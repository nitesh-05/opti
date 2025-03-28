System={
	 
		CreateModuleHtmlFilesNew : function ()
		{
			$.ajax({
				type: "POST",
				data:"schema_id=0",
				url: $host_url+"CreateModuleHtmlFilesNew",      
				success:function CreateModuleHtmlFilesResponce(responce)
						{ 
							try
							{
								responce = eval('(' + responce + ')');    
								ShowSuccessMsg(responce.data);
							}
							catch(err)
							{
								txt= err.message;
								$.unblockUI();
								ShowAlertMsg(txt);
							}	 
						}
 
				});
		}
}		
function ChangeTablesToInnoDB()
{
	$.ajax({
	       type: "POST",
			async:false,
	       url: $host_url+"ChangeTablesToInnoDB",
	        success: ChangeTablesToInnoDBResponce
	    });
}
function ChangeTablesToInnoDBResponce($responce)
{  
	$responce = eval('(' + $responce + ')');
	ShowSuccessMsg("Done");
}	

function TruncateEntryTables()
{
$.ajax({
	       type: "POST",
			async:false,
	       url: $host_url+"TruncateEntryTables",
	        success: TruncateEntryTablesResponce
	    });
}
function TruncateEntryTablesResponce($responce)
{  
	$responce = eval('(' + $responce + ')');
	ShowSuccessMsg("Done");
}	
 function GenerateCompressedFiles()
 {
		$.blockUI({ message: "<h1 class='h1' style='font-size:12px'>Compressing JS Files <img src='/img/spinner.gif' border='0'></h1>" });
		$.ajax({
		 type: "POST",
		 //async: false,
		   url: $host_url+"CompressFilesWithMin",	 
		   success: CompressFilesWithMinResponse
	  });
  
 }
 
 function CompressFilesWithMinResponse(responce)
 {
	responce = eval('(' + responce + ')');
	$.unblockUI();
	ShowSuccessMsg(responce.data);
 } 
 
 //GetSoftwareUpdates;
 function GetSoftwareUpdates()
 {
		$.blockUI({ message: "<h1 class='h1' style='font-size:12px'>Software is Updating.... <img src='/img/spinner.gif' border='0'></h1>" });
		$.ajax({
		type: "POST",
		//async: false,
		url: $host_url+"GetSoftWareUpdates",	 
		success: GetSoftWareUpdatesResponse
	  });
  
 }
 
 function GetSoftWareUpdatesResponse(responce)
 {
	responce = eval('(' + responce + ')');
	$.unblockUI();
	ShowSuccessMsg(responce.data);
 }
 

// Create All schema Files
	function populateAllSchemaFiles()
	{
		 $.ajax({
		 type: "POST",
		 async: false,
		   url: $host_url+"CreateAllSchemaFiles",      
		   data:'schema_id='+0,
		   success: populateAllSchemaFilesResponce
	  });
	} 

function populateAllSchemaFilesResponce($responce)
{
	$responce = eval('(' + $responce + ')'); 
	ShowSuccessMsg($responce.data);	 
}
 
function CreateModuleHtmlFiles()
{
    $.ajax({
		type: "POST",
		data:"schema_id=0",
		url: $host_url+"CreateModuleHtmlFiles.demo",      
		success:CreateModuleHtmlFilesResponce
	});
}
function CreateModuleHtmlFilesResponce($responce)
{ 
    $responce = eval('(' + $responce + ')');    
	ShowSuccessMsg($responce.data);
	 
}
 
function CreatePopUpFiles()
{
	$.ajax({
     type: "POST",
	 async: false,
       url: $host_url+"populateAllPopupGridFiles.demo",      
	   data:'',
       success: populateAllPopupGridFilesResponce
  });
}
function populateAllPopupGridFilesResponce($responce)
{
	$responce = eval('(' + $responce + ')'); 
	ShowSuccessMsg($responce.data);
 
}
function UpdateDefinedFlag() 
{
	$.ajax({
     type: "POST",
	 async: false,
       url: $host_url+"UpdateDefinedFlag.demo",      
	   data:'',
       success: UpdateDefinedFlagResponce
  });
}
function UpdateDefinedFlagResponce($responce)
{
	$responce = eval('(' + $responce + ')'); 
	ShowSuccessMsg($responce.data);
}
   