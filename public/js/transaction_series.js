function CallenableTransactionSeries(e_type)
{  
	document.getElementById('module_name_for_save').value = 'saveTransactionSeries';		
	$('#page_main_div').load("html_modules/system_transcation_series.html",function()
	{ 
		$.ajax({
			type: "POST",
			// async:false,
			url: $host_url+"getTransactionSeriesModule.demo",      
			success: populateTransactionSeriesModule
		});		    
	   if(e_type=='Add')
	   {
		$geditinternalcode=0;
	   }
	   if(e_type=='Edit')
	   {
	     getTransactionSeries($geditinternalcode);
	   }
	    getDefaultHeadFooterLinks('Transaction Series Setup');
		EnableManualModules();
	});
}
function AssignSysDisPrefix()
{
	sys_val=$("#display_series_name").val();
	pref_val=$("#transaction_series_prefix_name").val();
	if(empty(sys_val))
	{
	$("#display_series_name").val(pref_val+"-");
	}
}
function populateTransactionSeriesModule($responce)
{                                                
    $responce = eval('(' + $responce + ')'); 
    $g_link_details_array="";
	$g_link_details_array=$responce.data['links_data'];
 
	if( $responce.error_code=='0')
	{
		document.getElementById('transaction_series_module_name').options.length=0;
		$op = new Option('Select One', '0');	   
		$op.id='0'
		document.getElementById('transaction_series_module_name').options.add($op);
		for($i=0;$i < $responce.data[0].length;$i++)                                  
		{            
		$op = new Option($responce.data[0][$i]['type'], $responce.data[0][$i]['internal_code']);
		$op.id=$responce.data[0][$i]['internal_code'];//specifying the id  for options
		document.getElementById('transaction_series_module_name').options.add($op);
		}
		 
	}
    $("#header_td_id").html($g_link_details_array['header_link']);
	$("#footer_td_id").html($g_link_details_array['footer_link']);
	$("#page_header").show();
	$("#page_footer").show();	
}
function getTransactionSeriesModuleElements(default_val)
{
$.ajax({
		type: "POST",
		 //async:false,
		url: $host_url+"getTransactionSeriesModuleElements.demo",   
		data:"module_id="+document.getElementById('transaction_series_module_name').value,	
		success: function populateTransactionSeriesModuleElements($responce)
				{                                                
					$responce = eval('(' + $responce + ')'); 
					if(  $responce.error_code==0)
					{
					 document.getElementById('transaction_series_ele_name').options.length=0;
					   $op = new Option('Select One', '0');
						$op.id='0';
						document.getElementById('transaction_series_ele_name').options.add($op);
					   for($i=0;$i < $responce.data.length;$i++)                                  
						  {            
						$op = new Option($responce.data[$i]['type'], $responce.data[$i]['internal_code']);
						$op.id=$responce.data[$i]['internal_code'];//specifying the id  for options
						document.getElementById('transaction_series_ele_name').options.add($op);
						} 
						$('#transaction_series_ele_name').val(default_val);
					}
					else
					{
					 document.getElementById('transaction_series_ele_name').options.length=0;
					   $op = new Option('Select One', '0');
						$op.id='0';
						document.getElementById('transaction_series_ele_name').options.add($op);
					}
				}
	});
}

function saveTransactionSeries()
{
if (trim(document.getElementById('transaction_series_module_name').value)=='0')
	{
		alert('Please Select Module Name');
		document.getElementById('transaction_series_module_name').focus();
		return;
	}
	else if (trim(document.getElementById('transaction_series_ele_name').value)=='0')
	{
		alert('Please Select Element Name');
		document.getElementById('transaction_series_ele_name').focus();
		return;
	}
	else if (trim(document.getElementById('transaction_series_start_date').value)=='')
	{
		alert('Please Enter Valid Start Date');
		document.getElementById('transaction_series_start_date').focus();
		return;
	}
	else if (!isDate(document.getElementById('transaction_series_start_date').value,'d/M/y'))
	{
		alert('Please Enter Valid Start date as dd//mm/yy');
		document.getElementById('transaction_series_start_date').focus();
		return;
	}
	else if (trim(document.getElementById('transaction_series_end_date').value)=='')
	{
		alert('Please Enter Valid End Date');
		document.getElementById('transaction_series_end_date').focus();
		return;
	}
	else if (!isDate(document.getElementById('transaction_series_end_date').value,'d/M/y'))
	{
		alert('Please Enter Valid End date as dd//mm/yy');
		document.getElementById('transaction_series_end_date').focus();
		return;
	}
	$lstr_data="internal_code="+$geditinternalcode;
	$lstr_data+="&ref_module_code="+document.getElementById('transaction_series_module_name').value;
	$lstr_data+="&ref_module_element_code="+document.getElementById('transaction_series_ele_name').value;
	$lstr_data+="&series_name="+encodeURIComponent(document.getElementById('transaction_series_field_name').value);
	$lstr_data+="&prefix="+encodeURIComponent(document.getElementById('transaction_series_prefix_name').value);
	$lstr_data+="&starting_no="+encodeURIComponent(document.getElementById('transaction_series_start_no').value);
	$lstr_data+="&ending_no="+encodeURIComponent(document.getElementById('transaction_series_end_no').value);
	$lstr_data+="&last_no="+encodeURIComponent(document.getElementById('transaction_series_last_no').value);
	$lstr_data+="&default_value="+encodeURIComponent(document.getElementById('transaction_series_default_value').value);
	$lstr_data+="&starting_date="+encodeURIComponent(date_format(document.getElementById('transaction_series_start_date').value));
	$lstr_data+="&ending_date="+encodeURIComponent(date_format(document.getElementById('transaction_series_end_date').value));
	$lstr_data+="&display_series_name="+encodeURIComponent((document.getElementById('display_series_name').value));
	
	$.ajax({
		type: "POST",
		//async:false,
		url: $host_url+"saveTransactionSeries.demo",   
		data:$lstr_data,	
		success: populatesaveTransactionSeries
	});
}
function populatesaveTransactionSeries($responce)
{ 
$responce = eval('(' + $responce + ')'); 
alert($responce.data);   
$geditinternalcode=0;
}	
function getTransactionSeries($id)
{
 
 $.ajax({
		type: "POST",
		url: $host_url+"getTransactionSeries.demo",
		data:"internal_code="+$id,
		success: populateTransactionSeries
		});
 }
function populateTransactionSeries($responce)
{
	$responce = eval('(' + $responce + ')');
	$geditinternalcode=$responce.data.internal_code;
	document.getElementById('transaction_series_module_name').value= $responce.data.ref_module_code;
	document.getElementById('transaction_series_field_name').value= $responce.data.series_name;
	document.getElementById('transaction_series_prefix_name').value= $responce.data.prefix;
	document.getElementById('transaction_series_start_no').value= $responce.data.starting_no;
	document.getElementById('transaction_series_end_no').value= $responce.data.ending_no;
	document.getElementById('transaction_series_last_no').value= $responce.data.last_no;
	document.getElementById('transaction_series_start_date').value= $responce.data.starting_date;
	document.getElementById('display_series_name').value= $responce.data.display_series_name;	
	document.getElementById('transaction_series_end_date').value= $responce.data.ending_date;	
	document.getElementById('transaction_series_default_value').value= $responce.data.default_value;	
	//$("#transaction_series_module_name").trigger("onchange");
	//$("#transaction_series_ele_name").val($responce.data.ref_module_element_code);
	getTransactionSeriesModuleElements($responce.data.ref_module_element_code);
	 
 }	