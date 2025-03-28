function EnableChangePassword(close_required)
{
	if(empty(close_required))
		close_required=1;
		
	$(".modal-dialog").css("width","");
	$('#model_body').load("html_modules/change_password.html");
	
	$('#myModalLabel').html('Change Password');
	$('#myModal').modal('show');
}
function ChangePassword()
{
	var old_password=$("#old_password").val();
	var retype_password=$("#retype_password").val();
	var new_password=$("#new_password").val();
	if(empty(old_password))
	{
		ShowAlertMsg("Please Enter the Old Password");
		return;
	}
	else if(empty(retype_password))
	{
		ShowAlertMsg("Please Enter the Retype Password");
		return;
	}
	else if(empty(new_password))
	{
		ShowAlertMsg("Please Enter the New Password");
		return;
	}
	else if(retype_password!=new_password)
	{
		ShowAlertMsg("Retype Password and New Password are Same");
		return;
	}
	var list_data ="old_password="+old_password;
		list_data +="&retype_password="+retype_password;
		list_data +="&new_password="+new_password;
		App.blockUI({
						target:'.jqistate',
						boxed:true,
						message:"Please Wait... Password is updating"
					});
					
	$.ajax({
		type: "POST",	 
		url: $host_url+"change_password",
		data:list_data,		
		success:  function change_passwordSuccess(responce)
		{
			responce = eval('(' +  responce + ')');	
			if(responce.error_code=='0')
			{		 	
				App.unblockUI();
				ShowSuccessMsg(responce.data);
				CallLogout();
			}
			else
			{
				App.unblockUI();
				ShowAlertMsg(responce.data);
			}	
		}
	});
}
function LoadSecretQuestionData()
{  
	$.ajax({
		type: "POST",	 
		url: $host_url+"LoadSecretQuestionData",				
		success:  function LoadSecretQuestionDataScucess(responce)
		{
			responce = eval('(' +  responce + ')');	
			if(responce.error_code=='0')
			{		 	
				$("#secret_question").val(responce.data.secret_question);
				$("#answer").val(responce.data.answer);
			}	
		}
	});
}
function SavePassword()
{
	var login_pwd=trim($("#login_password").val());
	var secret_question=trim($("#secret_question").val());
	var answer=trim($("#answer").val());
   
	var list_qry="&login_pwd="+login_pwd;
		list_qry+="&secret_question="+secret_question;
		list_qry+="&answer="+answer;
	
	
	if(empty(secret_question))
	{ 
		alert('Please Enter the Secret Question');
		return false;
	}
	else if(empty(answer))
	{
		alert('Please Enter the Answer');
		return false;
	}   
	else if(empty(login_pwd))
	{
		alert('Please Enter the Login Password');
		return false;
	}
	else
	{   			
		$.ajax({
			type: "POST",	 
			url: $host_url+"SavePassword",
			data:list_qry,		
			success:  function SavePasswordScucess(responce)
			{
				responce = eval('(' +  responce + ')');	
				if(responce.error_code== 0)
				{		 	
					alert(responce.data);
					$("#secret_question").val("");
					$("#answer").val("");
					$("#login_password").val("");
				}
				else
			    {
				    alert(responce.data);
					$("#login_password").val("");
				}
				
			}
		});
	}
}