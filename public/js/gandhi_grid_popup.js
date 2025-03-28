function getGGridPopupRowData(id,system_module_table_name)
{	
	$gGridRowId=id;
	$('#gandhi_grid_dialog').dialog('close');
	$('#gandhi_grid_dialog').dialog('open');
	var win_width = window.screen.width;			
	$('#gandhi_grid_dialog').dialog('option', 'title', all_obj[system_module_table_name]['g_display_module_name']);

	var Top=eval($("#system_menu").position()['top']+65);
	var Left=eval($("#system_menu").position()['left']+.5);
	 
	//$("#gandhi_grid_dialog").data("position.dialog",[Left,Top]); 
	
	$("#gandhi_grid_html_div").html("");
	$("#gandhi_grid_table_update_div").html("");
	$("#gandhi_grid_above_update_html").html("");
	$("#gandhi_grid_table_html_div").html("");	
	$("#gandhi_grid_above_update_html").show();
	$("#gandhi_grid_html_div").show();
	$("#gandhi_grid_table_update_div").show();
	$("#gandhi_grid_table_html_div").show();
	$("#gandhi_grid_dialog").parent().css("z-index","22000");  
	$("#gandhi_grid_dialog").parent().css("top",Top+"px");  
		
	PopulateGGridPopupRowData(id,system_module_table_name);	
}

function HideAndShowGGridPopup(hide_div_id,div_val)
{  
	if($("#"+div_val).html()=='+')
	{      
		$("#"+div_val).html('-');
		$('#'+hide_div_id).fadeIn('slow');
	}
	else
	{
		$("#"+div_val).html('+');
		$('#'+hide_div_id).fadeOut('slow');
	}
}

function PopulateGGridPopupRowData(id,system_module_table_name)
{
   
  	$.ajax({
		type: "POST",
		data:'row_id='+id+"&module_id="+all_obj[system_module_table_name]['g_str_module_id']+"&system_module_table_name="+system_module_table_name,				
		url: $host_url+"PopulateGGridPopupRowData",      
		success: function PopulateGGridPopupRowDataDetails(responce)
		 {                                                
			  responce = eval('(' +  responce + ')'); 
			  var header=responce.data['header'];			  
			  var details_table=responce.data['details_table'];			  
			  var update_html=responce.data['update_html'];			  
			  var above_update_html=responce.data['above_update_html'];			  
			  $("#gandhi_grid_html_div").html(header);
			  $("#gandhi_grid_table_html_div").html(details_table);
			  div_perc=100;
			  var p_width=(($(window).width()/100)*div_perc)-100;
			  if(!empty(update_html))
			  {
				  $.prompt(details_table+" "+update_html, {
							title:header,

							loaded:	function(event){
								$(".jqi").draggable();
							
						},
							
							
							buttons: {},
							position: {  width: p_width},
							zIndex:9000
							});
				  $("#gandhi_grid_table_update_div").html(update_html);
			  }
			  $("#gandhi_grid_above_update_html").html(above_update_html);
			
		 }
		});	
		
}

function GetGandhiGridChildPopUpDetails(type,internal_code,data1,data2,data3)
{
    $('#gandhi_grid_child_dialog').dialog('open');
	var win_width = window.screen.width;
	//$('#ui-id-11').html($g_display_module_name);
	$('#gandhi_grid_child_dialog').dialog('option', 'title', $g_display_module_name);
	var Top=eval($("#page_info_header").position()['top']);
	var Left=eval($("#system_menu").position()['left']+.5);	 
	$("#gandhi_grid_child_dialog").data("position.dialog",[Left,Top]);
	$("#gandhi_grid_child_html_div").html("<div style='height:490px; margin: 0 auto; width:700px;'><img style=' margin: auto;position:absolute;top:36%;left:45%;'src='images/graph_spin.gif' border='0' /></div>");
    $("#gandhi_grid_child_dialog").parent().css("z-index","2100");  
	$.ajax({
		type: "POST",
		data:'row_id='+$gGridRowId+"&module_id="+$g_str_module_id+"&module_name="+
		               $g_str_module_name+"&type="+type+"&internal_code="+encodeURIComponent(internal_code)
					   +"&data1="+encodeURIComponent(data1)+"&data2="+encodeURIComponent(data2)+"&data3="+encodeURIComponent(data3),
					   
		url: $host_url+"GetGandhiGridChildPopUpDetails",      
		success: function PopulateGetGandhiGridChildPopUpDetailsaDetails(responce)
		 {                                                
			  responce = eval('(' +  responce + ')'); 
			  $("#gandhi_grid_child_html_div").html(responce.data.html);
		 }
		 
		 });
	
}

// GRID Reports Popus  : Date - 2016-05-17

function GetDashboardPopups1(uniqe_div_id,module_name,data1,data2,data3,data4)
 {
   
	var dialog_color_arr = new Array("#00A0B1", "#643EBF", "#BF1E4B", "#FF981D", "#00A600", "#FF0097"); 
	var lstr_str="";
    lstr_str+="&module_name="+encodeURIComponent(module_name),	
    lstr_str+="&data1="+encodeURIComponent(data1)+"&data2="+encodeURIComponent(data2)+"&data3="+encodeURIComponent(data3),	
    ResetTimer();
    $.ajax({
    type: "POST",
    async: false,
    url: $host_url+"GetDashboardPopups",
    data: lstr_str,
	 success: function GetDashboardPopupsResponce(responce)
          {
          	responce = eval('(' + responce + ')');
			if(responce.error_code==0)
			{
			        var jt_db=getCookie("jt_db");
					 var div_id="ds_"+uniqe_div_id; 						
					
					 var popup_content_div_id="ds_content_"+uniqe_div_id; 	
					var dialog_state = $("#"+div_id).dialogExtend("state");
					var is_dialog_open = $("#"+div_id).dialog('isOpen');
					var dialog_count = $(".ui-dialog[aria-describedby*='ds_']:visible").length;
					
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
						 
							   $("#page-content").append("<div id='"+div_id+"' title='' style='padding-left:0;'><div id='"+popup_content_div_id+"'></div> </div>");
							
								var dialog_height = screen.height-200;
									
								  $('#'+div_id).dialog({"title" : module_name,
								//"width" : "99%",
								//"width" : "99%",
								"height" : dialog_height, position: [5,50],
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
								
								
								
								$('#'+popup_content_div_id).html(responce.data['html']);
								
								$(".ui-dialog-titlebar-close").css("cursor" ,"pointer").css("padding" ,"0").css("height" ,"18px");
								$("#"+div_id).siblings('.ui-widget-header').css("background",dialog_color_arr[dialog_count]).css("border" ,"none");
								$(".ui-widget-header .ui-dialog-title").css("color","#ffffff");
								$(".ui-dialog").css("z-index","10000").css('box-shadow','1px 1px 5px 0px rgba(0,0,0,0.75)');
								$(".ui-dialog-titlebar").css('padding','1px 10px');
						}
					}
		    }
		  }	 
        }); 	 
 }

function GetDashboardPopups(uniqe_div_id,module_name,data1,data2,data3,data4,data5,data6,div_perc)
{
	if(empty(div_perc))
		div_perc=100;
	var p_width=(($(window).width()/100)*div_perc)-100;
	var dialog_color_arr = new Array("#00A0B1", "#643EBF", "#BF1E4B", "#FF981D", "#00A600", "#FF0097"); 
	var lstr_str="";
    lstr_str+="&module_name="+encodeURIComponent(module_name),	
    lstr_str+="&data1="+encodeURIComponent(data1)+"&data2="+encodeURIComponent(data2)+"&data3="+encodeURIComponent(data3)+"&data4="+encodeURIComponent(data4)+"&data5="+encodeURIComponent(data5)+"&data6="+encodeURIComponent(data6),	
    ResetTimer();
    $.ajax({
		type: "POST",
		async: false,
		url: $host_url+"GetDashboardPopups",
		data: lstr_str,
		success: function GetDashboardPopupsResponce(responce)
		{
          	responce = eval('(' + responce + ')');
			if(responce.error_code==0)
			{
				var jt_db=getCookie("jt_db");
				var div_id="ds_"+uniqe_div_id; 						
					
				var popup_content_div_id="ds_content_"+uniqe_div_id; 	
				$('#'+div_id).remove();
				div_id = div_id.replace(/ /g,"_");
				div_id = div_id+Math.floor(Math.random() * 100);
				
				html= ' <div id="myModal_'+div_id+'" class="modal fade" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
				html+=' 	<div class="modal-dialog">';
				html+=' 		<div class="modal-content" style="border-radius:8px !important;">';
				html+=' 			<div class="modal-header" style="padding: 6px;">';
				html+=' 				<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>';
				html+=' 				<h4 class="modal-title" id="myModalLabel_'+div_id+'" style="color: #00546f; font-weight: normal; font-size: 18px;">'+module_name+'</h4> ';
				html+=' 			</div>';
				html+=' 			<div class="modal-body" id="model_body_'+div_id+'" style="padding: 10px;">';
				html+=" 				<div id='"+div_id+"'> <div id='"+popup_content_div_id+"'>"+responce.data['html']+"</div> </div>";
				html+=' 			</div>';
				html+=' 			<div class="modal-footer" style="border-top: 0px;padding: 5px;">';
				html+=' 			</div>';
				html+=' 		</div>';
				html+=' 	</div>';
				html+=' </div>';
				html+=' </div>';
				
				$('#myModal_'+div_id).remove();
				$("#new_modal").append(html);
				
				$(".modal-dialog").css("width","");
			
				if($(window).width()>1200)
				{
					$(".modal-dialog").css("width","80%");
				}
				else
				{
					$(".modal-dialog").css("width","95%");
				}
				
				$('#myModal_'+div_id).modal('show');
				$('#myModal_'+div_id).on("hidden.bs.modal", function (e) {
					$('#myModal_'+div_id).remove();
				});
			}
		}
	}); 	 
} 
 
function GetDashboardPopupsFromApproval(uniqe_div_id,module_name,module_id,module_table_name,rowid,data1,data2,data3,data4,data5,data6,div_perc)
{	
	if(empty(div_perc))
		div_perc=100;
	var p_width=(($(window).width()/100)*div_perc)-100;
	var dialog_color_arr = new Array("#00A0B1", "#643EBF", "#BF1E4B", "#FF981D", "#00A600", "#FF0097"); 
	var lstr_str="";
    lstr_str+="&module_name="+encodeURIComponent(module_name),	
    lstr_str+="&data1="+encodeURIComponent(data1)+"&data2="+encodeURIComponent(data2)+"&data3="+encodeURIComponent(data3)+"&data4="+encodeURIComponent(data4)+"&data5="+encodeURIComponent(data5)+"&data6="+encodeURIComponent(data6),	
    ResetTimer();
    $.ajax({
		type: "POST",
		async: false,
		url: $host_url+"GetDashboardPopups",
		data: lstr_str,
		success: function GetDashboardPopupsResponce(responce)
		{
          	responce = eval('(' + responce + ')');
			if(responce.error_code==0)
			{
				var jt_db=getCookie("jt_db");
				var div_id="popup_module_view_"+module_id;						 
				
				var popup_content_div_id="ds_content_"+uniqe_div_id; 	
				$('#'+div_id).remove();
				div_id = div_id.replace(/ /g,"_");
				div_id = div_id+Math.floor(Math.random() * 100);
 
				// $.get("html_modules/load_popup.html",function(data) {
					html= ' <div id="myModal_'+div_id+'" class="modal fade" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
					html+=' 	<div class="modal-dialog">';
					html+=' 		<div class="modal-content" style="border-radius:8px !important;">';
					html+=' 			<div class="modal-header" style="padding: 6px;">';
					html+=' 				<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>';
					html+=' 				<h4 class="modal-title" id="myModalLabel_'+div_id+'" style="color: #00546f; font-weight: normal; font-size: 18px;">'+module_name+'</h4> ';
					html+=' 			</div>';
					html+=' 			<div class="modal-body" id="model_body_'+div_id+'" style="padding: 10px;">';
						html+= "<div id='"+div_id+"'> <div id='"+popup_content_div_id+"'>"+responce.data['html']+"</div> </div>";
						html+="<div style='padding-top:8px; text-align:center;' id='bulk_app_div' class='col-md-12 pull-right'>";
						html+="<span class='btn btn-sm btn-success' style='margin-right: 10px;' onclick=\"Approvals.MultiApproveRejectFromManualPopup('"+module_table_name+"',"+rowid+",'Approved')\">";
						html+="<i class='fa fa-check'></i> Approve</span>";
						html+="<span class='btn btn-sm btn-danger' onclick=\"Approvals.MultiApproveRejectFromManualPopup('"+module_table_name+"',"+rowid+",'Rejected')\">";
						html+="<i class='fa fa-times'></i> Reject</span></div>";
					html+=' 			</div>';
					html+=' 			<div class="modal-footer" style="border-top: 0px;padding: 5px;">';
					html+=' 			</div>';
					html+=' 		</div>';
					html+=' 	</div>';
					html+=' </div>';
					html+=' </div>';
					
					$('#myModal_'+div_id).remove();
					$("#new_modal").append(html);
					
					$(".modal-dialog").css("width","");
				
					if($(window).width()>1200)
					{
						$(".modal-dialog").css("width","80%");
					}
					else
					{
						$(".modal-dialog").css("width","95%");
					}
					
					$('#myModal_'+div_id).modal('show');
					$('#myModal_'+div_id).on("hidden.bs.modal", function (e) {
						$('#myModal_'+div_id).remove();
					});
				// });
			}
		}
	}); 	 
}

function GetExcelDashboard(uniqe_div_id,module_name,data1,data2,data3,data4,data5,data6,div_perc)
{
	var lstr_str="dash_rpt_type=excel";
		lstr_str+="&module_name="+encodeURIComponent(module_name),	
		lstr_str+="&data1="+encodeURIComponent(data1)+"&data2="+encodeURIComponent(data2)+"&data3="+encodeURIComponent(data3)+"&data4="+encodeURIComponent(data4)+"&data5="+encodeURIComponent(data5)+"&data6="+encodeURIComponent(data6)+"&div_perc="+encodeURIComponent(div_perc),	
		setTimeout(function(){window.location.href=$host_url+"GetExcelDashboardPopups&"+lstr_str,500});
}  
