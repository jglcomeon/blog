//加载模块

var express = require('express');

//加载body-parse模块，用来解析post方式传替的数据

var bodyParse = require('body-parser');

// 创建 application/x-www-form-urlencoded 编码解析
var urlencoded =bodyParse.urlencoded({extended:true});


var swig=require('swig');

//加载cookies模块
var Cookies=require('cookies');

//加载mongodb 模块
var mongodb=require('mongodb');
//获取mogodb的客户端，连接mongodb用
var mongodbClient=mongodb.mongoClient;
//获取mongodb数据中的主键类型
var objectId=mongodb.ObjectId;


// 创建一个express对象
var app = express();

app.use(urlencoded);

//设置静态文件的目录，如css.js,image,etc
//console.log(__dirname);
app.use('/public',express.static(__dirname+'/public'));



// 创建好的application编码

app.use(urlencoded);

//配置当前应用使用的模版引擎
//配置当前应用使用的模版引擎
//第一个参数：模版引擎的名称，也是需要渲染的文件后缀名
//第二个参数：渲染解析文件的技术



app.engine('html',swig.renderFile);

//配置需要使用模版引擎渲染文件的目录
//第一个参数：views，固定不变
//第二个参数：需要使用模版引擎渲染的文件目录

app.set('views','./views');


//注册之前配置的模版引擎，好让应用真正使用该模版引擎
//第一个参数 view engine 固定不变
//第二个参数：模版引擎的名称，跟app.engine第一个参数一致


app.set('view engine','html');

//关闭swig渲染缓存，默认是开启的
swig.setDefaults({cache:false});






app.use(function (req,resp,next) {
    req.cookies=new Cookies(req,resp);
    //获取cookies中的用户登录信息
    var userInfoStr=req.cookies.get('userInfo');

    //
    req.userInfo={};
    if(userInfoStr){
        //从数据库中查询是否为管理员
        req.userInfo=JSON.parse(userInfoStr);
        /*//数据库连接地址
        var url = 'mongodb://localhost:27017/user_info';
        MongoClient.connect(url,{useUnifiedTopology: true},function (err,db){
            if(err){
                console.log(err);
                next();
            }
            var dbo=db.db('user_info');
            var whereStr = {'_id':objectId(req.userInfo._id)};
            dbo.collection('user_info').find(whereStr).toArray(function (err,result) {
                if(err){
                    console.log(err);
                    next();
                }
                else {
                    //是将查询
                    req.userInfo.isAdmin=Boolean(results[0].isAdmin);
                    next();
                }
            })

            })*/
    }

    next();
})


//模块化开发
//前台首页模块
app.use('/',require("./routers/main.js"));
//前台其他功能模块（登入，注册，退出，阅读全文，评论
app.use('/api',require('./routers/api.js'));

app.use('/admin',require('./routers/admin.js'));

app.listen(8082,function () {
    console.log("博客系统已启动！");
})