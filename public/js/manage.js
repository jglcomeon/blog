$(function () {




    $('#next').click(function () {


        if($('#page').val()=='')
        {
            var page=1;
            $('#page').val(page);
        }
        else {
            var page = parseInt($('#page').val()) + 1;
            $('#page').val(page);

        }
        //( $('#page').text());
        //alert(page);
        $('#form1').submit();




    })

    $('#last').click(function () {


        if($('#page').val()==''||$('#page').val()==0)
        {
            var page=1;
            $('#page').val(page);
        }
        else {
            var page = parseInt($('#page').val())-1;
            $('#page').val(page);

        }
        $('#form1').submit();

    })
    $('#next2').click(function () {


        if($('#page2').val()=='')
        {
            var page=1;
            $('#page').val(page);
        }
        else {
            var page = parseInt($('#page2').val()) + 1;
            $('#page2').val(page);

        }
        //( $('#page').text());
        //alert(page);
        $('#form2').submit();




    })

    $('#last2').click(function () {


        if($('#page2').val()==''||$('#page2').val()==0)
        {
            var page=1;
            $('#page2').val(page);
        }
        else {
            var page = parseInt($('#page2').val())-1;
            $('#page2').val(page);

        }
        $('#form2').submit();

    })

    $('#next3').click(function () {


        if($('#page3').val()=='')
        {
            var page=1;
            $('#page3').val(page);
        }
        else {
            var page = parseInt($('#page3').val()) + 1;
            $('#page3').val(page);

        }
        //( $('#page').text());
        //alert(page);
        $('#form3').submit();




    })

    $('#last3').click(function () {


        if($('#page3').val()==''||$('#page3').val()==0)
        {
            var page=1;
            $('#page3').val(page);
        }
        else {
            var page = parseInt($('#page3').val())-1;
            $('#page3').val(page);

        }
        $('#form3').submit();

    })

    //触发添加分类
    /*$('#add_c').click(function () {
        $.ajax({
            url:'/admin/add_class',
            type:'post',
            data:$('#form3').serialize(),
            dataType:'json',
            success:function (res) {

            }
            

        })

    })*/
    $('#add_c').click(function () {
        //alert($('#c_name1').val());
        $('#c_name1').submit();

    })




})