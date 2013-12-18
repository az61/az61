$(function() {	
 	 $("#form_login").submit(function(){

        var username = $("#usernameLogin").val();
        var password = $("#passwordLogin").val();
       //alert(username+password);
         $.ajax({
            type: "POST",
            url: "login.php",
            data: "name="+username+"&pwd="+password,
            success: function(html){
              if(html=='true')
              {
                $("#container").fadeOut("normal");
                   window.location="home.php";                        
              }
              else
              {
                    $("#add_err").html("<span style='color:red;font-size:15px'>Wrong username or password</span>");
              }
            },
            beforeSend:function()
            {
                 $("#add_err").html("<span style='font-size:15px'>Loading...</span>");
            }
        });
         return false;
    });
 
});