var express = require('express');

var moment = require('moment');
moment.locale('zh-cn');

var router = express.Router();

//访问后台首页的路由
router.get('/manage',function (req,resp) {
    //渲染views/admin/manage.html文件
    resp.render('admin/manage',{userInfo:req.userInfo});
})

//管理员管理用户
router.get('/manage/user_ajax',function (req,resp) {

    var mongodb = require('mongodb');
    var MongoClient = mongodb.MongoClient;
    var url = "mongodb://localhost:27017/";
    var objectId = mongodb.ObjectId;

    MongoClient.connect(url, {useUnifiedTopology: true}, function (err, db) {
        if (err) throw err;
        var dbo = db.db("user_info");
        //获取
        dbo.collection("users").find({}).sort({'_id': -1}).toArray(function (err, result) {
            if (err) {
                console.log(err);
                return;
            }
            // console.log(result.length);
            //resp.json(result);
            //console.log(result);


            //console.log(page);

            //获取当前页数
            var page = req.query.page || 1;
            //每页显示
            //console.log(page);
            var limit = 3;
            //计算出总页数
            var totalPage = Math.ceil(result.length / limit);
            //console.log(totalPage);

            //判断页面是否超过范围
            if (page <= 1)
                page = 1;
            else if (page >= totalPage)
                page = totalPage;
            //计算从那个下标开始查起
            var startIndex = (page - 1) * limit;
            var users = result.slice(startIndex, startIndex + limit);

            //console.log(users)
            resp.render('admin/user_manage', {
                userInfo: req.userInfo,
                users: users,
                count: result.length,
                page: page,
                limit: limit,
                totalPage: totalPage

            })


            db.close();
        })


    })
})
//管理分类
    router.get('/class_index', function (req, resp) {
        var mongodb = require('mongodb');
        var MongoClient = mongodb.MongoClient;
        var url = "mongodb://localhost:27017/";
        var objectId = mongodb.ObjectId;
        MongoClient.connect(url, {useUnifiedTopology: true}, function (err, db) {
            if (err) throw err;
            var dbo = db.db("user_info");
            //获取
            dbo.collection("class").find({}).sort({'_id': -1}).toArray(function (err, result) {
                if (err) {
                    console.log(err);
                    return;
                }

                //获取当前页数
                var page = req.query.page || 1;
                //console.log(page);
                //每页显示
                var limit = 3;
                //计算出总页数
                var totalPage = Math.ceil(result.length / limit);

                //判断页面是否超过范围
                if (page <= 1)
                    page = 1;
                else if (page >= totalPage)
                    page = totalPage;
                //计算从那个下标开始查起
                var startIndex = (page - 1) * limit;
                var classes = result.slice(startIndex, startIndex + limit);

                //console.log(classes);

                resp.render('admin/class_index', {
                    userInfo: req.userInfo,
                    classes: classes,
                    count: result.length,
                    page: page,
                    limit: limit,
                    totalPage: totalPage

                })
                db.close();
            })

        })

})
//修改分类路由
router.get('/modify_class',function (req,resp) {
    var id =req.query.id;
    resp.render('admin/modify_c',{userInfo: req.userInfo,id:id});
    return;

})
//修改分类
router.post('/modify_c',function (req,resp) {
    var id=req.body.id;
    var c_name=req.body.c_name;
    var mongodb = require('mongodb');
    var MongoClient = mongodb.MongoClient;
    var url = "mongodb://localhost:27017/";
    var objectId = mongodb.ObjectId;
    MongoClient.connect(url,{useUnifiedTopology:true},function (err,db) {
        if(err){
            console.log(err);return;
        }
        var dbo=db.db('user_info');
        var whereStr={"_id":objectId(id)};
        var whereStr1={"c_name":c_name};
        dbo.collection("class").find(whereStr1).toArray(function (err,rt) {
            if (err){
                console.log(err);
                return;
            }
            if(rt!='')
            {
                resp.render('admin/err_tips4',{userInfo:req.userInfo,id:id});
                return;
            }


        var updata={$set:{"c_name":c_name}};
        dbo.collection("class").updateOne(whereStr,updata,function (err,res) {
            if(err){
                console.log(err);
                return;
            }
            resp.render('admin/success_tips3',{userInfo: req.userInfo,});
            db.close();
            return;
            
        })
        })

        })

})

//删除分类
router.get('/delete_class',function (req,resp) {
    //console.log(req.query.id);
    var id=req.query.id;
    var mongodb = require('mongodb');
    var MongoClient = mongodb.MongoClient;
    var url = "mongodb://localhost:27017/";
    var objectId = mongodb.ObjectId;

    MongoClient.connect(url,{useUnifiedTopology:true},function (err,db) {
        if(err){
            console.log(err);return;
        }
        var dbo=db.db('user_info');
        var whereStr={"_id":objectId(id)};
        //console.log(whereStr);
        dbo.collection("class").deleteOne(whereStr,function (err,obj) {
            if(err)
            {
                console.log(err);return;
            }

        })
        //获取
        dbo.collection("class").find({}).sort({'_id': -1}).toArray(function (err, result) {
            if (err) {
                console.log(err);
                return;
            }



            //获取当前页数
            var page = req.query.page || 1;
            //console.log(page);
            //每页显示
            var limit = 3;
            //计算出总页数
            var totalPage = Math.ceil(result.length / limit);

            //判断页面是否超过范围
            if (page <= 1)
                page = 1;
            else if (page >= totalPage)
                page = totalPage;
            //计算从那个下标开始查起
            var startIndex = (page - 1) * limit;
            var classes = result.slice(startIndex, startIndex + limit);

            //console.log(classes);

            resp.render('admin/class_index', {
                userInfo: req.userInfo,
                classes: classes,
                count: result.length,
                page: page,
                limit: limit,
                totalPage: totalPage

            })
            db.close();
        })
    })

})

//访问添加分类路由
router.get('/add',function (req,resp) {

    resp.render('admin/add_class',{userInfo:req.userInfo});
})
//添加分类
router.post('/add_class',function (req,resp) {
    var mongodb = require('mongodb');
    var MongoClient = mongodb.MongoClient;
    var url = "mongodb://localhost:27017/";
    var objectId = mongodb.ObjectId;
    var c_name=req.body.c_name;

    MongoClient.connect(url,{useUnifiedTopology:true},function (err,db) {
        if (err) {
            console.log(err);
            return;
        }
        var dbo = db.db('user_info');
        var whereStr={"c_name":c_name}

        dbo.collection("class").find(whereStr).toArray(function (err, result) {
            if (err) {
                console.log(err);
                return;
            }
            if(result==''&&c_name!='')
            {
                dbo.collection('class').insertOne(whereStr,function (err,res) {
                    if(err) throw err;
                    console.log("ok");
                    resp.render('admin/success_tips1',{userInfo:req.userInfo})
                })
            }
            else resp.render('admin/err_tips1',{userInfo:req.userInfo});
            db.close();

        })
    })

})

//访问添加内容路由,并查询所有分类
router.get('/add_c',function (req,resp) {
    var mongodb = require('mongodb');

    var MongoClient = mongodb.MongoClient;
    var url = "mongodb://localhost:27017/";
    var objectId = mongodb.ObjectId;
    MongoClient.connect(url, {useUnifiedTopology: true}, function (err, db) {
        if (err) throw err;
        var dbo = db.db("user_info");
        //获取
        dbo.collection("class").find({}).sort({'_id': -1}).toArray(function (err, result) {
            if (err) {
                console.log(err);
                return;
            }
            resp.render('admin/add_content', {
                userInfo: req.userInfo,
                classes: result
            })
            db.close();
            return;
        })

    })
})
//添加内容
router.post('/add_content',function (req,resp) {
    var c_name = req.body.c_name1;
    var title = req.body.title;

    var simple = req.body.simple;
    var content = req.body.content;
    var data =Date.now()
    var times= moment(data).format('YYYY-MM-DD HH:mm:ss');



    var mongodb = require('mongodb');
    var MongoClient = mongodb.MongoClient;
    var url = "mongodb://localhost:27017/";
    //var objectId = mongodb.ObjectId;
    MongoClient.connect(url, {useUnifiedTopology: true}, function (err, db) {
        if (err){
            console.log(err);
            return;
        }
        var dbo = db.db("user_info");

        var Str = {c_name:c_name,title:title,author:"admin",times:times,simple:simple,content:content,read_s:0,comment:0}
        var whereStr1 = {"c_name":c_name,"title":title,"simple":simple,"content":content}
        dbo.collection("content").find(whereStr1).toArray(function (err,data1) {
            if(err){
                console.log(err);
                return;
            }
            if(title==''||data1!='') {
                resp.render('admin/err_tips2', {userInfo: req.userInfo});
                db.close();
                return;
            }
            


        dbo.collection("content").insertOne(Str,function (err,res) {
            if (err) {
                console.log(err);
                return;
            }
            resp.render('admin/success_tips2', {
                userInfo: req.userInfo,
            })

            db.close();
            return;

        })
        })


        })


})

//显示内容列表
router.get('/add_index',function (req,resp) {
    var mongodb = require('mongodb');
    var MongoClient = mongodb.MongoClient;
    var url = "mongodb://localhost:27017/";
    MongoClient.connect(url, {useUnifiedTopology: true}, function (err, db) {
        if (err) throw err;
        var dbo = db.db("user_info");
        //获取
        dbo.collection("content").find({}).sort({'_id': -1}).toArray(function (err, result) {
            if (err) {
                console.log(err);
                return;
            }

            //获取当前页数
            var page = req.query.page || 1;
            //console.log(page);
            //每页显示
            var limit = 3;
            //计算出总页数
            var totalPage = Math.ceil(result.length / limit);

            //判断页面是否超过范围
            if (page <= 1)
                page = 1;
            else if (page >= totalPage)
                page = totalPage;
            //计算从那个下标开始查起
            var startIndex = (page - 1) * limit;
            var content = result.slice(startIndex, startIndex + limit);

            //console.log(classes);

            resp.render('admin/add_index', {
                userInfo: req.userInfo,
                content: content,
                count: result.length,
                page: page,
                limit: limit,
                totalPage: totalPage

            })
            db.close();
        })

    })
})
//添加修改内容路由
router.get('/modify_content',function (req,resp) {
    var id = req.query.id;
    var mongodb = require('mongodb');

    var MongoClient = mongodb.MongoClient;
    var url = "mongodb://localhost:27017/";
    var objectId = mongodb.ObjectId;
    MongoClient.connect(url, {useUnifiedTopology: true}, function (err, db) {
        if (err) throw err;
        var dbo = db.db("user_info");
        //获取
        dbo.collection("class").find({}).sort({'_id': -1}).toArray(function (err, result) {
            if (err) {
                console.log(err);
                return;
            }
            resp.render('admin/modify_content', {userInfo: req.userInfo, id: id, classes: result});
            return;
        })
    })
})
//修改内容
router.post('/modify_content1',function (req,resp) {
    var id=req.body.id;
    var c_name = req.body.c_name1;
    var title = req.body.title;
    var simple = req.body.simple;
    var content = req.body.content;
    var mongodb = require('mongodb');
    var MongoClient = mongodb.MongoClient;
    var url = "mongodb://localhost:27017/";
    var objectId = mongodb.ObjectId;
    MongoClient.connect(url, {useUnifiedTopology: true}, function (err, db) {
        if (err){
            console.log(err);
            return;
        }
        var dbo = db.db("user_info");

        //var Str = {c_name:c_name,title:title,author:"admin",times:times,simple:simple,content:content,read_s:0,comment:0}
        var whereStr1 = {"c_name":c_name,"title":title,"simple":simple,"content":content}
        dbo.collection("content").find(whereStr1).toArray(function (err,data1) {
            if(err){
                console.log(err);
                return;
            }
            if(title==''||data1!='') {
                resp.render('admin/err_tips3', {userInfo: req.userInfo});
                db.close();
                return;
            }

            var whereStr2={"_id":objectId(id)}
            var updata={$set:{"c_name":c_name,"title":title,"simple":simple,"content":content}};
            dbo.collection("content").updateOne(whereStr2,updata,function (err,res) {
                if (err) {
                    console.log(err);
                    return;
                }



                    resp.render('admin/success_tips4', {
                        userInfo: req.userInfo,
                })

                db.close();
                return;

            })
        })


    })

    

})
//删除内容
router.get('/delete_content',function (req,resp) {

    var id = req.query.id;
    var mongodb = require('mongodb');
    var MongoClient = mongodb.MongoClient;
    var url = "mongodb://localhost:27017/";
    var objectId = mongodb.ObjectId;

    MongoClient.connect(url, {useUnifiedTopology: true}, function (err, db) {
        if (err) {
            console.log(err);
            return;
        }
        var dbo = db.db('user_info');
        var whereStr = {"_id": objectId(id)};
        //console.log(whereStr);
        dbo.collection("content").deleteOne(whereStr, function (err, obj) {
            if (err) {
                console.log(err);
                return;
            }

        })
        //获取
        dbo.collection("content").find({}).sort({'_id': -1}).toArray(function (err, result) {
            if (err) {
                console.log(err);
                return;
            }


            //获取当前页数
            var page = req.query.page || 1;
            //console.log(page);
            //每页显示
            var limit = 3;
            //计算出总页数
            var totalPage = Math.ceil(result.length / limit);

            //判断页面是否超过范围
            if (page <= 1)
                page = 1;
            else if (page >= totalPage)
                page = totalPage;
            //计算从那个下标开始查起
            var startIndex = (page - 1) * limit;
            var content = result.slice(startIndex, startIndex + limit);

            //console.log(classes);

            resp.render('admin/add_index', {
                userInfo: req.userInfo,
                content: content,
                count: result.length,
                page: page,
                limit: limit,
                totalPage: totalPage

            })
            db.close();
        })
    })
})

module.exports=router;