var $loaded_js_files_arr = new Array(); 
function includeJsFilesMannually(js_path)
{
   
	if(js_path!="" && !in_array(js_path,$loaded_js_files_arr))
	{
	 
	  $loaded_js_files_arr.push(js_path);
	/*   var oHead = document.getElementsByTagName('head')[0];
        var oScript = document.createElement('script');
        oScript.type = 'text/javascript';
        oScript.charset = 'utf-8';
        oScript.src = js_path;
        oHead.appendChild(oScript);  */
	  
	  $(document.createElement('script')).attr('src',js_path).attr('type', 'text/javascript').appendTo('head');
	}
}
function includeJsFilesMannuallyByHead(js_path)
{
	if(js_path!="" && !in_array(js_path,$loaded_js_files_arr))
	{
	 
	  $loaded_js_files_arr.push(js_path);
		head.js(js_path);
	}
}

function includeCustomJs($js_path)
{
	$js_path_arr= $js_path.split(',');
	for($js=0;$js<$js_path_arr.length;$js++)
	{
		var js_path_details=$js_path_arr[$js];
		if(!in_array(js_path_details,$loaded_js_files_arr))
		{
			
			includeJsFilesMannually(js_path_details);
		}
	}
}

$load_frame_work_supported_file=0;
function IncludeFrameWorkSupportFiles()
{
	if($load_frame_work_supported_file==0)
	{
	 
		var modules = [
		 
			{ include: true, incfile:'custom_js/PreSaveModuleValidation.js'},
			{ include: true, incfile:'custom_js/postSaveSchemaGroupDetails.js'},				 
			// { include: true, incfile:'js/form_submit.js'},			
			{ include: true, incfile:'js/upload_details.js'},			
			{ include: true, incfile:'js/formatdate.js'},  
		 
			{ include: true, incfile:'js/validate.js'}, 		  		
			{ include: true, incfile:'js/gandhi_grid_popup.js'}, 		  		
		 						 
			//{ include: true, incfile:'custom_js/gandhi_grid.js'}, 			 
			{ include: true, incfile:'custom_js/include_js.js'}, 			 
			{ include: true, incfile:'custom_js/quick_item_search.js'}, 			 
			 						 
			{ include: true, incfile:'custom_js/PreMultipleSaveValidation.js'},		
		 	
		];
		var filename;
		for(var i=0;i<modules.length; i++)
		{
			if(modules[i].include === true) {        	
				filename =  modules[i].incfile;
				 head.js(filename);
			}
		}
	 $load_frame_work_supported_file=1;	
	}
}
function enableTransactionSeries()
{
		head.js("js/transaction_series.js",function(){CallenableTransactionSeries('Add')});
}