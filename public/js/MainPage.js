$g_clicked_syatem_module_table_name_for_month=""; 
var GridFilters=function()
{
}
grid_filter_obj=new GridFilters(); 
var $host_url="http://"+window.location.host+"/"+window.location.pathname.split('/')[1]+"/app.php?a=";
var $host_url_hr="http://"+window.location.host+"/"+window.location.pathname.split('/')[1]+"/aph.php?a=";
var $image_path="http://"+window.location.host+"/"+window.location.pathname.split('/')[1]+"/JQGrid4/themes/tarka/images/"; 
$host_url=$host_url.replace("/index.html","");
$host_url_hr=$host_url_hr.replace("/MainPage.html","");
// Golabal Variables
var $g_system_date='';
var $g_system_bom='';
var $gisLoggedInResponce='';
 window.gWindowType='E';
var $geditinternalcode=0;
var $loaded_js_files_arr = new Array(); 
 
// Loading Main Menu
function date_format($str)
{
	if(trim($str)=="" || $str=="undefined")
	$date="0000-00-00";	
	else				
	{
		var indx=$str.indexOf("/");
		if(indx==-1)
		return $str;
		else
		{
		$date=$str.split('/');
		return($date[2] +'-'+$date[1]+'-'+$date[0]);
		}
	}	
}
function date_format_time(str)
{	
	var date="0000-00-00 00:00:00";
	if(!empty(trim(str)))
	{		 
		var indx= str.indexOf(" ");
		if(indx==-1)
		return  date;
		else
		{
			var split_arr=str.split(' ');
			var date_arr=split_arr[0].split('/');
			date=date_arr[2] +'-'+date_arr[1]+'-'+date_arr[0]+" "+split_arr[1];
		}
	}
	return date;	
}

function ui_date_format($str)
{
	if(trim($str)=="" || $str=="undefined" || $str=="null" )
	$date="00/00/0000";	
	else				
	$date=$str.split('-');
	
	if($date.length==3)
	$date= $date[2] +'/'+$date[1]+'/'+$date[0];
	else $date="00/00/0000";	
	return $date;
}

function trim($str)
{
  return jQuery.trim($str);
}
function AjaxErrorMessage(xhr, textStatus, errorThrown) 
 {
	var error_msg="";
				$("#footer_save_link").show();
	if (textStatus !== null) {
		error_msg=textStatus;
	} else if (errorThrown !== null) {
		error_msg=errorThrown.message;
	}
	else {
		error_msg=error;
	}
		
		if(typeof(typeof(bootbox)) != 'undefined')
		{
			ShowAlertMsg(error_msg+"</br>"+xhr.responseText);
		}
		else
			ShowAlertMsg(error_msg+"</br>"+xhr.responseText);
		
		if(typeof($.unblockUI) != 'undefined')
			$.unblockUI();
}

function GetGeditInternalCodeForReport()
{
   var int_no=0;
	if($geditinternalcode>0)
		int_no=$geditinternalcode;
	else if (jQuery("#table_grid").length && jQuery("#table_grid").getGridParam('selrow')>0)
	{
		int_no= jQuery("#table_grid").getGridParam('selrow');
	}
	return int_no;
}
function closeManualScreens(internal_code)
{
	setTimeout(function(){
		$("#menu_tabs li.tab-current").prev().trigger("click");
		$('#section-bar-'+internal_code).remove();
		$('#menu_tabs #li_'+internal_code).remove();
	}, 100);
} 
function loadMasters()
{   
	$is_logged_user=isLoggedIn(); 
	$is_logged_user = 1;
	// $host_url= getCookie('host_url');
	// $g_language= getCookie('g_language');
	fw_password_changed= getCookie('fw_password_changed');
	
	if($is_logged_user==1)
	{	
		if(fw_password_changed=="No")
		{
			ShowAlertMsg("Please change the login Password");
			EnableChangePassword("0");
		}
		else
		{
			$.ajax({
				type: "POST",
				//async:false,
				error:AjaxErrorMessage,
				url: $host_url+"pupulateSystemMenu.demo",      
				success: displaySystemMenuResponce
			});
		 
			 $('#login_user_name_display').html(getCookie('username')+' - '+getCookie('fw_real_name'));
			 $('#login_user_email').html(getCookie('fw_user_email'));
			 $('#login_user_name_display_popover').html(getCookie('fw_real_name'));
		}
		// ApplyUserSelectedTheme();
	}
	else
	{
	// jAlert('Please Login', 'Page Says:');
 		setTimeout(function(){document.location.href = "index.html"},500); 
	}	
	//window.status='Leap From Tarka';
}
 
function ApplyUserSelectedTheme()
{
	$("#style_color").attr("id","style_color_old")
	$.cookie('style_color', getCookie('user_theme_name'));
	// console.log(getCookie('user_theme_name'));
	$(".theme-colors > ul > li[data-style='"+getCookie('user_theme_name')+"']").addClass("current");
	var headID = document.getElementsByTagName("head")[0];         
	var cssNode = document.createElement('link');
	cssNode.type = 'text/css';
	cssNode.rel = 'stylesheet';
	cssNode.href = 'assets/css/themes/'+ getCookie('user_theme_name')+'.css';
	cssNode.id = 'style_color';
	
	//cssNode.href = 'jquery-ui-1.10.3/themes/base/jquery.ui.all.css';
	headID.appendChild(cssNode);   
	
}

function closeMegaMenu()
{
	$(".fa-fw.open-close").trigger("click");
}
function HandleWindowResize()
{
	setTimeout(function(){ 
			$('#side-menu >li').each(function(){
				var position = $(this).position();
				var menu_width = $("#side-menu").width();
					menu_width = menu_width*0.60;
				if(position.left > menu_width)
				{
					$(this).addClass('last-nav');
				}
			});
		}, 200);
	
	$.each($("#side-menu>li>ul"),function(k,v)
	{
		var sub_menu_li_cnt = $(this).find(">li").length;
		var window_width = $(window).width();
		if(sub_menu_li_cnt > 9 && window_width > 980)
		{
			$(this).addClass("two-li");
		} 
		else
		{
			$(this).removeClass("two-li");
		}
	});
	
	HandleContainerFluidPadding();
	HandleSectionBarMinheight();
	
	if($(window).width()<=979)
	{
		$(".sidebar-nav").addClass('slimscrollsidebar');
		setTimeout(function(){ $("#nav_default_sidebar").css('overflow','');}, 200);
	}
	
	if($(window).width()>=768)
	{
		$("#footer_company_name").html("2019 &copy; Tarka Infotech Pvt. Ltd.");
		$("#powered_by").html("Powered By&nbsp;");
	}
	else
	{
		$("#footer_company_name").html("2019 &copy; Tarka");
		$("#powered_by").html("");
	}
}

function displaySystemMenuResponce($responce)
{                                         
    $responce = eval('(' + $responce + ')');  
    if ($responce.error_code == 0)
    {			
		$g_system_date=$responce.data['system_date'];
		$g_system_bom=$responce.data['system_bom'];
	    var div_id_cnt=$responce.data['div_id_cnt'];
        $("#system_menu").show();		
        $('#side_menu_ul').html($responce.data['sidehtml']);
		$('#side-menu').html($responce.data['html']);		
		$('#side-menu').metisMenu();		  

		includeJsFilesMannually("JQGrid4/src/grid.celledit.js");
		includeJsFilesMannually("JQGrid4/src/grid.formedit.js");	 
		$(".row").css("margin-left",'0px');
		$(".sub").css("max-height",'560px').css("overflow","auto");	 
		$('#login_counter').val($responce.data['login_cnt']); 
		home('home_dashboard');
		Common.GetFWCommonData();
		
		HandleWindowResize();
	}	     	
}
//Sidebar operations
function dropMenu(elt){
	
	if($(elt).parent('li').is('.open')){
		$(elt).parent('li').removeClass("open");
		$(elt).parent('li').children('a').children('span').removeClass("open");
		$(elt).parent('li').children('ul').slideUp(250, function(){$(elt).parent('li').children('ul').attr("style","display:none");});
	}
	else {
		$(elt).parent('li').siblings().children('a').children('span').removeClass("open");
		$(elt).parent('li').siblings().removeClass("open");
		$(elt).parent('li').siblings().children('ul').slideUp(250, function(){$(elt).parent('li').siblings().children('ul').attr("style","display:none");});
		$(elt).parent('li').addClass("open");
		$(elt).parent('li').children('a').children('span').addClass("open");
		$(elt).parent('li').children('ul').slideDown(500, function(){$(elt).parent('li').children('ul').attr("style","display:block");});
	}
}

function closeSideMenu()
{
	$('li.nav-item').removeClass('open');
	$('li.nav-item').children('a').children('span').removeClass('open');
	$('li.nav-item').children('ul').slideUp(250, function(){$('li.nav-item').children('ul').attr("style","display:none");});
	$('div.page-sidebar').removeClass('in');
	//$('#dialog').dialog('close');
}					
// Check User Logged IN (or) NOT
function isLoggedIn()
{
	$.ajax({
		type: "POST",
		async: false,
		url: $host_url+"isLoggedIn.demo",     
		error:AjaxErrorMessage,		
		data:'',
		success: isLoggedInResponce
  });
function isLoggedInResponce($responce)
{
	$responce = eval('(' + $responce + ')'); 
    $gisLoggedInResponce= $responce.data;

}
return $gisLoggedInResponce; 
}

// Get the Cookie Details
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
  
function CallTarkaMonthPicker(system_module_table_name,system_name)
{
	$g_clicked_syatem_module_table_name_for_month=system_module_table_name;
	$("#m_"+system_module_table_name+" #"+system_name).attr("attr_sys_module_table",system_module_table_name);
	$("#m_"+system_module_table_name+" #"+system_name).monthpicker({dateFormat:"M-yy"});
	$("#m_"+system_module_table_name+" #"+system_name).monthpicker('show');
	//$("#m_"+system_module_table_name+" #"+system_name).attr("attr_sys_module_table",system_module_table_name);
}	

function CallTarkaDatePicker(system_name)
{	 

	if(typeof(system_name)=='undefined')
	{
		$('.date-picker').datepicker({
			// rtl: App.isRTL(),

			autoclose: true,
			format: 'dd/mm/yyyy',
			  todayBtn: true
		});   
	} 
	else
	{
		$("#"+system_name).datepicker({
			// rtl: App.isRTL(),

			autoclose: true,
			format: 'dd/mm/yyyy',
			  todayBtn: true
		}); 
		$("#"+system_name).datepicker('show');
	}
    		
}
function getDateTime() {
    var now     = new Date(); 
    var year    = now.getFullYear();
    var month   = now.getMonth()+1; 
    var day     = now.getDate();
    var hour    = now.getHours();
    var minute  = now.getMinutes();
    var second  = now.getSeconds(); 
    if(month.toString().length == 1) {
        var month = '0'+month;
    }
    if(day.toString().length == 1) {
        var day = '0'+day;
    }   
    if(hour.toString().length == 1) {
        var hour = '0'+hour;
    }
    if(minute.toString().length == 1) {
        var minute = '0'+minute;
    }
    if(second.toString().length == 1) {
        var second = '0'+second;
    }   
    var dateTime = day+'/'+month+'/'+year+' '+hour+':'+minute;   
    return dateTime;
}

function CallTarkaDateTimePicker(system_name)
{	
	return;
	var current_datetime = getDateTime();
	if(typeof(system_name)=='undefined')
	{
		$('.form_datetime').datetimepicker({
			 autoclose: true,
            // isRTL: App.isRTL(),
            format: "dd/mm/yyyy hh:ii",
			 todayBtn: true,
            pickerPosition:"bottom-left"
		});   
		
	} 
	else
	{
		$("#"+system_name).datetimepicker({
			 autoclose: true,
			 "setDate": new Date(),
            // isRTL: App.isRTL(),
            format: "dd/mm/yyyy hh:ii",
			 todayBtn: true,
			 pickerPosition:"bottom-left"
            
		}); 
		
		$("#"+system_name).val(current_datetime);
		$("#"+system_name).datetimepicker('show');
	}
    		
}

function AssignDisplayModuleName()
{
	$modulepath="";
	$modulepath+=$system_menu_name;
	//$modulepath=$g_main_menu;
	if($g_module_parent_menu !="none")
	{
		//$modulepath+=$g_module_parent_menu;
		$('#span_main_menu').html($g_module_parent_menu);
		$("#span_main_menu").parent().show();
	}
	else
	{
		$("#span_main_menu").parent().hide();
	}
	if($geditinternalcode==0) 
	$('#page-title').html($g_display_module_name+" <small style='color: #1A847B; font-weight:400;'>Adding New "+$g_display_module_name+"</small>");
	else
	$('#page-title').html($g_display_module_name+" <small style='color: #1A847B; font-weight:400;'>Modifing  Details of "+$g_display_module_name+" </small>");
			
	$('#span_parent_menu').html($modulepath);
 
	$("#display_module_name").html($g_display_module_name);
	$("#display_module_name").attr("onclick","javascript:Clearfields();")
 
	$("#module_menu_action").show();
	$("#span_parent_menu_right").show();
	
} 
function AssignRefModuleLovValues(schema_id,system_module_table_name,geditinternalcode)
{
	 $.ajaxq("ajaxQueue",{
		type: "POST",
		async:false,
		url: $host_url+"AssignRefModuleLovValues.demo",     
		error:AjaxErrorMessage,
		data:"schema_id="+schema_id+"&system_module_table_name="+system_module_table_name+"&geditinternalcode="+geditinternalcode,
		success: function AssignRefModuleLovValuesResponse($responce)
			{
			  $responce = eval('(' + $responce + ')');
			if($responce.error_code=='-9')
			  {
			  ShowAlertMsg($responce.data);
			  return false;
			  }
			  if(!isNull($responce.data))
			  {
				for($k=0;$k<$responce.data.length;$k++)
					{
						var ele_code="#m_"+system_module_table_name+" #"+$responce.data[$k][0]['ele_code'];
						var o_ele_code= $responce.data[$k][0]['ele_code'];
						
						if($(ele_code).length>0)
						{
							// document.getElementById(ele_code).options.length = 0;
							$(ele_code+" option").empty(); 
						  
							var option = $('<option></option>').attr("value", "0").text("Select One");
							$(ele_code).append(option);
							if(!isNull($responce.data[$k]))
							{
								for($i=0;$i < $responce.data[$k].length;$i++)                                  

								{         
										if($responce.data[$k][$i]['internal_code']!='0')

										{
										var op = new Option($responce.data[$k][$i]['value'], $responce.data[$k][$i]['internal_code']);
										 op.id=$responce.data[$k][$i]['internal_code'];//specifying the id  for options
										if($(ele_code).length>0)
										{
										// document.getElementById(ele_code).options.add($op);
											$(ele_code).append(op);
										}
										}
								}
							}
						}
						EventAfterReferenceLovLoad(o_ele_code,system_module_table_name);
						
					}
					 if(!empty(all_obj[system_module_table_name]['g_user_schema_details_array']['data']['ref_data_default_val']) && all_obj[system_module_table_name]['g_is_module_for_new_or_edit']=="Add")
						 {
							var rdf_obj=all_obj[system_module_table_name]['g_user_schema_details_array']['data']['ref_data_default_val'];
							 
					 
							jQuery.each(rdf_obj, function(k, v) {
								var system_name=k;
								var rfd_default_val=v['default_val'];
								var rfd_int_code=v['int_code'];
								if(all_obj[system_module_table_name]['load_type']=='FW') 
								{
									  var div_id="#m_"+system_module_table_name;
									
								}else if(all_obj[system_module_table_name]['load_type']=='PopUp') 
								{
									var module_id=all_obj[system_module_table_name]['g_str_module_id'];
									var div_id="#popup_module_dialog_"+module_id+" #m_"+system_module_table_name;
								}
								 
								if($(div_id+" #"+system_name).attr('type')=='hidden')
									{
										$(div_id+" #txt_ref_schema_"+system_name).val(rfd_default_val);
										$(div_id+" #"+system_name).val(rfd_int_code);
									}
									else
									{
										 
										$(div_id+" #"+system_name).val(rfd_int_code);									 
									}
								
							});							
						}
				}
             				
			} 
			});
		 
					   
	
}

// Logout
function logout()
{
  swal({
		title: 'Are you sure to Logout..!',
		type: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'OK'
	}).then((result) => { 
	  if (result.value===true) { 
		CallLogout(); // this submits the form 
	  }
	  else
		return;  
	}) 
}
function CallLogout()
{
  $.ajax({
		 type: "POST",
		 async: false,
		   url: $host_url+"logout.demo",  
			error:AjaxErrorMessage,
		   data:"login_ctr="+$("#login_counter").val(),
		   success: logoutResponce
	  });
}
function logoutResponce($responce)
{
	$responce = eval('(' + $responce + ')'); 
	setTimeout(function(){document.location.href = "index.html"},500); 
}
function HandleSectionBarMinheight()
{
	if($(window).height()>620 && $(window).height()<750)
	{
		$('.section-bar-min-height').css("min-height","395px");
	}
	else if($(window).height()>750)
	{
		$('.section-bar-min-height').css("min-height","529px");
	}
}
function HandleContainerFluidPadding()
{
	if($("#side-menu").height()<=40)
	{
	   $('.container-fluid').css("padding-top","0px");
	}
	else if($("#side-menu").height()>40 && $("#side-menu").height()<80)
	{
	   $('.container-fluid').css("padding-top","5px");
	}
	else if($("#side-menu").height()>=80 && $("#side-menu").height()<89)
	{
	   $('.container-fluid').css("padding-top","45px");
	}
	else if($("#side-menu").height()>=45 && $("#side-menu").height()<90)
	{
		$('.container-fluid').css("padding-top","40px");
	}
	else if($("#side-menu").height()>=90 && $("#side-menu").height()<99)
	{
		$('.container-fluid').css("padding-top","50px");
	}
}
// Home
function home(dashboard_type,call_back)
{
	$g_inbox_init=0;
	$g_args=arguments;
	$('.page-title').html("Dashboard");
	$("#module_menu_action").hide();

    $('#page_main_home_div').show();
	$path="home.html";
	$('#home_dashboard').load($path,function()
	{		    
		HandleSectionBarMinheight();
		if(dashboard_type=="home_dashboard")
		{	
			ShowUserMegaMenu();
			GetDashboardDetails();
			UserGraphs.GetUserGraphs();
          
			$("#home_dashboard").trigger('click');	
	 	}
		else if(dashboard_type=="home_calender")
		{	
			$("#span_parent_menu").html("Calender");
			GetDashboardDetails();	
			GetCalenderDetails();	
			$("#home_calender").trigger('click');		
	 	}

		if(typeof(call_back)=="function")
		{		
			call_back($g_args[2]);
		}				
	}); 
			

}
 
function assignYearMonthValue($month)
{
	document.getElementById("details_"+$g_year_month_cal_text_id).value=$month+"-"+document.getElementById('year_month_cal').value;
	$("#sub_div_year_calander").hide();
}
function getYearMonthDBValue(val)
{
	var month_array = new Array();
 	  month_array['Jan'] = '01';
	  month_array['Feb'] = '02';
	  month_array['Mar'] = '03';
	  month_array['Apr'] = '04';
	  month_array['May'] = '05';
	  month_array['Jun'] = '06';
	  month_array['Jul'] = '07';
	  month_array['Aug'] = '08';
	  month_array['Sep'] = '09';
	  month_array['Oct'] = '10';
	  month_array['Nov'] = '11';
	  month_array['Dec'] = '12';
	  
		var inp_mon_arr = val.split('-');
		in_month = inp_mon_arr[0];
		in_year = inp_mon_arr[1];
		num_month = month_array[in_month];
		return in_year+num_month
}
function getYearMonthUIValue(val)
{
	if(trim(val)!='' && val != '000000' && val != '0')
	{
		var month_array = new Array();
		month_array['01'] = 'Jan';
		month_array['02'] = 'Feb';
		month_array['03'] = 'Mar';
		month_array['04'] = 'Apr';
		month_array['05'] = 'May';
		month_array['06'] = 'Jun';
		month_array['07'] = 'Jul';
		month_array['08'] = 'Aug';
		month_array['09'] = 'Sep';
		month_array['10'] = 'Oct';
		month_array['11'] = 'Nov';
		month_array['12'] = 'Dec';
		  
		in_year = val.substring(0,4);
		num_month = month_array[val.substring(4,6)];
		return num_month+'-'+in_year;
	}
	else
	{
	return "";
	}
	
}
  
grid_enter_events = {
table_grid:"selectRowId();" 
// table_grid1:"GetPopUpelementValue()"
}  
function in_array(needle, haystack, argStrict) {
     
    var key = '', strict = !!argStrict;

    if (strict) {
        for (key in haystack) {
            if (haystack[key] === needle) {
                return true;
            }
        }
    } else {
        for (key in haystack) {
            if (haystack[key] == needle) {
                return true;
            }
        }
    }

    return false;
}
function isNull(o)
{
return o === null;
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
}function GetGroupIdForGroup(group_name)
{
	for($j=0;$j< $all_multi_groups.length;$j++)
	{
		if(group_name==$all_multi_groups[$j]['group_name'])
		return $all_multi_groups[$j]['group_id'];
	}
}function GetGroupDetailsForGroup(group_name)
{
	for($j=0;$j< $all_multi_groups.length;$j++)
	{
		if(group_name==$all_multi_groups[$j]['group_name'])
		return $all_multi_groups[$j];
	}
}
function jQGridDateFormatter(cellvalue, options, rowObject)
{
   return ui_date_format(cellvalue);
}

function jQGridDateFormatter1(cellvalue, options, rowObject)
{
	var date=cellvalue.split('-');
	var new_date="";

	if(date.length==3)
	new_date=ui_date_format(cellvalue);
	else
	new_date=cellvalue;
	
	return new_date;
}

function NewGridEditNumberFormatter(cellvalue, options, rowObject)
{
	var input_width=parseInt(options['colModel']['widthOrg'])-10+"px";
	var grp_id=options['gid'].split("_").pop();
	var grp_arr=getMultiGroupIdArrDetails(grp_id);
	var entry_table=grp_arr['entry_table_name'];
	var onfocus="DisplayGridFooterDetailsValues('table_group_grid_"+grp_id+"',"+grp_id+","+options['rowId']+");";
	var id=grp_id+"_"+options['rowId']+"_"+options['colModel']['index'];
	var on_blur=" UpdateMultiGroupTableWithGridEdit('table_group_grid_"+grp_id+"',"+options['rowId']+",'"+options['colModel']['index']+"',this.value,'"+entry_table+"'); ";
	return "<input onfocus='$(this).select();' type='text' onfocus=\""+onfocus+"\" onkeypress='return acceptNumbersOnlyForModule(event);'   style='margin-right:5px;max-width:"+input_width+";text-align:right;color:#1E4766;' onchange=\""+on_blur+"\" onkeydown='handleGridEditManualKeyEvents(event);' value='"+cellvalue+"' id='"+id+"' />";
}
function handleGridEditManualKeyEvents(evt)
{
	var kC  = (evt.which) ? evt.which : evt.keyCode;
	if(kC==39 || kC==13) 
		$('#'+evt.target.id).focusNextInputField();
	if(kC==37) 
		$('#'+evt.target.id).focusPreviousInputField();	
}
function jQGridMonthNameFormatter(cellvalue, options, rowObject)
{
	return getYearMonthUIValue(cellvalue);
}
 
var $g_grid_row_color_arr = new Array();
 
function jQGridRowColor(cellvalue, options, rowObject)
{
	var table_id = options['gid'];
	var row_id = options['rowId'];
	 
	if(!empty(cellvalue))
	{
		$("#"+table_id+" #"+row_id).find("td").css("background","pink");
	}
	 
	return  cellvalue;
}
function array_flip (trans) 
{
    var key, tmp_ar = {};
	for (key in trans) 
	{
        tmp_ar[trans[key]] = key;
    }
    return tmp_ar;
}
  $.fn.focusNextInputField = function() {
    return this.each(function() {
        var fields = $(this).parents('form:eq(0),body').find('button,input,textarea,select');
        var index = fields.index( this );
        if ( index > -1 && ( index + 1 ) < fields.length ) {
            fields.eq( index + 1 ).focus();
        }
        return false;
    });}	
	
	$.fn.focusPreviousInputField = function() {
    return this.each(function() {
        var fields = $(this).parents('form:eq(0),body').find('button,input,textarea,select');
        var index = fields.index( this );
        if ( index > -1 && ( index + 1 ) < fields.length ) {
            fields.eq( index - 1 ).focus();
        }
        return false;
    });}		
function split(val) {
	return val.split(/;\s*/);
}
function extractLast( term ) {
	return split(term).pop();
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
function HandleNumberFromToRangeValidation(system_module_name,system_name,range_from,range_to)
{
	 
	if(empty(range_from))
		range_from=0;
	if(empty(range_to))
		range_to=0;
	range_from=parseFloat(range_from);
	range_to=parseFloat(range_to);
	var input_val = $("#m_"+system_module_name+" #"+system_name).val();
	 
	if(empty(input_val))
		input_val = 0;
	if(range_from!=0 && range_to!=0)
	{
		if(input_val>=range_from && input_val<=range_to)
		{
			return true;
		}
		else
		{
			ShowAlertMsg("Please Enter "+system_name+" Between "+range_from+" And "+range_to);
			setTimeout(function(){ 
				$("#m_"+system_module_name+" #"+system_name).val(0);
				},500); 
			
			
			return false;
		}
	}
} 
function FWAutoSelectFormatter(cellvalue, options, rowObject)
{
	var rowId=options["rowId"];
	var gid=options["gid"];
    var html="<i class='fa fa-check'   style='color:#008299;cursor:pointer;' onclick=\"POPUP.PopUpOnCheckBoxClickEvent(("+rowId+"))\" ></i>";
    return html;

}  