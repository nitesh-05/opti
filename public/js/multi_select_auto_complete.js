
 function AssignJqueryMultiSelectAutoComplete(system_name,ref_module_id)
 {
	if($("#"+system_name).length>0)
	{
	 

	
		$myinput=$("#"+system_name)
			// don't navigate away from the field on tab when selecting an item
			.bind( "keydown", function( event ) {
				if ( event.keyCode === $.ui.keyCode.TAB &&
						$( this ).data( "autocomplete" ).menu.active ) {
					event.preventDefault();
				}
			})
			.autocomplete({
				source: function( request, response ) {
			 
					 $.ajax({
								type: "POST",									
								url: $host_url+"getAutoCompleteMultiSearchFromFrameWork",   
								data:"value="+extractLast(request.term)+"&system_name="+system_name+"&base_module_id="+$g_schema_id+"&ref_module_id="+ref_module_id+"&system_module_table_name="+$g_system_module_table_name,
								success:  function GetDashboardDetailsSuccess(v_response)
								{
								  v_response = eval('(' +  v_response + ')');
								 response(v_response.data);	
									$('ul.ui-autocomplete li a').css("color",'#403849');	
								} 
						});
					
				
				},
				open: function(event, ui) {
			 	var new_width=eval(parseFloat($("#"+system_name).width())+32);
				 var new_top=$("#"+system_name).offset()['top']+30;				 
              jQuery(".ui-autocomplete").css("top", new_top);
				$(this).autocomplete("widget").css({
					"width": new_width,
					"min-heigh": 210,
					"height": 210 ,
					"z-index": 120000 ,
					"overflow": 'auto' 
				});
				},
				search: function() {
					// custom minLength
					var term = extractLast( this.value );
					 
					/* if ( term.length < 2 ) {
						return false;
					} */
				},
				focus: function() {
					// prevent value inserted on focus
					return false;
				},
				select: function( event, ui ) {
					var terms = split( this.value );
					// remove the current input
					terms.pop();
					// add the selected item
					terms.push( ui.item.details_val );
					// add placeholder to get the comma-and-space at the end
					terms.push( "" );
					this.value = terms.join( ";" );
					return false;
				}
		});
 
	}	
 }
 
 function AssignJqueryAutoComplete(system_name, module_id,ref_data_obj)
 {
		if($("#"+system_name).length>0)
		{
		var search_ref_module_db_field=0;

		var ref_search_value=0;
	 
		// For Ref Display
		
		 
		
 
		var txt_system_name="txt_ref_schema_"+system_name;
		var new_width=eval(parseFloat($("#"+txt_system_name).width())+47);
	 
	 	 $myinput=$("#txt_ref_schema_"+system_name)
			// don't navigate away from the field on tab when selecting an item
			.bind( "keydown", function( event ) {
			
				if ( event.keyCode === $.ui.keyCode.TAB &&
						$( this ).data( "uiAutocomplete" ).menu.active ) {
					event.preventDefault();
				}
				if(event.keyCode==8)
				{
					$("#"+system_name).val(0);
				}else if(event.keyCode==112)
				{
					$("#pop_up_"+system_name+" img").trigger("click");
				}
			})
			.autocomplete({
				source: function( request, response ) {
			 
					var all_data_obj_ac=new Object();
				jQuery.each($html_id_arr,function (ak,av){
				all_data_obj_ac[ak]=new Object();
				all_data_obj_ac[ak]=$('#'+ak).val();
				});	
jQuery.each($html_id_criteria_arr,function (ak,av){
					all_data_obj_ac[ak]=new Object();
					all_data_obj_ac[ak]=$('#'+av).val();
					});	
				
				all_data_obj_ac = encodeURIComponent(JSON.stringify(all_data_obj_ac)); 
				if(!empty(ref_data_obj))
					{
						var ref_mofule_code_active_field=ref_data_obj['ref_mofule_code_active_field'];
						if(ref_data_obj['ref_module_code_ref_field']!='0')
						{
							 search_ref_module_db_field=ref_data_obj['ref_module_code_ref_field_db_field'];
							if(ref_data_obj['ref_module_code_ref_field_on']!=0)
							{


							 ref_search_value= $("#details_"+ref_data_obj['ref_module_code_ref_field_on']).val();							}

							else
							{
							 ref_search_value=ref_data_obj['ref_module_code_ref_field_const'];
							}
						}
					}
				
			  var lstr_query_string='';
			   lstr_query_string+='value='+request.term+"&module_id="+module_id;
			    lstr_query_string+="&system_name="+system_name;
			   lstr_query_string+="&base_module_id="+$g_schema_id;
			   lstr_query_string+="&system_module_table_name="+$g_system_module_table_name;
				lstr_query_string+="&ref_search_value="+ref_search_value+"&search_ref_module_db_field="+search_ref_module_db_field+"&ref_mofule_code_active_field="+ref_mofule_code_active_field;
			   lstr_query_string+="&all_data_obj="+all_data_obj_ac;
 $("#"+system_name).val(0);
			 $.ajaxq ("ajaxQueue",{
	                  type: "POST",
		              async:false,
		              url: $host_url+"getAutoCompleteFromFrameWork.demo",  
	                  data: lstr_query_string,
	                  success: function getAutoCompleteFromFrameWorkResponce(v_response)
						{
								 
								  v_response = eval('(' +  v_response + ')');
								 response(v_response.data);	
									$('ul.ui-autocomplete li a').css("color",'#403849');	
						} 
						});
					
				
				},
				open: function(event, ui) {
				 var new_width=eval(parseFloat($("#"+txt_system_name).width())+47);
				 var new_top=$("#"+txt_system_name).offset()['top']+34;				 

              jQuery(".ui-autocomplete").css("top", new_top);
				$(this).autocomplete("widget").css({
					"width": new_width,
					"min-heigh": 210,
					"height": 210 ,
					"z-index": 120000 ,
					"overflow": 'auto' 

				});
				},
				search: function() {
					 
					// custom minLength
					var term = extractLast( this.value );
					 
					 /*  if ( term.length < 2 ) {
						return false;
					}   */
				},
				focus: function() {
					// prevent value inserted on focus
					return false;
				},
				select: function( event, ui ) {
					this.value = this.value;
					
					autoCompleteSelectText(txt_system_name,system_name,this.id,ui.item.internal_code ,module_id);
					return false;
				}
		});
	 
	  //$('.ui-menu-item a').css("color","#FFF"); 				
	
	//$('ul.ui-autocomplete li a').css("color",'#FFF');	
	}

 }
 
 function autoCompleteSelectText(txt_box_id, hidden_id,select_box_id,val,ref_module_code)
  {
 var internal_code=val;
 var schema_id=$g_str_module_id;

 var split=hidden_id.split('details_');
 var inputboxid=hidden_id;
 var table='';
 var table_id='';
 var field_name='';
  $.ajax({
	     type: "POST",
		 async: false,
		  url: $host_url+"getRefModuleColumnName.demo",
		   data:"internal_code="+ref_module_code+'&html_field_id=0&schema_id='+schema_id,
	       success: function getRefModuleColumnAutoCompleteResponse($responce)
					{
						$responce = eval('(' + $responce + ')');
						if($responce.error_code=='-9')
						  {
						  alert($responce.data);
						  return false;
						  }
						table=$responce.data.ref_data.table_name;
						table_id=$responce.data.ref_data.table_id;
						field_name=$responce.data.ref_data.field_name;
					}	
		 });   
 addElementFromAutoComplete(internal_code,table_id,field_name,schema_id,inputboxid);
	 
  
 
  }
  
  function addElementFromAutoComplete(id,table_id,field_name,schema_id,inputboxid)
{ 

		$.ajax({
	       type: "POST",
					async:false,
	       url: $host_url+"mGetFieldName.demo",
	       data: "internal_code="+id+"&table_id="+table_id+"&field_name="+field_name+"&schema_id="+schema_id+"&inputboxid="+inputboxid,
 	       success: function addElementFromAutoCompleteResponse($responce)
				{ 
						$responce = eval('(' + $responce + ')');
						if($responce.error_code=='-9')
						  {
						  alert($responce.data);
						  return false;
						  }
						if($responce.error_code == 0)
						{
							var name = $responce.data[0].name;
							var system_name = $responce.data[0].system_name;
							var internal_code = $responce.data[0].internal_code;	
							document.getElementById(inputboxid).value = internal_code;
							document.getElementById('txt_ref_schema_'+inputboxid).value = name;
							if($responce.data[1].length>0)
							{
								for($k=0;$k<$responce.data[1].length;$k++)
								{
								if($responce.data[1][$k].field_id != undefined)
								document.getElementById($responce.data[1][$k].field_id).value=$responce.data[1][$k].value;
								}
							}					
							var on_exit_event=$responce.data.on_exit_event.on_exit;
							if(on_exit_event!='')
							{
								eval(on_exit_event);
							}
					}
					else
					{
						document.getElementById(inputboxid).value = 0;
						document.getElementById('txt_ref_schema_'+inputboxid).value = '';
					}
				}
	    });
}