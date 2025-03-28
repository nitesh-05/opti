 var $g_is_change_pwd_requested=0;
 var $g_normal_update=0;
 var $g_is_update_by_editing=0;
 var $g_user_rights_details='';
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
		function setCookie(c_name,value,expiredays)
		{
			var exdate=new Date()
			exdate.setDate(exdate.getDate()+expiredays)
			document.cookie=c_name+ "=" +escape(value)+
			((expiredays==null) ? "" : ";expires="+exdate.toGMTString())
		}	
	
function enableUserSetUp()
{
    $g_normal_update=1;
    $g_is_update_by_editing=0;
    $g_formula_value='';
    window.enable_proper_module="enableUserSetUp";
	$('#page_main_div').load("html_modules/Setup_user_set_up.html",function(){
	EnablePageHeaderFooter();
	getUserDetais('0');
	});
	
	if(getCookie('user_type')!='Admin' && getCookie('user_type')!='Super Wiser')
	{
		$("#header_view_row").hide();
	  
	
	}  $("#footer_view_row").hide();
	$('#display_module_name').html('User Set up');
	document.getElementById('module_name_for_save').value = 'saveUserSetUpDetails';
	//closeChangePwd();
	//get_help_text('UserSetup');
		
	//onclick first time we are passing 0 value and using session id we will get the details in PHP
	// if Specicific id is passed we are getting the Required user info
}
function getUserDetais($u_id)
{
	$.ajax({
		type: "POST",
		data:"get_user_id="+$u_id,
		url: $host_url+"getUserSetupDetails.demo",      
		success: populateUserSetupDetailsResponse
	});
}
function saveUserSetUpDetails()
{
	if(trim(document.getElementById('user_type').value)=='0')
	{
	ShowAlertMsg('Please Select the User Type');
	document.getElementById('user_type').focus();
	return;
	}
	else if(trim(document.getElementById('login_id').value)=='')
	{
	ShowAlertMsg('Please Enter the Login Id');
	document.getElementById('login_id').focus();
	return;
	}
	else if ($g_is_change_pwd_requested==1)
	{
		if(getCookie('user_type')!='Admin' && (document.getElementById('old_password').value=='' || document.getElementById('old_password').value!=getCookie('pswd')) )
		{
		ShowAlertMsg('Please Enter the Valid Old Password');
		document.getElementById('old_password').focus();
		return;
		} 
		else if(document.getElementById('new_password').value=='')
		{
		ShowAlertMsg('Please Enter the New Password');
		document.getElementById('new_password').focus();
		return;
		}
		else if(document.getElementById('retype_new_password').value=='')
		
		{
		ShowAlertMsg('Please Re-Enter the New Password');
			document.getElementById('retype_new_password').focus();
		return;
		}
		else if(document.getElementById('retype_new_password').value!=document.getElementById('new_password').value)
		{
		ShowAlertMsg('New Password and Re-Entered password\'s are not matching');
		document.getElementById('retype_new_password').focus();
		return;
		}
	}

	else if(trim(document.getElementById('user_real_name').value)=='')
	{
	ShowAlertMsg('Please Enter the User Name');
	document.getElementById('user_real_name').focus();
	return;
	}
 
	/* else if(!validateemail(trim(document.getElementById('user_email_id').value)))
	{
	ShowAlertMsg('Please Enter the Valid Email Id');
	document.getElementById('user_email_id').focus();
	return;
	} */
	$can_edit_help_text=0;
	 
	$lstr_data="is_normal_update="+$g_normal_update;
	$lstr_data+="&is_update_by_editing="+$g_is_update_by_editing;
	$lstr_data+="&user_type_id="+document.getElementById('user_type').value;
	$lstr_data+="&login_id="+trim(encodeURIComponent(document.getElementById('login_id').value));
	$lstr_data+="&user_real_name="+trim(encodeURIComponent(document.getElementById('user_real_name').value));
	$lstr_data+="&user_email_id="+trim(encodeURIComponent(document.getElementById('user_email_id').value));
	$lstr_data+="&user_group="+trim(encodeURIComponent(document.getElementById('user_group').value));
	$lstr_data+="&super_wiser="+trim(encodeURIComponent(document.getElementById('user_superwiser').value));
	var user_theme= $('.jquery-ui-themeswitcher-title').text().replace("Theme: ","");
	$lstr_data+="&user_theme="+user_theme;
	 
	if(document.getElementById('user_can_edit_help').checked==true)
	$can_edit_help_text=1;
	$lstr_data+="&can_edit_help_text="+$can_edit_help_text;
	$lstr_data+="&is_password_changed="+$g_is_change_pwd_requested;
	$lstr_data+="&sysusrkey="+encodeURIComponent(document.getElementById('new_password').value);
	 
	 

	$.ajax({
			type: "POST",
			data:$lstr_data,
			url: $host_url+"updateUserSetUpDetails.demo",      
			success: updateUserSetUpDetailsResponse
		});
}
function updateUserSetUpDetailsResponse($responce)
 { 
  $responce = eval('(' + $responce + ')'); 
  ShowSuccessMsg($responce.data);
  home();
  //$g_is_update_by_editing=0;
}   
function populateUserSetupDetailsResponse($responce)
 { 
     $responce = eval('(' + $responce + ')');  
	   
    getDefaultHeadFooterLinks('User Rights');
	$("#module_menu_action").html('');
	EnablePageHeaderFooter();
	 
	 document.getElementById('user_type').focus();
     document.getElementById('user_type').options.length = 0;
     document.getElementById('user_superwiser').options.length = 0;
     document.getElementById('user_group').options.length = 0;
		$op = new Option('Select One', '0');
		$op.id='0';
		document.getElementById('user_type').options.add($op);
		         
		$op = new Option('Select One', '0');
		$op.id='0';
		document.getElementById('user_superwiser').options.add($op);
		
		$op = new Option('Select One', '0');
		$op.id='0';
		document.getElementById('user_group').options.add($op);
		
	 
		
		 
	 for($i=0;$i < $responce.data['user_type'].length;$i++)                                  
		{            
	    	$op = new Option($responce.data['user_type'][$i]['value'], $responce.data['user_type'][$i]['internal_code']);
			$op.id=$responce.data['user_type'][$i]['internal_code'];//specifying the id  for options
			document.getElementById('user_type').options.add($op);
		}
	 for($i=0;$i < $responce.data['super_wiser'].length;$i++)                                  
		{            
	    	$op = new Option($responce.data['super_wiser'][$i]['value'], $responce.data['super_wiser'][$i]['internal_code']);
			$op.id=$responce.data['super_wiser'][$i]['internal_code'];//specifying the id  for options
			document.getElementById('user_superwiser').options.add($op);
		}
	for($i=0;$i < $responce.data['Group'].length;$i++)                                  
		{            
	    	$op = new Option($responce.data['Group'][$i]['value'], $responce.data['Group'][$i]['internal_code']);
			$op.id=$responce.data['Group'][$i]['internal_code'];//specifying the id  for options
			document.getElementById('user_group').options.add($op);
		}
		
	 
		
		
	document.getElementById('login_id').value=$responce.data['user_details'].sysusr;	
	document.getElementById('user_type').value=$responce.data['user_details'].user_type;	
	document.getElementById('user_real_name').value=$responce.data['user_details'].real_name;	
	document.getElementById('user_email_id').value=$responce.data['user_details'].email_id;	
	document.getElementById('user_superwiser').value=$responce.data['user_details'].super_wiser;	
	document.getElementById('user_group').value=$responce.data['user_details'].user_group;
if($responce.data['user_details'].can_edit_help_text=='1')	
	document.getElementById('user_can_edit_help').checked=true;
else	
	document.getElementById('user_can_edit_help').checked=false;	
	if(getCookie('user_type')!='Admin')
	{
	document.getElementById('user_can_edit_help').disabled=true;
	document.getElementById('user_group').disabled=true;
	document.getElementById('user_superwiser').disabled=true;
	document.getElementById('user_type').disabled=true;
 
	document.getElementById('add_new_user').style.display='none';
	}	
}
function openChangePwd()
{
if(getCookie('user_type')=='Admin')
{
document.getElementById('row_old_password').style.display='none';
}
else 
document.getElementById('row_old_password').style.display='';

document.getElementById('row_new_password').style.display='';
document.getElementById('row_retype_new_password').style.display='';
document.getElementById('change_pwd').style.display='none';
document.getElementById('cancel_change_pwd').style.display='';
document.getElementById('old_password').value='';
document.getElementById('new_password').value='';
document.getElementById('retype_new_password').value='';
$g_is_change_pwd_requested=1;

}
function closeChangePwd()
{
document.getElementById('row_new_password').focus();
document.getElementById('row_old_password').style.display='none';
document.getElementById('row_new_password').style.display='none';
document.getElementById('row_retype_new_password').style.display='none';
document.getElementById('change_pwd').style.display=''; 
$g_is_change_pwd_requested=0;
}
function addNewUsers()
{
openChangePwd();
document.getElementById('user_type').focus();
document.getElementById('user_type').value='0';
document.getElementById('login_id').value='';
document.getElementById('user_real_name').value='';
document.getElementById('user_email_id').value='';
document.getElementById('user_superwiser').value='0';
document.getElementById('user_group').value='0';
document.getElementById('user_can_edit_help').checked=false;
document.getElementById('cancel_change_pwd').style.display='none';
document.getElementById('row_old_password').style.display='none';
document.getElementById('change_pwd').style.display='none';
 $g_normal_update=0;
}
function getUserSetUpDetails($id)
{
 $('#page_main_div').load("html_modules/Setup_user_set_up.html");
 //closeChangePwd();
 $g_is_change_pwd_requested=0;
 getUserDetais($id);
  $g_normal_update=1;
 $g_is_update_by_editing=$id;
}
 
// user rights starts here 27 oct 
function enableUserRightsSetUp() 
 {
	document.getElementById('module_name_for_save').value = 'saveUserRightsDetails';
	
	LoadManualFilesToLi("setup_user_rights","2","User Rights",'',function(){
		getDefaultHeadFooterLinks('User Rights','setup_user_rights');
		$.ajax({
		type: "POST",
		//data:"user_id="+$u_id,
		url: $host_url+"getUserRightsDetails.demo",      
		success: populateUserRightsDetailsResponse
		});
	});	
}
function populateUserRightsDetailsResponse($responce)
{
  $responce = eval('(' + $responce + ')'); 
 
   document.getElementById('user_rights_user').options.length = 0;
   document.getElementById('user_rights_module_type').options.length = 0;
  $op = new Option('Select One', '0');
		$op.id='0';
		document.getElementById('user_rights_user').options.add($op);
		
		$op = new Option('Select One', '0');
		$op.id='0';
		document.getElementById('user_rights_module_type').options.add($op);
		 
	 for($i=0;$i < $responce.data['user_rights_user'].length;$i++)                                  
		{            
	    	$op = new Option($responce.data['user_rights_user'][$i]['value'], $responce.data['user_rights_user'][$i]['internal_code']);
			$op.id=$responce.data['user_rights_user'][$i]['internal_code'];//specifying the id  for options
			document.getElementById('user_rights_user').options.add($op);
		}
	 for($i=0;$i < $responce.data['user_rights_module_type'].length;$i++)                                  
		{            
	    	$op = new Option($responce.data['user_rights_module_type'][$i]['value'], $responce.data['user_rights_module_type'][$i]['internal_code']);
			$op.id=$responce.data['user_rights_module_type'][$i]['internal_code'];//specifying the id  for options
			document.getElementById('user_rights_module_type').options.add($op);
		}
		 document.getElementById('user_rights_table_data_div').innerHTML='';
		 getUserRightModuleNames(0,'');
		 
}
function getUserRightModuleNames($id,$serach_value)
{
if($serach_value=='')
{
document.getElementById('search_user_right_module_name').value='';
}
$user_id=document.getElementById('user_rights_user').value;
	$.ajax({
		type: "POST",
		data:"module_type="+$id+"&serach_value="+trim($serach_value)+"&user_id_value="+$user_id,
		url: $host_url+"getUserRightsModuleNames.demo",      
		success: UserRightsModuleNamesResponse
	});
}
function UserRightsModuleNamesResponse($responce)
{
  $responce = eval('(' + $responce + ')');       
  
  $g_user_rights_details=$responce;
  if( $responce.error_code=='0')
  {
 document.getElementById('user_rights_table_data_div').innerHTML='';
  //$table_format="<table style='padding:3px 4px 3px 3px;' id='user_rights_table_data' width='100%' border='0' cellspacing='0' cellpadding='0'>";
  document.getElementById('user_rights_table_data_div').innerHTML=   $responce.data.module_data;
/*   $('.jqgrow').bind('mouseover',function(e) 
	{
		ptr = $(e.target).parents("tr.jqgrow");
		if($(ptr).attr("class") !== "subgrid") 
		{
			$(ptr).addClass("ui-state-hover");
		}
		return false;
	}).bind('mouseout',function(e) 
	{
		ptr = $(e.target).parents("tr.jqgrow");
		$(ptr).removeClass("ui-state-hover");
		return false;
	}); */
  }
  
  
}
 function saveUserRightsDetails()
{
if(document.getElementById('user_rights_user').value=='0')
{
ShowAlertMsg('Please Select the User/Group');
document.getElementById('user_rights_user').focus();
return;
}
else
if(document.getElementById('user_rights_module_type').value=='0')
{
ShowAlertMsg('Please Select Module Tye');
document.getElementById('user_rights_module_type').focus();
return;
}

$view_arr = new Object();
for($i=0;$i<$g_user_rights_details.data['module_id_details'].length;$i++)
{
$id=$g_user_rights_details.data['module_id_details'][$i].internal_code;
$view_arr[$i]= new Object();
$view_arr[$i]['id']=$id;
	if(document.getElementById('view_own_'+$id).checked==true)
	{
	$view_arr[$i]['view_own']='1';
	}
	else $view_arr[$i]['view_own']='0';
	
	if(document.getElementById('view_group_'+$id).checked==true)
	{
	$view_arr[$i]['view_group']='1';
	}
	else $view_arr[$i]['view_group']='0';
	
	if(document.getElementById('view_dep_'+$id).checked==true)
	{
	$view_arr[$i]['view_dep']='1';
	}
	else $view_arr[$i]['view_dep']='0';
	
	if(document.getElementById('view_all_'+$id).checked==true)
	{
	$view_arr[$i]['view_all']='1';
	}
	else $view_arr[$i]['view_all']='0';	
	
	if(document.getElementById('add_'+$id).checked==true)
	{
	$view_arr[$i]['add']='1';
	}
	else $view_arr[$i]['add']='0';		
	
	if(document.getElementById('download_'+$id).checked==true)
	{
		$view_arr[$i]['download']='1';
	}
	else $view_arr[$i]['download']='0';	
	
	/* if(document.getElementById('post_'+$id).checked==true)
	{
	$view_arr[$i]['post']='1';
	}
	else $view_arr[$i]['post']='0';	 */
	
	if(document.getElementById('edit_own_'+$id).checked==true)
	{
	$view_arr[$i]['edit_own']='1';
	}
	else $view_arr[$i]['edit_own']='0';
	
	if(document.getElementById('edit_group_'+$id).checked==true)
	{
	$view_arr[$i]['edit_group']='1';
	}
	else $view_arr[$i]['edit_group']='0';
	
	if(document.getElementById('edit_dep_'+$id).checked==true)
	{
	$view_arr[$i]['edit_dep']='1';
	}
	else $view_arr[$i]['edit_dep']='0';
	
	if(document.getElementById('edit_all_'+$id).checked==true)
	{
	$view_arr[$i]['edit_all']='1';
	}
	else $view_arr[$i]['edit_all']='0';	
	
	if(document.getElementById('delete_own_'+$id).checked==true)
	{
	$view_arr[$i]['delete_own']='1';
	}
	else $view_arr[$i]['delete_own']='0';
	
	if(document.getElementById('delete_group_'+$id).checked==true)
	{
	$view_arr[$i]['delete_group']='1';
	}
	else $view_arr[$i]['delete_group']='0';
	
	
	if(document.getElementById('delete_dep_'+$id).checked==true)
	{
	$view_arr[$i]['delete_dep']='1';
	}
	else $view_arr[$i]['delete_dep']='0';	
	
	if(document.getElementById('delete_all_'+$id).checked==true)
	{
	$view_arr[$i]['delete_all']='1';
	}
	else $view_arr[$i]['delete_all']='0';	

	$view_arr[$i]['past_days']=	$('#past_days_'+$id).val();
	$view_arr[$i]['future_days']=	$('#future_days_'+$id).val();
	$view_arr[$i]['edit_days']=	$('#edit_days_'+$id).val();
	$view_arr[$i]['delete_days']=	$('#delete_days_'+$id).val();
}

var myJSONText = JSON.stringify($view_arr);   
$lst_data="user_rights_user="+document.getElementById('user_rights_user').value+"&module_type="+document.getElementById('user_rights_module_type').value;
$.ajax({
       type: "POST",
	   async:false,
	    url: $host_url+"addUserRightsDetails.demo",  
        data:$lst_data+"&user_rights_data="+myJSONText,
       success: addUserRightsDetailsResponce
    });   

}
function addUserRightsDetailsResponce($responce)
{
  $responce = eval('(' + $responce + ')'); 
  ShowSuccessMsg($responce.data);
}
function checkIsViewChecked($id)
{
document.getElementById('view_own_'+$id).checked=true;
// to check the Group details
	if(document.getElementById('edit_own_'+$id).checked==true)
	{
	for($i=0;$i<$g_user_rights_details.data['module_id_details'].length;$i++)
		{
		$c_id=$g_user_rights_details.data['module_id_details'][$i].internal_code;
		if($c_id==$id && $g_user_rights_details.data['module_id_details'][$i].group_id=='0' )
			{
				$arr_group_id_for_check=$g_user_rights_details.data['module_id_details'][$i].group_id_for_check;
				$spl_data=$arr_group_id_for_check.split(',');
				 
					for($k=0;$k<$spl_data.length;$k++)
					{
					$("#view_own_"+$id+"_"+$spl_data[$k]).attr('checked', true);
					$("#edit_own_"+$id+"_"+$spl_data[$k]).attr('checked', true);
					//document.getElementById('view_own_'+$id+"_"+$spl_data[$k]).checked=true;
					//document.getElementById('edit_own_'+$id+"_"+$spl_data[$k]).checked=true;
					}
			}
		}
	}
	else if(document.getElementById('edit_own_'+$id).checked==false)
	{
	for($i=0;$i<$g_user_rights_details.data['module_id_details'].length;$i++)
		{
		$c_id=$g_user_rights_details.data['module_id_details'][$i].internal_code;
		if($c_id==$id && $g_user_rights_details.data['module_id_details'][$i].group_id=='0' )
			{
				$arr_group_id_for_check=$g_user_rights_details.data['module_id_details'][$i].group_id_for_check;
				$spl_data=$arr_group_id_for_check.split(',');
					for($k=0;$k<$spl_data.length;$k++)
					{	if(document.getElementById('edit_own_'+$id+"_"+$spl_data[$k]))
						document.getElementById('edit_own_'+$id+"_"+$spl_data[$k]).checked=false;
					}
			}
		}
	}
	// for to check add
	if(document.getElementById('add_'+$id).checked==true)
	{
	for($i=0;$i<$g_user_rights_details.data['module_id_details'].length;$i++)
		{
		$c_id=$g_user_rights_details.data['module_id_details'][$i].internal_code;
	if($c_id==$id && $g_user_rights_details.data['module_id_details'][$i].group_id=='0' )
			{
				$arr_group_id_for_check=$g_user_rights_details.data['module_id_details'][$i].group_id_for_check;
				$spl_data=$arr_group_id_for_check.split(',');
				 
					for($k=0;$k<$spl_data.length;$k++)
					{
						if(document.getElementById('add_'+$id+"_"+$spl_data[$k]))
						document.getElementById('add_'+$id+"_"+$spl_data[$k]).checked=true;
						if(document.getElementById('view_own_'+$id+"_"+$spl_data[$k]))
						document.getElementById('view_own_'+$id+"_"+$spl_data[$k]).checked=true;
					}
			}
		}
	}	
	// for to check Download
	if(document.getElementById('download_'+$id).checked==true)
	{
	for($i=0;$i<$g_user_rights_details.data['module_id_details'].length;$i++)
		{
		$c_id=$g_user_rights_details.data['module_id_details'][$i].internal_code;
	if($c_id==$id && $g_user_rights_details.data['module_id_details'][$i].group_id=='0' )
			{
				$arr_group_id_for_check=$g_user_rights_details.data['module_id_details'][$i].group_id_for_check;
				$spl_data=$arr_group_id_for_check.split(',');
				 
					for($k=0;$k<$spl_data.length;$k++)
					{
						if(document.getElementById('download_'+$id+"_"+$spl_data[$k]))
						document.getElementById('download_'+$id+"_"+$spl_data[$k]).checked=true;					
					}
			}
		}
	}
	else if(document.getElementById('add_'+$id).checked==false)
	{
	for($i=0;$i<$g_user_rights_details.data['module_id_details'].length;$i++)
		{
		$c_id=$g_user_rights_details.data['module_id_details'][$i].internal_code;
		if($c_id==$id && $g_user_rights_details.data['module_id_details'][$i].group_id=='0' )
			{
				$arr_group_id_for_check=$g_user_rights_details.data['module_id_details'][$i].group_id_for_check;
				$spl_data=$arr_group_id_for_check.split(',');
				 
					for($k=0;$k<$spl_data.length;$k++)
					{
						if(document.getElementById('add_'+$id+"_"+$spl_data[$k]))
						document.getElementById('add_'+$id+"_"+$spl_data[$k]).checked=false;
					}
			}
		}
	}
	// for to check post
/* 	if(document.getElementById('post_'+$id).checked==true)
	{
	for($i=0;$i<$g_user_rights_details.data['module_id_details'].length;$i++)
		{
		$c_id=$g_user_rights_details.data['module_id_details'][$i].internal_code;
	if($c_id==$id && $g_user_rights_details.data['module_id_details'][$i].group_id=='0' )
			{
				$arr_group_id_for_check=$g_user_rights_details.data['module_id_details'][$i].group_id_for_check;
				$spl_data=$arr_group_id_for_check.split(',');
				 
					for($k=0;$k<$spl_data.length;$k++)
					{
						if(document.getElementById('post_'+$id+"_"+$spl_data[$k]))
						document.getElementById('post_'+$id+"_"+$spl_data[$k]).checked=true;
						if(document.getElementById('view_own_'+$id+"_"+$spl_data[$k]))
						document.getElementById('view_own_'+$id+"_"+$spl_data[$k]).checked=true;
					}
			}
		}
	}
	else if(document.getElementById('post_'+$id).checked==false)
	{
	for($i=0;$i<$g_user_rights_details.data['module_id_details'].length;$i++)
		{
		$c_id=$g_user_rights_details.data['module_id_details'][$i].internal_code;
		if($c_id==$id && $g_user_rights_details.data['module_id_details'][$i].group_id=='0' )
			{
				$arr_group_id_for_check=$g_user_rights_details.data['module_id_details'][$i].group_id_for_check;
				$spl_data=$arr_group_id_for_check.split(',');
				 
					for($k=0;$k<$spl_data.length;$k++)
					{
						if(document.getElementById('post_'+$id+"_"+$spl_data[$k]))
						document.getElementById('post_'+$id+"_"+$spl_data[$k]).checked=false;
					}
			}
		}
	} */
}

function uncheckIsViewChecked($id)
{
	if(document.getElementById('view_own_'+$id).checked==false)
	{
			document.getElementById('view_group_'+$id).checked=false;
			document.getElementById('view_dep_'+$id).checked=false;
			document.getElementById('view_group_'+$id).checked=false;
			document.getElementById('view_all_'+$id).checked=false;
			
			document.getElementById('delete_own_'+$id).checked=false;
			document.getElementById('delete_dep_'+$id).checked=false;
			document.getElementById('delete_group_'+$id).checked=false;
			document.getElementById('delete_all_'+$id).checked=false;
			
			document.getElementById('edit_own_'+$id).checked=false;
			document.getElementById('edit_dep_'+$id).checked=false;
			document.getElementById('edit_group_'+$id).checked=false;
			document.getElementById('edit_all_'+$id).checked=false;
			
			document.getElementById('add_'+$id).checked=false;
			document.getElementById('download_'+$id).checked=false;
			//document.getElementById('post_'+$id).checked=false;
		 
	}
	// to check the Group details
	if(document.getElementById('view_own_'+$id).checked==true)
	{
	for($i=0;$i<$g_user_rights_details.data['module_id_details'].length;$i++)
		{
		$c_id=$g_user_rights_details.data['module_id_details'][$i].internal_code;
		if($c_id==$id && $g_user_rights_details.data['module_id_details'][$i].group_id!='0' )
			{
				$arr_group_id_for_check=$g_user_rights_details.data['module_id_details'][$i].group_id_for_check;
				$spl_data=$arr_group_id_for_check.split(',');
				 
					for($k=0;$k<$spl_data.length;$k++)
					{
						document.getElementById('view_own_'+$id+"_"+$spl_data[$k]).checked=true;
					}
			}
		}
	}
	else if(document.getElementById('view_own_'+$id).checked==false)
	{
	for($i=0;$i<$g_user_rights_details.data['module_id_details'].length;$i++)
		{
		$c_id=$g_user_rights_details.data['module_id_details'][$i].internal_code;
		if($c_id==$id && $g_user_rights_details.data['module_id_details'][$i].group_id!='0' )
			{
				$arr_group_id_for_check=$g_user_rights_details.data['module_id_details'][$i].group_id_for_check;
				$spl_data=$arr_group_id_for_check.split(',');
				 
					for($k=0;$k<$spl_data.length;$k++)
					{
						document.getElementById('view_own_'+$id+"_"+$spl_data[$k]).checked=false;
					}
			}
		}
	}
}

function checkAllRights()
{
	if($g_user_rights_details!='')
	{
		if(document.getElementById('check_all_rights').checked==true)
		{
			for($i=0;$i<$g_user_rights_details.data['module_id_details'].length;$i++)
			{
			$id=$g_user_rights_details.data['module_id_details'][$i].internal_code;
			
			document.getElementById('delete_own_'+$id).checked=true;
			document.getElementById('delete_group_'+$id).checked=true;
			document.getElementById('delete_dep_'+$id).checked=true;
			document.getElementById('delete_all_'+$id).checked=true;
			
			document.getElementById('edit_own_'+$id).checked=true;
			document.getElementById('edit_group_'+$id).checked=true;
			document.getElementById('edit_dep_'+$id).checked=true;
			document.getElementById('edit_all_'+$id).checked=true;
			
			
			document.getElementById('add_'+$id).checked=true;
			//document.getElementById(''+$id).checked=true;
			//document.getElementById('post_'+$id).checked=true;
			
			document.getElementById('view_own_'+$id).checked=true;
			document.getElementById('view_group_'+$id).checked=true;
			document.getElementById('view_dep_'+$id).checked=true;
			document.getElementById('view_all_'+$id).checked=true;
			
			}
		}
		else
		 {
		 	for($i=0;$i<$g_user_rights_details.data['module_id_details'].length;$i++)
			{
			$id=$g_user_rights_details.data['module_id_details'][$i].internal_code;
			document.getElementById('delete_own_'+$id).checked=false;
			document.getElementById('delete_group_'+$id).checked=false;
			document.getElementById('delete_dep_'+$id).checked=false;
			document.getElementById('delete_all_'+$id).checked=false;
			
			document.getElementById('edit_own_'+$id).checked=false;
			document.getElementById('edit_group_'+$id).checked=false;
			document.getElementById('edit_dep_'+$id).checked=false;
			document.getElementById('edit_all_'+$id).checked=false;
			
			
			document.getElementById('add_'+$id).checked=false;
			document.getElementById('download_'+$id).checked=false;
			//document.getElementById('post_'+$id).checked=false;
			
			document.getElementById('view_own_'+$id).checked=false;
			document.getElementById('view_group_'+$id).checked=false;
			document.getElementById('view_dep_'+$id).checked=false;
			document.getElementById('view_all_'+$id).checked=false;
			}
		} 
 }
}
function checkAllDepUserRights()
{
	if($g_user_rights_details!='')
	{
		if(document.getElementById('check_all_dep_user_rights').checked==true)
		{
			for($i=0;$i<$g_user_rights_details.data['module_id_details'].length;$i++)
			{
			$id=$g_user_rights_details.data['module_id_details'][$i].internal_code;
			
			document.getElementById('delete_own_'+$id).checked=true;
			document.getElementById('delete_group_'+$id).checked=true;
			document.getElementById('delete_dep_'+$id).checked=true;
		 
			
			document.getElementById('edit_own_'+$id).checked=true;
			document.getElementById('edit_group_'+$id).checked=true;
			document.getElementById('edit_dep_'+$id).checked=true;
			 
			
			
			document.getElementById('add_'+$id).checked=true;
			//document.getElementById('post_'+$id).checked=true;
			
			document.getElementById('view_own_'+$id).checked=true;
			document.getElementById('view_group_'+$id).checked=true;
			document.getElementById('view_dep_'+$id).checked=true;
		 
			
			}
		}
		else
		 {
		 	for($i=0;$i<$g_user_rights_details.data['module_id_details'].length;$i++)
			{
			$id=$g_user_rights_details.data['module_id_details'][$i].internal_code;
			document.getElementById('delete_own_'+$id).checked=false;
			document.getElementById('delete_group_'+$id).checked=false;
			document.getElementById('delete_dep_'+$id).checked=false;
		 
			
			document.getElementById('edit_own_'+$id).checked=false;
			document.getElementById('edit_group_'+$id).checked=false;
			document.getElementById('edit_dep_'+$id).checked=false;
			 
			
			document.getElementById('add_'+$id).checked=false;
			//document.getElementById('post_'+$id).checked=false;
			
			document.getElementById('view_own_'+$id).checked=false;
			document.getElementById('view_group_'+$id).checked=false;
			document.getElementById('view_dep_'+$id).checked=false;
			 
			}
		} 
 }
}
function CheckAllColumnValue(type)
{
var check_box_id="";
var own_id="";
var dep_id="";
var grp_id="";
var all_id="";
if (type=='View')
{
	check_box_id='column_view';
	own_id='view_own_';
	grp_id='view_group_';
	dep_id='view_dep_';
	all_id='view_all_';
}
else if (type=='Add')
{
	check_box_id='column_add';
	own_id='add_';
	grp_id='add_';
	dep_id='add_';
	all_id='add_';
}
else if (type=='Download')
{
	check_box_id='column_download';
	own_id='download_';
	grp_id='download_';
	dep_id='download_';
	all_id='download_';
}
/* else if (type=='Post')
{
	check_box_id='column_post';
	own_id='post_';
	grp_id='post_';
	dep_id='post_';
	all_id='post_';
 }*/
else if (type=='Edit')
{
	check_box_id='column_edit';
	own_id='edit_own_';
	grp_id='edit_group_';
	dep_id='edit_dep_';
	all_id='edit_all_';
}
else if (type=='Delete')
{
	check_box_id='column_delete';
	own_id='delete_own_';
	grp_id='delete_group_';
	dep_id='delete_dep_';
	all_id='delete_all_';
}
if($g_user_rights_details!='')
	{
		if(document.getElementById(check_box_id).checked==true)
		{
			for($i=0;$i<$g_user_rights_details.data['module_id_details'].length;$i++)
			{
			$id=$g_user_rights_details.data['module_id_details'][$i].internal_code;
			
			document.getElementById(own_id+$id).checked=true;
			document.getElementById(grp_id+$id).checked=true;
			document.getElementById(dep_id+$id).checked=true;
			document.getElementById(all_id+$id).checked=true;
			}
		}
		else
		 {
		 	for($i=0;$i<$g_user_rights_details.data['module_id_details'].length;$i++)
			{
			$id=$g_user_rights_details.data['module_id_details'][$i].internal_code;
			document.getElementById(own_id+$id).checked=false;
			document.getElementById(grp_id+$id).checked=false;
			document.getElementById(dep_id+$id).checked=false;
			document.getElementById(all_id+$id).checked=false;
			}
		} 
 }
}
function CheckAllRowValues($id)
{
	if(document.getElementById('check_row_'+$id).checked==true)
	{
		document.getElementById('delete_own_'+$id).checked=true;
		document.getElementById('delete_group_'+$id).checked=true;
		document.getElementById('delete_dep_'+$id).checked=true;
		document.getElementById('delete_all_'+$id).checked=true;

		document.getElementById('edit_own_'+$id).checked=true;
		document.getElementById('edit_group_'+$id).checked=true;
		document.getElementById('edit_dep_'+$id).checked=true;
		document.getElementById('edit_all_'+$id).checked=true;

		document.getElementById('add_'+$id).checked=true;
		document.getElementById('download_'+$id).checked=true;
		//document.getElementById('post_'+$id).checked=true;
		
		document.getElementById('view_own_'+$id).checked=true;
		document.getElementById('view_group_'+$id).checked=true;
		document.getElementById('view_dep_'+$id).checked=true;
		document.getElementById('view_all_'+$id).checked=true;
	}
	else
	{
		document.getElementById('delete_own_'+$id).checked=false;
		document.getElementById('delete_group_'+$id).checked=false;
		document.getElementById('delete_dep_'+$id).checked=false;
		document.getElementById('delete_all_'+$id).checked=false;

		document.getElementById('edit_own_'+$id).checked=false;
		document.getElementById('edit_group_'+$id).checked=false;
		document.getElementById('edit_dep_'+$id).checked=false;
		document.getElementById('edit_all_'+$id).checked=false;

		document.getElementById('add_'+$id).checked=false;
		document.getElementById('download_'+$id).checked=false;
		//document.getElementById('post_'+$id).checked=false;
		
		document.getElementById('view_own_'+$id).checked=false;
		document.getElementById('view_group_'+$id).checked=false;
		document.getElementById('view_dep_'+$id).checked=false;
		document.getElementById('view_all_'+$id).checked=false;
	}
}