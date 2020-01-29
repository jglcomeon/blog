var express = require('express');
var router = express.Router();

var cookies=require('cookies');



router.get('/manage',function (req,resp) {
    //渲染views/admin/manage.html文件
    resp.render('admin/manage',{userInfo:req.userInfo});
})
router.get('/user_manage',function (req,resp) {
    //渲染views/admin/user_manage.html文件
    resp.render('admin/user_manage',{userInfo:req.userInfo});
})

/*router.get('/user_manage',function (req,resp) {
    //渲染views/admin/user_manage.html文件
    resp.render('admin/user_manage');
})*/

//以ajax方式获取用户登陆信息

router.post('/login/info_ajax',function (req,resp) {
    var name = req.body.name||'';
    var password = req.body.psw||'';
    //console.log(name);
    //console.log(password);
    var responseDate = {
        message:'',
        userInfo:''
    }

    if(name==''){
        responseDate.message="用户名不能为空";
        resp.json(responseDate);
        return;
    }
    if(password==''){
        responseDate.message="密码不能为空";
        resp.json(responseDate);
        return;
    }
    var MongoClient = require('mongodb').MongoClient;
    var url = 'mongodb://localhost:27017/user_info';
    MongoClient.connect(url,{useUnifiedTopology: true},function (err,db){
        if(err) throw err;
        var dbo=db.db("user_info");
        var wherestr = {"name":name,"psw":password};
        dbo.collection("users").find(wherestr).toArray(function (err,result) {
            if(err) throw err;
            // console.log(result);

            if (result==''){
                responseDate.message="用户名不存在或者密码错误";
                resp.json(responseDate);

                return;
            }
            else {
                responseDate.message="OK";
                responseDate.userInfo={
                    _id:result[0]._id,
                    name:result[0].name
                };
                //console.log(responseDate.userInfo._id+'!');

                //将数据存储到cookie中
                req.cookies.set('userInfo',
                JSON.stringify(responseDate.userInfo));
                resp.json(responseDate);
            }

        });


    });

});

//退出
router.get('/exit_ajax',function (req,resp) {
    //清除cookies中存储的登陆用户信息

    req.cookies.set('userInfo',null);
    resp.json({message:"ok"});
    //resp.render('main/blog_index',{userInfo: req.userInfo,});
    return;


});
router.get('/exit1_ajax',function (req,resp) {
    //清除cookies中存储的登陆用户信息
    req.cookies.set('userInfo',null);
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
//处理提交注册的信息
router.post('/register/user_ajax',function (req,resp) {

    var name = req.body.name1||'';
    var password1 = req.body.psw1||'';
    var password2 = req.body.psw2||'';
    //console.log(name);
    //console.log(password1);
    var responseDate = {
        message:''
    }

    if(name==''){
        responseDate.message="用户名不能为空";
        resp.json(responseDate);
        return;
    }
    if(password1==''||password2==''){
        responseDate.message="密码不能为空";
        resp.json(responseDate);
        return;
    }
    if(password1!=password2){
        responseDate.message="两次密码不一致";
        resp.json(responseDate);
        return;
    }

    var MongoClient = require('mongodb').MongoClient;
    var url = 'mongodb://localhost:27017/';
    MongoClient.connect(url,{useUnifiedTopology: true},function (err,db){
        if(err) throw err;
        var dbo=db.db("user_info");
        var wherestr = {"name":name};
        var insertinfo = {"name":name,"psw":password1};

        //查询用户名是否注册过
        dbo.collection("users").find(wherestr).toArray(function (err,result) {
            if(err) throw err;

            if (result!=''){
                //console.log(result);
                responseDate.message="用户名已注册";
                resp.json(responseDate);

                return;
            }
            else {
                dbo.collection("users").insertOne(insertinfo,function (err,res) {
                    if(err) throw  err;
                    responseDate.message="OK";

                    /*responseDate.userInfo={
                        _id:123,
                        name:name
                    };
                    //console.log(responseDate.userInfo._id+'!');

                    //将数据存储到cookie中
                    req.cookies.set('userInfo',
                        JSON.stringify(responseDate.userInfo));*/
                    resp.json(responseDate);
                    return;
                });
            }
            db.close();
        });





    });

});


module.exports=router;