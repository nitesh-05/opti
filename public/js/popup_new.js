function monkeyPatchAutocomplete() {
   $.ui.autocomplete.prototype._renderItem = function (ul, item) {

      // Escape any regex syntax inside this.term
      var cleanTerm = this.term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
 
      // Build pipe separated string of terms to highlight
      var keywords = $.trim(cleanTerm).replace('  ', ' ').split(' ').join('|');

      // Get the new label text to use with matched terms wrapped
      // in a span tag with a class to do the highlighting
      var re = new RegExp("(" + keywords + ")", "gi");
      var output = item.label.replace(re,  
                                      '<span style="font-weight:bold;color:#2E35F4;"  >$1</span>');

      return $("<li>")
         .append($("<a>").html(output))
         .appendTo(ul);
   };
};
monkeyPatchAutocomplete();
function split(val) {
	return val.split(/;\s*/);
}
function extractLast( term ) {
	return split(term).pop();
}
$gp_pop_up_table_name="";
$gp_calling_table_name="";
$gp_system_name="";

POPUP={
	 
		OpenFWPopup : function (p_pop_up_table_name,p_calling_table_name,system_name)
		{
			$gp_pop_up_table_name=p_pop_up_table_name;
			$gp_calling_table_name=p_calling_table_name;
			$gp_system_name=system_name;
			 read_only_att=$("#m_"+p_calling_table_name+" #txt_ref_schema_"+system_name).attr("readonly");//.toLowerCase();
			 if(read_only_att =='readonly') return;
			try
			{
				clicked_id_system_name=system_name;
			calling_table_name=p_calling_table_name;
			pop_up_table_name=p_pop_up_table_name;
			if($('#dialog').closest('.ui-dialog').is(':visible'))
				$("#dialog").dialog("close");
			$("#dialog").dialog({"title" : '',
				"width" : 880,  draggable:false ,
				"height" : 600,  
				resizable:false 
				 

				}) .dialogExtend({
				"closable" : true,
				"maximizable" : false,
				"collapsable" : false,
				"minimizable" :false,
				"minimizeLocation" :"left",
				"dblclick" : "collapse",
					"titlebar" : false ,

				icons:{"close":"ui-icon-close"}
				})
 
 
			$(".ui-dialog-titlebar-close").css("cursor" ,"pointer").css("padding" ,"0").css("height" ,"18px");
				$("#dialog").siblings('.ui-widget-header').css("background","#008299").css("border" ,"none");
				$(".ui-widget-header .ui-dialog-title").css("color","#ffffff");
				
			 $("#grid_popup_anchor").trigger('click');
			index_highest=getMaxIndex();
			 // alert(index_highest);
			 
				 // $(".modal.fade").css( "zIndex", index_highest+1 );
				 // $("#grid_popup_model").css( "zIndex", index_highest+1 );
			// $("#grid_popup_model .modal-dialog").draggable();
			// $("#grid_popup_model .modal-title").css("cursor","move")
			 
			$('#grid_popup_data').html("");
			var file_name="pop_up_"+p_pop_up_table_name+".js";
			search_ref_module_db_field="";
			search_ref_module_value="";
			ref_data_obj="";
			 
			if(!empty(all_obj[p_calling_table_name]['g_system_names_full_arr'][system_name]))
			  ref_data_obj=(all_obj[p_calling_table_name]['g_system_names_full_arr'][system_name]['pop_up_ref_obj']);
			
			search_ref_module_db_field="";
			search_ref_module_value="";
			
			if(!empty(ref_data_obj))
			{
				try
				{
					
					search_ref_module_db_field=ref_data_obj['ref_module_code_ref_field_db_field'];
					if(ref_data_obj['ref_module_code_ref_field_on']!=0)
					{
					 search_ref_module_value= $("#m_"+calling_table_name+" #"+ref_data_obj['ref_module_code_ref_field_on']).val();							}
					else
					{
					 search_ref_module_value=ref_data_obj['ref_module_code_ref_field_const'];
					}
				}
				 catch(err)
						{
							txt= err.message;
							$.unblockUI();
							ShowAlertMsg(txt );
						}	
									
			}  
			
			all_data_obj=this.GetAllDataObjects(p_calling_table_name);
			
			var main="<table id='table_grid1' class='scroll'   ondblclick= POPUP.PopUpOnDBClickEvent('"+p_pop_up_table_name+"','"+p_calling_table_name+"','"+system_name+"'); ></table> <div id='sub_grid_div1' class='scroll' style='text-align:center;'></div>";
			$('#grid_popup_data').html(main+" <div><span id='open_popup_value'></span><div>");
			var th = document.getElementsByTagName('head')[0];
			var s = document.createElement('script');
			s.setAttribute('type','text/javascript');
			var jt_db=getCookie("jt_db"); 
			var path='grid_display_files/'+jt_db+"/"+file_name;
			s.setAttribute('src',path);
			th.appendChild(s);
			index_highest=getMaxIndex();
			 
				 $("#dialog").parent().css( "zIndex", index_highest+1 )
			}
			catch(err)
				{
					txt= err.message;
					$.unblockUI();
					ShowAlertMsg(txt);
				}				
		},
		
		AssignJqueryMultiSelectAutoComplete  : function (pop_up_table_name,calling_table_name,system_name)
		 {
			
				if($("#m_"+calling_table_name+" #"+system_name).length>0)
				{
				 
				
					$myinput=$("#m_"+calling_table_name+" #"+system_name)
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
											data:"value="+extractLast(request.term)+"&system_name="+system_name+"&pop_up_table_name="+pop_up_table_name+"&calling_table_name="+calling_table_name,
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
			 },
		
		
		
		AsignPopUpDetailsValues:function(col_model_arr,id)
		{
			var a_data=jQuery("#table_grid1").getRowData(id);
			var pop_up_data=" <table border=0>";
			jQuery.each(a_data, function(ak, av) {	
			
				if(ak != 'is_select')
					pop_up_data+="<tr><td><b>"+col_model_arr[ak]+"</b></td><td>:</td><td>"+av+"</td></tr>";
			});
			pop_up_data+="</table>";		
			$("#open_popup_value").html("");		 
			$("#open_popup_value").html(pop_up_data);	
			return true;	
		},
		PopUpOnDBClickEvent:function(pop_up_table_name,calling_table_name,system_name)
		{
			var id=jQuery("#table_grid1").getGridParam('selrow'); 
			if(id > 0) 
			{ 
		if($("#dialog").dialog('isOpen'))
		$("#dialog").dialog("close");
			this.GetModuleKeyDataForElement(pop_up_table_name,calling_table_name,system_name,id);
			//$('#dialog').dialog('close'); 
			 
			} 
			else
			{ 
				ShowAlertMsg("Please select row"); return;
			}
		},
		PopUpOnCheckBoxClickEvent:function(id)
		{
		if($("#dialog").dialog('isOpen'))
		$("#dialog").dialog("close");
			this.GetModuleKeyDataForElement($gp_pop_up_table_name,$gp_calling_table_name,$gp_system_name,id);
			//$('#dialog').dialog('close'); 
		},
		GetModuleKeyDataForElement:function(pop_up_table_name,calling_table_name,system_name,internal_code)
		{
		 
			$.ajax({
				   type: "POST",
					async:false,
				   url: $host_url+"GetModuleKeyDataForElement",
				   error:AjaxErrorMessage,
				   data: "pop_up_table_name="+pop_up_table_name+"&calling_table_name="+calling_table_name+"&system_name="+system_name+"&internal_code="+internal_code,
				   success: function GetModuleKeyDataForElementResponce( responce)
					{ 
						try
						{
							responce = eval('(' +  responce + ')');
							
							if( responce.error_code=='-9')
							{
								ShowAlertMsg($responce.data);
								return false;
							}
							else if( responce.error_code=='0')
							{
								 
								$("#m_"+calling_table_name+" #txt_ref_schema_"+system_name).val(responce.data['key_data']['name']);
								$("#m_"+calling_table_name+" #"+system_name).val(responce.data['key_data']['internal_code']);
								var on_exit_event=$("#m_"+calling_table_name+" #txt_ref_schema_"+system_name).attr("on_exit");
								if(on_exit_event!='')
								{
								eval(on_exit_event);
								}
								var ref_display_arr=responce.data['ref_display'];
								if(!empty(ref_display_arr))
								{
									jQuery.each(ref_display_arr, function(k, v) {
									 $("#m_"+calling_table_name+" #"+k).val(v);
									});
								}
							}
						}
						 catch(err)
						{
							txt= err.message;
							$.unblockUI();
							ShowAlertMsg(txt+"<br>"+responce);
						}	
					}
				});
		},
		GetAllDataObjects:function(calling_table_name)
		{
				var all_data_obj_ac=new Object();
				
				if(typeof(all_obj[calling_table_name])!='undefined')
				{
					var html_id_arr=all_obj[calling_table_name]['html_id_arr'];
					
					jQuery.each(html_id_arr,function (ak,av){
					all_data_obj_ac[ak]=new Object();
					all_data_obj_ac[ak]=$("#m_"+calling_table_name+" #"+ak).val();
					});	
					all_data_obj_ac = encodeURIComponent(JSON.stringify(all_data_obj_ac)); 
				}
			return 	all_data_obj_ac;					 
			
		},
		AssignJqueryAutoCompleteNew:function(pop_up_table_name,calling_table_name,system_name,ref_data_obj,ref_module_code)
		{
			 
				if($("#m_"+calling_table_name+" #"+system_name).length>0)
				{
				var search_ref_module_db_field=0;

				var ref_search_value=0;
				var txt_system_name=("#m_"+calling_table_name+" #txt_ref_schema_"+system_name);
				var new_width=eval(parseFloat($(txt_system_name).width())+47);
			 
				 $myinput=$(txt_system_name)
					// don't navigate away from the field on tab when selecting an item
					.bind( "keydown", function( event ) 
					{
					
						if ( event.keyCode === $.ui.keyCode.TAB &&
								$( this ).data( "uiAutocomplete" ).menu.active ) {
							event.preventDefault();
						}
						if(event.keyCode==8)
						{
							$("#m_"+calling_table_name+" #"+system_name).val(0);
						}
						else if(event.keyCode==112)
						{
							$("#m_"+calling_table_name+" #pop_up_"+system_name+" img").trigger("click");
						}
					})
					.autocomplete({
						delay: 1000,
						source: function( request, response ) {
					 
						
						if(!empty(ref_data_obj))
							{
								 
								var ref_mofule_code_active_field=ref_data_obj['ref_mofule_code_active_field'];
								if(ref_data_obj['ref_module_code_ref_field']!='0')
								{
									 search_ref_module_db_field=ref_data_obj['ref_module_code_ref_field_db_field'];
									if(ref_data_obj['ref_module_code_ref_field_on']!=0)
									{


									 ref_search_value= $("#m_"+calling_table_name+" #"+ref_data_obj['ref_module_code_ref_field_on']).val();							}

									else
									{
									 ref_search_value=ref_data_obj['ref_module_code_ref_field_const'];
									}
								}
							}
							else
							{
									if(all_obj.hasOwnProperty(calling_table_name))
								{
								var active_field_arr=all_obj[calling_table_name]['g_user_schema_details_array']['data']['active_field_arr'];		
								var ref_mofule_code_active_field="";
								if(!empty(active_field_arr))
								  ref_mofule_code_active_field=active_field_arr[ref_module_code];
								}
							}
						all_data_obj=POPUP.GetAllDataObjects(calling_table_name);
					  var lstr_query_string='';
					   lstr_query_string+='value='+request.term;
						lstr_query_string+="&system_name="+system_name;
					   lstr_query_string+="&pop_up_table_name="+pop_up_table_name;
					   lstr_query_string+="&calling_table_name="+calling_table_name;
					 
						lstr_query_string+="&ref_search_value="+ref_search_value+"&search_ref_module_db_field="+search_ref_module_db_field+"&ref_mofule_code_active_field="+ref_mofule_code_active_field;
					   lstr_query_string+="&all_data_obj="+all_data_obj;
						$("#m_"+calling_table_name+" #"+system_name).val(0);
					 $.ajaxq ("ajaxQueue",{
							  type: "POST",
							  async:false,
							  url: $host_url+"getAutoCompleteFromFrameWorkNew",  
							  data: lstr_query_string,
							  success: function getAutoCompleteFromFrameWorkNewResponce(v_response)
								{
										 
										  v_response = eval('(' +  v_response + ')');
										 response(v_response.data);	
											$('ul.ui-autocomplete li a').css("color",'#403849');	
								} 
								});
							
						
						},
						open: function(event, ui) {
						 var new_width=eval(parseFloat($(txt_system_name).width())+47);
						 var new_top=$(txt_system_name).offset()['top']+25;	
						 
						if(typeof(all_obj[calling_table_name])!='undefined' && all_obj[calling_table_name]['load_type']=='PopUp' )
						{
							var module_id = all_obj[calling_table_name]['g_str_module_id'];
							var pop_top_height = $("#popup_module_dialog_"+module_id).parent().offset().top;
							new_top = new_top-pop_top_height;
						}
						
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
							POPUP.GetModuleKeyDataForElement(pop_up_table_name,calling_table_name,system_name,ui.item.internal_code)
							//autoCompleteSelectText(txt_system_name,system_name,this.id,ui.item.internal_code ,module_id);
							return false;
						},
						autoFocus: true
				});
			  }
			 	
		},
		AssignJqueryAutoFill:function(system_table_name,calling_table_name,system_name,tr_id)
		 {
			 
			var txt_system_name=("#m_"+system_table_name+" #"+system_name);
					 
			$myinput=$(txt_system_name).bind( "keydown", function( event ) {
				 
			}).autocomplete({
				source: function( request, response ) {
						
			 var row_data_obj =""; 
				
			if(parseFloat(tr_id) > 0)
			   row_data_obj = FWMultiGrid.GetRowDataFromTable(system_table_name,calling_table_name,tr_id); 
				
				var lstr_query_string='';
				lstr_query_string+='value='+request.term ;
				lstr_query_string+='&system_name='+system_name ;
				lstr_query_string+='&system_table_name='+system_table_name ;
				lstr_query_string+='&calling_table_name='+calling_table_name ;
				lstr_query_string+='&row_data_obj='+encodeURIComponent(JSON.stringify(row_data_obj));	
				 			  
				$.ajaxq ("ajaxQueue",{
	                  type: "POST",
		              async:false,
		              url: $host_url+"GetJqueryAutoCompleteAutoFill",  
	                  data: lstr_query_string,
	                  success: function GetJqueryAutoCompleteAutoFillResponce(v_response)
						{
							 v_response = eval('(' +  v_response + ')');
							 response(v_response.data);	
							$('ul.ui-autocomplete li a').css("color",'#403849');	
						} 
						});
					
				
				},
				 open: function(event, ui) {
						 var new_width=eval(parseFloat($(txt_system_name).width())+22);
						 var new_top=$(txt_system_name).offset()['top']+25;	
						 
						if(all_obj[system_table_name]['load_type']=='PopUp')
						{
							var module_id = all_obj[system_table_name]['g_str_module_id'];
							var pop_top_height = $("#popup_module_dialog_"+module_id).parent().offset().top;
							new_top = new_top-pop_top_height;
						}
						
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
					 
					var term = extractLast( this.value );
				},
				focus: function() {
					// prevent value inserted on focus
					return false;
				},
				select: function( event, ui ) {
				 	$(txt_system_name).val(ui.item.value);
					return false;
				}
		});
		 
		}
}