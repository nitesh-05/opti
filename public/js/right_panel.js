RightPanel =
{
	GetRightPanelData : function()
	{
		$.ajax({
			type: "POST",	 
			url: $host_url+"GetRightPanelData",  
			data:"",				
			error:AjaxErrorMessage,		
			success: function GetRightPanelDataResponce(responce)
			{
				try
				{
					App.unblockUI();
					responce = eval('(' +  responce + ')');	
					if(responce.error_code == '0')
					{		
						$("#right_panel_list").html(responce.data);
					}							  
				}
				catch(err)
				{
					txt = err.message;
					App.unblockUI();
					ShowErrorMsg(txt+"<br> in GetRightPanelDataResponce");
				}
			}	
		});
	}
}