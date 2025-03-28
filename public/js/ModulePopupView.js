AllModulePopupView =  {

	OpenModulePoupView : function (system_module_table_name,module_id,internal_code,callback_func) {
	
		var dialog_color_arr = new Array("#4CA6FF", "#979752", "#FF2693", "#FF981D", "#26FF26", "#FF0097");  
		var jt_db=getCookie("jt_db");
		var path="html_modules/modules/"+jt_db+"/module_"+module_id+"_popup_view.html";
		
		 var div_id="popup_module_view_"+module_id;	
		 var popup_content_div_id="popup_module_view_content_"+module_id;
		var dialog_state = $("#"+div_id).dialogExtend("state");
		var is_dialog_open = $("#"+div_id).dialog('isOpen');
		var dialog_count = $(".ui-dialog[aria-describedby*='popup_module_view_']:visible").length;
		
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

				$("#page-content").append("<div id='"+div_id+"' title='' style='padding-left:0;'><div id='"+popup_content_div_id+"'></div> </div>");
				
					var dialog_height = screen.height-150;
						IncludeFrameWorkSupportFiles(); 
					  $('#'+div_id).dialog({"title" : "Loading...",
					"width" : "100%",
					"height" : dialog_height, position: [0,0],
					resizable:true,
					draggable:false 

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
							AllModulePopupView.GetDataForModulePopupView(system_module_table_name,module_id,internal_code,function () {
								if (empty(callback_func))
									return;
								else
									eval(callback_func);
							});
					});
					
					$(".ui-dialog-titlebar-close").css("cursor" ,"pointer").css("padding" ,"0").css("height" ,"18px");
					$("#"+div_id).siblings('.ui-widget-header').css("background",dialog_color_arr[dialog_count]).css("border" ,"none");
					$(".ui-widget-header .ui-dialog-title").css("color","#ffffff");
					$(".ui-dialog").css("z-index","10000").css('box-shadow','1px 1px 5px 0px rgba(0,0,0,0.75)');
					$(".ui-dialog-titlebar").css('padding','1px 10px');
			}
		}
		},
		
		GetDataForModulePopupView : function (system_module_table_name,module_id,internal_code,callback) {
		
			
			var lstr_str = "system_module_table_name="+system_module_table_name;
				lstr_str+="&module_id="+module_id;
			 
				lstr_str+="&internal_code="+internal_code;
			var div_id="#popup_module_view_"+module_id+" #popup_module_view_content_"+module_id;	
			 App.blockUI({target: $(div_id+" #m_"+system_module_table_name)});
			 
			 $.ajax({
				type: "POST",
				// async:false,

				url: $host_url+"GetDataForModulePopupView",
				error:AjaxErrorMessage,
				data:lstr_str, 		
				success: function(responce) 
				{ 
					try  
					{
						responce = eval('(' + responce + ')');
						if(responce.error_code=='-9')
						{
							alert(responce.data);CallLogout();
							return false;
						}						
						if (responce.error_code == 0)
						{
							
							var ele_details_arr = responce.data.ele_details;
							var values_arr = responce.data.details;
							var grp_details = responce.data.grp_details;
							var display_module_name = responce.data.display_module_name;
							$("#popup_module_view_"+module_id).dialog('option', 'title', display_module_name);
							$.each(grp_details,function (k,v){
							
								$(div_id+" #"+k+" tbody").html(v);
							});
							$.each(ele_details_arr, function (k,v){
							
								var data_type=v['data_type'];
								var system_name=v['system_name'];
								var is_ref_module_code_lov=v['is_ref_module_code_lov'];
								
								
								var val=values_arr[system_name];
								if(data_type=='Reference Data' && is_ref_module_code_lov=="0" && !empty(val))
								{
									var ref_module_table_name=v['ref_module_table_name'];
									var ref_module_id=v['ref_module_id'];
									var txt_ref_name = values_arr["txt_ref_schema_"+system_name];
									var ref_html = "<span style='cursor: pointer;  color: blue; text-decoration: underline;' onclick=\"AllModulePopupView.OpenModulePoupView('"+ref_module_table_name+"',"+ref_module_id+","+val+");\">"+txt_ref_name+"</span>";
									$(div_id+" #"+system_name).html(ref_html);
								}
								else
								{
									val = empty(val) ? "" : val;
									$(div_id+" #"+system_name).html(val);
								}
							});
							
							
						}
						App.unblockUI(div_id+" #m_"+system_module_table_name);
						if (callback && typeof(callback) === "function")
							callback();
					}
					catch(err)
							{
								txt= err.message;
								App.unblockUI();
								bootbox.alert(txt+"<br>"+responce+" in Approvals.GetPFApplicationStatusListCountOnly");
							}  					
				}
			})
		},
		
		OpenModuleChildPoupView : function (system_module_table_name,module_code,group_code,ele,title) {
		
			// var div_id=".jqi #m_"+system_module_table_name;	
			var app_name = getCookie("jt_db");
			var path="html_modules/modules/"+app_name+"/module_"+module_code+"_"+group_code+"_child_popup_view.html";
			
	/* 		$.get("html_modules/modules/"+app_name+"/module_"+module_code+"_"+group_code+"_child_popup_view.html", function(data) {
						$.prompt(data, {
								title:"Details",
								loaded:	function(event){
											var child_data = JSON.parse($(ele).parent().attr('data-child-level'));
											$.each(child_data, function (k,v){
												$(div_id+" #"+k+" tbody").html(decodeURIComponent(v));
											});
										},
								buttons: {},
								position: {  width: 900},
								zIndex:'10001'
						});
			}); */
		
			var div_id="popup_module_view_child_"+module_code+"_"+group_code;	
			var popup_content_div_id="popup_module_view_child_content_"+module_code+"_"+group_code;	
			var grp_div_id=div_id+" #popup_module_view_child_content_"+module_code+"_"+group_code+" #m_"+system_module_table_name;
			$('#'+div_id).dialog("close")
			$('#'+div_id).remove();
			$("#page-content").append("<div id='"+div_id+"' title='' style='padding-left:0;'><div id='"+popup_content_div_id+"'></div> </div>");
				
					var dialog_height = 320;
				
				  $('#'+div_id).dialog({"title" : title,
					"width" : "60%",
					"height" : dialog_height,
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

					icons:{"close":"ui-icon-close"}
					});
					
					$('#'+popup_content_div_id).load(path,function() 
					{
						var child_data = JSON.parse($(ele).parent().attr('data-child-level'));
											$.each(child_data, function (k,v){
												$("#"+grp_div_id+" #"+k+" tbody").html(decodeURIComponent(v));
											});		
					});
					
					$(".ui-dialog-titlebar-close").css("cursor" ,"pointer").css("padding" ,"0").css("height" ,"18px");
					$("#"+div_id).siblings('.ui-widget-header').css("background","#D9006C").css("border" ,"none");
					$(".ui-widget-header .ui-dialog-title").css("color","#ffffff");
					$(".ui-dialog").css("z-index","10000").css('box-shadow','1px 1px 5px 0px rgba(0,0,0,0.75)');
					$(".ui-dialog-titlebar").css('padding','1px 10px');
		}
		
}