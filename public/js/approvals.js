function LoadApprovals(system_module_table_name)
{
	LoadManualFilesToLi("approvals","158","Approvals",'',function(){
		getDefaultHeadFooterLinks('Approvals','approvals');
		Approvals.init(system_module_table_name);
	});
}

var Approvals = function () {

    var content = $('#approvals .inbox-content');
    var loading = $('#approvals .inbox-loading');
    var listListing = '';

    var toggleButton = function(el) {
        if (typeof el == 'undefined') {
            return;
        }
        if (el.attr("disabled")) {
            el.attr("disabled", false);
        } else {
            el.attr("disabled", true);
        }
    }
	 
    return {
        //main function to initiate the module
        init: function (system_module_table_name) {
			Approvals.GetApprovalsList(system_module_table_name);
		},
		GetApprovalsList:function(system_module_table_name)
		{
			$.ajax({
				type: "GET",
				url: $host_url+"GetApprovalsList",
				error:AjaxErrorMessage,
				data:"system_module_table_name="+system_module_table_name, 		
				success: function(responce) 
				{
					responce = eval('(' + responce + ')'); 
					if(responce.error_code=='-9')
					{
						ShowSuccessMsg(responce.data);CallLogout();
						return false;
					}						
					if(responce.error_code == 0)
					{
						
						$("#approvals_ul").html(responce.data['html']);
						$("#approvals_list_ul").html(responce.data['dash_html']);
						if($("#approvals_ul li.notices.active").length==0)
						{
							$("#approvals_ul.inbox-nav :first").addClass('active')
						}
						$("#approvals_ul.inbox-nav .active a").trigger("click");
					}
					if (responce.error_code == -1)
					{
						$("#approvals_ul").html("");
						$("#approvals #approvals_dt_div").html("");
						$("#approvals_head h3").html("No Data Found...");
					}
				}
			})
		},
		GetApprovalsModuleHeaders : function (el, system_module_table_name) {
		
		
			$('#approvals_ul.inbox-nav > li.active').removeClass('active');
			$("#approvals #approvals_ul li a[data-system-table='"+system_module_table_name+"']").parent().addClass('active');
			var bulk_approval = $("#approvals #approvals_ul li a[data-system-table='"+system_module_table_name+"']").attr('data-bulk-approval');
			
			var header = el.attr('data-title');
			$("#approvals_head h3").html(header);
					
			var load_id = "#approvals #approvals_dt_div";
			var main="<table  id='approval_table_grid' class='scroll'  system_module_table_name='"+system_module_table_name+"' ></table> <div id='sub_grid_div'   class='scroll' style='text-align:center;'></div>";
			$(load_id).html("<div class='col-md-12' style='padding:0;'>"+main+"</div>");
			
			var th = document.getElementsByTagName('head')[0];
			var s = document.createElement('script');
			var jt_db=getCookie("jt_db");
			s.setAttribute('type','text/javascript');
			var path='grid_display_files/'+jt_db+"/"+system_module_table_name+'_approval.js';
			s.setAttribute('src',path);
			th.appendChild(s); 
			$("#approvals_head #bulk_app_div").html("");
			if(bulk_approval=='Yes')
			{
				var bulk_app_button = "<span onclick=\"Approvals.MultiApproveReject('"+system_module_table_name+"','Approved')\" style='margin-right: 10px;' class='btn btn-sm green'>";
					bulk_app_button+="<i class='fa fa-check'></i> Approve</span>";
					//bulk_app_button+= "<span onclick=\"Approvals.MultiApproveReject('"+system_module_table_name+"','Rejected')\"  class='btn btn-sm red'>";
					//bulk_app_button+="<i class='fa fa-times'></i> Reject</span>";
				$("#approvals_head #bulk_app_div").html(bulk_app_button);
			}
			 
		},
		MultiApproveReject:function(system_module_table_name,status)
		{
			var app_history_int_codes=jQuery("#approvals #approval_table_grid").getGridParam('selarrrow');
			
			if(app_history_int_codes.length>0)
			{
				Swal({
					title: 'Enter your remarks',
					input: 'text',
					showCancelButton: true,
					confirmButtonColor: '#3085d6',
					cancelButtonColor: '#d33',
					inputValidator: (value) => {
						if (value=='' || value==undefined || value=='undefined')
						{
							return 'Please enter your remarks!';
						}
						else
						{
							remarks = value;
							Approvals.ApproveRejectHistoryTable(system_module_table_name,status,remarks,app_history_int_codes,'Bulk Approval');	
							LoadApprovals(system_module_table_name);
						}
					}
				});
			}
			else
			{
				ShowAlertMsg("Please Select atleast one record");
				return false;
			}
		},
		
		ApproveRejectHistoryTable:function (system_module_table_name,status,remarks,app_history_int_codes,call_type)//Bulk Approval -- selects the ids from the grid and clicks on approve/reject
		{
			
			 var module_id=$("#approvals #approvals_ul li a[data-system-table='"+system_module_table_name+"']").attr('mod_id');
			 var lstr_str="&module_id="+module_id;
				lstr_str+="&module_name="+system_module_table_name;
				lstr_str+="&status="+status;
				lstr_str+="&remarks="+encodeURIComponent(remarks);
				lstr_str+="&app_history_int_codes="+app_history_int_codes;
				
			App.blockUI({boxed:true,message:"Approving/Rejecting "+$g_display_module_name});
			
			 $.ajax({
				type: "POST",
				async:false,

				url: $host_url+"ApproveRejectHistoryTable",
				error:AjaxErrorMessage,
				data:lstr_str, 		
				success: function(responce) 
				{ 
					try  
					{
						responce = eval('(' + responce + ')');
						if(responce.error_code=='-9')
						{
							ShowAlertMsg(responce.data);CallLogout();
							return false;
						}						
						if (responce.error_code == 0)
						{
							if(call_type=='Popup')
							{
								var div_id="popup_module_view_"+module_id;	
								$('#'+div_id).dialog("close")
								$('#'+div_id).remove();
							}
							Approvals.GetApprovalsList(system_module_table_name);
							ShowSuccessMsg(responce.data);
						}
						if(responce.error_code == -1)
						{
							ShowAlertMsg(responce.data);
							App.unblockUI();
						}
						App.unblockUI();
					}
					catch(err)
					{
						txt= err.message;
						App.unblockUI();
						ShowAlertMsg(txt+"<br>"+responce+" in Approvals.GetPFApplicationStatusListCountOnly");
					}  					
				}
			})
		},
			
		OpenModulePoupFromApprovalScreen :function (system_module_table_name,module_id,rowid) 
		{	
			CustomApprovals.CallOpenModulePopupFunc(system_module_table_name,module_id,rowid);
		},
		
		AppendApproveRejectApprovalsForPopup :function (system_module_table_name,module_id,app_history_int_code) {
		
			var html="<div style='padding-top:8px; text-align:center;' id='bulk_app_div' class='col-md-12 pull-right'>";
				html+="<span class='btn btn btn-success' style='margin-right: 10px;' onclick=\"Approvals.MultiApproveRejectFromPopup('"+system_module_table_name+"',"+app_history_int_code+",'Approved')\">";
				html+="<i class='fa fa-check'></i> Approve</span></div>";
				//html+="<span class='btn btn-sm red' onclick=\"Approvals.MultiApproveRejectFromPopup('"+system_module_table_name+"',"+app_history_int_code+",'Rejected')\">";
				//html+="<i class='fa fa-times'></i> Reject</span></div>";
				
			 var div_id="#popup_module_view_"+module_id;	
			 $(div_id).append(html);
		},
		
		MultiApproveRejectFromPopup : function (system_module_table_name,app_history_int_code,status) 
		{
			if(status=="Rejected")
			{
				Swal({
					title: 'Enter your remarks',
					input: 'text',
					showCancelButton: true,
					confirmButtonColor: '#3085d6',
					cancelButtonColor: '#d33',
					inputValidator: (value) => {
						if (value=='' || value==undefined || value=='undefined')
						{
							return 'Please enter your remarks!';
						}
						else
						{
							remarks = value;
							Approvals.ApproveRejectHistoryTable(system_module_table_name,status,remarks,app_history_int_code,'Popup');
							$(".modal").modal('hide');
							LoadApprovals(system_module_table_name);
						}
					}
				});
			}
			else
			{
				remarks=status;
				Approvals.ApproveRejectHistoryTable(system_module_table_name,status,remarks,app_history_int_code,'Popup');
				$(".modal").modal('hide');
				LoadApprovals(system_module_table_name);
			}
		},
		
		MultiApproveRejectFromManualPopup : function (system_module_table_name,app_history_int_code,status) 
		{
			if(status=="Rejected")
			{
				Swal({
					title: 'Enter your remarks',
					input: 'text',
					showCancelButton: true,
					confirmButtonColor: '#3085d6',
					cancelButtonColor: '#d33',
					inputValidator: (value) => {
						if (value=='' || value==undefined || value=='undefined')
						{
							return 'Please enter your remarks!';
						}
						else
						{
							remarks = value;
							Approvals.ApproveRejectHistoryTable(system_module_table_name,status,remarks,app_history_int_code,'');
							$(".modal").modal('hide');
							LoadApprovals(system_module_table_name);
						}
					}
				});
			}
			else
			{
				remarks=status;
				Approvals.ApproveRejectHistoryTable(system_module_table_name,status,remarks,app_history_int_code,'');
				$(".modal").modal('hide');
				LoadApprovals(system_module_table_name);
			}
		}
	}
}();
