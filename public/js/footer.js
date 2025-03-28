function GenerateFiles(system_module_table_name)
{ 
		var save_obj=all_obj[system_module_table_name];
		// console.log(save_obj);
			save_second_level=save_obj.g_user_schema_details_array.data[1];
			var system_module_table_name=save_second_level[0].system_module_table_name;
			var g_str_module_id= save_obj.g_str_module_id;
			var g_str_module_name= save_obj.g_str_module_name;
			if( all_obj.validateFormFields(system_module_table_name))
			//if(1)
			{
				var div_id="m_"+system_module_table_name;
				var data="";
				var lstr_data="";
				for($i = 0; $i < save_second_level.length; $i++)
				{ 						 		
				var system_name=save_second_level[$i].system_name;
				var cell_val= (trim($("#"+div_id+" #"+system_name).val()));
				 lstr_data+="&"+(system_name.toLowerCase())+"="+cell_val;
				}
				 data="report_id="+g_str_module_id +"&schema_name="+g_str_module_name+"&system_module_table_name="+system_module_table_name+lstr_data;
			 
				var report_type = (trim($("#"+div_id+" #report_type").val()))
				
				if(report_type.toLowerCase()=='html')
				{
					App.blockUI({
						target: '#m_'+system_module_table_name,
						boxed: true,
						message: "Getting Report Data"
					});
					
					$.ajax
					({
						   type: "POST",
						   url: $host_url+"getDownloadReportFile",
						   error:AjaxErrorMessage,		       
						   //async: false,
						   data: data,
						   success:  function getDownloadReportFileResponce(responce)
									{
										 try
											{
												App.unblockUI();
												   App.unblockUI('#m_'+system_module_table_name);
												responce = eval('(' + responce + ')');
												if(responce.error_code=='-9')
												{
													
													alert(responce.data);
													CallLogout();
													return false;
												}
												if(responce.error_code == 0)
												{
													$("#m_"+system_module_table_name+" #html_report").remove();
													$("#m_"+system_module_table_name+" .tabbable").append("<div id='html_report' align='middle' style=' width:100%;overflow-y: auto; border: 1px solid #cfcfcf; padding: 10px;'></div>");
													$("#m_"+system_module_table_name+" #html_report").load(responce.data, function() {
														$("#m_"+system_module_table_name+" #html_report table tr td[class*='style']").attr('style','border-color:#ccc !important');
														$("#m_"+system_module_table_name+" #html_report table tr td[class*='style']").css('padding-right','2px').css('padding-left','2px').css('color','#000000');
														
														
													});
													
												}

												if(responce.error_code == -1)
												{
													
													ShowAlertMsg(responce.data.msg);
												}
											}	
											catch(err)
											{
												txt= err.message;
												
												ShowAlertMsg(txt+"<br> in saveModuleDetails");
											} 
									}	
							   
					  });
					
				}
				else
				{
					setTimeout(function(){ window.location.href=$host_url+"getDownloadReportFile&"+data,500});
				}	
			}			
}
function EnableManualModules()
{
	$("#li_1").show();
	$("#li_1").trigger("click");
	$('#page_main_home_div').hide();
	$('#page_main_div').show();
	$('#main_body').show();
}
 	 
function saveRecords()
{
	//$('#dialog').dialog('close');
 	switch(document.getElementById('module_name_for_save').value)
	{
	
		case 'savegeneralmasterDetails':
			savegeneralmasterDetails();
			//$geditinternalcode=0;
		break;
		
		case 'saveuserschemagroupDetails':
			saveuserschemagroupDetails();
			//$geditinternalcode=0;
		break;
		
		case 'saveuserschemaelementDetails':
		 
			saveuserschemaelementDetails();
		break;
		
		case 'saveModuleDetails':
			 saveModuleDetails();
			 
		break;
		
		case 'saveSchemaGroupTableDetails':
		 
			saveSchemaGroupDetails();
			//$geditinternalcode=0;
		break;
		 
		case 'saveUserSetUpDetails':		 
			  saveUserSetUpDetails();
			//$geditinternalcode=0;
		break;
		case 'saveUserRightsDetails':
			 
			saveUserRightsDetails();
			//$geditinternalcode=0;
		break;
		
		case 'saveTransactionSeries':			 
			saveTransactionSeries();
			//$geditinternalcode=0;
		break;		
	 
		 
		
		 	
	}
}

function Clearfields()
{
	//$('#dialog').dialog('close');
	$g_group_edit_internalcode=0;
	$g_group_edit_parent_internalcode=0;	
	switch(document.getElementById('module_name_for_save').value)
	{
		
		/* case 'savegeneralmasterDetails':
			enablegeneralmaster('Add');
			$geditinternalcode=0;
		break;
	
		case 'saveuserschemagroupDetails':
			enable_user_schema_group('Add');
			$geditinternalcode=0;
		break;
		
		case 'saveuserschemaelementDetails':
			enable_user_schema_elements('Add');
			$geditinternalcode=0;
		break; */
		
		case 'saveModuleDetails':
			getModulesDetails($g_str_module_name,$g_str_module_id,'Add',$g_display_module_name);
			$geditinternalcode=0;
			$geditParentGroupinternalcode=0;
		break;
	 
		case 'saveTransactionSeries':
			enableTransactionSeries("Add");
			$geditinternalcode=0;
		break;		
	 	
		 
		case 'saveUserSetUpDetails':
			$gedituserinternalcode=1;
			enableUserRightsSetUp();
		break;
 
		 
				
	}
}	
 

function view_records()
{
//$('#dialog').dialog('close');
$geditinternalcode=0;
$geditParentGroupinternalcode=0;
$g_group_edit_internalcode=0;
$g_group_edit_parent_internalcode=0;
HideHeaderFooterValues('View');

	if(1)
	{
		switch(document.getElementById('module_name_for_save').value)
		{
		/* 	case 'savegeneralmasterDetails':
				displayUserSchemaMaster_grid("system_general_master_setup");
			break;
			
			case 'saveuserschemagroupDetails':
				display_user_schema_group_master_grid();			
			break;
			
			case 'saveuserschemaelementDetails':
				display_user_schema_element_master_grid("system_user_schema_elements");			
			break; */
			
			case 'saveModuleDetails':
			displayUserSchemaModuleDetails();
				
			break;
			
			case 'saveuserschemaelementDetails':
				display_user_schema_element_master_grid();
				document.getElementById('edit_row').style.display='';
				document.getElementById("finish_row").setAttribute("class", "tarkabutton-disabled");
			break;
			
			 
			case 'saveTransactionSeries':
				displayTransactionSeriesGrid();				
			break;
													 
		}
	}	
}
 
 	
 
 function editRecords($id)
{
//$('#dialog').dialog('close');
$geditinternalcode=$id;
 	switch(document.getElementById('module_name_for_save').value)
	{
		
		case 'savegeneralmasterDetails':
			enablegeneralmaster('Edit')
		break;
			
		case 'saveDynamicMasters':
			getDynamicMasterDetails($id);
			break;
			case 'saveuserschemagroupDetails':
				enable_user_schema_group('Edit');
			//getUserSchemaGroupDetails($id);
		break;
		case 'saveuserschemaelementDetails':
			 enable_user_schema_elements('Edit');
		break;
			case 'saveModuleDetails': 		
		  	getModulesDetails($g_str_module_name,$g_str_module_id,'Edit',$g_display_module_name);
			 
			 //getUserSchemaModuleDetails($id,$g_user_schema_details_array.data[1][0].ref_s_user_schema_code);
			
		break;
		 
		case 'saveUserSetUpDetails':
			getUserSetUpDetails($id);
		break;
		case 'saveTransactionSeries':
			CallenableTransactionSeries('Edit');
		break;
	}
}
function editRecordsNewFromEnterKey(system_module_name)
{
	var id=jQuery("#table_grid_"+system_module_name).getGridParam('selrow'); 
	if(id > 0) 
	{ 
		var obj=all_obj[system_module_name];
	 
		switch(document.getElementById('module_name_for_save').value)
		{
			 
				case 'saveModuleDetails': 
				{				
					var load_type=all_obj[system_module_name]['load_type'];
					if(load_type=="FW")
					{
					getModulesDetailsNew(system_module_name,obj.g_str_module_name,obj.g_str_module_id,'Edit',obj.g_display_module_name,id);
					}
					else
					{
						var jt_db=getCookie("jt_db");
						var path="html_modules/modules/"+jt_db+"/module_"+all_obj[system_module_name]['g_str_module_id']+".html";	
						var popup_content_div_id="popup_content_"+all_obj[system_module_name]['g_str_module_id']
						$('#'+popup_content_div_id).load(path,function() 
						{
								CallGetModuleDetailsNew(system_module_name,'Edit',all_obj[system_module_name]['g_str_module_name'],all_obj[system_module_name]['g_str_module_id'],id,'PopUp');
						});
					}
				}
				 
		}
	} 
	else
	{ 
		alert("Please select row"); return;
	}
}
function editRecordsNew($id,system_module_name)
{
//$('#dialog').dialog('close');
 
	// alert(all_obj[system_module_name]['geditinternalcode']);
 var obj=all_obj[system_module_name];
 
 	switch(document.getElementById('module_name_for_save').value)
	{
		 
			case 'saveModuleDetails': 		
			{
				var load_type=all_obj[system_module_name]['load_type'];
				if(load_type=="FW")
				{
				getModulesDetailsNew(system_module_name,obj.g_str_module_name,obj.g_str_module_id,'Edit',obj.g_display_module_name,$id);
				}
				else
				{
					var jt_db=getCookie("jt_db");
					var path="html_modules/modules/"+jt_db+"/module_"+all_obj[system_module_name]['g_str_module_id']+".html";	
					var popup_content_div_id="popup_content_"+all_obj[system_module_name]['g_str_module_id']
					$('#'+popup_content_div_id).load(path,function() 
					{
							CallGetModuleDetailsNew(system_module_name,'Edit',all_obj[system_module_name]['g_str_module_name'],all_obj[system_module_name]['g_str_module_id'],$id,'PopUp');
					});
				}
			}
			 
	}
}
 
function UploadRecords(system_module_name)
{
	switch(document.getElementById('module_name_for_save').value)
	{		
		case 'saveModuleDetails':
			
			// var load_id = "#page_main_div";
			var load_id = "#m_"+system_module_name+"_section";
			var load_type=all_obj[system_module_name]['load_type'];
			if(load_type=='PopUp')
			{
				load_id="#popup_module_dialog_"+all_obj[system_module_name]['g_str_module_id']+" #popup_content_"+all_obj[system_module_name]['g_str_module_id'];
			}
			
			//uploadModuleRecords($g_user_schema_details_array.data[1][0].ref_s_user_schema_code);
			$(load_id).load("html_modules/upload_details.html", function () {
			
				var schema_id = all_obj[system_module_name]['g_str_module_id'];
				$(load_id+" #module_download_format").bind('click', function() {
					get_header(schema_id,system_module_name);
				});
				$(load_id+" #module_upload_data").bind('click', function() {
					uploadModuleDetailsIntoDB(schema_id,system_module_name);
				});
				$(load_id+" #module_download_data").bind('click', function() {
					downloadModuleData(schema_id,system_module_name, load_id);
				});
				$(load_id+" #is_display_add_remove_row").bind('click', function() { 
					DisplayAddRemoveRow(schema_id, system_module_name, load_id);
				});
				$(load_id+" #add_row").bind('click', function() {
					addDownloadFiltersRow(system_module_name, load_id);
				});
				$(load_id+" #remove_row").bind('click', function() {
					removeDownloadFiltersRow(system_module_name, load_id);
				});
				$(load_id+" #download_field_id_1").bind('change', function() {
					createTextBoxBasedDataType('1', system_module_name, load_id );
				});
				
			});           
			HideHeaderFooterValues('Upload/Download');		
	}		
}	
function HideHeaderFooterValues($type)
{
	switch($type)
	{		
			
			case 'View':
				$("#header_finish_row").hide();
				$("#footer_finish_row").hide();
				$("#footer_upload_row").show();
				$("#header_upload_row").show();				
				$("#header_clear_row").html("New");
				$("#footer_clear_row").html("New");
				$("#header_upload_row").html("Download/Upload");
				$("#footer_upload_row").html("Download/Upload");
				$("#header_generate").html("Generate ");
				$("#footer_generate").html("Generate "); 				
			    $("#header_view_row").hide();
				$("#footer_view_row").hide();
				$("#btn_header_save").hide();					
				$("#btn_header_view").hide();	
				$("#btn_footer_save").hide();					
				$("#btn_footer_view").hide();					
				$("#footer_generate").show();
				$("#header_generate").show();
				$("#header_sendmail").show();
				$("#footer_sendmail").show();
			    $("#header_clear_row").focus()
			break;
			case 'Reports':
				$("#header_view_row").hide();
				$("#footer_view_row").hide();
				$("#header_upload_row").hide();
				$("#footer_upload_row").hide();
				$("#btn_header_save").hide();					
				$("#btn_header_view").hide();	
				$("#btn_footer_save").hide();					
				$("#btn_footer_view").hide();
				$("#btn_header_upload").hide();
				$("#btn_footer_upload").hide();				
			break;
			case 'Download':
				$("#header_finish_row").hide();
				$("#footer_finish_row").hide();
				$("#header_upload_row").hide();
				$("#footer_upload_row").hide();				
				$("#header_clear_row").html("New");
				$("#footer_clear_row").html("New");
				$("#btn_header_save").hide();					
				$("#btn_header_view").hide();	
				$("#btn_footer_save").hide();					
				$("#btn_footer_view").hide();
				$("#btn_header_upload").hide();
				$("#btn_footer_upload").hide();
			
			break;		
	}	
}
function getManualUploadheader()
{
	switch(document.getElementById('module_name_for_save').value)
	{
		
			case 'enableMonthlyTransaction':
			 window.location.href=$host_url+"getMonthlyTransactionHeaders.demo";
			break;
		 
	}		
}
function uploadManualModuleDetailsIntoDB()
{
	switch(document.getElementById('module_name_for_save').value)
	{
		
			case 'enableMonthlyTransaction':
			 uploadMonthlytransactionsIntoDB();
			break;
			 	
	}		
}
 

 function getDefaultHeadFooterLinks(module,module_system_name)
 {	
	$.ajax({
		type: "POST",
		 async:false,
		url: $host_url+"getDefaultHeadFooterLinks.demo", 
		data:"module_name="+module,	
		success:  function getHeadFooterLinksResponce($responce)
		{
				$responce = eval('(' + $responce + ')');
				var g_link_details_array="";
			 
				g_link_details_array=$responce.data['links_data'];
				$g_module_parent_menu =  $responce.data['module_parent_menu'];
				$system_menu_name =  $responce.data['system_menu_name'];
				 $g_display_module_name =  $responce.data['display_module_name'];
				AssignDisplayModuleName();

				$("#m_"+module_system_name+" #module_menu_links").html(g_link_details_array['header_link']);							 
				$("#m_"+module_system_name+" #save_clear_panel").html(g_link_details_array['footer_link']);							 
				
				// var html_save="";
					// html_save+="<div class='form-actions right' id='save_clear_panel' style='margin:0; float:right; border:1px solid #E5E5E5; border-top:none;'>";
					// html_save+="<a href='#' onclick='javascript:saveRecords();'  style='margin-right: 5px;' class='btn btn btn-success'>Save <i class='fa fa-check'></i></a>";
					// html_save+="<a href='#' onclick='javascript:Clearfields();' style='margin-right: 5px;' class='btn btn btn-info'>New <i class='fa fa-bars'></i></a>";
					// html_save+="</div>";
					
				// $("#save_clear_panel").remove();	
				// $("#page_main_tab_div").after(html_save);
				$("#module_menu_action").show();
			 
		}
	}); 
 }

 $upload_group_table_name="";
function  UploadGroupDetails(group_name)
{
$upload_group_table_name=group_name;
$('#dialog').dialog('open');

$path="../html_modules/upload_group_details.html";
	$('#dialog').load($path);
 
}