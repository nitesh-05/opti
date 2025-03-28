NoticeBoard =
{
	HideOrShowDisplayToGroup : function()
	{
		var display_to = $("#display_to").val();
		
		if(display_to == "All")
		{
			$("#m_notice_board #department").hide();
			$("#m_notice_board #employee").hide();
		}
		else if(display_to == "Department")
		{
			$("#m_notice_board #department").show();
			$("#m_notice_board #employee").hide();
		}
		else if(display_to == "Employee")
		{
			$("#m_notice_board #department").hide();
			$("#m_notice_board #employee").show();
		}
	},
	
	GetDisplayToGroupData : function()
	{
		var geditinternalcode = all_obj.notice_board.geditinternalcode;
		
		$.ajax({
			type: "POST",	 
			url: $host_url+"GetDisplayToGroupData",  
			data:"geditinternalcode="+geditinternalcode,				
			error:AjaxErrorMessage,		
			success: function GetDisplayToGroupDataResponce(responce)
			{
				try
				{
					App.unblockUI();
					responce = eval('(' +  responce + ')');	
					if(responce.error_code == '0')
					{		
						FWMultiGrid.AssignGridEditDetails("notice_board","notice_board_department_group",responce.data.dept_data); 
						FWMultiGrid.AssignGridEditDetails("notice_board","notice_board_employee_group",responce.data.emp_data);
					}							  
				}
				catch(err)
				{
					txt = err.message;
					App.unblockUI();
					ShowErrorMsg(txt+"<br> in GetDisplayToGroupDataResponce");
				}
			}	
		});
	},
	
	GetNoticeDataForDashboard : function()
	{
		$.ajax({
			type: "POST",
			async: false,
			url: $host_url+"GetNoticeDataForDashboard",      
			success: function GetNoticeDataForDashboardResponce(responce)
			{
				responce = eval('(' + responce + ')'); 	
				
				$("#notice_list_ul").html(responce.data); 
				$('[data-toggle="tooltip"]').tooltip();
			}
		});
	},
	
	OpenNoticeDetailsInPopup : function(nb_int_code)
	{
		$.get("html_modules/notice_board_popup.html", function(data) {
				
			$(".modal-dialog").css("width","");
			html = data;	
			
			$('#model_body').html(html)
			$('#myModalLabel').html('Notice Board');
			setTimeout(function()
			{ 
				NoticeBoard.GetNoticeDetailsForPopup(nb_int_code);
			}, 200);
			if($(window).width()>1200)
			{
				$(".modal-dialog").css("width","40%");
			}
			else
			{
				$(".modal-dialog").css("width","95%");
			}
		});
		$('#myModal').modal('show');
		$("#myModal").on("hidden.bs.modal", function (e) {
			$('#model_body').html('');
		});
	},
	
	GetNoticeDetailsForPopup : function(nb_int_code)
	{
		App.blockUI();
		
		$.ajax({
			type: "POST",	 
			url: $host_url+"GetNoticeDetailsForPopup",  
			data:"nb_int_code="+nb_int_code,				
			error:AjaxErrorMessage,		
			success: function GetNoticeDetailsForPopupResponce(responce)
			{
				try
				{
					App.unblockUI();
					responce = eval('(' +  responce + ')');	
					if(responce.error_code == '0')
					{		
						$("#nb_details_div").html(responce.data); 
					}							  
				}
				catch(err)
				{
					txt = err.message;
					App.unblockUI();
					ShowErrorMsg(txt+"<br> in GetNoticeDetailsForPopupResponce");
				}
			}	
		});
	}
}