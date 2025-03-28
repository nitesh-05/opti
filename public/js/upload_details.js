//Uploading Details
var up_module_name="";
function get_header(schema_id,system_module_table_name)
{ 
var upload_type=all_obj[system_module_table_name]['upload_type'];
 
	if(upload_type=="Multiple")
	{

		setTimeout(function(){window.location.href=$host_url+"getModuleDetailsHeadersNew&schema_id="+schema_id,500});
	} 
	else
	{
	 
	   setTimeout(function(){ window.location.href=$host_url+"DownloadExcelFormatForUpload&schema_id="+schema_id+"&system_module_table_name="+system_module_table_name,500});
	} 
}
 
function downloadModuleData(schema_id,system_module_table_name, load_id)
{ 
	
	myJSONfiltersText=false;
	var is_filter=0;
	var selected_db_fields_arr=Array();
	if(($(load_id+' #m_'+system_module_table_name+' #is_display_add_remove_row').is(':checked')))
	{
		tbl = $(load_id+ ' #m_'+system_module_table_name+' #download_details_table');
		//tbl = document.getElementById('download_details_table');
		var ctr=(tbl.children('tbody').children('tr').length)-1;
		//var ctr=(tbl.rows.length)-1;
		var filter_cond="";
		$download_details= new Object();
		$k=0;
		for($i=1;$i<=ctr;$i++)
		{
			feild=$(load_id+' #m_'+system_module_table_name+' #download_field_id_'+$i).val();
			val=$(load_id+' #m_'+system_module_table_name+' #txtbox_'+$i).val(); 
			operator=$(load_id+' #m_'+system_module_table_name+' #oper_'+$i).val();
			and_or=$(load_id+' #m_'+system_module_table_name+' #and_or_'+$i).val();	
			
			data_type=all_obj[system_module_table_name]['g_system_names_full_arr'][feild]['Type']; 
			if(data_type=='Month')
			{
				val= getYearMonthDBValue(val);
			}
			else if(data_type=='Date')
			{
				 val=date_format(val)
			}
			
			if(empty(feild)) 
					continue;
			
			if(empty($("#download_field_id_"+$i).val())) continue;
			$download_details[$k]= new Object();
		    $download_details[$k]['db_filed']=feild;
		    $download_details[$k]['oper']=operator;
		    $download_details[$k]['val']=encodeURIComponent(val);
		    $download_details[$k]['cond']=and_or;	
			$k++;		   
		}
		
		
		$.each(all_obj[system_module_table_name]['g_user_schema_details_array']['data']['1'],function (ak,av)
		{
			system_name=av['system_name'];  
			if($(':checkbox[id='+system_name+']').is(':checked'))
				selected_db_fields_arr.push(system_name);
		});
		is_filter=1;
		var myJSONfiltersText = (JSON.stringify($download_details));  
	   
	}
	setTimeout(function(){  window.location.href=$host_url+"DownloadExcelFormatFullData&schema_id="+schema_id+"&system_module_table_name="+system_module_table_name+"&filter_cond="+myJSONfiltersText+"&selected_db_fields_arr="+selected_db_fields_arr+"&is_filter="+is_filter,500});

  
  
   // setTimeout(function(){ window.location.href=$host_url+"downloadModuleData.demo&schema_id="+schema_id+"",500});
}

function DisplayAddRemoveRow(schema_id, system_module_name, load_id)
{
	 
	var load_type=all_obj[system_module_name]['load_type'];
	if(load_type=='PopUp')  
	  
		$(load_id+" [name='upload_download_file']").attr("id", "m_"+system_module_name);
	 
	else 
		$(load_id+' [name="upload_download_file"]').attr("id", "m_"+system_module_name);
	 
	//document.getElementById('is_display_add_remove_row').checked  == true 
	if($(load_id+' #m_'+system_module_name+' #is_display_add_remove_row').is(':checked'))
	{
		$(load_id+ " #m_"+system_module_name+" #download_filters_fields").show();
	}
	else  
	{
		$(load_id+ " #m_"+system_module_name+" #download_filters_fields").hide();
	}
	
	$op='';
	list=all_obj[system_module_name]['g_user_schema_details_array']['data']['1'];
	if( (list.length)>0)
	{
  	   // document.getElementById('download_field_id_1').options.length=0;		
	   $(load_id+  ' #m_'+system_module_name+' #download_field_id_1 option').remove();
		//$op = new Option('Select One', '');
		$op = "<option value=''>Select One</option>";
		////$op.id='0'; 
		//document.getElementById('download_field_id_1').options.add($op);
		
		$(load_id+ ' #m_'+system_module_name+' #download_field_id_1').append($op);
		$.each(all_obj[system_module_name]['g_user_schema_details_array']['data']['1'], function(k,v)
		{
			//$op = new Option(v['element_name'], v['system_name']);
			$op = "<option value='"+v['system_name']+"'>"+v['element_name']+"</option>";
			$(load_id+ ' #m_'+system_module_name+' #download_field_id_1').append($op);
			//$op.id=v['system_name'];//specifying the id  for options
			//document.getElementById('download_field_id_1').options.add($op);
		});
	}
	
	// to delete the rows mannually
	//var tbl = document.getElementById('download_details_table');
	var tbl = $(load_id+ ' #m_'+system_module_name+' #download_details_table');
	//var lastRow_full_length = tbl.rows.length;
	var lastRow_full_length = tbl.children('tbody').children('tr').length;

	for($i=0;$i<lastRow_full_length;$i++)
	{
		//var lastRow = tbl.rows.length;
		var lastRow = tbl.children('tbody').children('tr').length;
		if (lastRow > 2) 
			tbl.children('tbody').children('tr:last').remove();
	}
	GetDownloadFilterDataDetails(load_id, system_module_name);  
 	
}

function addDownloadFiltersRow(system_module_name, load_id)
{
	//var tbl = document.getElementById('download_details_table'); 
	var tbl = $(load_id+' #m_'+system_module_name+' #download_details_table'); 
	
	//var lastRow = tbl.rows.length; 
	var lastRow = tbl.children('tbody').children('tr').length; 
	var iteration = lastRow;
	var counter=iteration-1;
	
	// creates a new row
	var each_row="<tr>";
	
	each_row+="<td id='"+iteration+"1'>";
	each_row+=" <select style='width:85%' class='form-control  input-sm' onchange=\"createTextBoxBasedDataType('"+iteration+"', '"+system_module_name+"', '"+load_id+"')\" id='download_field_id_"+iteration+"' >";
	each_row+="<option value=''>Select One</option>"; 
	$.each(all_obj[system_module_name]['g_user_schema_details_array']['data']['1'], function(k,v)
	{
		each_row+="<option value='"+v['system_name']+"'>"+v['element_name']+"</option>"; 
	});  
	each_row+= "</select>"; 
	each_row+="</td>";	
	
	each_row+="<td id='"+iteration+"2'>";
	each_row+=" <select style='width:85%' class='form-control  input-sm' id='oper_"+iteration+"'>";
	each_row+="<option value=''>Select One</option>"; 
	each_row+="<option value='='>=</option>"; 
	each_row+="<option value='<='><=</option>"; 
	each_row+="<option value='>='>>=</option>"; 
	each_row+="<option value='like'>like</option>"; 
	
	each_row+= "</select>";
	each_row+="</td>";	
	
	each_row+="<td id='"+iteration+"3'>";	
	each_row+="<input type='text' class='form-control  input-sm'  id='txtbox_"+iteration+"' style='width:95%;'>";
	each_row+="</td>";	
	 
	each_row+="<td id='"+iteration+"4'>";
	each_row+=" <select style='width:85%' class='form-control  input-sm' id='and_or_"+iteration+"'>";
	each_row+="<option value=''>Select One</option>"; 
	each_row+="<option value='And'>And</option>"; 
	each_row+="<option value='Or'>Or</option>";   
	each_row+= "</select>";
	each_row+="</td>";
	 
	each_row+="</tr>";
	
	$(load_id+' #m_'+system_module_name+' #download_details_table tbody tr:last').after(each_row);
}

function removeDownloadFiltersRow(system_module_name, load_id)
{
	//var tbl = document.getElementById('download_details_table');
	var tbl = $(load_id+' #m_'+system_module_name+' #download_details_table'); 
	
	// grab the length!
	var lastRow = tbl.children('tbody').children('tr').length;
	// delete the last row if there is more than one row!
	if (lastRow > 2) 
		tbl.children('tbody').children('tr:last').remove();
}

function createTextBoxBasedDataType(id, system_module_name, load_id)
{
	feild=$(load_id+' #m_'+system_module_name+ ' #download_field_id_'+id).val();
	 
	data_type=all_obj[system_module_name]['g_system_names_full_arr'][feild]['Type'];
	
	if(data_type=='Number')
	{
		//$('#txtbox_'+id).attr("onkeypress", "return acceptNumbersOnlyForModule(event)") ;
		$(load_id+' #m_'+system_module_name+ ' #'+id+'3').html("<input type='text' class='form-control  input-sm' id='txtbox_"+id+"' onkeypress='return acceptNumbersOnlyForModule(event)' style='width:95%;'>");
	}
	else if(data_type=='Month')
	{
		month_element="<div data-date-format='M' data-date-viewmode='years' class='input-icon right' style='width: 95%;'>";
		month_element+="<i class='fa fa-calendar-o' onclick=\"CallTarkaMonthPicker('"+load_id+"', '"+system_module_name+"', 'txtbox_"+id+"')\" style='cursor:pointer; color:#333333;'></i>";
		month_element+="<input class='form-control input-sm' readonly id='txtbox_"+id+"' type='text'> </div>";
		$(load_id+' #m_'+system_module_name+ ' #'+id+'3').html(month_element);
	}
	else if(data_type=='Date')
	{
		date_element="<div class='input-icon right' data-date-format='dd/mm/yyyy' data-date-viewmode='years' style='width: 95%;'>";
		date_element+="<i class='fa fa-calendar' onclick=\"CallTarkaDatePickerUpload('"+load_id+"', '"+system_module_name+"', 'txtbox_"+id+"')\"  style='margin-right: 10px; cursor:pointer; color:#333333;'></i>";
		date_element+="<input type='text' class='form-control date date-picker input-sm' placeholder='dd/mm/yyyy'   id='txtbox_"+id+"'> </div> ";
		$(load_id+' #m_'+system_module_name+ ' #'+id+'3').html(date_element);
	}
	else if(data_type=='Reference Data')
	{
		$.each(all_obj[system_module_name]['g_user_schema_details_array']['data']['1'], function(k,v)
		{
			if(feild==v['system_name'])
			{
				ref_table_name=v['ref_module_table_name'];
				
				ref_element="<div class='input-icon right' style='width: 95%;'>";
				ref_element+="<input  class='form-control input-sm'   id='txtbox_"+id+"'   type='hidden'  value='0' />";
				ref_element+="<i style='width: 50px; margin-top: 1px; margin-bottom-1px; margin-right: 1px; height: 22px;' >";	
				ref_element+="<span class='fa fa-search' title='Search in SKU Master' onclick=\"POPUP.OpenFWPopup('"+ref_table_name+"','"+system_module_name+"' ,'txtbox_"+id+"');\"  style='background: #EEEEEE; color:#333333; height: 18px; margin: 0; width: 24px; float:right; padding:4px; cursor:pointer;'></span>";
				ref_element+="</i> <input class='form-control input-sm' on_exit='0' id='txt_ref_schema_txtbox_"+id+"' onblur=\"all_obj.ClearReferenceData('"+system_module_name+"','txtbox_"+id+"')\" type='text' style=' ' value=''>";
				ref_element+="</div>";
				$(load_id+' #m_'+system_module_name+ ' #'+id+'3').html(ref_element);
				POPUP.AssignJqueryAutoCompleteNew(ref_table_name, system_module_name, 'txtbox_'+id);
			}
		});
	}
	else 
	{
		$(load_id+' #m_'+system_module_name+ ' #'+id+'3').html("<input type='text' class='form-control  input-sm' id='txtbox_"+id+"' style='width:95%;'>");
	}
	 
	 
}

function CallTarkaDatePickerUpload(load_id, system_module_name, id)
{	 
		 
	$("#"+id).datepicker({ 
		autoclose: true,
		format: 'dd/mm/yyyy',
		dateFormat: 'dd/mm/yy',
		todayBtn: true
	}); 
	$(load_id+' #m_'+system_module_name+ ' #'+id).datepicker('show');
		 
}
function CallTarkaMonthPickerUpload(load_id, system_module_name, system_name)
{
	$(load_id+' #m_'+system_module_name+' #'+system_name).monthpicker({dateFormat:"M-yy"});
	$(load_id+' #m_'+system_module_name+' #'+system_name).monthpicker('show');
}	


function GetDownloadFilterDataDetails(load_id, system_module_name)
{
	html="";
	
	html=" <table align='center'width='40%' border='0' cellspacing='1' cellpadding='1'>";
	html+="<tr><td>";

	html+="<table  align='center' width='46%' border='0' cellpadding='' cellspacing=''>";
	html+="<tr><td>Check All <input type='checkbox' checked id='is_filter_data_check_all' onclick=\"CheckAllFilterData('"+system_module_name+"', '"+load_id+"')\"/></td></tr>";
	html+="<tr>";
	html+="<td style='width:30px;'>";		
	html+="<div  style='overflow-y:scroll;overflow-y:auto;width:245px;height:227px;border:1px solid #cccccc;'>";
	$.each(all_obj[system_module_name]['g_user_schema_details_array']['data']['1'], function(k,v)
	{
		html+="<input type='checkbox' checked  id='"+v['system_name']+"' name='"+v['system_name']+"' /> <label for='"+v['system_name']+"'>"+v['element_name']+"</label><br />";
	}); 
	html+="</div></td>";
	html+="</tr></table>";
	html+="</td> </tr></table>";	
	//document.getElementById('download_filter_data_div').innerHTML=html;
	$(load_id+" #m_"+system_module_name+" #download_filter_data_div").html(html);
	$(load_id+" #m_"+system_module_name+" #download_filter_data_div").show();
}

function CheckAllFilterData(system_module_name, load_id)
{
    if($(load_id+' #m_'+system_module_name+' #is_filter_data_check_all').is(':checked'))
	{
		$.each(all_obj[system_module_name]['g_user_schema_details_array']['data']['1'], function(k,v)
		{
			//$(':checkbox[id='+v['system_name']+']').prop('checked', true);
			$(load_id+ ' #m_'+system_module_name +' #'+v['system_name']).attr('checked', true);	
		});
	}
	else
	{
		$.each(all_obj[system_module_name]['g_user_schema_details_array']['data']['1'], function(k,v)
		{
			//$(':checkbox[id='+v['system_name']+']').prop('checked', false);
			$(load_id+' #m_'+system_module_name +' #'+v['system_name']).attr('checked', false);
		});
	}
}

function uploadModuleDetailsIntoDB(schema_id,system_module_name)
{ 
	var load_id = "#m_"+system_module_name+"_section #module_details_uploaded_file";
	var error_load_id = "#m_"+system_module_name+"_section";
	var load_type=all_obj[system_module_name]['load_type'];
	var upload_type=all_obj[system_module_name]['upload_type'];
	if(load_type=='PopUp')
	{
		load_id="#popup_module_dialog_"+all_obj[system_module_name]['g_str_module_id']+" #popup_content_"+all_obj[system_module_name]['g_str_module_id']+" #module_details_uploaded_file";
		error_load_id="#popup_module_dialog_"+all_obj[system_module_name]['g_str_module_id']+" #popup_content_"+all_obj[system_module_name]['g_str_module_id'];
	}
	
    var input, file, fr;
	
	
        if (typeof window.FileReader !== 'function') {
            alert("The file API isn't supported on this browser yet.");
            return;
        }

        input =$(load_id).fileinput()[0];
        if (!input) {
           alert("Um, couldn't find the fileinput element.");
		   return false;
        }
        else if (!input.files) {
            alert("This browser doesn't seem to support the `files` property of file inputs.");
        }
        else if (!input.files[0]) {
            alert("Please select a file before clicking 'Load'");
			return false;
        }
		else {
			var file_name = $(load_id).fileinput()[0].files[0].name;
			var file_ext = file_name.split('.').pop().toLowerCase();;
			if(file_ext !='xls' && file_ext !='xlsx')
			{
				alert("Please Select  Excel File to uplaod...");
				return false;
			}
			else
			{
				file = input.files[0];
				fr = new FileReader();
				fr.onload = function () {
				result = fr.result;
					
					
					var data_obj = new Object();
						data_obj['content']= result;
						data_obj['file_name']= file_name;
						data_obj['schema_id']= schema_id;
						data_obj['system_module_name']= system_module_name;
				App.blockUI();
				var call_url="";
				if(upload_type=="Single")
				 call_url=$host_url+"UploadExcelModuleData";//uploadModuleDetailsIntoDB.demo
				else
				  call_url=$host_url+"uploadModuleDetailsIntoDBNew";
			 
				$.ajax({
						type: "POST",
						//async:false,
						url:call_url,
						contentType: "charset=utf-8",
						dataType: "json",
						// data: lstr_query_string, 
						data: JSON.stringify(data_obj),
						success: function uploadModuleDetailsIntoDBResponce(responce)
								{
									
									try
										{	
											App.unblockUI();
											
											if(responce.error_code=='-9')
											{
												alert(responce.data);CallLogout();
												return false;
											}
											
											/* else if(responce.error_code == -1)
											{
												var url= "src/uploadmoduledetails_error_file.php?file_name="+encodeURIComponent(responce.data);
												alert("Upload Failed, Please refer error file.");
												$(error_load_id+" #upload_error").attr('href',url);
												$(error_load_id+" #upload_error")[0].click();
											}
											else if(responce.error_code == -2)
											{
												var url=  (responce.data);
												alert("Upload Failed, Please refer error file.");
												$(error_load_id+" #upload_error").attr('href',url);
												$(error_load_id+" #upload_error")[0].click();
											} */
											if(responce.error_code == 0)
											{
												var load_type=all_obj[system_module_name]['load_type'];
												 var load_id="#m_"+system_module_name+"_section #update_result";
												if(load_type=='PopUp')
												{
													load_id="#popup_module_dialog_"+all_obj[system_module_name]['g_str_module_id']+" #popup_content_"+all_obj[system_module_name]['g_str_module_id']+" #update_result";
													 
												}
												
	
												// bootbox.alert(responce.data);#page_main_div #module_details_uploaded_file";
												 $(load_id).html(responce.data);
											}
											
										}	
										catch(err)
										{
											txt= err.message;
											alert(txt);
										}	
								}
					}); 
				};
				 fr.readAsDataURL(file);
			}
		}
}
  
