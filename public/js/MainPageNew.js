var AllModules=function()
{
	 
	this.ClearfieldsNew=function(system_module_name)
	{ 
		if(all_obj[system_module_name]['load_type']=='FW')
			getModulesDetailsNew(system_module_name,all_obj[system_module_name]['g_str_module_name'],all_obj[system_module_name]['g_str_module_id'],'Clear',all_obj[system_module_name]['g_display_module_name'],0);
		else
		{
			var jt_db=getCookie("jt_db");
			var path="html_modules/modules/"+jt_db+"/module_"+all_obj[system_module_name]['g_str_module_id']+".html";	
			var popup_content_div_id="popup_content_"+all_obj[system_module_name]['g_str_module_id']
			$('#'+popup_content_div_id).load(path,function() 
			{
					CallGetModuleDetailsNew(system_module_name,'Clear',all_obj[system_module_name]['g_str_module_name'],all_obj[system_module_name]['g_str_module_id'],0,'PopUp');
			});
		}
	},
	this.GetGroupDetailsForGroup=function (system_module_name,group_name)
	{
		var all_multi_groups=all_obj[system_module_name]['all_multi_groups'];
	
		for( j=0; j<  all_multi_groups.length; j++)
		{
			if(group_name==all_multi_groups[j]['group_name'])
			return  all_multi_groups[j];
		}
	},
	this.close = function (system_module_name,internal_code) 
	{
		if(all_obj.hasOwnProperty(system_module_name))
		{
			if(all_obj[system_module_name]['geditinternalcode'] > 0)
			{
				swal({
						title: 'You are in edit mode, Are you sure to close..?',
						type: 'warning',
						showCancelButton: true,
						confirmButtonColor: '#3085d6',
						cancelButtonColor: '#d33',
						confirmButtonText: 'Yes'
					}).then((result) => { 
						if (result.value===true)
						{ 
							this.CloseFromCall(system_module_name,internal_code);
						}
					}); 
			}
			else
			{
				this.CloseFromCall(system_module_name,internal_code);
			}
		}
		else
		{
			this.CloseFromCall(system_module_name,internal_code);
		}
	},
	this.CloseFromCall=function(system_module_name,internal_code)
	{
		if(all_obj[system_module_name]['load_type']== 'FW')
		{
			setTimeout(function(){
					$("#menu_tabs li.tab-current").prev().trigger("click");
					$('#section-bar-'+internal_code).remove();
					$('#menu_tabs #li_'+internal_code).remove();
				}, 100);
		}
		else
		{
			var div_id="popup_module_dialog_"+internal_code;
			$('#'+div_id).dialog("close");
			$("#popup_module_dialog_"+internal_code).html("");
		}
	},
	this.CallTarkaNewDatePicker = function (system_module_name,system_name)
	{
	jQuery("#m_"+system_module_name+" #"+system_name).datepicker({
        autoclose: true,
        todayHighlight: true
    });
	},
	this.CallTarkaDatePickerNew = function (system_module_name,system_name)
	{	 
	var e_val=$("#m_"+system_module_name+" #"+system_name).val();
	if(e_val=="00/00/0000")
		$("#m_"+system_module_name+" #"+system_name).val("");
		$("#m_"+system_module_name+" #"+system_name).datepicker({
			// rtl: App.isRTL(),
			autoclose: true,
			format: 'dd/mm/yyyy',
			  todayBtn: true
		}); 
		$("#m_"+system_module_name+" #"+system_name).datepicker('show');
		$(".datepicker").css("z-index","100001");
	},
	this.CallTarkaDateTimePickerNew = function (system_module_name,system_name)
	{	
		var current_datetime = getDateTime();
		$("#m_"+system_module_name+" #"+system_name).datetimepicker({
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
	this.CallTarkaTimePickerNew = function (system_module_name,system_name)
	{	
		$("#m_"+system_module_name+" #"+system_name).clockpicker({
			donetext: 'Done',
		}).find('input').change(function() {
			console.log(this.value);
		});
		$("#"+system_name).clockpicker('show');
	}
	this.CallTarkaMonthPickerNew = function (system_module_name,system_name)
	{	
		$("#m_"+system_module_name+" #"+system_name).datepicker( {
			format: "M-yyyy",
			viewMode: "months", 
			minViewMode: "months",
			autoclose: true
		});
		$("#m_"+system_module_name+" #"+system_name).datepicker('show');
	}
	
	this.ClearReferenceData=function (system_module_name,ref_s_user_schema_code,system_name) {
		
		var div_id = "#page_main_div #m_"+system_module_name;
		 if(all_obj[system_module_name].load_type=='PopUp')
			div_id = "#popup_module_dialog_"+ref_s_user_schema_code+" #popup_content_"+ref_s_user_schema_code+" #m_"+system_module_name;
		
		
		var val = $(div_id+" #"+system_name).val();
		var txt_ref_val = trim($(div_id+" #txt_ref_schema_"+system_name).val());
		if(val==0 && !empty(txt_ref_val))
		{
			$(div_id+" #txt_ref_schema_"+system_name).val("");
			setTimeout(function(){
				$(div_id+" #txt_ref_schema_"+system_name).focus();
			}, 100);
			return false;
		}
	},
	
	this.validateFormFields=function(system_module_name)
	{
		var save_obj=this[system_module_name];
		var div_id="m_"+system_module_name;
		save_second_level=save_obj.g_user_schema_details_array.data[1];
		var system_module_table_name=save_second_level[0].system_module_table_name;
		for($i = 0; $i < save_second_level.length; $i++)
		{
			var data_type=save_second_level[$i].Type;
			var optional=save_second_level[$i].optional;
			var system_name=save_second_level[$i].system_name;
			var element_name=save_second_level[$i].element_name;
			var is_ref_module_code_lov=save_second_level[$i].is_ref_module_code_lov;
			var p_cell_val=parseFloat(trim($("#"+div_id+" #"+save_second_level[$i].system_name).val()));
			var div_sytem_name=$("#"+div_id+" #"+save_second_level[$i].system_name);
			var cell_val= (trim($("#"+div_id+" #"+save_second_level[$i].system_name).val()));
			 
				if(data_type=="Number"   && optional=='0' && (empty(cell_val) || cell_val==0))
				{
					ShowAlertMsg(element_name+" is mandatory", function() {
									setTimeout(function(){div_sytem_name.focus(); ;},2000);			
								});    
					return false;
				}
				else if(data_type=="Text"  && optional=='0'  && empty(cell_val))
				{					 
					 
					ShowAlertMsg(element_name+" is mandatory", function() {
									setTimeout(function(){div_sytem_name.focus(); ;},2000);			
								});    
					return false;
				}
				
				else if(data_type=="Email")
				{					 
					 if(optional=='0'  && empty(cell_val))
					 {
						ShowAlertMsg(element_name+" is mandatory", function() {
										setTimeout(function(){div_sytem_name.focus(); ;},2000);			
									});    
						return false;
					}
					if(validateemail(cell_val)==false)
					{
						ShowAlertMsg("Please Enter Valid Email Id In "+element_name, function() {
										setTimeout(function(){div_sytem_name.focus(); ;},2000);			
									});    
						return false;
					};
					
				}	
				else if(data_type=="List Of Values"  && optional=='0' && empty(cell_val))
				{					 
					 
					ShowAlertMsg(element_name+" is mandatory", function() {
									setTimeout(function(){div_sytem_name.focus(); ;},2000);			
								});    
					return false;
				}
				else if(data_type=="Reference Data"  && optional=='0'  && empty(cell_val) )//&& is_ref_module_code_lov=1
				{
					
					
					ShowAlertMsg(element_name+" is mandatory", function() {
									setTimeout(function(){div_sytem_name.focus(); ;},2000);			
								});    
					return false;
				}
				else if(data_type=="Date")
				{
					 
					if(optional=='0' && (cell_val=="00/00/0000" || empty(cell_val)))
					{
							ShowAlertMsg(element_name+" is mandatory", function() {
									setTimeout(function(){div_sytem_name.focus();},2000);			
								});    
							return false;
					}
					if(!empty(cell_val)   && !isDate(cell_val,'d/M/y'))
					{
					ShowAlertMsg('Please Enter '+element_name+' Date format as dd/mm/yy');
					div_sytem_name.focus();
					return false;
					}
				}
				else if(data_type=="Attachment" && typeof window.FileReader !== 'function' )
				{
					
					ShowAlertMsg(element_name+" : The file API isn't supported on this browser yet. Update your browser to latest version.", function() {
							setTimeout(function(){div_sytem_name.focus();},2000);			
						});    
					return false;
					
				}else if(data_type=="Attachment" && optional=='0' && empty(cell_val) )
				{
					
					ShowAlertMsg(element_name+" is mandatory", function() {
							setTimeout(function(){div_sytem_name.focus();},2000);			
						});    
					return false;
					
				}
				 
			 
		}
		
		return true;
	},
	this.ReadAttachment=function (system_module_name,system_name)
	{
	
		var load_id = "#m_"+system_module_name+" #"+system_name;
		var input =$(load_id).fileinput()[0];
		var attachment_obj =new Object();;
		if (input.files[0])
		{
			var file_name = $(load_id).fileinput()[0].files[0].name;
				
			var file = input.files[0];
			var fr = new FileReader();
			fr.readAsDataURL(file);
			var result;
			fr.onload = function () {
				result = fr.result;
			
				$(load_id).attr("data-file-src",result);
				$(load_id).attr("data-file-name",file_name);
				$(load_id).attr("data-att-state","New");
				$(load_id+"_attch_del").show();
				$(load_id+"_attch_name").attr('href',"");
				$(load_id+"_attch_name").html("");
			};
		}
	},
	this.RemoveAttachment=function(system_module_name,system_name)
	{
		var load_id = "#m_"+system_module_name+" #"+system_name;
		$(load_id).val("");
		$(load_id).attr("data-file-src","");
		$(load_id).attr("data-file-name","");
		$(load_id).attr("data-att-state","Delete");
		$(load_id+"_attch_name").attr('href',"");
		$(load_id+"_attch_name").html("");
		$(load_id+"_attch_del").hide();
		
	},
	this.saveModuleDetails=function(system_module_name)
	{
		  try
		  {
			var save_obj=this[system_module_name];
			geditinternalcode=save_obj['geditinternalcode'];
			var edit_right=save_obj['edit_right'];
			var add_right=save_obj['add_right'];
			var is_edit_allowed_for_past_days=save_obj['is_edit_allowed_for_past_days'];
			if(is_edit_allowed_for_past_days=="0" && geditinternalcode > 0)
			{
				ShowAlertMsg("Hi "+getCookie("username")+", You dont have permission to Edit this record");
				return false;
			}
			if(edit_right=="0" && geditinternalcode > 0)
			{
				ShowAlertMsg("Hi "+getCookie("username")+", You dont have permission to Edit this record");
				return false;
			}
			if(add_right == "0" && geditinternalcode == 0)
			{
				ShowAlertMsg("Hi "+getCookie("username")+", You dont have permission to Add this record");
				return false;
			}
			
			
			var div_id="m_"+system_module_name;
			save_second_level=save_obj.g_user_schema_details_array.data[1];
			var system_module_table_name=save_second_level[0].system_module_table_name;
			 if(!this.validateFormFields(system_module_name)) return;
				is_empty_rows_flag=false;
				if(!empty(save_obj.g_multi_group))
				{
					$.each(save_obj.g_multi_group, function (k,v) {
						var group_table_name=v.table_name;
						var group_name=v.group_name;
						var is_empty_rows_allowed=v.is_empty_rows_allowed;
						 
						if(is_empty_rows_allowed==0)
						{
							if($("#"+div_id+" #"+group_table_name+" input:visible").length>0)
							{
								var input_val="";
								  $("#"+div_id+" #"+group_table_name+" input:visible").map(function(){
									 var this_val=$(this).val();
										if(!empty(this_val) && this_val!='0' && this_val!="0.00" && this_val!=".00")
										{
											input_val+=this_val;
										}										
									});
									
								if(!empty(input_val))
								{
								ShowAlertMsg(group_name+" grid contains unsaved row(s). Please save/clear it before final save");	
								is_empty_rows_flag=true;
								return;
								}
							}
						}
					});		
				}
				if(is_empty_rows_flag) return;
						$auto_increment_value='';
						var auto_inc_ctr=0;
						var save_schema_details_arr = new Object();
						var auto_inc_details_arr = new Object();
					var image_obj = new Object();
					var attachments_obj = new Object();
					
					for($k = 0; $k < save_second_level.length; $k++)
					  {
						 
						var field_id=save_second_level[$k].meta_field;
						var meta_data=save_second_level[$k].meta_data;
						var field_id_val='';

						if(meta_data=="User") continue;
						if(save_second_level[$k].meta_field!='' && save_second_level[$k].Type!='Ref Display')
						{
							
							 
							var system_name= save_second_level[$k].system_name;
							var cell_val= (trim($("#"+div_id+" #"+save_second_level[$k].system_name).val()));
							
							var int_code=save_second_level[$k].internal_code;;
						 
							/* if(save_second_level[$k].Type=='Date' && cell_val!='')
							{
							 
							field_id_val=date_format(cell_val);
							 
							}
							else if(save_second_level[$k].Type=='Date' && (cell_val)=='')
							{
						 
							field_id_val="0000-00-00";
						 
							} */
							 
							if(save_second_level[$k].Type=='DateTime' && cell_val=='')
							{
							field_id_val="00/00/0000 00:00";
							}
							  else if(save_second_level[$k].Type=='Month' && cell_val!='')
							{
							  field_id_val=getYearMonthDBValue(cell_val);
							}
							else if(save_second_level[$k].Type=='Month' && cell_val=='')
							{
							  field_id_val="000000"
						 
							}
							else if(save_second_level[$k].Type=='Checkbox')
							{
							    if($("#"+div_id+" #"+save_second_level[$k].system_name).is(':checked'))
								  field_id_val=1;
							    else
								  field_id_val=0;	
							}
							
							else if(save_second_level[$k].Type=='Image')
							{
								var image_val=encodeURIComponent($("#"+system_name+" .fileinput-preview.fileinput-exists.thumbnail >img").attr('src'));
								var image_class = $("#"+system_name+" .fileinput").attr('class')
								image_obj[system_name]= new Object();
								image_obj[system_name]['data']= image_val;
								image_obj[system_name]['class']= image_class;
								image_obj[system_name]['file_name']= $("#"+system_name+" :file").val();
								continue;
							}
							else if(save_second_level[$k].Type=='Attachment')
							{	
							
								attachments_obj[system_name] = new Object();
								var file_content = encodeURIComponent($("#m_"+system_module_name+" #"+system_name).attr('data-file-src'));
								var file_name = encodeURIComponent($("#m_"+system_module_name+" #"+system_name).attr('data-file-name'));
								var attach_state = $("#m_"+system_module_name+" #"+system_name).attr('data-att-state');
								attachments_obj[system_name]['file_name']=file_name;
								attachments_obj[system_name]['file_content']=file_content;
								attachments_obj[system_name]['attach_state']=attach_state;
								continue;
							} 
							else if (save_second_level[$k].Type=='Reference Data' && save_second_level[$k].is_ref_module_code_lov=='0')
							{
							var txt_ref_val=trim($("#"+div_id+" #"+'txt_ref_schema_'+save_second_level[$k].system_name).val());
								if(empty(txt_ref_val))
									{
									 
									field_id_val="0"
									 
									}
									else 
									{
										field_id_val=cell_val;
										field_id_val=empty(field_id_val)?0:field_id_val;
										
									}
							}
							else 
							{
							  field_id_val=cell_val;
							}
							if (save_second_level[$k].Type=='Auto Increment' && (trim(document.getElementById(system_name).value))!='')
							{
							$auto_increment_value+=save_second_level[$k].internal_code+"ele_value"+$("#"+system_name).val()+"~";
							}
							if(save_second_level[$k].Type=='Auto Increment')
							{
							auto_inc_details_arr[auto_inc_ctr]= new Object();
							 
							auto_inc_details_arr[auto_inc_ctr][system_name]=$("#auto_inc_"+int_code).val(); 
							auto_inc_ctr++;
							}
							 
							save_schema_details_arr[field_id]=encodeURIComponent(field_id_val);
						}
						
					}
			var fw_save_obj=new Object();			
			var image_data = image_obj;
			var attachment_data = attachments_obj;
			var auto_inc_jsn_text = JSON.stringify(auto_inc_details_arr);	 
			 
			var group_details_arr=this.GetGroupDetailsForSave(save_obj.g_multi_group,system_module_name);
		 
			  fw_save_obj.internal_code=save_obj['geditinternalcode'];
		 
			  fw_save_obj.ref_s_user_schema_code=save_obj['g_str_module_id'];
			  fw_save_obj.system_module_table_name=encodeURIComponent(system_module_table_name);
			  fw_save_obj.auto_increment_value=encodeURIComponent($auto_increment_value);
			fw_save_obj.save_schema_details_arr=save_schema_details_arr;
			  fw_save_obj.auto_inc_jsn_text=encodeURIComponent(auto_inc_jsn_text);
			  fw_save_obj.group_details_arr= ((group_details_arr));
			fw_save_obj.image_data=image_data;
			fw_save_obj.attachment_data=attachment_data;
			fw_save_obj.g_system_names_full_arr=all_obj[system_module_name]['g_system_names_full_arr'];
			 if(typeof(OverRideFraworkSaveObj)=="function")
			 {
				 fw_save_obj=OverRideFraworkSaveObj(fw_save_obj,system_module_table_name);
				 
			 }				 
			var save_flag=true;
			var s_module_pre_save=save_obj.s_module_pre_save
			 if(!empty(s_module_pre_save))
			 {
				 save_flag=eval(s_module_pre_save);
			 }
			// if(PreSaveModuleValidation())
			var msave=all_obj[system_module_name]['msave'];
			 
			if(save_flag==true && msave=='Yes')
			 {
				all_obj[system_module_name]['msave']='No';
				
				$("#footer_save_link").hide();
				App.blockUI({boxed:true,message:"Saving "});
				$.ajax
				({
					   type: "POST",
					   url: $host_url+"AddUserSchemaGeneralDetailsNew",
					   dataType: "json",
					   // contentType: "charset=utf-8",
					   error:AjaxErrorMessage,		       
					   //async: false,
					 //  data:$lstr_query_string+"&login_counter="+$("#login_counter").val()+"&login_ctr="+$("#login_counter").val(),
					   data:JSON.stringify(fw_save_obj),
					   success:  function saveUserSchemaGeneralDetailsResponce($responce)
								{
									$("#footer_save_link").show();
									 try
										{
											// App.unblockUI();
											all_obj[system_module_name]['msave']='Yes';
											// $responce = eval('(' + $responce + ')');
											if($responce.error_code=='-9')
											{
												
												ShowAlertMsg($responce.data);
												App.unblockUI();
												CallLogout();
											return false;
											}
											// var system_module_name=$responce.data.system_module_name;

											if ($responce.error_code == 2) 
											{
											   var err_mess = "<span style='color:red; font-weight: bold;font-size:150%;'>"+$responce.data+"</span>";
											   ShowAlertMsg(err_mess);
											   App.unblockUI();
											   return false;
											}
											if($responce.error_code == 0)
											{											 
												all_obj[system_module_name]['geditinternalcode']=$responce.data.last_id;
												 var flag=PostSaveModuleDetails($responce.data.last_id,system_module_table_name);
												 
												 ShowSuccessMsg($responce.data.msg);
												 if((flag || empty(flag)) && flag!=false)//some times user has to keep the saved record with out refreshing the page
												 {												 
													if(all_obj[system_module_name].load_type=='FW')
														getModulesDetailsNew(system_module_name,all_obj[system_module_name]['g_str_module_name'],all_obj[system_module_name]['g_str_module_id'],'Add',all_obj[system_module_name]['g_display_module_name'],0);
													else
													{
														var jt_db=getCookie("jt_db");
														var path="html_modules/modules/"+jt_db+"/module_"+all_obj[system_module_name]['g_str_module_id']+".html";	
														var popup_content_div_id="popup_content_"+all_obj[system_module_name]['g_str_module_id']
														$('#'+popup_content_div_id).load(path,function() 
														{
																CallGetModuleDetailsNew(system_module_name,'Add',all_obj[system_module_name]['g_str_module_name'],all_obj[system_module_name]['g_str_module_id'],0,'PopUp');
														});
													}
													App.unblockUI();
												 }
												else
												{
													javascript:all_obj.ClearfieldsNew(system_module_table_name);
													App.unblockUI();
												}													

											}

											if($responce.error_code == -1)
											{											
												ShowAlertMsg($responce.data.msg);
												App.unblockUI();
											}
										}	
										catch(err)
										{
											txt= err.message;											
											ShowAlertMsg(txt+"<br> in saveModuleDetails");
											App.unblockUI();
										} 
								}	
						   
				  });
			 }
		  } //try close
		catch(err)
		{
			txt= err.message;
			App.unblockUI();
			ShowAlertMsg(txt+"<br> in saveModuleDetails")
			// bootbox.alert(txt+"<br> in saveModuleDetails");
		}   
	},
	this.AssignRefModuleDefaultValues = function(system_module_table_name)
	{
				 
		 if(!empty(all_obj[system_module_table_name]['g_user_schema_details_array']['data']['ref_data_default_val']) && (all_obj[system_module_table_name]['g_is_module_for_new_or_edit']=="Add" || all_obj[system_module_table_name]['g_is_module_for_new_or_edit']=="Clear"))
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
	},
	this.GetPrevNextModuleDetails = function(system_module_name,type,internal_code)
	{
		if(internal_code==0 || empty(internal_code))
		{
			ShowAlertMsg("No "+type+" Record to view");
			return false;
		}
		else
		{
			all_obj[system_module_name]['geditinternalcode']=internal_code;
			all_obj.GetSchemaModuleDetailsForUpdateNew(system_module_name);
		}
	},
	
	this.GetSchemaModuleDetailsForUpdateNew=function (system_module_name)
	{/* 
		if(system_module_name=="order_form")
		{
			alert('e');
			return;
		} */
		var search_fields=JSON.stringify(grid_filter_obj[system_module_name]);
		
		var save_obj=all_obj[system_module_name];
		var full_arr=JSON.stringify(all_obj[system_module_name]['g_system_names_full_arr']);
		var display_module_name=save_obj['g_display_module_name'];
		var ur_edit_days=save_obj['ur_edit_days'];									
		// alert(ur_edit_days);
				// App.blockUI({boxed:true,message:"Getting "+display_module_name+" Data"});
				App.blockUI({
                target: '#m_'+system_module_name,
                boxed: true,
                message: "Getting "+display_module_name+" Data"
            });
				
				
			$.ajaxq("ajaxQueue",{
				type: "POST",
				 // async: false,
				url: $host_url+"GetSchemaModuleDetailsForUpdateNew",
				error:AjaxErrorMessage,
				data:"internal_code="+save_obj.geditinternalcode+"&table_name="+save_obj.g_system_module_table_name+"&schema_id="+save_obj.g_str_module_id+"&search_fields="+search_fields+"&full_arr="+full_arr+"&ur_edit_days="+ur_edit_days,
				success: function populateSchemaModuleDetalisForUpdate(responce)
						{
							try
								{
									App.unblockUI();
									   App.unblockUI('#m_'+system_module_name);
									 responce = eval('(' + responce + ')');
									
									if(responce.error_code=='-9')
									{
									ShowAlertMsg(responce.data);CallLogout();
									return false;
									}
									 else if(responce.error_code == -1)
									{
									ShowAlertMsg(responce.data.msg);
									}
									if(responce.error_code == 0)
									{
										all_obj.AssginDataAfterEdit(system_module_name,responce);
									}

									
								}	
								catch(err)
								{
									txt= err.message;
									App.unblockUI();
									ShowAlertMsg(txt+"<br> in GetSchemaModuleDetailsForUpdateNew");
								}
						}
						
				});
	}
	this.AssginDataAfterEdit=function(system_module_name,responce)
	{
			var save_obj=all_obj[system_module_name];
			var div_id="m_"+system_module_name;
			var previous_int_code=responce.data['previous_int_code'];
			var next_int_code=responce.data['next_int_code'];
			var is_edit_allowed=responce.data['is_edit_allowed'];											
			saved_ref_display_arr=responce.data['saved_ref_display_arr'];
			var details=responce.data['details'];
			$.each(save_obj.g_system_names_full_arr,function(k,v)
			{
				
				var system_name=k;
				var data_type=v['Type'];
				var is_ref_module_code_lov=v['is_ref_module_code_lov'];
				if(data_type=="Reference Data" && is_ref_module_code_lov=="0")
				{
						var txt_schema_id="txt_ref_schema_"+system_name;
					$("#"+div_id+" #txt_ref_schema_"+system_name).val(details[txt_schema_id]);
					$("#"+div_id+" #"+system_name).val(details[system_name]);
				}if(data_type=="Reference Data" && is_ref_module_code_lov=="1")
				{
					ref_val=details[system_name];
					if(empty(ref_val))
						ref_val=0;
					$("#"+div_id+" #"+system_name).val(ref_val);
				}
				else if(data_type=='Image')
				{
					var image_path = details[system_name];
					if(!empty(image_path))
					{
						var image_tag= "<img src='"+image_path+"'></img>";
						$("#"+system_name+" .fileinput-preview.fileinput-exists.thumbnail").html(image_tag);
						$("#"+system_name+" .fileinput").removeClass('fileinput-new');
						$("#"+system_name+" .fileinput").addClass('fileinput-exists');
						
					}
				}
				else if(data_type=='Attachment')
				{
					var attachment_path = details[system_name];
					if(!empty(attachment_path))
					{
						$("#"+div_id+" #"+system_name+"_attch_name").attr('href',attachment_path);
						var file_name = attachment_path.split('/').pop();
						$("#"+div_id+" #"+system_name+"_attch_name").html(file_name);
						$("#"+div_id+" #"+system_name+"_attch_del").show();
						
					}
				}
				else if(data_type=='Ref Display')
				{
					 $("#"+div_id+" #"+system_name).val(saved_ref_display_arr[system_name]);
				}
				
				else if(data_type=='Checkbox')
				{
					 if(details[system_name] == 1)
					   $("#"+div_id+" #"+system_name).attr('checked', true);
				     else
					    $("#"+div_id+" #"+system_name).attr('checked', false);	 
				}
				else if(data_type=='Month')
				{
					var value = getYearMonthUIValue(details[system_name]);
					$("#"+div_id+" #"+system_name).val(value);
				}
				
				else if(data_type=='Date')
				{
					if(details[system_name])
					{
					 
					date_temp=details[system_name].split('/');
					var temp=date_temp[0];
					date_temp[0]=date_temp[1];
					date_temp[1]=temp;
					var date_past = new Date(date_temp.join('/'));
					var date_future = new Date(date_temp.join('/'));
					date_past.setDate(date_past.getDate() - save_obj.ur_past_days); 
					date_future.setDate(+date_future.getDate() + +save_obj.ur_future_days); 
					if(date_future.getDate()<10){
						day_future="0"+date_future.getDate();
					}
					else {
						day_future=date_future.getDate();
					}
					if(date_past.getDate()<10){
						day_past="0"+date_past.getDate();
					}
					else {
						day_past=date_past.getDate();
					}
					if(date_future.getMonth()<9){
						month_future="0"+(+date_future.getMonth() + +1);
					}
					else {
						month_future=date_future.getMonth();
					}
					if(date_past.getMonth()<9){
						month_past="0"+(+date_past.getMonth() + +1);
					}
					else {
						month_past=(+date_past.getMonth() + +1);
					}
					year_future=date_future.getFullYear();
					year_past=date_past.getFullYear();
					
					if(getCookie("user_type")!='Admin')
						{
						   $("#"+div_id+" #"+system_name).attr("data-date-start-date",day_past+"-"+month_past+"-"+year_past);
					       $("#"+div_id+" #"+system_name).attr("data-date-end-date",day_future+"-"+month_future+"-"+year_future);
					       
						}
						
						$("#"+div_id+" #"+system_name).val(details[system_name]);
							  
					}
				}
				 
				else
				{
					$("#"+div_id+" #"+system_name).val(details[system_name]);
				}
			});
			
			if(is_edit_allowed == 0){
				all_obj[system_module_name]['is_edit_allowed_for_past_days'] = "0";
				var msg = "&nbsp;&nbsp;<p style='font-size:20px;color:red;font-weight:00';float:left>You don\'t have rights to edit this record</p>";
			}else{
				
				all_obj[system_module_name]['is_edit_allowed_for_past_days'] = "1";
				msg = "";
			}
			// $("#m_"+system_module_name+" #prev_button").remove();
			// $("#m_"+system_module_name+" #next_button").remove();
			// $("#m_"+system_module_name+" #save_clear_panel").find('div').remove();
			var next_pre_button="<span id='prev_button' style='float:left; margin-left:20px; margin-top: 10px; cursor:pointer;' title='Previous Record' onclick=\"javascript:all_obj.GetPrevNextModuleDetails('"+system_module_name+"','Previous',"+previous_int_code+");\" class=''> <i class='fa fa-arrow-circle-o-left' style='font-size: 31px; color:#0362FD; '></i></span>";
				next_pre_button+="<span id='next_button'style='float:left; margin-left:20px; margin-top: 10px;  cursor:pointer;' title='Next Record'  onclick=\"javascript:all_obj.GetPrevNextModuleDetails('"+system_module_name+"','Next',"+next_int_code+");\" class=''> <i class='fa fa fa-arrow-circle-o-right' style='font-size: 31px; color:#0362FD; '></i></span>"+msg;
			// $("#m_"+system_module_name+" #save_clear_panel").append(next_pre_button);
			 var grp_details=responce.data['grp_details'];
			 FWMultiGrid.AssignGroupDetailsAfterEdit(system_module_name,grp_details);
			 var s_module_after_edit=save_obj.s_module_after_edit
			 if(!empty(s_module_after_edit))
			 {
				  eval(s_module_after_edit);
					
					
			 }
			 var  tax_structure_exists=all_obj[system_module_name]['t_tax_structure_exists'];
			 if(tax_structure_exists=="Yes")
				{
					Tax.ReAssignAllTaxStructureDataAfterEditRecord(system_module_name);
				}
				
			//Previously I was hiding the save buttons
			/* if(is_edit_allowed == 0)
			{
				$("#header_finish_row").hide();
				$("#footer_save_link").hide();
			} */			   
		 
	},	
	this.GetGroupDetailsForSave = function(g_multi_group,system_module_name)
	{
		if(empty(g_multi_group))
			return;
		var group_save_obj= new Object;
		var div_id="m_"+system_module_name;
		$.each(g_multi_group, function (k,v) {
			var group_name=v.table_name;
			var is_child_exists=v.is_child_exists;
			var group_id=v.group_id;
			var is_grid_edit_inline=v.is_grid_edit_inline;
			var is_grid_edit=v.is_grid_edit;
			var parent_group=v.parent_group;
			if(parent_group>0) return;
			var child_group_arr=v.child_group_arr;
			var elements=v.elements;
			var grp_system_name_full_arr=v.grp_system_name_full_arr;
			var table_id="#"+div_id+" #"+group_name+" tbody tr";
			group_save_obj[group_name]=new Object;
			if(is_grid_edit=="1" && is_grid_edit_inline=="1")
			{
			var jqgrid_data=$('#table_group_grid_'+group_id).jqGrid('getGridParam','data');
			// group_save_obj[group_name]=jqgrid_data; return;
			var element_keys=Object.keys(grp_system_name_full_arr);
			// console.log(element_keys);
				var grid_obj=new Object();
				k=0;
				 $.each($(jqgrid_data), function (gk,gv) {
					 grid_obj[k]=new Object();
					 for(m=0;m<element_keys.length;m++)
					 {
						if(empty(gv[element_keys[m]]))
						    grid_obj[k][element_keys[m]] = gv[element_keys[m]];
						else 
							grid_obj[k][element_keys[m]] = encodeURIComponent(gv[element_keys[m]]);
					 }
					 k++;
				 });
				 // console.log(grid_obj);
			group_save_obj[group_name]=grid_obj; return;
			
			}
			var i=0;
			//####HANDLE TAX
				 var t_tax_structure_doc_table = all_obj[system_module_name].t_tax_structure_doc_table;
				 var t_tax_structure_exists = all_obj[system_module_name].t_tax_structure_exists;
				 var t_tax_structure_item_tax_table = all_obj[system_module_name].t_tax_structure_item_tax_table;
					var tax_structure_type = all_obj[system_module_name].g_multi_group[group_name].tax_structure_type;
					var is_item_tax_data_exists = all_obj[system_module_name].g_multi_group[group_name].grp_system_name_full_arr.hasOwnProperty('item_tax_data');
					if(t_tax_structure_exists=='Yes' && t_tax_structure_doc_table==group_name)// for doc tax structure we are taking values differently
					{
						var tax_obj=Tax.GetDocTaxStructureDataForSave(system_module_name);
						group_save_obj[group_name]=tax_obj;
						return;
					}	
						
			$.each($(table_id), function (rk,rv) {
			
				
				var tr_id=rv['id'];
				var tr_row_data=$(this);
				var row_type = $(this).find("#actions #row_cancel").attr('data-row-type');
				// input_field_length=$(table_id+"#"+tr_id+" input:visible, "+table_id+"#"+tr_id+" select:visible").length;
				 
				if(row_type!='New' && row_type!='Edit' && parent_group==0)
				{
				
					group_save_obj[group_name][i]=new Object;
					$.each(elements, function (ek,ev) {
						
						var meta_data=ev['meta_data'];
						if(meta_data=="User") return;
						var data_type=ev['Type'];
						var db_field=ev['db_field'];
						var is_ref_module_code_lov=ev['is_ref_module_code_lov'];
						
						 
						if((data_type=='Reference Data'))
						{
							//group_save_obj[group_name][i][db_field]=$(table_id+"#"+tr_id+" #"+db_field+"_"+tr_id).val();
								 group_save_obj[group_name][i][db_field]=tr_row_data.find("#"+db_field+"_"+tr_id).val();
								 
						}
						/* else if(data_type=='Date')
						{
							group_save_obj[group_name][i][db_field]=date_format($(table_id+"#"+tr_id+"  #"+db_field+"_"+tr_id+" p").html());
						} */
						else if(data_type=='Image')
						{
							var img_obj= new Object();
							var image_data = $(table_id+"#"+tr_id+" #"+db_field+"_"+tr_id+" p img").attr('src');
							var image_type = $(table_id+"#"+tr_id+" #"+db_field+"_"+tr_id+" p img").attr('data-image-type');
							var image_name = $(table_id+"#"+tr_id+" #"+db_field+"_"+tr_id+" p img").attr('data-image-name');
						
							img_obj['image_data']=encodeURIComponent(image_data);
							img_obj['image_type']=encodeURIComponent(image_type);
							img_obj['image_name']=encodeURIComponent(image_name);
							group_save_obj[group_name][i][db_field]=img_obj;
						}
						else if(data_type=='Attachment')
						{
							var att_obj= new Object();
							var att_data = $(table_id+"#"+tr_id+" #"+db_field+"_"+tr_id+" p").attr('data-file-src');
							var data_att_state = $(table_id+"#"+tr_id+" #"+db_field+"_"+tr_id+" p").attr('data-att-state');
							var file_name = $(table_id+"#"+tr_id+" #"+db_field+"_"+tr_id+" p").attr('data-file-name');
						
							att_obj['image_data']=encodeURIComponent(att_data);
							att_obj['image_type']=encodeURIComponent(data_att_state);
							att_obj['image_name']=encodeURIComponent(file_name);
							group_save_obj[group_name][i][db_field]=att_obj;
						}
						else if(data_type=='Checkbox')
						{
							var check_val=0;
							//var checkbox_val=$(table_id+"#"+tr_id+" #"+db_field+"_"+tr_id+" p :input[type='checkbox']").is(':checked');
							var checkbox_val= tr_row_data.find("#"+db_field+"_"+tr_id+" p :input[type='checkbox']").is(':checked');
							// alert(checkbox_val);
							if(checkbox_val)
								check_val=1;
							group_save_obj[group_name][i][db_field]=check_val;
						}
						else
						{
							group_save_obj[group_name][i][db_field]=encodeURIComponent(tr_row_data.find("#"+db_field+"_"+tr_id+" p").html());
							// group_save_obj[group_name][i][db_field]=encodeURIComponent($(table_id+"#"+tr_id+" #"+db_field+"_"+tr_id+" p").html());
						}
							
						});
						
						  	group_save_obj[group_name][i]['group_int_code']= tr_row_data.find("#group_int_code_"+tr_id).val()
						  	group_save_obj[group_name][i]['row_sequence']= tr_row_data.find("#seq_"+tr_id+" p").html();
						if(is_child_exists=="1")
						{
							
								var t_obj= decodeURIComponent(tr_row_data.find("#third_level_obj_"+tr_id).html());;
								if(!empty(t_obj) && t_obj!='undefined')
								{
									t_obj= JSON.parse(t_obj);
								}
								
								
								
								if(t_tax_structure_exists=='Yes' && tax_structure_type=='Item' && is_item_tax_data_exists==true)
								{
									var item_tax_obj = new Object();
									item_tax_obj[t_tax_structure_item_tax_table]=JSON.parse(decodeURIComponent($(table_id+"#"+tr_id+" #item_tax_data_"+tr_id+" p").html()))
									if(!empty(t_obj))
									{
										if(!empty(item_tax_obj))
										{
										var third_level_obj=t_obj;// merging 3rd level Group with item Comercial Group
										var t_obj=new Object();
										$.extend( t_obj, third_level_obj, item_tax_obj);
										}
									}
									else// if only one group in third level exists
									{
										t_obj=item_tax_obj;
									}
								}
					
					
									group_save_obj[group_name][i]['child_groups']=t_obj;
								 
						}
						
						
					 
					
					i++;
					 
				}
				
			})
		});
		console.log(group_save_obj);
		return group_save_obj;
	}
	
	 
	  //closing of save Module validation	
}//closing of mail class
var Module = function ()
{
	 
	this.geditinternalcode='0';
 
	this.g_system_module_table_name='';
 
	this.g_user_schema_details_array='';
	this.g_is_module_for_new_or_edit='';
	this.html_id_arr='';
 
	this.g_system_names_full_arr=new Object();
	this.html_id_criteria_arr='';
	this.all_multi_groups='';
	this.all_non_multi_groups='';
	this.g_display_module_name="";
	this.system_menu_name="";
	this.g_str_module_name="";
	this.load_type="";
	this.g_str_module_id="";
	this.g_module_parent_menu="";
	this.g_multi_group="";
	this.s_module_onload="";
	this.s_module_pre_save="";
	this.s_module_after_edit="";
	
	 
	this.t_item_tax_data="";//to store Item Level Object On change of tax structure
	this.t_tax_structure_exists="";// to check wheather this module has tax structure exists on not
	this.t_tax_structure_item_table="";// po_items_group_table_name
	this.t_tax_structure_item_tax_table="";// po_items_tax_structure_group_table_name
	this.t_tax_structure_doc_table="";// po_doc_tax_group_table_name
	this.upload_type="";// po_doc_tax_group_table_name
	this.default_view="";// po_doc_tax_group_table_name
	this.add_right="0";// po_doc_tax_group_table_name
	this.del_right="0";// po_doc_tax_group_table_name
	this.grid_is_view_click="0";// po_doc_tax_group_table_name
	this.view_right="0";// po_doc_tax_group_table_name
	this.edit_right="0";// po_doc_tax_group_table_name
	this.ur_past_days="0";// po_doc_tax_group_table_name
	this.ur_future_days="0";// po_doc_tax_group_table_name
	this.ur_edit_days="0";// po_doc_tax_group_table_name
	this.is_edit_allowed_for_past_days="1";// this is for restricting the user to edit the record after crossing his edit days limit
	this.AssignDisplayModuleName=function()
	{
 
		 var bc_id='fw_bc';
		if(this.load_type=='PopUp')
			bc_id="popup_module_dialog_"+this.g_str_module_id+" #popup_bc";
			// console.log(bc_id);
		var modulepath="";
		 modulepath+=this.system_menu_name;
		//$modulepath=$g_main_menu;
		if( this.g_module_parent_menu !="none")
		{
		//$modulepath+=$g_module_parent_menu;
		$('#'+bc_id+' #span_main_menu').html( this.g_module_parent_menu);
		$("#"+bc_id+" #span_main_menu").parent().show();
		}
		else
		{
		$("#"+bc_id+"#span_main_menu").parent().hide();
		}
		
		if(this.load_type=='FW')
		{
			if(this.geditinternalcode==0) 
			$('#page-title').html(this.g_display_module_name+" <small style='color: #1A847B; font-weight:400;'>Adding New "+this.g_display_module_name+"</small>");
			else
			$('#page-title').html(this.g_display_module_name+" <small style='color: #1A847B; font-weight:400;'>Modifing  Details of "+this.g_display_module_name+" </small>");
		}
		$("#"+bc_id+" #span_parent_menu").html(modulepath);

		$("#"+bc_id+" #display_module_name").html(this.g_display_module_name);
		$("#"+bc_id+" #display_module_name").attr("onclick","javascript:all_obj.ClearfieldsNew('"+this.g_system_module_table_name+"');")
		$("#m_"+this.g_system_module_table_name+" #module_menu_action").show();
		 
		$("#"+bc_id+" #span_parent_menu_right").show();
	},
    this.InitModule=function()
	  {
		  ResetTimer();
		   this.g_module_parent_menu =this.g_user_schema_details_array.data[1][0].module_parent_menu;
			var links_data =this.g_user_schema_details_array.data.links_data.header_link;
			var footer_link =this.g_user_schema_details_array.data.links_data.footer_link;
		  document.getElementById('module_name_for_save').value='saveModuleDetails';
		  if(this.g_is_module_for_new_or_edit=="Add" || this.g_is_module_for_new_or_edit=="Clear")
			{
			this.geditinternalcode=0;
			 
			}
			var html_save="";
			
		
				
			 if(this.load_type=="FW")
			 {
				 $("#m_"+this.g_system_module_table_name+" #module_menu_links").html(links_data);
				 $("#m_"+this.g_system_module_table_name+" #save_clear_panel").html(footer_link);
				// $("#page_main_tab_div").parent().after(footer_link);
			 }
			 else
			 {
				var popup_actions="#popup_module_dialog_"+this.g_str_module_id+" #module_menu_links";
				 $(popup_actions).html(links_data);
				 $("#popup_module_dialog_"+this.g_str_module_id+" #save_clear_panel").html(footer_link);
				 $("#m_"+this.g_system_module_table_name+" #page_main_tab_div").parent().css('margin-top','0');
				 $("#popup_module_dialog_"+this.g_str_module_id).scrollTop(0);
			 }
			if(this.g_user_schema_details_array.data.is_ref_module_code_lov_flag=='1')
			{									 
				AssignRefModuleLovValues(this.g_str_module_id,this.g_system_module_table_name,this.geditinternalcode);
			}
			all_obj.AssignRefModuleDefaultValues(this.g_system_module_table_name);
				 var js_path=this.g_user_schema_details_array.data[1][0].js_path;
				 this.s_module_onload=this.g_user_schema_details_array.data[1][0].s_module_onload;
				this.s_module_pre_save=this.g_user_schema_details_array.data[1][0].s_module_pre_save;
				 this.s_module_after_edit=this.g_user_schema_details_array.data[1][0].s_module_after_edit;
							 if(!empty(js_path))
							 {
								includeCustomJs(js_path);							 
							 }		
	 							 
			var active_field_arr=this.g_user_schema_details_array.data['active_field_arr'];					 
			for($a=0;$a<this.g_user_schema_details_array.data[1].length;$a++)
			{
				
				$obj=this.g_user_schema_details_array.data[1];
				var  data_type=$obj[$a]['Type'];
				this.g_system_names_full_arr[$obj[$a]['system_name']]=new Object();
				this.g_system_names_full_arr[$obj[$a]['system_name']]['Type']=$obj[$a]['Type'];
				this.g_system_names_full_arr[$obj[$a]['system_name']]['element_name']=$obj[$a]['element_name'];
				this.g_system_names_full_arr[$obj[$a]['system_name']]['number_range_from']=$obj[$a]['number_range_from'];
				this.g_system_names_full_arr[$obj[$a]['system_name']]['number_range_to']=$obj[$a]['number_range_to'];
				this.g_system_names_full_arr[$obj[$a]['system_name']]['optional']=$obj[$a]['optional'];
				this.g_system_names_full_arr[$obj[$a]['system_name']]['is_ref_module_code_lov']=$obj[$a]['is_ref_module_code_lov'];
				this.g_system_names_full_arr[$obj[$a]['system_name']]['on_exit']=$obj[$a]['on_exit'];
				var is_ref_module_code_lov=$obj[$a]['is_ref_module_code_lov'];
				this.g_system_names_full_arr[$obj[$a]['system_name']]['ref_module_code']=$obj[$a]['ref_module_code'];
				/* var data_type=(this.g_system_names_full_arr[$obj[$a]['system_name']['Type']]);
			 
				// var data_type=(this.html_id_data_type_arr[$obj[$a]['system_name']]); */
				var system_name=$obj[$a]['system_name'];
					if(data_type=="Number")
					{
						/* $("#"+system_name).live('focus', function () {
						$(this).select();  
						});$("#"+system_name).live('mouseup', function () {
						$(this).select();  
						}); */
					}	
					if(data_type=="Date")
					{
					var date_default_val_obj=(this.g_user_schema_details_array.data['date_fields_default_values']);
						$("#m_"+this.g_system_module_table_name+" #"+system_name).mask({mask: "##/##/####"}) ; 
						$("#m_"+this.g_system_module_table_name+" #"+system_name).val(date_default_val_obj[system_name]);
					}
					else if(data_type=="DateTime")
					{
						var date_default_val_obj=(this.g_user_schema_details_array.data['date_fields_default_values']);
						$("#m_"+this.g_system_module_table_name+" #"+system_name).mask({mask: "##/##/#### ##:##:##"}) ;  
						$("#m_"+this.g_system_module_table_name+" #"+system_name).val(date_default_val_obj[system_name]);
					}
										
					if(data_type=="Multi Search")
					{
						POPUP.AssignJqueryMultiSelectAutoComplete($obj[$a]['ref_module_table_name'],this.g_system_module_table_name,$obj[$a]['system_name']);
					}
					else if(data_type=="Reference Data" && is_ref_module_code_lov==0)
					{
						var ref_data_obj=new Object();
						ref_data_obj['ref_module_code_ref_field']=$obj[$a]['ref_module_code_ref_field'];
						var pop_up_ref_obj=new Object();
						if(ref_data_obj['ref_module_code_ref_field']>0)
						{
							pop_up_ref_obj['ref_module_code_ref_field_db_field']=$obj[$a]['ref_module_code_ref_field_db_field'];
							pop_up_ref_obj['ref_module_code_ref_field_on']=$obj[$a]['ref_module_code_ref_field_on'];
							pop_up_ref_obj['ref_module_code_ref_field_const']=$obj[$a]['ref_module_code_ref_field_const'];
							this.g_system_names_full_arr[$obj[$a]['system_name']]['pop_up_ref_obj']=pop_up_ref_obj;
						}
						ref_data_obj['ref_module_code_ref_field_db_field']=$obj[$a]['ref_module_code_ref_field_db_field'];
						ref_data_obj['ref_module_code_ref_field_on']=$obj[$a]['ref_module_code_ref_field_on'];
						ref_data_obj['ref_module_code_ref_field_const']=$obj[$a]['ref_module_code_ref_field_const'];
						if(!empty(active_field_arr))
								ref_data_obj['ref_mofule_code_active_field']=active_field_arr[ref_data_obj,$obj[$a]['ref_module_code']];
						POPUP.AssignJqueryAutoCompleteNew($obj[$a]['ref_module_table_name'],this.g_system_module_table_name,$obj[$a]['system_name'],ref_data_obj,$obj[$a]['ref_module_code']);
					}
					else if(data_type=="Auto Fill")
					{
						 
						POPUP.AssignJqueryAutoFill( this.g_system_module_table_name,this.g_system_module_table_name,$obj[$a]['system_name'] );
					}
				if($obj[$a]['linked_field']=='0' && $obj[$a]['source_field']>0 && this.g_user_schema_details_array.data.is_auto_increment_update_flag=='1')
				{
			 
				// getDocRootPrefix($module_id,$obj[$a]['internal_code'],$obj[$a]['source_field_system_name']);
				}									
			}
 	  		  

			FWMultiGrid.FormFWMultiGroupGrid(this.g_system_module_table_name);
		
			this.InitMultiGroupModule();			
			// OnloadModule();
			eval(this.s_module_onload);
			
				this.AssignDisplayModuleName();
			// App.init();
			// CallTarkaDatePickerNew();		 
			CallTarkaDateTimePicker();	

		if(this.g_is_module_for_new_or_edit=="Edit")
		  {
		  all_obj.GetSchemaModuleDetailsForUpdateNew(this.g_system_module_table_name);
		  }			
	  },//close of init 
	  this.InitMultiGroupModule=function()
	  {
		  var multi_group_arr=this.g_user_schema_details_array.data['multi_group'];
								if(!empty(multi_group_arr))
								{
									jQuery.each(multi_group_arr, function(k, v)  
									{ 
										var ele_obj=v['elements'];
										var is_grid_edit_inline=v['is_grid_edit_inline'];
										var group_id=v['group_id'];
										
											if(!empty(ele_obj))
											{
												jQuery.each(ele_obj, function(kk, vv)  
												{
													var data_type=(vv['Type']);
													var system_name=(vv['system_name']);
													var ref_module_code=(vv['ref_module_code']);
													if(data_type=="Number")
													{
													
														/* $("#"+system_name).live('focus', function () {
														$(this).select();  
														});
														 $("#"+system_name).live('mouseup', function () {
														$(this).select();  
														}); */
													}
													var is_ref_module_code_lov=(vv['is_ref_module_code_lov']);
													if(data_type=="Multi Search")
													{
														AssignJqueryMultiSelectAutoComplete(system_name,ref_module_code);
													}
													else if(data_type=="Reference Data" && is_ref_module_code_lov==0)
													{
														var ref_data_obj=new Object();
														ref_data_obj['ref_module_code_ref_field']="";
														ref_data_obj['ref_module_code_ref_field_db_field']="";
														ref_data_obj['ref_module_code_ref_field_on']="";
														ref_data_obj['ref_module_code_ref_field_const']="";
														//AssignJqueryAutoComplete(system_name,ref_module_code,ref_data_obj);
													}
												});
											}	
									});
								}
							
	  }//close of InitMultiGroupModule
};
//getModulesDetailsNew('Brand Master',42,'Add','Brand Master','New')
all_obj=new AllModules();
function getModulesDetailsNew(system_module_name,module_name,module_id,is_module_for_new_or_edit,display_module_name,geditinternalcode,callback_func)
 { 	
			App.unblockUI();
			
			if($("#m_"+system_module_name).length > 0)
			{
				div_id = "section-bar-"+module_id;
				jt_db =getCookie("jt_db");
				$path="html_modules/modules/"+jt_db+"/module_"+module_id+".html";	
				$('#'+div_id).load($path,function() 
				{							
					IncludeFrameWorkSupportFiles(); 
					CallGetModuleDetailsNew(system_module_name,is_module_for_new_or_edit,module_name,module_id,geditinternalcode,'FW',callback_func);
				});	
				$("#li_"+module_id).trigger("click");
				return;
			}
			tabs_cnt = $('#menu_tabs li:visible').length;
		 
			if(tabs_cnt < 6)
			{
				$("#menu_tabs li").removeClass("tab-current");
				var tabs="";
				var section_bar="";
							
				tabs="<li id='li_"+module_id+"'><a href='#section-bar-"+module_id+"' class='fa fa-dashboard'> &nbsp;<span></span></a></li>";			
				section_bar+="<section id='section-bar-"+module_id+"' style='padding: 0px 5px 5px;'></section>";

				
				$("#menu_tabs").append(tabs);
				$("#section_bars").append(section_bar);	
				
				 (function() {
					[].slice.call(document.querySelectorAll('.sttabs')).forEach(function(el) {
						new CBPFWTabs(el);
					});
				})(); 	
				var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));
				$('.js-switch').each(function() {
					new Switchery($(this)[0], $(this).data());
				});	
				$("section[id^='section-bar-']").removeClass("content-current");
				$("#li_"+module_id).trigger("click") ;
				
				setTimeout(function(){
				
				// $('li').siblings('#li_'+module_id).show();
				// $('li').siblings('#li_'+module_id).click();
				div_id = "section-bar-"+module_id;
				var jt_db=getCookie("jt_db");
				 
				$path="html_modules/modules/"+jt_db+"/module_"+module_id+".html";	
				$("#li_"+module_id).html("<a href='#section-bar-"+module_id+"' class='fa fa-dashboard' style='border-radius:5px'> &nbsp;<span>"+display_module_name+"</span></a><div><button type='button' class='clsbtn' onclick='javascript:all_obj.close(&quot;"+system_module_name+"&quot;,&quot;"+module_id+"&quot;);'>&times;</button></div>");
				$('#m_'+system_module_name).remove();
				$('.contents').show();
				$('#'+div_id).show();
				$('#page_main_home_div').hide();
				$('#main_body').show(); 
				$('#'+div_id).load($path,function() 
				{							
					IncludeFrameWorkSupportFiles(); 
					HandleSectionBarMinheight();
					CallGetModuleDetailsNew(system_module_name,is_module_for_new_or_edit,module_name,module_id,geditinternalcode,'FW',callback_func);
				});	
				// $('#section-bar-'+tabs_cnt).show();
				},500);
			}
			else
			{
				ShowAlertMsg("You have opened maximum menus")
				// alert("You have opened maximum menus");
			}

	// }
	
 }
 function getMaxIndex()
 {
	 var index_highest = 0;   
	// more effective to have a class for the div you want to search and 
	// pass that to your selector
	$("div").each(function() {
		// always use a radix when using parseInt
		var index_current = parseInt($(this).css("zIndex"), 10);
		if(index_current > index_highest) {
			index_highest = index_current;
		}
	});
	return index_highest;
 }
 function AssignPopupModuleDetails(system_module_name,module_name,display_module_name,module_id,root_module)
 {
	$g_add_in_popup_base_module = root_module;
	$g_add_in_popup_root_module = module_name;
	$g_add_in_popup_base_system_module_name = system_module_name;
	getModulesDetailsNewForPopup(system_module_name,module_name,display_module_name,module_id);
 }
 function getModulesDetailsNewForPopup(system_module_name,module_name,display_module_name,module_id,callback_func)
 { 
	 
	var dialog_color_arr = new Array("#00A0B1", "#643EBF", "#BF1E4B", "#FF981D", "#00A600", "#FF0097");  
	var jt_db=getCookie("jt_db");
	var path="html_modules/modules/"+jt_db+"/module_"+module_id+".html";
 	 
	 var div_id="popup_module_dialog_"+module_id;	
	 var popup_content_div_id="popup_content_"+module_id;
	var dialog_state = $("#"+div_id).dialogExtend("state");
	var is_dialog_open = $("#"+div_id).dialog('isOpen');
	var dialog_count = $(".ui-dialog[aria-describedby*='popup_module_dialog_']:visible").length;
	
	if(is_dialog_open  &&  dialog_state == 'minimized' )
	{
		$("#"+div_id).dialogExtend("restore");
	}
	else if(is_dialog_open  && (dialog_state == 'maximized' || dialog_state == 'normal') )
	{
		$("#"+div_id).dialog("open");
	}
	else
	{
		if(dialog_count==6)
		{
			ShowAlertMsg("Maximum Popup Windows Opened, Please Close Any One To Open New.");
			return false;
		}
		{
			$('#'+div_id).dialog("close")
			$('#'+div_id).remove();
		 
			// var dialog_bred_crum="<div  style='margin-left: 0px;'>";
				// dialog_bred_crum+="<div class='col-md-12 page-content' style='padding:0; min-height:0;' id='popup_bc'>";
				// dialog_bred_crum+="</div>";
				// dialog_bred_crum+="</div>";
				  
			  $("#section_bars").append("<div id='"+div_id+"' title='' style='padding-left:0;'><div id='popup_breadcrumb' class='col-md-12' style='padding-left:0px;padding-right:0px'></div><div id='"+popup_content_div_id+"'></div> </div>");
			
				var dialog_height = screen.height-150;
					IncludeFrameWorkSupportFiles(); 
				  $('#'+div_id).dialog({"title" : display_module_name,
				"width" : "98%",
				"height" : dialog_height, position: [0,0],
				resizable:true,
				draggable:false ,
				"close" : function(evt,ui) 
				   { 
				   $('#'+div_id).remove();
				   },

				}).dialogExtend({
				"closable" : true,
				"maximizable" : false,
				"collapsable" : false,
				"minimizable" :true,
				"minimizeLocation" :"left",
				"dblclick" : "collapse",
				"titlebar" : false,
				"maximize" : function(evt,ui) 
				   {$(this).parent().css("top","50px"); },
				 

				icons:{"close":"ui-icon-close"}
				});
				
				$('#'+popup_content_div_id).load(path,function() 
				{				 
						CallGetModuleDetailsNew(system_module_name,'Add',module_name,module_id,0,'PopUp',callback_func);
				});
				
				$(".ui-dialog-titlebar-close").css("cursor" ,"pointer").css("padding" ,"0").css("height" ,"18px");
				$("#"+div_id).siblings('.ui-widget-header').css("background",dialog_color_arr[dialog_count]).css("border" ,"none");
				$(".ui-widget-header .ui-dialog-title").css("color","#ffffff");
				$(".ui-dialog").css("z-index","10000").css('box-shadow','1px 1px 5px 0px rgba(0,0,0,0.75)').css("left","1%");
				$(".ui-dialog-titlebar").css('padding','1px 10px');
				index_highest=getMaxIndex();
		}
	}
 }
 // to open Direclty from Other Module in Popup, same as above except Passing in Edit Mode
 function getModulesDetailsNewForPopupForEdit(system_module_name,module_name,display_module_name,module_id,geditinternalcode,callback_func)
 { 
	var dialog_color_arr = new Array("#00A0B1", "#643EBF", "#BF1E4B", "#FF981D", "#00A600", "#FF0097");  
	var jt_db=getCookie("jt_db");
	var path="html_modules/modules/"+jt_db+"/module_"+module_id+".html";
 	
	 var div_id="popup_module_dialog_"+module_id;	
	 var popup_content_div_id="popup_content_"+module_id;
	var dialog_state = $("#"+div_id).dialogExtend("state");
	var is_dialog_open = $("#"+div_id).dialog('isOpen');
	var dialog_count = $(".ui-dialog[aria-describedby*='popup_module_dialog_']:visible").length;
	
	if(is_dialog_open  &&  dialog_state == 'minimized' )
	{
		$("#"+div_id).dialogExtend("restore");
	}
	else if(is_dialog_open  && (dialog_state == 'maximized' || dialog_state == 'normal') )
	{
		$("#"+div_id).dialog("open");
	}
	else
	{
		if(dialog_count==6)
		{
			alert("Maximum Popup Windows Opened, Please Close Any One To Open New.");
			return false;
		}
		{
			$('#'+div_id).dialog("close")
			$('#'+div_id).remove();
		 
			var dialog_bred_crum="<div  style='margin-left: 0px;'>";
				dialog_bred_crum+="<div class='col-md-12 page-content' style='padding:0; min-height:0;' id='popup_bc'>";
				dialog_bred_crum+="<ul class='page-breadcrumb breadcrumb' style='margin-bottom: 0;'>";
				// dialog_bred_crum+="				<li class='btn-group' id='module_menu_action' style='right:0;'>";
				// dialog_bred_crum+="					<button type='button' class='btn blue dropdown-toggle' data-toggle='dropdown' data-hover='dropdown' data-delay='1000' data-close-others='true'>";
				// dialog_bred_crum+="					<span>";
				// dialog_bred_crum+="						Actions";
				// dialog_bred_crum+="					</span>";
				// dialog_bred_crum+="					<i class='fa fa-angle-down'></i>";
				// dialog_bred_crum+="					</button>";
				// dialog_bred_crum+="					<ul class='dropdown-menu pull-right' id='module_menu_links' role='menu'></ul>";
				// dialog_bred_crum+="			</li>";
				dialog_bred_crum+="				<li>";
				dialog_bred_crum+="				<i class='fa fa-home'></i>";
				dialog_bred_crum+="				<a href='#' onclick='home('home_dashboard');'>";
				dialog_bred_crum+="					Home";
				dialog_bred_crum+="				</a>";
				dialog_bred_crum+="				<i class='fa fa-angle-right'></i>";
				dialog_bred_crum+="			</li>";
				dialog_bred_crum+="			<li>";
				dialog_bred_crum+="				<a href='#' id='span_parent_menu'> Dashboard</a>";
				dialog_bred_crum+="				<i class='fa fa-angle-right' id='span_parent_menu_right'></i>";
				dialog_bred_crum+="			</li>";
				dialog_bred_crum+="			<li style='display:none;'>";
				dialog_bred_crum+="				<a href='#' id='span_main_menu'></a>";
				dialog_bred_crum+="				<i class='fa fa-angle-right'></i>";
				dialog_bred_crum+="			</li>	";
				dialog_bred_crum+="			<li>";
				dialog_bred_crum+="				<a href='#' id='display_module_name' onclick='javascript:Clearfields();'></a>	";					
				dialog_bred_crum+="			</li>";
				dialog_bred_crum+="			</ul>";
				dialog_bred_crum+="</div>";
				dialog_bred_crum+="</div>";
				  
			  $("#page-content").append("<div id='"+div_id+"' title='' style='padding-left:0;'><div id='popup_breadcrumb'  class='col-md-12'>"+dialog_bred_crum+"</div><div id='"+popup_content_div_id+"'></div> </div>");
			
				var dialog_height = screen.height-150;
					IncludeFrameWorkSupportFiles(); 
				  $('#'+div_id).dialog({"title" : display_module_name,
				"width" : "100%",
				"height" : dialog_height, position: [0,0],
				resizable:true,
				draggable:true 

				}).dialogExtend({
				"closable" : true,
				"maximizable" : true,
				"collapsable" : false,
				"minimizable" :true,
				"minimizeLocation" :"left",
				"dblclick" : "collapse",
				"titlebar" : false,
				"maximize" : function(evt,ui) 
				   {$(this).parent().css("top","50px"); },
				"close" : function(evt,ui) 
				   {alert("asd");},

				icons:{"close":"ui-icon-close"}
				});
				
				
				
				$('#'+popup_content_div_id).load(path,function() 
				{
					 
						CallGetModuleDetailsNew(system_module_name,'Edit',module_name,module_id,geditinternalcode,'PopUp',callback_func);
				});
				
				$(".ui-dialog-titlebar-close").css("cursor" ,"pointer").css("padding" ,"0").css("height" ,"18px");
				$("#"+div_id).siblings('.ui-widget-header').css("background",dialog_color_arr[dialog_count]).css("border" ,"none");
				$(".ui-widget-header .ui-dialog-title").css("color","#ffffff");
				$(".ui-dialog").css("z-index","10000").css('box-shadow','1px 1px 5px 0px rgba(0,0,0,0.75)');
				$(".ui-dialog-titlebar").css('padding','1px 10px');
					index_highest=getMaxIndex();
			 
				 $("#popup_module_dialog_"+module_id).parent().css( "zIndex", index_highest+1 );
		}
	}
 }	
 
 function CallGetModuleDetailsNew(system_module_name,is_module_for_new_or_edit,module_name,module_id,geditinternalcode,load_type,callback)
 {
	HandleSectionBarMinheight();

	 $.ajaxq ("ajaxQueue",{
			 type: "POST",
			   // async:false,
			   error:AjaxErrorMessage,
				url: $host_url+"getGeneralUserSchemaDetails.demo",      
				//ADDED TO ACCOMPLISH THE USER RIGHTS ON NOV-7-2008 is_module_for_new_or_edit
				// data:"is_module_for_new_or_edit="+is_module_for_new_or_edit+"&system_module_table_name="+system_module_name+"&schema_name="+encodeURIComponent(module_name.replace(/~/g, " "))+"&is_multiple=0&login_cnt="+document.getElementById('login_counter').value,
				data:"is_module_for_new_or_edit="+is_module_for_new_or_edit+"&system_module_table_name="+system_module_name+"&schema_name="+encodeURIComponent(module_name.replace(/~/g, " "))+"&is_multiple=0&login_cnt=1",
			   success: function GeneralUserSchemaDetailsResponse($responce)
						{
							try  
							{
								// App.unblockUI();
								// App.unblockUI('#m_'+system_module_name);

								$responce = eval('(' + $responce + ')');  
								if($responce.error_code=='-9')
								{
									ShowAlertMsg($responce.data);CallLogout();
									return false;
								}
								var m_obj = new Module();
								 
								 m_obj.geditinternalcode=geditinternalcode;
							 
								m_obj.g_is_module_for_new_or_edit=is_module_for_new_or_edit;
							
								m_obj.load_type=load_type;
								m_obj.module_icon=$responce.data['module_icon'];
								if(!empty(m_obj.module_icon))
								{
									$("#li_"+module_id).children("a").removeClass();
									$("#li_"+module_id).children("a").addClass(m_obj.module_icon);
								}
								m_obj.g_str_module_name=module_name;
								m_obj.g_str_module_id=module_id;
								m_obj.g_display_module_name=$responce.data['display_module_name'];
								m_obj.g_user_schema_details_array=$responce;
								m_obj.html_id_arr=$responce.data['html_id_arr'];
								m_obj.g_system_module_table_name=$responce.data[1][0].system_module_table_name;
								m_obj.html_id_criteria_arr=$responce.data['html_id_criteria_arr'];
								// m_obj.html_id_data_type_arr=$responce.data['html_id_data_type_arr'];
								m_obj.all_multi_groups=$responce.data['all_multi_groups'];
								m_obj.all_non_multi_groups=$responce.data['all_non_multi_groups'];	
								m_obj.system_menu_name=$responce.data.system_menu_name;
								m_obj.g_multi_group=$responce.data['multi_group'];
								m_obj.t_tax_structure_exists=$responce.data['tax_structure_exists'];
								m_obj.upload_type=$responce.data['upload_type'];
								 
								m_obj.add_right=$responce.data['add_right'];
								 
							
								
								m_obj.del_right=$responce.data['del_right'];
								m_obj.view_right=$responce.data['view_right'];
								m_obj.edit_right=$responce.data['edit_right'];
								
								m_obj.ur_past_days=$responce.data['ur_past_days'];
								m_obj.ur_future_days=$responce.data['ur_future_days'];
								m_obj.ur_edit_days=$responce.data['ur_edit_days'];
								if(getCookie("user_type")!='Admin')
								{
								  $("#m_"+system_module_name+" #date").attr("data-date-start-date","-"+m_obj.ur_past_days+"d");
								  $("#m_"+system_module_name+" #date").attr("data-date-end-date","+"+m_obj.ur_future_days+"d");
								}
								m_obj.default_view=$responce.data['default_view'];
								m_obj.t_tax_structure_item_table=$responce.data['tax_structure_item_table'];
								m_obj.t_tax_structure_item_tax_table=$responce.data['tax_structure_item_tax_table'];
								m_obj.t_tax_structure_doc_table=$responce.data['tax_structure_doc_table'];
	 
	
								if(!empty($responce.data['multi_group']))
								{
									$.each($responce.data['multi_group'], function (gk,gv) { 		
			
									var group_table_name=gv.table_name;
									var group_name=gv.group_name;
									var parent_group=gv.parent_group;

									var grp_ele_arr=gv.elements;
									var grp_system_name_full_arr=new Object();
									if(!empty(grp_ele_arr))
									{
										 $.each(grp_ele_arr, function (ek,ev) {			
											var data_type=ev.Type;
											var db_field=ev.db_field;
											var system_name=ev.system_name;
											grp_system_name_full_arr[system_name]=new Object();
											grp_system_name_full_arr[system_name]['data_type']=data_type;
											});
											 
											m_obj.g_multi_group[group_table_name]['grp_system_name_full_arr']=grp_system_name_full_arr;
									}		
										});
								}	
								
								$("#m_"+m_obj.g_system_module_table_name+"  :input:visible:first").focus(); 
								all_obj[m_obj.g_system_module_table_name]=m_obj;
								all_obj[m_obj.g_system_module_table_name]['msave']="Yes";
							
								m_obj.InitModule();
								
								if(load_type == 'PopUp' && m_obj.add_right == 0)
								{
									ShowAlertMsg("You do not have rights to add here!");
									all_obj.close(system_module_name,module_id);
									return false;									
								}
								
								if (callback && typeof(callback) === "function")
								{									
							        callback();
								}
								$('#view_footer_actions').remove();												
								if(is_module_for_new_or_edit=='Add' &&  m_obj.default_view=="View" && typeof(callback) != "function")
								{
									 displayUserSchemaModuleDetailsNew(m_obj.g_system_module_table_name);
								}
							}
						   catch(err)
							{
								txt= err.message;
								// App.unblockUI();
								 ShowAlertMsg(txt+"<br>"+$responce+" in CallGetModuleDetailsNew");
								// bootbox.alert(txt+"<br>"+$responce+" in CallGetModuleDetailsNew");
							}  	
						}
			 });
	
 }