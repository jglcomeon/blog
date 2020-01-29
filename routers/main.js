var express = require('express');

var router = express.Router();

//获取时间模块
var moment = require('moment');
moment.locale('zh-cn');
//访问前台首页的路由
router.get('/',function (req,resp) {
    //渲染views/main.blog_index.html文件
    var mongodb = require('mongodb');
    var MongoClient = mongodb.MongoClient;
    var url = "mongodb://localhost:27017/";

    MongoClient.connect(url, {useUnifiedTopology: true}, function (err, db) {
        if (err) {
            console.log(err);
            return;
        }
        var dbo = db.db('user_info');

        //获取分类
        dbo.collection("class").find({}).sort({'_id': -1}).toArray(function (err, result) {
            if (err) {
                console.log(err);
                return;
            }


        //获取内容
        dbo.collection("content").find({}).sort({'_id': -1}).toArray(function (err, result1) {
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
            var totalPage = Math.ceil(result1.length / limit);

            //判断页面是否超过范围
            if (page <= 1)
                page = 1;
            else if (page >= totalPage)
                page = totalPage;
            //计算从那个下标开始查起


            var startIndex = (page - 1) * limit;
            var content = result1.slice(startIndex, startIndex + limit);

            resp.render('main/blog_index', {
                userInfo: req.userInfo,
                classes: result,
                content:content,
                page: page,
                totalPage: totalPage
            })
            db.close();
            return;
        })
        })


    })

})

//获取阅读全文
router.get('/read',function (req,resp) {
    var id = req.query.id;
    var user_id=req.query.user_id;
    var mongodb = require('mongodb');
    var MongoClient = mongodb.MongoClient;
    var url = "mongodb://localhost:27017/";
    var objectId = mongodb.ObjectId;
    var whereStr = {"_id": objectId(id)};
    var whereStr1 = {"content_id": id}
    var whereStr2 = {"user_id":user_id,"content_id":id};
    MongoClient.connect(url, {useUnifiedTopology: true}, function (err, db) {
        if (err) {
            console.log(err);
            return;
        }
        var dbo = db.db("user_info");
        dbo.collection("class").find({}).sort({'_id': -1}).toArray(function (err, classes) {
            if (err) {
                console.log(err);
                return;
            }
            dbo.collection("read_num").find(whereStr2).toArray(function (err,read_ss) {
                if(err){
                    console.log(err);
                    return;
                }

            dbo.collection("content").find(whereStr).toArray(function (err, result) {
                if (err) {
                    console.log(err);
                    return;
                }
                var content = result[0];
                if(read_ss=='')
                {
                var read_s1 = parseInt(result[0].read_s) + 1;
                //console.log(read_s1);
                //console.log(content);
                var updata = {$set: {"read_s": read_s1}};
                dbo.collection("content").updateOne(whereStr, updata, function (err, res) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                })
                dbo.collection("read_num").insertOne(whereStr2,function (err,zz) {
                    if(err){
                        console.log(err);
                        return;
                    }
                })
                }
                dbo.collection("comment").find(whereStr1).sort({'time': -1}).toArray(function (err, result1) {
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
                    var totalPage = Math.ceil(result1.length / limit);

                    //判断页面是否超过范围
                    if (page <= 1)
                        page = 1;
                    else if (page >= totalPage)
                        page = totalPage;
                    //计算从那个下标开始查起
                    var startIndex = (page - 1) * limit;
                    var comment = result1.slice(startIndex, startIndex + limit);

                    resp.render('main/index', {
                        userInfo: req.userInfo,
                        content: content,
                        count: result1.length,
                        page: page,
                        limit: limit,
                        totalPage: totalPage,
                        comment: comment,
                        classes: classes

                    })
                    db.close();
                    return;
                })
            })

        })
        })

    })
//提交评论

    router.post('/add_comment', function (req, resp) {
        var id = req.body.id;
        //var read_s=parseInt(req.query.read_s)+1;
        var num = parseInt(req.body.num) + 1;
        //console.log(read_s);
        var cm = req.body.cm;
        console.log(cm);
        var mongodb = require('mongodb');
        var MongoClient = mongodb.MongoClient;
        var url = "mongodb://localhost:27017/";
        var objectId = mongodb.ObjectId;
        var whereStr = {"_id": objectId(id)};
        var updateStr = {$set: {"comment": num}};

        var data = Date.now()
        var times = moment(data).format('YYYY-MM-DD HH:mm:ss');
//更新评论和阅读量
        MongoClient.connect(url, {useUnifiedTopology: true}, function (err, db) {
            if (err) {
                console.log(err);
                return;
            }

            var dbo = db.db("user_info");
            dbo.collection("content").updateOne(whereStr, updateStr, function (err, res) {
                if (err) {
                    console.log(err);
                    return;
                }
            })
            var info = {content_id: id, author: req.userInfo.name, time: times, comment: cm}
            dbo.collection("comment").insertOne(info, function (err, res) {
                if (err) {
                    console.log(err);
                    return;
                }

                resp.json({message: "ok"});
                db.close();
                return;
            })
        })

    })
})

module.exports=router;