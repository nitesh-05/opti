var $host_url=window.location.protocol+"//"+window.location.host+"/"+window.location.pathname.split('/')[1]+"/app.php?a=";
var $image_path=window.location.protocol+"//"+window.location.host+"/"+window.location.pathname.split('/')[1]+"/JQGrid4/css/images/"; 
$host_url=$host_url.replace("/index.html","");
 
function trim($str)
{
  return $str.replace(/^\s*|\s*$/g,"");
}
function loadwindow()
{
	if(getCookie('username'))
	{
		document.getElementById('user_name').value = getCookie('username');
	}
	else
	{

	   document.getElementById('user_name').value ='Username';
	}
	if(getCookie('pswd'))
	{
		//document.getElementById('password').value = getCookie('pswd');
		document.getElementById('password').value = "";
	}
	else
	{


	   document.getElementById('password').value ='******';
	}
	 
	CheckLoggedInSession();
	 
	 
}
function CheckLoggedInSession()
{
	$.ajax({
			type: "POST",
			url: $host_url+"CheckLoggedInSession",
			data:"",
			success: function CheckLoggedInSessionResponse(responce)
			{
				responce = eval('(' + responce + ')');
				if(responce.error_code=="0")
				{
					window.location.href="MainPage.html?i="+Math.random();
				}
			}	
		});
}


	
function validate()
{
	return true;
}

function login()
{

	if(trim(document.getElementById('user_name').value) == '')
	{
		ShowAlertMsg("Please enter Username");
		document.getElementById('user_name').focus();
		return ;
		
	}
	else if(trim(document.getElementById('password').value) == '')
	{
		ShowAlertMsg("Please enter Password");
		document.getElementById('password').focus();
		return ;
	}
		var username = document.getElementById('user_name').value;
		var password = (document.getElementById('password').value);
		 
					
		var $parameters = "usr="+username+"&password="+password;
			$.ajax({
			type: "POST",
			url: $host_url+"validateUsernameAndPassword.demo",
			data:$parameters,
			success: validateUsernameAndPasswordResponse
		});
	}	
	
		
function validateUsernameAndPasswordResponse($responce)
{
	$responce = eval('(' + $responce + ')');
	if ($responce.error_code == -1)
	{
		document.getElementById('user_name').focus();
		document.getElementById('password').value = '';				
		ShowAlertMsg($responce.data);
	}
	else
	{
	var user_type=$responce.data.user_type;
	var user_theme_name=$responce.data.theme;
	var user_id=$responce.data.user_id;
	var real_name=$responce.data.real_name;
	var jt_db=$responce.data.jt_db;
	var department=$responce.data.department;
	var fw_user_email=$responce.data.fw_user_email;
	var dist_dealer_user_int_code=$responce.data.dist_dealer_user_int_code;
	var password_changed=$responce.data.password_changed;
	
		//Get Login time
		var a_p = "";
		var d = new Date();
		var curr_hour = d.getHours();
		if (curr_hour < 12)
		a_p = "AM";
		else
		a_p = "PM";
		
		if (curr_hour == 0)
		{
			curr_hour = 12;
		}
		if (curr_hour > 12)
		{
			curr_hour = curr_hour - 12;
		}
		var curr_min = (d.getMinutes()<10)?"0"+(d.getMinutes()):(d.getMinutes());
		var login_time =  curr_hour + ":" + curr_min + " " + a_p;
	
	
		setCookie("username",trim(document.getElementById('user_name').value),1);
		setCookie("pswd",trim(document.getElementById('password').value),1);
	
		setCookie("user_type",user_type,1);
		setCookie("user_theme_name",user_theme_name,1);
		setCookie("host_url",$host_url,1);
		setCookie("image_path",$image_path,1);
		setCookie("user_id",user_id,1);
		setCookie("fw_real_name",real_name,1);
		setCookie("jt_db",jt_db,1);	
		setCookie("department",department,1);	
		setCookie("fw_user_email",fw_user_email,1);	
		setCookie("fw_password_changed",password_changed,1);	
		 
			
		window.location.href="MainPage.html?i="+Math.random();
						
	}
}

function setCookie(c_name,value,expiredays)
{
	var exdate=new Date()
	exdate.setDate(exdate.getDate()+expiredays)
	document.cookie=c_name+ "=" +escape(value)+
	((expiredays==null) ? "" : ";expires="+exdate.toGMTString())
}

function getCookie(c_name)
{
	if (document.cookie.length>0)
	  {
	  c_start=document.cookie.indexOf(c_name + "=")
	  if (c_start!=-1)
		{ 
		c_start=c_start + c_name.length+1 
		c_end=document.cookie.indexOf(";",c_start)
		if (c_end==-1) c_end=document.cookie.length
		return unescape(document.cookie.substring(c_start,c_end))
		} 
	  }
	return "";
}

function dologin(event)
{
	if (event.keyCode == 13)
		login();
}
function empty (mixed_var) {
     
    var key;    
    if (mixed_var === "" ||
        mixed_var === 0 ||
        mixed_var === "0" ||
        mixed_var === null ||        mixed_var === false ||
        typeof mixed_var === 'undefined'
    ){
        return true;
    } 
    if (typeof mixed_var == 'object') {
        for (key in mixed_var) {
            return false;
        }        return true;
    }
 
    return false;
}
function OpenForgotPasswordPopup()
{
	var p_width=$(window).width()-100;
	$.get("html_modules/forgot_password.html", function( data ) {
	  $.prompt(data, {
		buttons: {},
		 persistent: true , //on escape don't Close
		loaded : function(){					 
				{
				}							 
		},
		title: "Forgot Password",
		// position: {width: p_width},
		zIndex:90909090
	  }); 
	});
}
function ForgotPassword()
{
	var fp_user_name=$("#fp_user_name").val();
	var fp_email_id=$("#fp_email_id").val();
	
	if(empty(fp_user_name))
	{
		ShowAlertMsg("Please Enter User Name");
		return;
	}
	else if(empty(fp_email_id))
	{
		ShowAlertMsg("Please Enter Email ID");
		return;
	}
	var list_data ="fp_user_name="+fp_user_name;
		list_data +="&fp_email_id="+fp_email_id;
		 
	$("#fp_loading").show();
	$("#fp_submit").hide();
	$.ajax({
		type: "POST",	 
		url: $host_url+"ForgotPassword",
		data:list_data,		
		success:  function ForgotPasswordSuccess(responce)
		{
			responce = eval('(' +  responce + ')');	
			if(responce.error_code=='0')
			{		 	
				ShowSuccessMsg(responce.data);
				$("#fp_loading").hide();
				$("#fp_submit").show();
				ClosePopup();
			}
			else
			{
				ShowAlertMsg(responce.data);
				$("#fp_loading").hide();
				$("#fp_submit").show();
			}	
		}
	});
}
function ClosePopup()
{
	$.prompt.close();
}
	
function doResetPasswordPage(event)
{
if (event.keyCode == 13)
CallResetPasswordFromScreen();
}
		
function doLoginPage(event)
{
if (event.keyCode == 13)
login();
}
function ShowErrorMsg(error)
{
	swal({   
           title: "Error",   
           html: error,   
           type: "warning",   
           confirmButtonColor: "#DD6B55"    
       });
	   $('.swal2-container').css('z-index','22222229999')
} 
 
function ShowAlertMsg(error)
{
	swal({   
           title: "Alert",   
           html: error,   
           type: "warning",   
           confirmButtonColor: "#DD6B55",   
           cancelButtonText: "No, cancel plx!"   
       });
	   $('.swal2-container').css('z-index','22222229999')
}  
 
function ShowSuccessMsg(msg)
{
	swal({   
           title: "Success",   
           html: msg,   
           type: "success" 
       });
	   $('.swal2-container').css('z-index','22222229999')
}  
		 
