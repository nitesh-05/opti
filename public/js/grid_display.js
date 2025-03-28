var $img_path=getCookie('image_path');
var $host_url=getCookie('host_url');

 
 function selectRowUserSchemaRowId()
{ 
	var id=jQuery("#table_system_general_master_setup").getGridParam('selrow'); 
	$geditinternalcode=id;

	if (id) 
	{ 
		 
		enablegeneralmaster('Edit');
		return;
	} 
	else
	{
		alert("Please select row in grid"); return;
	}
 }
 
function displayUserSchemaMaster_grid(system_module_table_name)
{
	var load_id = "#m_"+system_module_table_name+"_section";
	
	main="<table id='table_system_general_master_setup' class='scroll' ondblclick='selectRowUserSchemaRowId();'></table> <div id='sub_grid_div_system_general_master_setup' class='scroll' style='text-align:center;'></div>";
	$(load_id).html("<div class='col-md-12' id='m_"+system_module_table_name+"' style='margin-top:5px;'>"+main+"</div>");
	var user_schema=jQuery("#table_system_general_master_setup").jqGrid(
	{
		url:$host_url+'viewUserSchemaDeiatls.demo',
		datatype: "json",
		colNames:['Module Name','Display Module Name','Module Type','Active'],
		colModel:[
		{name:'grid_module_name',index:'grid_module_name', width:175 },
		{name:'grid_display_module_name',index:'grid_display_module_name', width:175 },
		{name:'grid_module_type',index:'grid_module_type', width:175 },
		{name:'grid_active',index:'grid_active', width:175 }
		],
		rowNum:50,
		rowList:[50,75,100,125],
		imgpath:$img_path,
		pager: jQuery('#sub_grid_div_system_general_master_setup'),
		sortname: 'id',
		height:'480',
		autowidth: true,
		viewrecords: true,
		sortorder: "desc",
		cellEdit: true,
		loadComplete:function() {
		$('.ui-jqgrid-htable').css('border-collapse','separate');
		},
		multiselect: true,
		 
		editurl:$host_url+'deleteUserSchemaDeiatls.demo'
	}).navGrid('#sub_grid_div_system_general_master_setup',{edit:false,add:false,del:true,search:false},{},{},{},{multipleSearch:true})
			.navButtonAdd('#sub_grid_div_system_general_master_setup',{caption:"Toggle",
			buttonicon :'ui-icon-pin-s', onClickButton:function(){ user_schema[0].toggleToolbar() } }).
    navButtonAdd('#sub_grid_div_system_general_master_setup',{caption:"Edit", 
    onClickButton:function()
    {
	selectRowUserSchemaRowId();
    }	     
    }); 
user_schema.filterToolbar(); 		
  }

function selectRowId()
{ 
	var id=jQuery("#table_grid").getGridParam('selrow'); 
	if (id) 
	{ 
		 
		editRecords(id);
		return;
	} 
	else
	{
		alert("Please select row in grid"); return;
	}
 }

  
function displayUserSchemaModuleDetails()
{
 
$main="<table  id='table_grid' class='scroll' ></table> <div id='sub_grid_div'   class='scroll' style='text-align:center;'></div>";
document.getElementById('page_main_div').innerHTML="<div class='col-md-12'>"+$main+"</div>";
var th = document.getElementsByTagName('head')[0];
var s = document.createElement('script');
var jt_db=getCookie("jt_db");
s.setAttribute('type','text/javascript');
var path='grid_display_files/'+jt_db+"/"+$g_system_module_table_name+'.js';
s.setAttribute('src',path);
th.appendChild(s); 
$('#page-title').html($g_display_module_name+" <small style='color: #1A847B; font-weight:400;'>Listing "+$g_display_module_name+" Details</small>");
}  




function displayUserSchemaModuleDetailsNew(system_module_table_name,internal_code)
{
	var load_id = "#m_"+system_module_table_name+"_section";
	var load_type=all_obj[system_module_table_name]['load_type'];
	all_obj[system_module_table_name]['grid_is_view_click']=1;
	all_obj[system_module_table_name]['geditinternalcode']=0;
	 
	var main="<table  id='table_grid_"+system_module_table_name+"' class='scroll'  system_module_table_name='"+system_module_table_name+"' ></table> <div id='sub_grid_div_"+system_module_table_name+"'   class='scroll' style='text-align:center;'></div>";
	$(load_id).html("<div class='col-md-12' id='m_"+system_module_table_name+"' style='margin-top:5px;'>"+main+"</div>");
	
	var th = document.getElementsByTagName('head')[0];
	var s = document.createElement('script');
	var jt_db=getCookie("jt_db");
	s.setAttribute('type','text/javascript');
	var path='grid_display_files/'+jt_db+"/"+system_module_table_name+'.js';
	s.setAttribute('src',path);
	th.appendChild(s); 
	if(load_type=="FW")
	{
	var obj=all_obj[system_module_table_name];
	$('#page-title').html(obj.g_display_module_name+" <small style='color: #1A847B; font-weight:400;'>Listing "+obj.g_display_module_name+" Details</small>");
	}
		// $('#view_footer_actions').remove();	
		// footer_link="<div id='view_footer_actions'><div style='clear:both;padding-top:4px;'/>"+all_obj[system_module_table_name].g_user_schema_details_array.data.links_data.footer_link+"</div>";
		// $("#m_"+system_module_table_name).parent().after(footer_link);
		// $("#footer_save_link").remove();
				
	
}

function selectRowUserSchemaGroupRowId()
{ 
	var id=jQuery("#table_grid_system_user_schema_group").getGridParam('selrow'); 
	$geditinternalcode=id;

	if (id) 
	{ 
		enable_user_schema_group('Edit');
		return;
	} 
	else
	{
		alert("Please select row in grid"); return;
	}
 }
 
//to Display User Schema group
function display_user_schema_group_master_grid(system_module_table_name)
{
	var load_id = "#m_"+system_module_table_name+"_section";
	
	main="<table id='table_grid_system_user_schema_group' class='scroll' ondblclick='selectRowUserSchemaGroupRowId();'></table> <div id='sub_grid_div_system_user_schema_group' class='scroll' style='text-align:center;'></div>";
	$(load_id).html("<div class='col-md-12' id='m_"+system_module_table_name+"' style='margin-top:5px;'>"+main+"</div>");
		var user_schema_group=jQuery("#table_grid_system_user_schema_group").jqGrid(
		{
			//url:'http://localhost/activity/app.php?a=display_user_schema_group_master_grid.demo',
			url:$host_url+'display_user_schema_group_master_grid.demo',

			datatype: "json",
			colNames:['Schema Name','Tab','Column','Group Name','Multiple Group','Sequence'],
			colModel:[
			{name:'grid_schema_name',index:'grid_schema_name', width:140},
			{name:'grid_tab_name',index:'grid_tab_name', width:140},
			{name:'grid_column_name',index:'grid_column_name', width:140},
			{name:'grid_group_name',index:'grid_group_name', width:140},
			{name:'grid_multiple',index:'grid_multiple', width:100},
			{name:'grid_group_sequence',index:'grid_group_sequence', width:100}
			],
			rowNum:50,
			rowList:[50,75,100,125],
			imgpath:$img_path,
			pager: jQuery('#sub_grid_div_system_user_schema_group'),
			sortname: 'id',
			height:'470',
			  autowidth: true,
			viewrecords: true,
			sortorder: "desc",
			cellEdit: true,
					loadComplete:function() {
					$('.ui-jqgrid-htable').css('border-collapse','separate');
					},
			multiselect: true,
			caption:"User Schema Group Details",
			editurl:$host_url+'mdelete_user_schema_group_master_details_from_grid.demo'
		}
	).navGrid('#sub_grid_div_system_user_schema_group',{edit:false,add:false,del:true,search:false},{},{},{},{multipleSearch:true})
		.navButtonAdd('#sub_grid_div_system_user_schema_group',{caption:"Toggle",buttonicon :'ui-icon-pin-s', onClickButton:function(){ user_schema_element[0].toggleToolbar() } })
		.navButtonAdd('#sub_grid_div_system_user_schema_group',{caption:"Edit", onClickButton:function()
			{
				selectRowUserSchemaGroupRowId();
			}	     
		}); 
	user_schema_group.filterToolbar(); 	
}
 
 function selectRowUserScemaElementRowId()
{ 
	var id=jQuery("#table_grid_user_schema_element").getGridParam('selrow'); 
	$geditinternalcode=id;

	if (id) 
	{ 
		 
		 enable_user_schema_elements('Edit');
		return;
	} 
	else
	{
		alert("Please select row in grid"); return;
	}
 }
 
function display_user_schema_element_master_grid(system_module_table_name)
{
	
	var load_id = "#m_"+system_module_table_name+"_section";
	
	main="<table id='table_grid_user_schema_element' class='scroll' ondblclick='selectRowUserScemaElementRowId();'></table> <div id='sub_grid_div_user_schema_element' class='scroll' style='text-align:center;'></div>";
	$(load_id).html("<div class='col-md-12' id='m_"+system_module_table_name+"' style='margin-top:5px;'>"+main+"</div>");
	var user_schema_element = jQuery("#table_grid_user_schema_element").jqGrid(
	{
	url:$host_url+'display_user_schema_element_master_grid.demo',

	 datatype: "json",
	colNames:['Schema Name','Display Name','Element Name','Data Type','Sequence','Group Name','Field Position','Default Value',
	'Optional','Ref Module Name','Element Type'],
	colModel:[
	{name:'grid_Schema_name',index:'grid_Schema_name', width:110},
	{name:'grid_display_module_name',index:'grid_display_module_name', width:110},
	{name:'grid_name',index:'grid_name', width:85},
	{name:'grid_data_type',index:'grid_data_type', width:65},
	{name:'grid_sequence',index:'grid_sequence', width:65},
	{name:'grid_group_name',index:'grid_group_name', width:70},
	{name:'grid_field_position',index:'grid_field_position', width:50},
	{name:'grid_default_value',index:'grid_default_value', width:45},
	{name:'grid_optional',index:'grid_optional', width:50},
	{name:'grid_ref_module_name',index:'grid_ref_module_name', width:65},
	{name:'grid_meta_type',index:'grid_meta_type', width:55}
	],
	rowNum:50,
	rowList:[50,75,100,125],
	imgpath:$img_path,
	pager: jQuery('#sub_grid_div_user_schema_element'),
	sortname: 'id',
	height:'470',
	  autowidth: true,
	viewrecords: true,
	sortorder: "desc",
	cellEdit: true,
			loadComplete:function() {
			$('.ui-jqgrid-htable').css('border-collapse','separate');
			},
	multiselect: true,
	caption:"User Schema Element Details",
	editurl:$host_url+'mdelete_user_schema_element_master_details_from_grid.demo'

	}
	).navGrid('#sub_grid_div_user_schema_element',{edit:false,add:false,del:true,search:false},{},{},{},{multipleSearch:true})
				.navButtonAdd('#sub_grid_div_user_schema_element',{caption:"Toggle",
				buttonicon :'ui-icon-pin-s', onClickButton:function(){ user_schema_element[0].toggleToolbar() } }).
	  navButtonAdd('#sub_grid_div_user_schema_element',{caption:"Edit", 
		onClickButton:function()
		{
		selectRowUserScemaElementRowId();
		}	     
		}); 
	user_schema_element.filterToolbar(); 	
}
function displayUserSetUpDetails()
{
$main="<table id='table_grid' class='scroll' ondblclick='selectRowId();' ></table> <div id='sub_grid_div' class='scroll' style='text-align:center;'></div>";
document.getElementById('page_main_div').innerHTML="<div class='col-md-12'>"+$main+"</div>";
if(getCookie('user_type')=='Admin')
$del=true;
else
$del=false;
jQuery("#table_grid").jqGrid(
{
//url:'http://localhost/activity/app.php?a=display_user_schema_group_master_grid.demo',
url:$host_url+'displayUserSetUpDetails.demo',

datatype: "json",
colNames:['User Id','Pass Word','User Type','Real Name','Email Id','Department','Group','Edit Text'],
colModel:[
{name:'grid_sysusr',index:'grid_sysusr', width:70},
{name:'grid_sysusrkey',index:'grid_sysusrkey', width:70},
{name:'grid_user_type',index:'grid_user_type', width:70},
{name:'grid_real_name',index:'grid_real_name', width:70},
{name:'grid_email_id',index:'grid_email_id', width:70},
{name:'grid_user_dept',index:'grid_user_dept', width:70},
{name:'grid_user_group',index:'grid_user_group', width:70},
{name:'grid_can_edit_help_text',index:'grid_can_edit_help_text', width:70}
],
rowNum:10,
rowList:[15,20,25,30,35],
imgpath:$img_path,
pager: jQuery('#sub_grid_div'),
sortname: 'id',
height:'250',
width:'935',
viewrecords: true,
cellEdit: true,
		loadComplete:function() {
		$('.ui-jqgrid-htable').css('border-collapse','separate');
		},
sortorder: "desc",
multiselect: true,
caption:"User Schema Group Details",
editurl:$host_url+'deleteUserSetUpDetails.demo' 

}
).navGrid('#sub_grid_div',{edit:false,add:false,del:$del}).
navButtonAdd('#sub_grid_div',{caption:"Edit", 
    onClickButton:function()
    {
	selectRowId();
    }	     
	}); 	 
}
function displayTransactionSeriesGrid()
{
$main="<table id='table_grid' class='scroll' ondblclick='selectRowId();' ></table> <div id='sub_grid_div' class='scroll' style='text-align:center;'></div>";
document.getElementById('page_main_div').innerHTML="<div class='col-md-12'>"+$main+"</div>";

ts=jQuery("#table_grid").jqGrid(
{
 
url:$host_url+'viewTransactionSeriesGrid.demo',
datatype: "json",
colNames:['Module Name','Element Name','Series name','Prefix','Starting No','Ending No','Last No','Start Date','End Date'],
colModel:[
{name:'grid_ref_module_code',index:'grid_ref_module_code', width:115},
{name:'grid_ref_module_element_code',index:'grid_ref_module_element_code', width:115},
{name:'grid_series_name',index:'grid_series_name', width:115},
{name:'grid_prefix',index:'grid_prefix', width:115},
{name:'grid_starting_no',index:'grid_starting_no', width:115},
{name:'grid_ending_no',index:'grid_ending_no', width:115},
{name:'grid_last_no',index:'grid_last_no', width:115},
{name:'grid_starting_date',index:'grid_starting_date', width:115},
{name:'grid_ending_date',index:'grid_ending_date', width:115},
],
rowNum:15,
rowList:[15,20,25,30],
imgpath:$img_path,
pager: jQuery('#sub_grid_div'),
sortname: 'id',
height:'300',
width:'900',
viewrecords: true,
sortorder: "desc",
cellEdit: true,
		loadComplete:function() {
		$('.ui-jqgrid-htable').css('border-collapse','separate');
		},
multiselect: true,
caption:"Transaction Series Details",
editurl:$host_url+'deleteTransactionSeries.demo'
}
).navGrid('#sub_grid_div',{edit:false,add:false,del:true}).
navButtonAdd('#sub_grid_div',{caption:"Edit", 
    onClickButton:function()
    {
	selectRowId();
    }	     
	}); ts.filterToolbar(); 
}

$g_group_s_ref_data_code=0;
function displayUserSchemaModuleGroupDetails($table_name,$s_ref_data_code,$group_id,$main_group_grid_div)
{
	if($("#"+$main_group_grid_div).length>0)
	{
		$g_group_s_ref_data_code=0;
		$g_group_s_ref_data_code=$s_ref_data_code;

		$entry_table=$table_name.replace(/group/g, "entry"); 
		$("#g_group_s_ref_data_code").val($s_ref_data_code);
		 //alert($g_edit_str[$entry_table].is_grid_edit)
		$main="<table  align='left'  id='table_group_grid_"+$group_id+"' class='scroll' ></table> <div id='sub_grid_group_div_"+$group_id+"' class='scroll' style='text-align:center;'></div>";
		document.getElementById($main_group_grid_div).innerHTML="<div class='col-md-12'>"+$main+"</div>";
		var th = document.getElementsByTagName('head')[0];
		var s = document.createElement('script');
		s.setAttribute('type','text/javascript');
		var jt_db=getCookie("jt_db"); 
		var path='grid_display_files/'+jt_db+"/"+$table_name+'.js';
		s.setAttribute('src',path);
		th.appendChild(s); 

	}

}
 