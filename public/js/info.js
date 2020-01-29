// 页面全部加载完毕的回调函数
$(function () {
    // 登入验证
    $('#login').click(function () {
        // 用ajax提交请求
        $.ajax({
            url:'/api/login/info_ajax',
            type:'post',
            data:$('#form1').serialize(),
            dataType:'json',
            success:function (res) {
                if(res.message!="OK")
                    $('#tips').html(res.message);
                else {
                    window.location.reload();
                }
            }
        });
    });
    //退出
    $('#exit').click(function () {
        $.ajax({
            url:'/api/exit_ajax',
            type:'get',
            data:'',
            dataType:'json',
            success:function (res) {
                window.location.reload();
            }


        })

    })
    $('#exit1').click(function () {
        $.ajax({
            url:'/api/exit1_ajax',
            type:'get',
            data:'',
            dataType:'json',
            success:function (res) {
                window.location.reload();
            }


        })

    })
    $('#register').click(function () {
        $('#div4').css("display", "none");
        $('#div7').css("display", "block");

    })
    //注册
    $('#login1').click(function () {
        //用ajax提交请求
        $.ajax({
            url:'/api/register/user_ajax',
            type:'post',
            data:$('#form2').serialize(),
            dataType:'json',
            success:function (res) {
                if(res.message!="OK")
                    $('#tips1').html(res.message);
                else {
                    alert("注册成功！请登入");
                    window.location.replace("/");
                   /* if($('#name1').val()=="admin")
                    {
                        $('#div7').css("display", "none");
                        $('#div8').css("display", "block");
                    }
                    else
                     {
                         $('#div7').css("display", "none");
                         $('#div6').css("display", "block");
                         $('#p1').text($('#name1').val());
                     }
                    */
                }
            }
        })

    })
    $('#next4').click(function () {


        if($('#page4').val()=='')
        {
            var page=1;
            $('#page4').val(page);
        }
        else {
            var page = parseInt($('#page4').val()) + 1;
            $('#page4').val(page);

        }
        //( $('#page').text());
        //alert(page);
        $('#form4').submit();




    })

    $('#last4').click(function () {


        if($('#page4').val()==''||$('#page4').val()==0)
        {
            var page=1;
            $('#page4').val(page);
        }
        else {
            var page = parseInt($('#page4').val())-1;
            $('#page4').val(page);

        }
        $('#form4').submit();

    })


    $('#next6').click(function () {


        if($('#page6').val()=='')
        {
            var page=1;
            $('#page6').val(page);
        }
        else {
            var page = parseInt($('#page4').val()) + 1;
            $('#page6').val(page);

        }
        //( $('#page').text());
        //alert(page);
        $('#form6').submit();




    })

    $('#last6').click(function () {


        if($('#page6').val()==''||$('#page6').val()==0)
        {
            var page=1;
            $('#page6').val(page);
        }
        else {
            var page = parseInt($('#page6').val())-1;
            $('#page6').val(page);

        }
        $('#form6').submit();

    })
    $('#submit55').click(function () {
        $('#form5').submit();
    })
    
    $('#button1').click(function () {
        $.ajax({
            url:'/add_comment',
            type:'post',
            data:$('#form7').serialize(),
            dataType:'json',
            success:function (res) {
                window.location.reload();
            }


        })
    })
    
});