
/**************************************************************************************************
*	FILE NAME…….......: MainPage.js
*	DATE..............: 26/05/2009
* 	PROGRAMMER........: Natesh 
* 	MODIFIED DATE.....: 26/05/2009
* 	MODIFIED PROGRAMMERS...: Jijo.P,Beemaraj.V 
* 	DESCRIPTION…......: This Script file is used for maintaining Cookie,Golabal Variable,Display Menu
*	
*	FUNCTION….........: enablegeneralmaster()
*	PARAMETERS........: NO ARGUMENTS
* 	DESCRIPTION.......: The function is used to Enable System General master Div.

*	FUNCTION….........: savegeneralmasterDetails()
*	PARAMETERS........: NO ARGUMENTS
* 	DESCRIPTION.......: The function is used to save System General master details.
*
*	FUNCTION….........: view_records()
*	PARAMETERS........: NO ARGUMENTS
* 	DESCRIPTION.......: The function is used to Display Grid for corresponding modules.
*
*
*
***************************************************************************************************/
function LoadManualFilesToLi(html_file_name,module_id,display_module_name,type,callbac_function)
{
	if($("#m_"+html_file_name).length > 0)
	{
		div_id = "section-bar-"+module_id;
		jt_db =getCookie("jt_db");
		$path=$path="html_modules/"+html_file_name+".html";;	
		$('#'+div_id).load($path,function() 
		{	
			 if(!empty(callbac_function))	
				 callbac_function(type);
		});	
		$("#li_"+module_id).trigger("click");
		return;
	}
			
	tabs_cnt = $('#menu_tabs li:visible').length;
 
	if(tabs_cnt < 6)
	{
		$('#section-bar-'+module_id).remove();
		$('#li_'+module_id).remove();
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
		div_id = "section-bar-"+module_id;
		var jt_db=getCookie("jt_db");
		 
		$path="html_modules/"+html_file_name+".html";	
		$("#li_"+module_id).html("<a href='#section-bar-"+module_id+"' class='fa fa-dashboard' style='border-radius:5px'> &nbsp;<span>"+display_module_name+"</span></a><div><button type='button' class='clsbtn' onclick='closeTab(&quot;"+module_id+"&quot;);'>&times;</button></div>");
		$('#m_'+module_id).remove();
		$('.contents').show();
		$('#'+div_id).show();
		$('#page_main_home_div').hide();
		$('#main_body').show(); 
		
			$('#'+div_id).load($path,function() 
			{			
			 
				if(!empty(callbac_function))	
				 callbac_function(type);
			});
		},500);
	}
}
function closeTab(internal_code) 
{
	setTimeout(function(){
			$("#menu_tabs li.tab-current").prev(":last").trigger("click");
			$('#section-bar-'+internal_code).remove();
			$('#li_'+internal_code).remove();
		}, 100);
}
 
function enablegeneralmaster(type)
{	 
	document.getElementById('module_name_for_save').value = 'savegeneralmasterDetails';
	LoadManualFilesToLi("system_general_master_setup","3","General Master Setup",type,function(type){
		getuserSchemaModuleType();
		getDefaultHeadFooterLinks('General Master Setup','system_general_master_setup');
	 
		if(type=='Edit')
		{
			getGeneralMasterDetails($geditinternalcode);
		}
		else
		{
			$geditinternalcode=0;
		}
	});
}
function getuserSchemaModuleType()
{
	$.ajax({
		type: "POST",
		//async:false,
		url: $host_url+"getModuleType.demo",      
		success: function populateModuleTypeResponce($responce)
				{
					$responce = eval('(' + $responce + ')');
					$op='';
					$g_link_details_array="";
					//$g_link_details_array=$responce.data['links_data'];
					document.getElementById('module_type').options.length=0;
					document.getElementById('module_menu_name').options.length=0;
					$op = new Option('Select One', '0');
					$op.id='0';
					document.getElementById('module_menu_name').options.add($op);
					for($i=0;$i < $responce.data[0].length;$i++)                                  
					{             
						$op = new Option($responce.data[0][$i]['type'], $responce.data[0][$i]['internal_code']);
													$op.id=$responce.data[0][$i]['internal_code'];//specifying the id  for options
													document.getElementById('module_type').options.add($op);

					}      
					for($i=0;$i < $responce.data[1].length;$i++)                                  
					{               
						$op = new Option($responce.data[1][$i]['type'], $responce.data[1][$i]['internal_code']);
													$op.id=$responce.data[1][$i]['internal_code'];//specifying the id  for options
													document.getElementById('module_menu_name').options.add($op);

					} 
						document.getElementById('module_name').focus();
						
					//$("#header_td_id").html($g_link_details_array['header_link']);
					//$("#footer_td_id").html($g_link_details_array['footer_link']);
					$("#page_header").show();
					$("#page_footer").show();
				}
		});	
}

function showModuleFunctionName()
{
	if(document.getElementById('is_menu_only').checked == true) 
	$("#row_module_function_name").show();
	else
	$("#row_module_function_name").hide();
}

 
function savegeneralmasterDetails()
{	
		if( trim(document.getElementById('module_name').value) == '' )
		{
			ShowAlertMsg('Please enter the Module Name.');
			document.getElementById('module_name').focus();
			return;
		}
		 if( (document.getElementById('is_menu_only').checked) == true && trim(document.getElementById('module_function_name').value)=='')  
		{
			ShowAlertMsg('Please enter the Formula Name.');
			document.getElementById('module_function_name').focus();
			return;
		}		
			else
			{
			$is_menu_only=0;
			var is_analytical=0;
			var is_generate_html=0;
			var grid_tot_footer=0;
			var $create_table;
			// var $framework_type;
			$active=0;
			$module_function_name='';
				if(document.getElementById('is_menu_only').checked  == true)
				{
				$is_menu_only=1;
				$module_function_name=trim(document.getElementById('module_function_name').value)
				}
				if(document.getElementById('is_module_active').checked  == true)
				{
				$active=1;
				}	
				if(document.getElementById('is_analytical').checked  == true)
				{
				  is_analytical=1;
				}
				if(document.getElementById('is_generate_html').checked  == true)
				{
				  is_generate_html=1;
				}
				if(document.getElementById('grid_tot_footer').checked  == true)
				{
				  grid_tot_footer=1;
				}
				if(document.getElementById('create_table').checked  == true)
				{
				$create_table=1;
				}
				else $create_table=0;
				$tax_structure_exists= $("#tax_structure_exists option:selected").text();
				
				if($('#approval_exists'). prop("checked")=='false')
					$approval_exists = 'No';
				else
					$approval_exists = 'Yes';
				// $approval_exists= $("#approval_exists option:selected").text();
				
				$is_save=0;
		        if(document.getElementById('is_user_schema_save').checked==false)
		         $is_save=0;
		        else
		         $is_save=1;
				 
				$is_clear=0;
		        if(document.getElementById('is_user_schema_clear').checked==false)
		         $is_clear=0;
		        else
		         $is_clear=1;
				 
				 $is_download=0;
		        if(document.getElementById('is_user_schema_download').checked==false)
		         $is_download=0;
		        else
		         $is_download=1;
				 
				$is_view=0;
		        if(document.getElementById('is_user_schema_view').checked==false)
		         $is_view=0;
		        else
		         $is_view=1;
				 
				$is_generate=0;
		        if(document.getElementById('is_user_schema_generate').checked==false)
		         $is_generate=0;
		        else
		         $is_generate=1;
				 
				$is_include_mb_in_grid=0;
		        if(document.getElementById('is_include_mb_in_grid').checked==false)
		         $is_include_mb_in_grid=0;
		        else
		         $is_include_mb_in_grid=1;
				 
				 
				$is_include_cb_in_grid=0;
		        if(document.getElementById('is_include_cb_in_grid').checked==false)
		         $is_include_cb_in_grid=0;
		        else
		         $is_include_cb_in_grid=1;
				
				$lstr_query_string="internal_code="+$geditinternalcode;
				$lstr_query_string+="&module_name="+encodeURIComponent(trim(document.getElementById('module_name').value));
				$lstr_query_string+="&user_schema_display_module_name="+encodeURIComponent(trim(document.getElementById('user_schema_display_module_name').value));
				$lstr_query_string+="&system_module_table_name="+encodeURIComponent(trim(document.getElementById('system_module_table_name').value));
				$lstr_query_string+="&module_type="+encodeURIComponent(trim(document.getElementById('module_type').value));
				// $lstr_query_string+="&framework_type="+encodeURIComponent(trim(document.getElementById('framework_type').value));
				$lstr_query_string+="&is_menu_only="+$is_menu_only;
				$lstr_query_string+="&create_table="+$create_table;
				$lstr_query_string+="&active="+$active;
				$lstr_query_string+="&is_analytical="+is_analytical;
				$lstr_query_string+="&is_generate_html="+is_generate_html;
				$lstr_query_string+="&grid_tot_footer="+grid_tot_footer;
				$lstr_query_string+="&module_function_name="+encodeURIComponent($module_function_name);
				$lstr_query_string+="&main_menu="+(document.getElementById('module_menu_name').value);
				$lstr_query_string+="&tax_structure_exists="+$tax_structure_exists;
				$lstr_query_string+="&approval_exists="+$approval_exists;
				$lstr_query_string+="&is_save="+$is_save;
				$lstr_query_string+="&is_clear="+$is_clear;
				$lstr_query_string+="&is_download="+$is_download;
				$lstr_query_string+="&is_view="+$is_view;
				$lstr_query_string+="&is_generate="+$is_generate;
				$lstr_query_string+="&is_include_mb_in_grid="+$is_include_mb_in_grid;
				$lstr_query_string+="&is_include_cb_in_grid="+$is_include_cb_in_grid;
				$lstr_query_string+="&custom_links="+encodeURIComponent(trim(document.getElementById('user_schema_custom_links').value));
				// $lstr_query_string+="&logo_path="+encodeURIComponent(trim(document.getElementById('user_schema_logo_path').value));
				$lstr_query_string+="&module_grid_type="+encodeURIComponent(trim(document.getElementById('module_grid_type').value));
				$lstr_query_string+="&grid_user_schema_coloum_names="+encodeURIComponent(trim(document.getElementById('grid_user_schema_coloum_names').value));
 		        $lstr_query_string+="&grid_user_schema_coloum_models="+encodeURIComponent(trim(document.getElementById('grid_user_schema_coloum_models').value));
		        $lstr_query_string+="&grid_user_schema_grid_query="+encodeURIComponent(trim(document.getElementById('grid_user_schema_grid_query').value));
		        $lstr_query_string+="&grid_custom_links="+encodeURIComponent(trim(document.getElementById('grid_custom_links').value));
	            $lstr_query_string+="&user_schema_js_path="+encodeURIComponent(trim(document.getElementById('user_schema_js_path').value));
				$lstr_query_string+="&user_schema_grid_default_rows="+encodeURIComponent(trim(document.getElementById('user_schema_grid_default_rows').value));
				$lstr_query_string+="&user_schema_fa_icon="+encodeURIComponent(trim(document.getElementById('user_schema_fa_icon').value));
				$lstr_query_string+="&default_view="+encodeURIComponent(trim(document.getElementById('default_view').value));
				$lstr_query_string+="&grid_shrink_to_fit="+encodeURIComponent(trim(document.getElementById('grid_shrink_to_fit').value));
				$lstr_query_string+="&module_onload="+encodeURIComponent(trim(document.getElementById('module_onload').value));
				$lstr_query_string+="&module_after_edit="+encodeURIComponent(trim(document.getElementById('module_after_edit').value));
				$lstr_query_string+="&module_pre_save="+encodeURIComponent(trim(document.getElementById('module_pre_save').value));
				$lstr_query_string+="&include_grid_color="+encodeURIComponent(trim(document.getElementById('include_grid_color').value));
				$.ajax({
				 type: "POST",
				 url: $host_url+"maddUserScheMamaster.demo",
				 data:$lstr_query_string,
				 success: savegeneralmasterDetailsResponce
				});  	
			}	
}

function savegeneralmasterDetailsResponce($responce) 
{  
	$responce = eval('(' + $responce + ')');    
	if ($responce.error_code == 0)                                
	{
		ShowSuccessMsg($responce.data);
		$g_general_master_module_name = '';
		clear_generalmaster_fields();
		enablegeneralmaster();
		$geditinternalcode=0;	
		document.getElementById('module_name').focus();   
    }
    else
    {   
       ShowAlertMsg('Insertion unsuccessfully!!');        
    }
    return; 
} 

// To Display User Schema Element Entry  div
function enable_user_schema_elements(type)
{  	
	window.enable_proper_module="enable_user_schema_elements";	
	document.getElementById('module_name_for_save').value = 'saveuserschemaelementDetails';
	
	LoadManualFilesToLi("system_user_schema_elements","5","User Schema Elements",type,function(type){
		getDefaultHeadFooterLinks('User Schema Elements','system_user_schema_elements');
	
		 $.ajaxq ("ajaxQueue",{
			type: "POST",
			 async: false,
			url: $host_url+"mcombouserschemaname.demo",      
			success: populate_user_schema_type_element_combo
		});
		 $.ajaxq ("ajaxQueue",{
			type: "POST",
			 async: false,
			url: $host_url+"mcombouserschemaelementtype.demo",     
			success: populate_user_schema_element_type_combo
		});
		 $.ajaxq ("ajaxQueue",{
		 type: "POST",
		 async: false,
		   url: $host_url+"mComboUserSchemaElementReferenceData.demo",     
		   success: populateComboUserSchemaElementReferenceDatas
		});  
		populate_group_for_element(0);
		$('.contents').show();
		$('#page_main_div').show();
		$('#page_main_home_div').hide();	
		if(type=='Add')
		{
			$geditinternalcode=0;
		}
		else
		{
			getUserSchemaElementDetails($geditinternalcode);
		}
	});
} 

function populate_user_schema_type_element_combo($responce)
{ 
    $responce = eval('(' + $responce + ')'); 
    sleep(888);	
    document.getElementById('elemenmt_user_schema').options.length = 0;
    var $lobj_Option = document.createElement("OPTION");
    $lobj_Option.value = "0";
    $lobj_Option.text = "Select One";         
    document.getElementById('elemenmt_user_schema').options[0]=($lobj_Option);              
    for($i=0;$i < $responce.data.length;$i++)                                  
    {                                            
        var $obj_Option   = document.createElement("OPTION");
        $obj_Option.value = $responce.data[$i].internal_code;
        $obj_Option.text  = $responce.data[$i].user_schema;                                    
        document.getElementById('elemenmt_user_schema').options[$i+1] = ($obj_Option); 
	}       
}  

function populate_user_schema_element_type_combo($responce)
{ 
    $responce = eval('(' + $responce + ')');           
    document.getElementById('user_schema_element_type').options.length = 0;
    document.getElementById('user_schema_element_meta_type').options.length = 0;
    $op = new Option('Select One', '0');
	$op.id='0';
	document.getElementById('user_schema_element_type').options.add($op);    
    for($i=0;$i < $responce.data.length;$i++)                                  
	{            
		if($responce.data[$i].type=='data_type')
		{
			$op = new Option($responce.data[$i]['value'], $responce.data[$i]['internal_code']);
			$op.id=$responce.data[$i]['internal_code'];//specifying the id  for options
			document.getElementById('user_schema_element_type').options.add($op);
		}
	    else if($responce.data[$i].type=='element_type')
		{
			$op1 = new Option($responce.data[$i]['value'], $responce.data[$i]['internal_code']);
			$op1.id=$responce.data[$i]['internal_code'];//specifying the id  for options
			document.getElementById('user_schema_element_meta_type').options.add($op1);
		}
          
	}        
}  

function populateComboUserSchemaElementReferenceDatas($responce)
{ 
	$responce = eval('(' + $responce + ')');           
    document.getElementById('user_schema_element_ref_module').options.length = 0;
	
    var $lobj_Option = document.createElement("OPTION");
    $lobj_Option.value = "0";
    $lobj_Option.text = "Select One";         
    document.getElementById('user_schema_element_ref_module').options[0]=($lobj_Option);              
    for($i=0;$i < $responce.data.length;$i++)                                  
    {                                            
		var $obj_Option   = document.createElement("OPTION");
		$obj_Option.value = $responce.data[$i].internal_code;
		$obj_Option.text  = $responce.data[$i].module_name;                                    
		document.getElementById('user_schema_element_ref_module').options[$i+1] = ($obj_Option); 
	}
  //$("#element_meta_type_tr").hide();
	document.getElementById('elemenmt_user_schema').focus();     
 		
 }
 
//To Display User Schema Group div.  
function enable_user_schema_group(type)
{
	window.enable_proper_module="saveuserschemagroupDetails";	
	document.getElementById('module_name_for_save').value = 'saveuserschemagroupDetails';	
	LoadManualFilesToLi("system_user_schema_group","4","User Schema Group",type,function(type){
		getDefaultHeadFooterLinks('User Schema Group','system_user_schema_group');
		
		if(type=='Add')	
		$geditinternalcode=0;
		
			 $.ajaxq ("ajaxQueue",{
			 type: "POST",
			  async: false,
				url: $host_url+"mcombouserschemaname.demo",     
			   success: function populate_user_schema_type_combo($responce)
						  { 
							$responce = eval('(' + $responce + ')');           
							document.getElementById('group_user_schema').options.length = 0;
							
							var $lobj_Option = document.createElement("OPTION");
							$lobj_Option.value = "0";
							$lobj_Option.text = "Select One";         
							document.getElementById('group_user_schema').options[0]=($lobj_Option);              
							for($i=0;$i < $responce.data.length;$i++)                                  
							{                                            
								var $obj_Option   = document.createElement("OPTION");
								$obj_Option.value = $responce.data[$i].internal_code;
								$obj_Option.text  = $responce.data[$i].user_schema;                                    
								document.getElementById('group_user_schema').options[$i+1] = ($obj_Option); 
							}        
							document.getElementById('group_user_schema').focus();
						} 
			});	
		if(type=='Edit')
		{
			$.ajaxq ("ajaxQueue",{
				type: "POST",
				async: false,
				url: $host_url+"mGetUserSchemaGroupDetailsForUpdate.demo",
				data:"internal_code="+$geditinternalcode,
				success: populateUserSchemaGroupDetalis
			});
		}
	});	
 
}

function ShowColoumDetails()
{
if(document.getElementById('is_grid_edit_user_schema_group').checked==true)
{
    $("#tr_coloum_names").show();	
	$("#tr_coloum_models").show();	
	$("#tr_grid_query").show();
	$("#tr_is_grid_edit_inline").show();
	$("#tr_add_row_exit_field").show();
 }
else if(document.getElementById('is_grid_edit_user_schema_group').checked==false)
{
  	$("#tr_coloum_names").hide();	
	$("#tr_coloum_models").hide();	
	$("#tr_grid_query").hide();  
	$("#tr_is_grid_edit_inline").hide();  
	$("#tr_add_row_exit_field").hide();  
}

}

function getUserSchemaParentGroupNames()
{
	$("#group_user_schema_module_tabs").html("");
 $list_data ="schema_name="+$("#group_user_schema").val();	
 $list_data+="&geditinternalcode="+$geditinternalcode;	
 $.ajax({
     type: "POST",
	   async: false,
	    url: $host_url+"mComboUserSchemaParentGroup.demo",
        data: $list_data,			
       success: populateUserSchemaParentGroupResponce
	});
}

function populateUserSchemaParentGroupResponce($responce)
 {                                                
    $responce = eval('(' + $responce + ')'); 
	if( $responce.error_code=='0')
	{
		document.getElementById('user_schema_parent_group').options.length=0;
		$op = new Option('Select One', '0');
		$op.id='0';
		document.getElementById('user_schema_parent_group').options.add($op);
		for($i=0;$i < $responce.data['parent_group'].length;$i++)                                  
		{            
		$op = new Option($responce.data['parent_group'][$i]['user_schema'], $responce.data['parent_group'][$i]['internal_code']);
		$op.id=$responce.data['parent_group'][$i]['internal_code'];//specifying the id  for options
		document.getElementById('user_schema_parent_group').options.add($op);
		} 	
			
		
		$("#group_user_schema_module_tabs").html($responce.data['module_tabs']);
	}
	else
	{
	document.getElementById('user_schema_parent_group').options.length=0;
		$op = new Option('Select One', '0');
		$op.id='0';
		document.getElementById('user_schema_parent_group').options.add($op);
	}	
 }  

//Get Module Columns
function getUserSchemaModuleColumns()
{
 var list_data ="schema_name="+$("#group_user_schema").val();	
	list_data+="&schema_module_tab="+$("#group_user_schema_module_tabs").val();	
 $("#group_user_schema_module_columns").html("");
 $.ajax({
     type: "POST",
	   async: false,
	    url: $host_url+"getUserSchemaModuleColumns",
        data: list_data,			
       success: function getUserSchemaModuleColumnsResponce(responce)
				{
					responce = eval('(' + responce + ')'); 
					if( responce.error_code=='0')
					{
						$("#group_user_schema_module_columns").html(responce.data['module_columns']);
					}
				}
	});
}
 
	 
// called from Html to display proper group names for User Schema
function populate_group_for_element($val)
{
 $ref_s_ref_modules_code="elemenmt_user_schema="+$val;
 $.ajax({
     type: "POST",
	  async: false,
	  url: $host_url+"mcombouserschemagroup.demo",     
     
		data:$ref_s_ref_modules_code,	   
       success: populate_user_schema_element_group_combo
  });
}
function populate_user_schema_element_group_combo($responce)
 { 
   $responce = eval('(' + $responce + ')');           
    document.getElementById('elemenmt_user_schema_group').options.length = 0;
	
    var $lobj_Option = document.createElement("OPTION");
    $lobj_Option.value = "0";
    $lobj_Option.text = "None";         
    document.getElementById('elemenmt_user_schema_group').options[0]=($lobj_Option);              
    for($i=0;$i < $responce.data[0].length;$i++)                                  
      {                                            
            var $obj_Option   = document.createElement("OPTION");
            $obj_Option.value = $responce.data[0][$i].internal_code;
            $obj_Option.text  = $responce.data[0][$i].user_schema_group;                                    
            document.getElementById('elemenmt_user_schema_group').options[$i+1] = ($obj_Option); 
		}   
        document.getElementById('user_schema_element_sequence').value= $responce.data[1];
	
		
 }  
 
function enableReferenceDivs()
{
 var selected_data_type=$("#user_schema_element_type option:selected").text();
if(selected_data_type=='Number')
{ 
document.getElementById('row_user_schema_element_ref_module').style.display='none';
document.getElementById('row_user_schema_element_decimal').style.display='';
document.getElementById('row_user_schema_element_lov').style.display='none';
document.getElementById('row_user_schema_linked_fild').style.display='none';
document.getElementById('row_user_schema_source_fild').style.display='none';
document.getElementById('row_auto_incremenet_source_field').style.display='none';
}
else if(selected_data_type=='Reference Data' || selected_data_type=='Multi Search')
{ 
document.getElementById('row_user_schema_element_ref_module').style.display='';
document.getElementById('row_user_schema_element_decimal').style.display='none';
document.getElementById('row_user_schema_element_lov').style.display='none';
document.getElementById('row_user_schema_linked_fild').style.display='none';
document.getElementById('row_user_schema_source_fild').style.display='none';
document.getElementById('row_auto_incremenet_source_field').style.display='none';
}
else if(selected_data_type=='List Of Values')
{ 
document.getElementById('row_user_schema_element_ref_module').style.display='none';
document.getElementById('row_user_schema_element_decimal').style.display='none';
document.getElementById('row_user_schema_linked_fild').style.display='none';
document.getElementById('row_user_schema_source_fild').style.display='none';
document.getElementById('row_auto_incremenet_source_field').style.display='none';
document.getElementById('row_user_schema_element_lov').style.display='';
}
else if(selected_data_type!='Multi Search' && selected_data_type!='Reference Data' && selected_data_type!='Number' && selected_data_type!='List Of Values'  && selected_data_type!='Number' && selected_data_type!='Ref Display' && selected_data_type!='Auto Increment' )
{

document.getElementById('row_user_schema_element_ref_module').style.display='none';
document.getElementById('row_user_schema_element_decimal').style.display='none';
document.getElementById('row_user_schema_element_lov').style.display='none';
document.getElementById('row_user_schema_linked_fild').style.display='none';
document.getElementById('row_auto_incremenet_source_field').style.display='none';
document.getElementById('row_user_schema_source_fild').style.display='none';
}
else if(selected_data_type=='Ref Display')
{ 
document.getElementById('row_user_schema_element_ref_module').style.display='none';
document.getElementById('row_user_schema_element_decimal').style.display='none';
document.getElementById('row_user_schema_element_lov').style.display='none';
document.getElementById('row_auto_incremenet_source_field').style.display='none';
document.getElementById('row_user_schema_linked_fild').style.display='';
document.getElementById('row_user_schema_source_fild').style.display='';
}
else if(selected_data_type=='Auto Increment')
{ 
document.getElementById('row_user_schema_element_ref_module').style.display='none';
document.getElementById('row_user_schema_element_decimal').style.display='none';
document.getElementById('row_user_schema_linked_fild').style.display='none';
document.getElementById('row_user_schema_source_fild').style.display='none';
document.getElementById('row_user_schema_element_lov').style.display='none';
document.getElementById('row_auto_incremenet_source_field').style.display='';
}
}
 

function displayLinkedFields()
{
if(document.getElementById('user_schema_element_type').options[document.getElementById('user_schema_element_type').selectedIndex].text=='Ref Display')
{
 $.ajax({
     type: "POST",
	 async: false,
	  url: $host_url+"getLinkedModules.demo",     
     
		data:'schema_code='+document.getElementById('elemenmt_user_schema').value,	   
       success:getLinkedModulesResponce
  });
}
}
function displayAutoIncrementSourceFields(selected_val)
{
if( $("#user_schema_element_type option:selected").text()=='Auto Increment')
{
 
 $.ajax({
     type: "POST",
	 async: false,
	  url: $host_url+"getAutoIncrementSourceFields.demo",       
	  data:'schema_code='+document.getElementById('elemenmt_user_schema').value,	   
       success:function getAutoIncrementSourceFieldsResponce($responce)
				 { 
					$responce = eval('(' + $responce + ')');           
					document.getElementById('auto_incremenet_source_field').options.length = 0;
							$op = new Option('Select One', '0');
						$op.id='0';
						document.getElementById('auto_incremenet_source_field').options.add($op);
					 for($i=0;$i < $responce.data.length;$i++)                                  
						{            
							$op = new Option($responce.data[$i]['value'], $responce.data[$i]['internal_code']);
							$op.id=$responce.data[$i]['internal_code'];//specifying the id  for options
							document.getElementById('auto_incremenet_source_field').options.add($op);
						}
						$("#auto_incremenet_source_field").val(selected_val);
				}	
  });
}
}

function getLinkedModulesResponce($responce)
 { 
	$responce = eval('(' + $responce + ')');           
    document.getElementById('user_schema_element_linked_fild').options.length = 0;
	$op = new Option('Select One', '0');
		$op.id='0';
		document.getElementById('user_schema_element_linked_fild').options.add($op);
	 for($i=0;$i < $responce.data.length;$i++)                                  
		{            
	    	$op = new Option($responce.data[$i]['value'], $responce.data[$i]['internal_code']);
			$op.id=$responce.data[$i]['internal_code'];//specifying the id  for options
			document.getElementById('user_schema_element_linked_fild').options.add($op);
		}
}	
function displaySourceFields()
{

 $.ajax({
     type: "POST",
	 async: false,
	  url: $host_url+"getSourceFields.demo",     
     
		data:'element_code='+document.getElementById('user_schema_element_linked_fild').value,	   
       success:getSourceFieldsResponce
  });

}

function getSourceFieldsResponce($responce)
 { 
	$responce = eval('(' + $responce + ')');           
    document.getElementById('user_schema_element_source_fild').options.length = 0;
	$op = new Option('Select One', '0');
		$op.id='0';
		document.getElementById('user_schema_element_source_fild').options.add($op);
	 for($i=0;$i < $responce.data.length;$i++)                                  
		{            
	    	$op = new Option($responce.data[$i]['value'], $responce.data[$i]['internal_code']);
			$op.id=$responce.data[$i]['internal_code'];//specifying the id  for options
			document.getElementById('user_schema_element_source_fild').options.add($op);
		}
}	
function saveuserschemagroupDetails()
{
	if (trim(document.getElementById('group_user_schema').value)=='0')
	{
		ShowAlertMsg('Please Select Schema Name');
		document.getElementById('group_user_schema').focus();
		return;
	}
	else if (trim(document.getElementById('group_user_schema_module_tabs').value)=='0')
	{
		ShowAlertMsg('Please Select Module tabs');
		document.getElementById('group_user_schema_module_tabs').focus();
		return;
	}
	else if (trim(document.getElementById('group_user_schema_module_columns').value)=='0')
	{
		ShowAlertMsg('Please Select Module Columns');
		document.getElementById('group_user_schema_module_columns').focus();
		return;
	}
	else if (trim(document.getElementById('user_schema_group_name').value)=='')
	{
		ShowAlertMsg('Please Enter Group Name');
		document.getElementById('user_schema_group_name').focus();
		return;
	}
	else if (trim(document.getElementById('user_schema_group_id').value)=='')
	{
		ShowAlertMsg('Please Enter Group Id');
		document.getElementById('user_schema_group_id').focus();
		return;
	}
	else if (trim(document.getElementById('system_group_table_name').value)=='')
	{
		ShowAlertMsg('Please Enter Group Table Name');
		document.getElementById('system_group_table_name').focus();
		return;
	}	
	else if (trim(document.getElementById('system_group_width').value)=='')
	{
		ShowAlertMsg('Please Select Group Width');
		document.getElementById('system_group_width').focus();
		return;
	}
	else if (trim(document.getElementById('system_group_field_type').value)=='')
	{
		ShowAlertMsg('Please Select Group Field Type');
		document.getElementById('system_group_field_type').focus();
		return;
	}
	else if (trim(document.getElementById('system_group_type').value)=='')
	{
		ShowAlertMsg('Please Select Group Type');
		document.getElementById('system_group_type').focus();
		return;
	}
	else if (trim(document.getElementById('tax_structure_type').value)=='')
	{
		ShowAlertMsg('Please Select Tax Structure Type');
		document.getElementById('tax_structure_type').focus();
		return;
	}
	 
	else if (!validnumber(trim(document.getElementById('user_schema_group_sequence').value)))
	{
		ShowAlertMsg('Please Enter Numbers for Sequence');
		document.getElementById('user_schema_group_sequence').focus();
		return;
	}
	else
	{   
		$is_multiple=0;
		if(document.getElementById('is_multiple_user_schema_group').checked==false)
		$is_multiple=0;
		else
		$is_multiple=1;
		
		$is_grid_edit=0;
		if(document.getElementById('is_grid_edit_user_schema_group').checked==false)
		$is_grid_edit=0;
		else
		$is_grid_edit=1;
		
		$is_grid_edit_inline=0;
		if(document.getElementById('is_grid_edit_inline').checked==false)
		$is_grid_edit_inline=0;
		else
		$is_grid_edit_inline=1; 
		
	/* 	$is_inline_div=0;
		if(document.getElementById('is_inline_div_user_schema_group').checked==false)
		$is_inline_div=0;
		else
		$is_inline_div=1;	 */
		
		$is_multi_select="";
		if(document.getElementById('is_multi_select_div_user_schema_group').checked==false)
		$is_multi_select="No";
		else
		$is_multi_select="Yes";
	
		$is_multi_search=0;
		if(document.getElementById('is_multi_user_schema_group_search').checked==false)
		$is_multi_search=0;
		else
		$is_multi_search=1;
		
		$is_empty_row=0;
		if(document.getElementById('is_empty_row_user_schema_group').checked==false)
		$is_empty_row=0;
		else
		$is_empty_row=1;
		
       $group_sequence=0;
       if(document.getElementById('user_schema_group_sequence').value=='')
       $group_sequence=0;
       else
        $group_sequence=document.getElementById('user_schema_group_sequence').value;
		$lstr_query_string="internal_code="+$geditinternalcode;
		$lstr_query_string+="&group_user_schema="+document.getElementById('group_user_schema').value+"&user_schema_group_name="+encodeURIComponent(trim(document.getElementById('user_schema_group_name').value));
		$lstr_query_string+="&is_multiple_user_schema_group="+$is_multiple+"&sequence="+$group_sequence;
		$lstr_query_string+="&is_grid_edit_user_schema_group="+$is_grid_edit;
		$lstr_query_string+="&is_grid_edit_inline="+$is_grid_edit_inline;
		// $lstr_query_string+="&is_inline_div_user_schema_group="+$is_inline_div;
		$lstr_query_string+="&is_multi_select_div_user_schema_group="+$is_multi_select;
		$lstr_query_string+="&is_multi_user_schema_group_search="+$is_multi_search;
		$lstr_query_string+="&is_empty_row="+$is_empty_row;
		$lstr_query_string+="&user_schema_parent_group="+document.getElementById('user_schema_parent_group').value;
        $lstr_query_string+="&add_row_exit_field="+encodeURIComponent(trim(document.getElementById('add_row_exit_field').value));
		$lstr_query_string+="&user_schema_group_min_rows="+encodeURIComponent(trim(document.getElementById('user_schema_group_min_rows').value));
		$lstr_query_string+="&user_schema_group_max_rows="+encodeURIComponent(trim(document.getElementById('user_schema_group_max_rows').value));
		$lstr_query_string+="&user_schema_coloum_names="+encodeURIComponent(trim(document.getElementById('user_schema_coloum_names').value));
		$lstr_query_string+="&user_schema_coloum_models="+encodeURIComponent(trim(document.getElementById('user_schema_coloum_models').value));
		$lstr_query_string+="&user_schema_grid_query="+encodeURIComponent(trim(document.getElementById('user_schema_grid_query').value));
		$lstr_query_string+="&user_schema_group_custom_links="+encodeURIComponent(trim(document.getElementById('user_schema_group_custom_links').value));
		$lstr_query_string+="&user_schema_group_onclick="+encodeURIComponent(trim(document.getElementById('user_schema_group_onclick').value));
		$lstr_query_string+="&system_group_table_name="+encodeURIComponent(trim(document.getElementById('system_group_table_name').value));
		$lstr_query_string+="&grid_shrink_to_fit="+encodeURIComponent(trim(document.getElementById('grid_shrink_to_fit').value));
		$lstr_query_string+="&group_user_schema_module_tabs="+encodeURIComponent(trim(document.getElementById('group_user_schema_module_tabs').value));
		$lstr_query_string+="&group_user_schema_module_columns="+encodeURIComponent(trim(document.getElementById('group_user_schema_module_columns').value));
		$lstr_query_string+="&user_schema_group_id="+encodeURIComponent(trim(document.getElementById('user_schema_group_id').value));
		$lstr_query_string+="&system_group_width="+encodeURIComponent(trim(document.getElementById('system_group_width').value));
		$lstr_query_string+="&system_group_field_type="+encodeURIComponent(trim(document.getElementById('system_group_field_type').value));
		$lstr_query_string+="&system_group_type="+encodeURIComponent(trim(document.getElementById('system_group_type').value));
		$lstr_query_string+="&system_group_color="+encodeURIComponent(trim(document.getElementById('system_group_color').value));
		$lstr_query_string+="&system_group_label_width="+encodeURIComponent(trim(document.getElementById('system_group_label_width').value));
		$lstr_query_string+="&system_group_icon="+encodeURIComponent(trim(document.getElementById('system_group_icon').value));
		$lstr_query_string+="&user_schema_group_pre_edit="+encodeURIComponent(trim(document.getElementById('user_schema_group_pre_edit').value));
		$lstr_query_string+="&user_schema_group_height="+encodeURIComponent(trim(document.getElementById('user_schema_group_height').value));
		$lstr_query_string+="&grid_footer="+encodeURIComponent(trim(document.getElementById('grid_footer').value));
		$lstr_query_string+="&tax_structure_type="+encodeURIComponent(trim(document.getElementById('tax_structure_type').value));
		$lstr_query_string+="&inline_jqgrid_type="+encodeURIComponent(trim(document.getElementById('inline_jqgrid_type').value));
		
		$.ajax
		({
	       type: "POST",
		    url: $host_url+"madduserschemagroup.demo",
	       data:$lstr_query_string,
	       success: saveuserschemagroupResponce
	  });                                
	} 
}

function saveuserschemagroupResponce($responce)
{
	$responce = eval('(' + $responce + ')');    
    if ($responce.error_code == 0) 
    {                                               
		ShowSuccessMsg($responce.data);        
		clear_userschema_group_fields();
         document.getElementById('group_user_schema').focus();    
    }
    else
    {   
		ShowAlertMsg('Insertion unsuccessfull!!');     
		document.getElementById('group_user_schema').focus();       
    }
    return; 
 }
 function saveuserschemaelementDetails()
{
$ref_module_code=0;
 var selected_data_type=$("#user_schema_element_type option:selected").text();
	if (trim(document.getElementById('elemenmt_user_schema').value)=='0')
	{
		ShowAlertMsg('Please Select Schema Name');
		document.getElementById('elemenmt_user_schema').focus();
		return;
	}
	else if (trim(document.getElementById('user_schema_element_type').value)=='0')
	{
		ShowAlertMsg('Please Select Data Type');
		document.getElementById('user_schema_element_type').focus();
		return;
	}
	else if (trim(document.getElementById('user_schema_system_name').value)=='')
	{
		ShowAlertMsg('Please Enter System Name');
		document.getElementById('user_schema_system_name').focus();
		return;
	}	
	else if (trim(document.getElementById('user_schema_element_type').value)=='0')
	{
		ShowAlertMsg('Please Select Data Type');
		document.getElementById('user_schema_element_type').focus();
		return;
	}
	else if (trim(document.getElementById('elemenmt_user_schema_group').value)=='0')
	{
		ShowAlertMsg('Please Select Schema Group');
		document.getElementById('elemenmt_user_schema_group').focus();
		return;
	}
	else if (!validnumber(trim(document.getElementById('user_schema_element_sequence').value)))
	{
		ShowAlertMsg('Please Enter Numbers for Sequence');
		document.getElementById('user_schema_element_sequence').focus();
		return;
	}
	else if (trim(document.getElementById('user_schema_element_field_position').value)=='0')
	{
		ShowAlertMsg('Please Select Field Position');
		document.getElementById('user_schema_element_field_position').focus();
		return;
	}
	 else if(document.getElementById('user_schema_element_meta_type').options[document.getElementById('user_schema_element_meta_type').selectedIndex].text=='Meta' && document.getElementById('user_schema_element_type').options[document.getElementById('user_schema_element_type').selectedIndex].text=='Ref Display'  )
	{
		ShowAlertMsg('Please Select Element Type as User Since you have selected Ref Display');
		document.getElementById('user_schema_element_meta_type').focus();
		return;
	}
	else if(document.getElementById('user_schema_element_meta_type').options[document.getElementById('user_schema_element_meta_type').selectedIndex].text=='User' && document.getElementById('user_schema_element_type').options[document.getElementById('user_schema_element_type').selectedIndex].text=='Auto Increment'  )
	{
		ShowAlertMsg('Please Select Element Type as Meta Since you have selected Auto Increment');
		document.getElementById('user_schema_element_meta_type').focus();
		return;
	}
 	else if(document.getElementById('user_schema_element_meta_type').options[document.getElementById('user_schema_element_meta_type').selectedIndex].text=='User' && (document.getElementById('is_user_schema_element_unique_only').checked==true))
	{
		ShowAlertMsg('Is Unique is not applicable for Element Type User');
		document.getElementById('is_user_schema_element_unique_only').focus();
		return;
	} 
	else if((selected_data_type=='Reference Data' || selected_data_type=='Multi Search') && (document.getElementById('user_schema_element_ref_module').value=='0'))
	{
		ShowAlertMsg('Please Select Reference Module');
		document.getElementById('user_schema_element_ref_module').focus();
		return;
	}
 	else if(document.getElementById('user_schema_element_meta_type').options[document.getElementById('user_schema_element_meta_type').selectedIndex].text=='User' && document.getElementById('include_in_pop_up').checked==true  )
	{
		ShowAlertMsg('Please Select Element Type as Meta Since you have checked Include in Pop Up');
		document.getElementById('user_schema_element_meta_type').focus();
		return;
	} 	
	else
	{
		var ref_module_code=0;
		var ref_module_code_ref_field=0;
		var ref_module_code_ref_field_on=0;
		var ref_module_code_ref_field_const='';
		
		if(selected_data_type=='Reference Data' || selected_data_type=='Multi Search')
		{
			ref_module_code=trim(document.getElementById('user_schema_element_ref_module').value);
			ref_module_code_ref_field=trim(document.getElementById('user_schema_element_ref_module_field').value);
			ref_module_code_ref_field_on=trim(document.getElementById('user_schema_element_ref_module_ref_field_on').value);
			ref_module_code_ref_field_const=trim(document.getElementById('user_schema_element_ref_module_const_value').value);
		}
		 
		$decimal=trim(document.getElementById('user_schema_element_decimal').value);
		if(	$decimal=='')
			$decimal=0;
			
		$range_from=trim(document.getElementById('user_schema_element_range_from').value);
		if(	$range_from=='')
			$range_from=0;
		
		$range_to=trim(document.getElementById('user_schema_element_range_to').value);
		if($range_to=='')
			$range_to=0;
			
	    $is_optional=0;
		if(document.getElementById('is_user_schema_element_optional').checked==false)
		$is_optional=0;
		else
		$is_optional=1;
		
		$is_visible=0;
		if(document.getElementById('is_user_schema_element_is_visible').checked==false)
		$is_visible=0;
		else
		$is_visible=1;
		
		$is_read_only=0;
		if(document.getElementById('is_user_schema_element_read_only').checked==false)
		$is_read_only=0;
		else
		$is_read_only=1;
		
		$is_unique=0;
		if(document.getElementById('is_user_schema_element_unique_only').checked==false)
		$is_unique=0;
		else
		$is_unique=1;
		
		$is_lov=0;
		if(document.getElementById('is_lov_check').checked==false)
		$is_lov=0;
		else
		$is_lov=1;
		
		$is_populate_lov=0;
		if(document.getElementById('is_populate_lov_check').checked==false)
		$is_populate_lov=0;
		else
		$is_populate_lov=1;
		
		var is_quick_view=0;
		if(document.getElementById('is_user_schema_element_quick_view').checked==false)
		is_quick_view=0;
		else
		is_quick_view=1;
		
		is_bold=0;
		if(document.getElementById('is_user_schema_element_bold_only').checked==false)
		is_bold=0;
		else
		is_bold=1;
		
		add_in_popup=0;
		if(document.getElementById('is_user_schema_element_add_in_popup').checked==false)
		add_in_popup=0;
		else
		add_in_popup=1;
		
		
		is_grid_foot_tot=0;
		if(document.getElementById('is_grid_foot_tot').checked==false)
		is_grid_foot_tot=0;
		else
		is_grid_foot_tot=1;
		
		is_compare=0;
		if(document.getElementById('is_compare').checked==false)
		is_compare=0;
		else
		is_compare=1;
			
		//alert(is_bold);
		
		var include_in_grid=0,is_key_field=0;
		
		if(document.getElementById('is_user_schema_element_ingrid').checked) include_in_grid=1;
		if(document.getElementById('is_user_schema_element_key_field').checked) is_key_field=1;
		
		$field_position= $("#user_schema_element_field_position option:selected").text();
	
		
		if(document.getElementById('user_schema_element_sequence').value=='')
		$Sequence=0;
		 else
		 $Sequence=document.getElementById('user_schema_element_sequence').value;
		 $linked_field='0';
		 $source_fields='0';
		 if(document.getElementById('user_schema_element_type').options[document.getElementById('user_schema_element_type').selectedIndex].text=='List Of Values')
		 $lov=encodeURIComponent(trim(document.getElementById('user_schema_element_lov').value)) ; else $lov='';
		 if(document.getElementById('user_schema_element_type').options[document.getElementById('user_schema_element_type').selectedIndex].text=='Ref Display')
		 {
		 $linked_field=encodeURIComponent(trim(document.getElementById('user_schema_element_linked_fild').value)) ; 
		 $source_fields=encodeURIComponent(trim(document.getElementById('user_schema_element_source_fild').value)) ; 
		 } 
		 if(document.getElementById('user_schema_element_type').options[document.getElementById('user_schema_element_type').selectedIndex].text=='Auto Increment')
		 {
		 $linked_field=0;
		 $source_fields=(document.getElementById('auto_incremenet_source_field').value) ; 
		 }
			if(document.getElementById('include_in_pop_up').checked==false)
			$include_in_pop_up=0;
			else
			$include_in_pop_up=1; 
	
		  
	$lstr_query_string="internal_code="+$geditinternalcode;
	$lstr_query_string+="&elemenmt_user_schema="+trim(document.getElementById('elemenmt_user_schema').value)+"&user_schema_element_name="+encodeURIComponent(trim(document.getElementById('user_schema_element_name').value));
	$lstr_query_string+="&user_schema_element_type="+trim(document.getElementById('user_schema_element_type').value)+"&user_schema_element_sequence="+($Sequence);	
	$lstr_query_string+="&user_schema_system_name="+trim(document.getElementById('user_schema_system_name').value);	
	$lstr_query_string+="&user_schema_element_field_position="+$field_position;
	$lstr_query_string+="&elemenmt_user_schema_group="+trim(document.getElementById('elemenmt_user_schema_group').value)+"&user_schema_element_description="+encodeURIComponent(trim(document.getElementById('user_schema_element_description').value));
	$lstr_query_string+="&user_schema_element_default_value="+encodeURIComponent(trim(document.getElementById('user_schema_element_default_value').value));
	$lstr_query_string+="&is_user_schema_element_optional="+$is_optional;
	$lstr_query_string+="&include_in_pop_up="+$include_in_pop_up;
	$lstr_query_string+="&include_in_grid="+include_in_grid;
	$lstr_query_string+="&is_quick_view="+is_quick_view;
	$lstr_query_string+="&is_bold="+is_bold;
	$lstr_query_string+="&add_in_popup="+add_in_popup;
	$lstr_query_string+="&is_grid_foot_tot="+is_grid_foot_tot;
	$lstr_query_string+="&is_compare="+is_compare;
	$lstr_query_string+="&is_key_field="+is_key_field;
	$lstr_query_string+="&decimal="+$decimal;
	$lstr_query_string+="&range_from="+$range_from;
	$lstr_query_string+="&range_to="+$range_to;
	$lstr_query_string+="&is_unique="+$is_unique;
	$lstr_query_string+="&is_visible="+$is_visible;
	$lstr_query_string+="&is_lov="+$is_lov;
	$lstr_query_string+="&is_populate_lov="+$is_populate_lov;
	$lstr_query_string+="&lov="+$lov+"&is_read_only="+$is_read_only;
	$lstr_query_string+="&meta_type="+document.getElementById('user_schema_element_meta_type').value;
	$lstr_query_string+="&ref_module_code="+ref_module_code;
	$lstr_query_string+="&ref_module_code_ref_field="+ref_module_code_ref_field;
	$lstr_query_string+="&ref_module_code_ref_field_on="+ref_module_code_ref_field_on;
	$lstr_query_string+="&ref_module_code_ref_field_const="+ref_module_code_ref_field_const;
	$lstr_query_string+="&linked_field="+$linked_field+"&source_fields="+$source_fields;
	$lstr_query_string+="&suffix="+encodeURIComponent(trim(document.getElementById('user_schema_element_suffix').value));
	$lstr_query_string+="&width="+encodeURIComponent(trim(document.getElementById('user_schema_element_length').value));
	$lstr_query_string+="&padding="+encodeURIComponent(trim(document.getElementById('user_schema_element_padding').value));
	$lstr_query_string+="&on_enter="+encodeURIComponent(trim(document.getElementById('user_schema_element_on_enter').value));
	$lstr_query_string+="&on_exit="+encodeURIComponent(trim(document.getElementById('user_schema_element_on_exit').value));
	$lstr_query_string+="&user_schema_element_conditional_display="+encodeURIComponent(trim(document.getElementById('user_schema_element_conditional_display').value));
	$lstr_query_string+="&user_schema_element_grid_width="+encodeURIComponent(trim(document.getElementById('user_schema_element_grid_width').value));
	$lstr_query_string+="&user_schema_element_text_area_rows="+encodeURIComponent(trim(document.getElementById('user_schema_element_text_area_rows').value));
	$lstr_query_string+="&user_schema_label_css="+encodeURIComponent(trim(document.getElementById('user_schema_label_css').value));
	$lstr_query_string+="&user_schema_field_css="+encodeURIComponent(trim(document.getElementById('user_schema_field_css').value));
	$lstr_query_string+="&user_schema_element_group_total="+encodeURIComponent(trim(document.getElementById('user_schema_element_group_total').value));
	$lstr_query_string+="&element_user_schema_sub_group="+encodeURIComponent(trim(document.getElementById('element_user_schema_sub_group').value));
	$lstr_query_string+="&user_schema_element_accept_negative="+encodeURIComponent(trim(document.getElementById('user_schema_element_accept_negative').value));
	$.ajax
	({
	       type: "POST",
		    url: $host_url+"forInsertuserschemaelement.demo",
	         data:$lstr_query_string,
	       success: saveuserschemaelementsResponce
	  });
	}
 }
 function GetUserSchemaElementsRefModuleFilterDetails()
 {
	var lstr_query_string='';
	lstr_query_string="schema_id="+$("#elemenmt_user_schema").val();
	lstr_query_string+="&ref_module_code="+$("#user_schema_element_ref_module").val();
	$.ajax
	({
	       type: "POST",
		   async:false,
		    url: $host_url+"GetUserSchemaElementsRefModuleFilterDetails.demo",
	         data:lstr_query_string,
	       success: GetUserSchemaElementsRefModuleFilterDetailsResponce
	  });
 }
function GetUserSchemaElementsRefModuleFilterDetailsResponce($responce)
{
	$responce = eval('(' + $responce + ')');  
	document.getElementById('user_schema_element_ref_module_field').options.length=0;
	document.getElementById('user_schema_element_ref_module_ref_field_on').options.length=0;
	$op = new Option('Select One', '0');
	$op.id='0';
	$op1 = new Option('Select One', '0');
	$op1.id='0';
	document.getElementById('user_schema_element_ref_module_field').options.add($op);
	document.getElementById('user_schema_element_ref_module_ref_field_on').options.add($op1);
	for($i=0;$i < $responce.data['ref_module_fields'].length;$i++)                                  
	{             
		$op = new Option($responce.data['ref_module_fields'][$i]['name'], $responce.data['ref_module_fields'][$i]['internal_code']);
									$op.id=$responce.data['ref_module_fields'][$i]['internal_code'];//specifying the id  for options
									document.getElementById('user_schema_element_ref_module_field').options.add($op);

	}      
	for($i=0;$i < $responce.data['schema_fields'].length;$i++)                                  
    {               
		$op1 = new Option($responce.data['schema_fields'][$i]['name'], $responce.data['schema_fields'][$i]['internal_code']);
									$op1.id=$responce.data['schema_fields'][$i]['internal_code'];//specifying the id  for options
									document.getElementById('user_schema_element_ref_module_ref_field_on').options.add($op1);

	} 	
 }
function saveuserschemaelementsResponce($responce)
{
	$responce = eval('(' + $responce + ')');    
	clear_userschema_element_fields();
    if ($responce.error_code == 0) 
    {                                               
		ShowSuccessMsg($responce.data[0]);        
		clear_userschema_element_fields();
		document.getElementById('elemenmt_user_schema').focus();  
		document.getElementById('user_schema_system_name').value='';  		   
		document.getElementById('user_schema_element_sequence').value=  $responce.data[1] ; 		   
    }
    else
    {   
			ShowAlertMsg($responce.data[0]);         
        document.getElementById('elemenmt_user_schema').focus();  
    
    }
    return; 
 }
function getGeneralMasterDetails($id)
		{
		      
			    $.ajax({
				type: "POST",
				url: $host_url+"GetSchemaDetailsForUpdate.demo",
				data:"internal_code="+$id,
				success: function populateModuleDetalis($responce)
		{
			$responce = eval('(' + $responce + ')');
			if ($responce.error_code == 0)                                
			{
				$geditinternalcode=$responce.data.internal_code;
				document.getElementById('module_name').value = $responce.data.module_name;
				document.getElementById('user_schema_display_module_name').value = $responce.data.display_module_name;
				document.getElementById('system_module_table_name').value = $responce.data.system_module_table_name;
				document.getElementById('module_type').value = $responce.data.module_type;
				// document.getElementById('framework_type').value = $responce.data.framework_type;
				document.getElementById('module_menu_name').value = $responce.data.main_menu;
				document.getElementById('tax_structure_exists').value = $responce.data.tax_structure_exists;							
				document.getElementById('approval_exists').value = $responce.data.approval_exists;							
				document.getElementById('include_grid_color').value = $responce.data.include_grid_color;							
				document.getElementById('user_schema_custom_links').value = $responce.data.custom_links;				
				document.getElementById('module_grid_type').value = $responce.data.grid_type;	
				document.getElementById('grid_user_schema_coloum_names').value = $responce.data.s_col_names;				
				document.getElementById('grid_user_schema_coloum_models').value = $responce.data.s_col_model;				
				document.getElementById('grid_user_schema_grid_query').value = $responce.data.s_grid_query;								
				document.getElementById('grid_custom_links').value = $responce.data.s_grid_custom_links;
				document.getElementById('module_onload').value = $responce.data.s_module_onload;
				document.getElementById('module_after_edit').value = $responce.data.s_module_after_edit;
				document.getElementById('module_pre_save').value = $responce.data.s_module_pre_save;
				document.getElementById('user_schema_js_path').value = $responce.data.js_path;
				document.getElementById('user_schema_grid_default_rows').value = $responce.data.grid_default_rows;				
				document.getElementById('user_schema_fa_icon').value = $responce.data.fa_icon;				
				document.getElementById('default_view').value = $responce.data.default_view;				
				document.getElementById('grid_shrink_to_fit').value = $responce.data.shrink_to_fit;				
				// document.getElementById('user_schema_logo_path').value = $responce.data.logo_path;				
				
				if($responce.data.active==1)
				{
				 document.getElementById('is_module_active').checked =true;
				}
				else
				document.getElementById('is_module_active').checked =false;
				
				if($responce.data.is_analytical==1)
				{
				 document.getElementById('is_analytical').checked =true;
				}
				else
				document.getElementById('is_analytical').checked =false;
				
				if($responce.data.is_generate_html==1)
				{
				 document.getElementById('is_generate_html').checked =true;
				}
				else
				document.getElementById('is_generate_html').checked =false;
				
				if($responce.data.grid_tot_footer==1)
				{
				 document.getElementById('grid_tot_footer').checked =true;
				}
				else
				document.getElementById('grid_tot_footer').checked =false;
				
				if($responce.data.is_menu_only==1)
				{
				 document.getElementById('is_menu_only').checked =true;
				 document.getElementById('module_function_name').value =$responce.data.menu_function;
				}
				else
				{
				 document.getElementById('is_menu_only').checked =false;
				 document.getElementById('module_function_name').value='';
				 }
				
                if($responce.data.create_table==1)
				document.getElementById('create_table').checked=true;
				else 
				document.getElementById('create_table').checked=false;					
				 
				 
			    if($responce.data.include_save==1)
				document.getElementById('is_user_schema_save').checked=true;
				else 
				document.getElementById('is_user_schema_save').checked=false;
				
				
				if($responce.data.is_include_mb_in_grid==1)
				document.getElementById('is_include_mb_in_grid').checked=true;
				else 
				document.getElementById('is_include_mb_in_grid').checked=false;
				
				if($responce.data.is_include_cb_in_grid==1)
				document.getElementById('is_include_cb_in_grid').checked=true;
				else 
				document.getElementById('is_include_cb_in_grid').checked=false;
				
				
			    if($responce.data.include_clear==1)
				document.getElementById('is_user_schema_clear').checked=true;
				else 
				document.getElementById('is_user_schema_clear').checked=false;
				
			    if($responce.data.include_download==1)
				document.getElementById('is_user_schema_download').checked=true;
				else 
				document.getElementById('is_user_schema_download').checked=false;
				
			    if($responce.data.include_view==1)
				document.getElementById('is_user_schema_view').checked=true;
				else 
				document.getElementById('is_user_schema_view').checked=false;
				
			    if($responce.data.include_generate==1)
				document.getElementById('is_user_schema_generate').checked=true;
				else 
				document.getElementById('is_user_schema_generate').checked=false;	
				
			 }
		 }
		
			});
		
		}
	
		// To display General Master set up details based on the search string
	
		
	
			function getUserSchemaElementDetails($id)
		   {		
		 
			sleep(1150);
				$.ajax({
				type: "POST",
			
				url: $host_url+"mGetUserSchemaElementDetailsForUpdate.demo",
				data:"internal_code="+$id,
				success: populateUserSchemaElementDetalis
			});
		}

	function populateUserSchemaElementDetalis($responce)
	{
		$responce = eval('(' + $responce + ')');
		//console.log($responce );
		
		if ($responce.error_code == 0)
		{
		
		 
			$geditinternalcode=$responce.data.internal_code;
			 populate_group_for_element($responce.data.ref_s_user_schema_code);
			document.getElementById('elemenmt_user_schema').value = $responce.data.ref_s_user_schema_code;
			//to populate  automatic Html values from User schema group
			 $ref_s_ref_modules_code_for_pop="elemenmt_user_schema="+$responce.data.ref_s_user_schema_code;
			
			/* $.ajax({
				type: "POST",
				async: false,
				url: $host_url+"mcombouserschemagroup.demo",
				data:$ref_s_ref_modules_code_for_pop,	   
				success: populate_user_schema_element_group_combo
				}); */
			
			document.getElementById('user_schema_element_name').value = $responce.data.name;
			document.getElementById('user_schema_element_type').value = $responce.data.data_type;
			document.getElementById('user_schema_system_name').value = $responce.data.system_name;
			document.getElementById('user_schema_element_sequence').value = $responce.data.sequence;
			document.getElementById('user_schema_element_field_position').value = $responce.data.field_position;
			//enableReferenceDivs();
			document.getElementById('elemenmt_user_schema_group').value = $responce.data.ref_s_user_schema_group_code;
			document.getElementById('user_schema_element_ref_module').value = $responce.data.ref_module_code;
			document.getElementById('user_schema_element_decimal').value = $responce.data.decimals;
			document.getElementById('user_schema_element_range_from').value = $responce.data.number_range_from;
			document.getElementById('user_schema_element_accept_negative').value = $responce.data.accept_negative_number;
			document.getElementById('user_schema_element_range_to').value = $responce.data.number_range_to;
			document.getElementById('user_schema_element_description').value = $responce.data.description;
			document.getElementById('user_schema_element_meta_type').value = $responce.data.s_ref_type_meta;
			document.getElementById('user_schema_element_lov').value = $responce.data.list_of_values;
			document.getElementById('user_schema_element_default_value').value = $responce.data.default_value;
			document.getElementById('user_schema_element_suffix').value = $responce.data.suffix;
			document.getElementById('user_schema_element_length').value = $responce.data.width;
			document.getElementById('user_schema_element_padding').value = $responce.data.padding;
			document.getElementById('user_schema_element_on_enter').value = $responce.data.on_enter;
			document.getElementById('user_schema_element_on_exit').value = $responce.data.on_exit;
		    document.getElementById('user_schema_element_conditional_display').value = $responce.data.conditional_display;	
		    document.getElementById('user_schema_element_grid_width').value = $responce.data.grid_width;	
		    document.getElementById('user_schema_element_text_area_rows').value = $responce.data.text_area_rows;	
		    document.getElementById('user_schema_label_css').value = $responce.data.label_css;	
		    document.getElementById('user_schema_field_css').value = $responce.data.field_css;	
		    document.getElementById('user_schema_element_group_total').value = $responce.data.group_total;	
		    	GetSubGroupDetailsForModule();
			
			if(document.getElementById('user_schema_element_type').options[document.getElementById('user_schema_element_type').selectedIndex].text=='Ref Display')			
				{
				 $.ajax({
				     type: "POST",
					 async: false,
					  url: $host_url+"getLinkedModules.demo",     
				     data:'schema_code='+document.getElementById('elemenmt_user_schema').value,	   
				       success:getLinkedModulesResponce
				  });
				  sleep(40);
				}
					if(document.getElementById('user_schema_element_type').options[document.getElementById('user_schema_element_type').selectedIndex].text=='Reference Data')
					{
					GetUserSchemaElementsRefModuleFilterDetails();
					sleep(40);
					document.getElementById('user_schema_element_ref_module_field').value = $responce.data.ref_module_code_ref_field;
					document.getElementById('user_schema_element_ref_module_ref_field_on').value = $responce.data.ref_module_code_ref_field_on;
					document.getElementById('user_schema_element_ref_module_const_value').value = $responce.data.ref_module_code_ref_field_const;
					}
			document.getElementById('user_schema_element_linked_fild').value = $responce.data.linked_field;
			document.getElementById('user_schema_element_source_fild').value = $responce.data.source_field;
			if($responce.data.optional==1)
				document.getElementById('is_user_schema_element_optional').checked=true;
				else 
				document.getElementById('is_user_schema_element_optional').checked=false;
				
				if($responce.data.is_ref_module_code_lov==1)
				document.getElementById('is_lov_check').checked=true;
				else 
				document.getElementById('is_lov_check').checked=false;
				
				if($responce.data.populate_lov==1)
				document.getElementById('is_populate_lov_check').checked=true;
				else 
				document.getElementById('is_populate_lov_check').checked=false;
				
				if($responce.data.is_visible==1)
				document.getElementById('is_user_schema_element_is_visible').checked=true;
				else 
				document.getElementById('is_user_schema_element_is_visible').checked=false;
				 
				if($responce.data.is_read_only==1)
				document.getElementById('is_user_schema_element_read_only').checked=true;
				else 
				document.getElementById('is_user_schema_element_read_only').checked=false;				
				
				if($responce.data.is_unique==1)
				document.getElementById('is_user_schema_element_unique_only').checked=true;
				else 
				document.getElementById('is_user_schema_element_unique_only').checked=false;
				  	if($responce.data.include_in_popup==1)
				document.getElementById('include_in_pop_up').checked=true;
				else 
				document.getElementById('include_in_pop_up').checked=false;
				if($responce.data.include_in_grid==1)
				document.getElementById('is_user_schema_element_ingrid').checked=true;
				else
				document.getElementById('is_user_schema_element_ingrid').checked=false;	
				if($responce.data.quick_view==1)
				document.getElementById('is_user_schema_element_quick_view').checked=true;
				else
				document.getElementById('is_user_schema_element_quick_view').checked=false;
				if($responce.data.is_key_field==1)
				document.getElementById('is_user_schema_element_key_field').checked=true;
				else
				document.getElementById('is_user_schema_element_key_field').checked=false;
				
				if($responce.data.is_bold==1)
				document.getElementById('is_user_schema_element_bold_only').checked=true;
				else 
				document.getElementById('is_user_schema_element_bold_only').checked=false;
				
				if($responce.data.add_in_popup==1)
				document.getElementById('is_user_schema_element_add_in_popup').checked=true;
				else 
				document.getElementById('is_user_schema_element_add_in_popup').checked=false;
				
				if($responce.data.is_grid_foot_tot==1)
				document.getElementById('is_grid_foot_tot').checked=true;
				else 
				document.getElementById('is_grid_foot_tot').checked=false;
				
				if($responce.data.is_compare==1)
				document.getElementById('is_compare').checked=true;
				else 
				document.getElementById('is_compare').checked=false;
				
				var selected_val=$responce.data.source_field;
			    enableReferenceDivs();displayLinkedFields();displayAutoIncrementSourceFields(selected_val);	
		}
	}
	
	 

	function populateUserSchemaGroupDetalis($responce)
	{
		$responce = eval('(' + $responce + ')');
		if ($responce.error_code == 0)
		{
			$geditinternalcode=$responce.data.internal_code;
		 
			document.getElementById('group_user_schema').value = $responce.data.ref_s_user_schema_code;
			document.getElementById('user_schema_group_name').value = $responce.data.name;
			document.getElementById('system_group_table_name').value = $responce.data.system_group_table_name;
			getUserSchemaParentGroupNames();
			document.getElementById('user_schema_parent_group').value = $responce.data.parent_group_code;
			document.getElementById('user_schema_group_custom_links').value = $responce.data.custom_links;
			document.getElementById('user_schema_group_sequence').value = $responce.data.sequence;		
			document.getElementById('user_schema_group_onclick').value = $responce.data.on_click_event;		
			document.getElementById('add_row_exit_field').value = $responce.data.add_row_exit_field;	
			document.getElementById('user_schema_group_min_rows').value = $responce.data.group_min_rows;	
			document.getElementById('user_schema_group_max_rows').value = $responce.data.group_max_rows;	
			document.getElementById('user_schema_group_id').value = $responce.data.group_id;	
			document.getElementById('system_group_width').value = $responce.data.width;	
			document.getElementById('system_group_field_type').value = $responce.data.field_type;	
			document.getElementById('system_group_type').value = $responce.data.group_type;	
			document.getElementById('system_group_color').value = $responce.data.group_color;	
			document.getElementById('system_group_icon').value = $responce.data.group_icon;	
			document.getElementById('system_group_label_width').value = $responce.data.label_width;	
			document.getElementById('user_schema_group_pre_edit').value = $responce.data.group_pre_edit;	
			document.getElementById('user_schema_group_height').value = $responce.data.group_height;	
			document.getElementById('grid_footer').value = $responce.data.group_footer;	
			document.getElementById('tax_structure_type').value = $responce.data.tax_structure_type;	
			document.getElementById('inline_jqgrid_type').value = $responce.data.inline_jqgrid_type;	
			
			
			
			$('#group_user_schema_module_columns').html($responce.data.col_html);	
			if($responce.data.multiple==1)
				document.getElementById('is_multiple_user_schema_group').checked=true;
				else 
				document.getElementById('is_multiple_user_schema_group').checked=false;
			
			if($responce.data.is_empty_row==1)
				document.getElementById('is_empty_row_user_schema_group').checked=true;
				else 
				document.getElementById('is_empty_row_user_schema_group').checked=false;
				
			  if($responce.data.is_grid_search==1)
				document.getElementById('is_multi_user_schema_group_search').checked=true;
				else 
				document.getElementById('is_multi_user_schema_group_search').checked=false;
				
			   /*  if($responce.data.inline_div==1)
				document.getElementById('is_inline_div_user_schema_group').checked=true;
				else 
				document.getElementById('is_inline_div_user_schema_group').checked=false; */
				
			if($responce.data.is_multi_select=='Yes')
				document.getElementById('is_multi_select_div_user_schema_group').checked=true;
				else 
				document.getElementById('is_multi_select_div_user_schema_group').checked=false;	
				
			if($responce.data.is_grid_edit_inline==1)	
			{ 
			  document.getElementById('is_grid_edit_inline').checked=true;
			}
			else
			{
			  document.getElementById('is_grid_edit_inline').checked=false;
			}	
		    if($responce.data.is_grid_edit==1)	
			{
			  document.getElementById('is_grid_edit_user_schema_group').checked=true;
			  document.getElementById('user_schema_coloum_names').value = $responce.data.col_name;		
		      document.getElementById('user_schema_coloum_models').value = $responce.data.col_model;		
		      document.getElementById('user_schema_grid_query').value = $responce.data.grid_edit_query;
			 } 
			 else 
			  document.getElementById('is_grid_edit_user_schema_group').checked=false;
			
				
		}
	}

	
		

function clear_generalmaster_fields()
{ $geditinternalcode=0
  document.getElementById('module_name').value= '';
  document.getElementById('module_name').focus();  
 }       
function clear_userschema_group_fields()
{
			$geditinternalcode=0
			document.getElementById('group_user_schema').value = '';               
			document.getElementById('user_schema_group_name').value = ''; 
			document.getElementById('user_schema_group_sequence').value = ''; 
			document.getElementById('is_multiple_user_schema_group').checked = false; 
			document.getElementById('is_multi_user_schema_group_search').checked = false; 
 }   
 function clear_userschema_element_fields()
 {
			$geditinternalcode=0
			document.getElementById('elemenmt_user_schema').value = '';               
			 document.getElementById('user_schema_element_type').value = ''; 
			document.getElementById('user_schema_element_sequence').value = ''; 
			document.getElementById('elemenmt_user_schema_group').value = ''; 
			document.getElementById('user_schema_element_description').value = ''; 
			document.getElementById('user_schema_element_default_value').value = ''; 
			document.getElementById('is_user_schema_element_is_visible').checked = true; 
			document.getElementById('is_user_schema_element_optional').checked = true; 
			document.getElementById('is_user_schema_element_read_only').checked = false; 
			document.getElementById('is_user_schema_element_unique_only').checked = false; 
            document.getElementById('elemenmt_user_schema').focus();          
 }

 // System Main menu Sub Item menu function 
function populateAllGridGroupFiles()
{
 	 $.ajax({
     type: "POST",
	 async: false,
       url: $host_url+"populateAllGridGroupFiles.demo",      
	   data:'schema_id='+0,
       success: populateAllGridGroupFilesResponce
  });
} 

function populateAllGridGroupFilesResponce($responce)
{
	$responce = eval('(' + $responce + ')'); 
	ShowSuccessMsg($responce.data);	 
}
 
 
function populateAllGridFiles()
{
 	 $.ajax({
     type: "POST",
	 async: false,
       url: $host_url+"populateAllGridFiles.demo",      
	   data:'schema_id='+0,
       success: populateAllGridFilesResponce
  });
} 
 
function populateAllGridFilesResponce($responce)
{
	$responce = eval('(' + $responce + ')'); 
	ShowSuccessMsg($responce.data);
}

function createModuleMetaColumns()
{
 	 $.ajax({
     type: "POST",
	 async: false,
       url: $host_url+"createModuleMetaColumns.demo",      
	   data:'',
       success: createModuleMetaColumnsResponce
  });
}

function createModuleMetaColumnsResponce($responce)
{
	$responce = eval('(' + $responce + ')'); 
	ShowSuccessMsg($responce.data);
} 
 
function updateUserSchemaElementDbField()
{
 	 $.ajax({
     type: "POST",
	 async: false,
       url: $host_url+"updateUserSchemaElementDbField.demo",      
	   data:'',
       success: updateUserSchemaElementDbFieldResponce
  });
}
 
function updateUserSchemaElementDbFieldResponce($responce)
{
	$responce = eval('(' + $responce + ')'); 
	ShowAlertMsg($responce.data);
}
function sleep(interval)
{
var i=0;
			while(i<interval)
			{
			i++;		 
			}
} 

var sys_tbl_name='';
function AssignSystemTableName(sys_tbl_name)
{
 if(document.getElementById('system_module_table_name').value=='')
	{
	document.getElementById('system_module_table_name').value=sys_tbl_name
	}
}

var $dpyname;
function AssignDsplayModuleName($dpyname)
{
	if(document.getElementById('user_schema_display_module_name').value=='')
	{
	
	  document.getElementById('user_schema_display_module_name').value=$dpyname;
	}
}

var group_tbl_name='';
function AssignGroupTableName(group_tbl_name)
{
	if(document.getElementById('system_group_table_name').value=='')
	{
	
	  document.getElementById('system_group_table_name').value=group_tbl_name.replace(/[$.!@#$% ^&*//]/g,"_").toLowerCase();;
	  document.getElementById('user_schema_group_id').value=group_tbl_name.replace(/[$.!@#$% ^&*//]/g,"_").toLowerCase();;
	}
}

function AssignTabName(tab_name)
{
	if(document.getElementById('tab_id').value=='')
	{
	  document.getElementById('tab_id').value=tab_name.replace(/[$.!@#$% ^&*//]/g,"_").toLowerCase();;
	}
}
function AssignColName(col_name)
{
	if(document.getElementById('column_id').value=='')
	{
	  document.getElementById('column_id').value=col_name.replace(/[$.!@#$% ^&*//]/g,"_").toLowerCase();;
	}
}

var $sysname='';
function AssignSystemName($sysname)
{
if(document.getElementById('user_schema_system_name').value=='')
{
  $sysname = $sysname.replace(/[$.!@#$% ^&*//]/g,"_").toLowerCase();
  document.getElementById('user_schema_system_name').value= $sysname;
 }
}

var sys_table_name='';
function AssignSystemTableName(sys_table_name)
{
if(document.getElementById('system_module_table_name').value=='')
{
  sys_table_name = sys_table_name.replace(/[$.!@#$% ^&*//]/g,"_").toLowerCase();
  document.getElementById('system_module_table_name').value= sys_table_name;
 }
}

function GetSubGroupDetailsForModule()
{
	var elemenmt_user_schema = document.getElementById('elemenmt_user_schema').value;
	if(elemenmt_user_schema=='')
	{
		ShowAlertMsg("Please Select Module");
		return false;
	}
	else
	{
		var lstring = "elemenmt_user_schema="+elemenmt_user_schema;
			lstring+= "&elemenmt_user_schema_group="+document.getElementById('elemenmt_user_schema_group').value;
			lstring+= "&geditinternalcode="+$geditinternalcode;
		$.ajax({
			type: "POST",
			async: false,
			url: $host_url+"GetSubGroupDetailsForModule",      
			data:lstring,
			success:function updateUserSchemaElementDbFieldResponce(responce)
					{
						responce = eval('(' + responce + ')'); 
						if(responce.error_code==0)
						{
							 $('#element_user_schema_sub_group').html(responce.data);
						}
					}
	});

	}
}