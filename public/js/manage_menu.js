$g_mm_group_edt_int_code=0;

function EnableManageMenu()
{
	LoadManualFilesToLi("manage_menus","","My Menus",'',function(){
		EnableMMGroupNames();
		$g_mm_group_edt_int_code=0;
		ShowUserMenuDetails();
	});	
}
function EnableMMGroupNames()
{
	ResetTimer();
    $.ajax({
		type: "POST",
		async: false,
		url: $host_url+"EnableMMGroupNames",
		data:"",
		success: function EnableMMGroupNamesResponce(responce)
		{
          	responce = eval('(' + responce + ')');
			
			document.getElementById('manage_menu_groups').options.length = 0;
			document.getElementById('manage_menu_type').options.length = 0;
			document.getElementById('manage_menu_names').options.length = 0;
			$op = new Option('Select One', '0');
			$op.id='0';
			
			document.getElementById('manage_menu_groups').options.add($op);
			$op = new Option('Select One', '0');
			$op.id='0';
					  
			document.getElementById('manage_menu_type').options.add($op);
			$op = new Option('Select One', '0');
			$op.id='0';
			
			document.getElementById('manage_menu_names').options.add($op);
			var group_names_arr= responce.data['group_names_arr'];
			var menu_type_arr= responce.data['menu_type_arr'];
			for($k=0;$k<group_names_arr.length;$k++)
			{
				$op = new Option(group_names_arr[$k]['value'],group_names_arr[$k]['internal_code']);
				$op.id=group_names_arr[$k]['internal_code'];//specifying the id  for options
				document.getElementById('manage_menu_groups').options.add($op);
			}
			for($k=0;$k< menu_type_arr.length;$k++)
			{
				$op = new Option(menu_type_arr[$k]['value'],menu_type_arr[$k]['internal_code']);
				$op.id=menu_type_arr[$k]['internal_code'];//specifying the id  for options
				document.getElementById('manage_menu_type').options.add($op);
			}
		}
	});
}
function GetMMModuleNamesForModuleType()
{
	ResetTimer();
    $.ajax({
		type: "POST",
		async: false,
		url: $host_url+"GetMMModuleNamesForModuleType",
		data:"module_type="+$("#manage_menu_type").val(),
		success: function GetMMModuleNamesForModuleTypeResponce(responce)
		{
          	responce = eval('(' + responce + ')');
			document.getElementById('manage_menu_names').options.length = 0;

			$op = new Option('Select One', '0');
			$op.id='0';
			document.getElementById('manage_menu_names').options.add($op);

			var module_type_arr= responce.data['module_type_arr'];

			for($k=0;$k< module_type_arr.length;$k++)
			{
				$op = new Option(module_type_arr[$k]['value'],module_type_arr[$k]['internal_code']);
				$op.id=module_type_arr[$k]['internal_code'];//specifying the id  for options
				document.getElementById('manage_menu_names').options.add($op);
			}
		}
	});
}

function EnableMMGroupDetails()
{
	$("#mm_group_name").val("");
	$("#mm_group_seq").val("0");
	$g_mm_group_edt_int_code=0;ResetTimer();
    $.ajax({
		type: "POST",
		async: false,
		url: $host_url+"EnableMMGroupDetails",
		data:"",
		success: function EnableMMGroupDetailsResponce(responce)
		{
          	responce = eval('(' + responce + ')');
			$("#div_mm_group_details").html(responce.data['html']);
			$g_mm_group_edt_int_code=0;
			$('[data-toggle="tooltip"]').tooltip();
		}
    });
}
function ShowUserMenuDetails()
{
	$g_mm_group_edt_int_code=0;ResetTimer();
    $.ajax({
		type: "POST",
		async: false,
		url: $host_url+"ShowUserMenuDetails",
		data:"",
		success: function ShowUserMenuDetailsResponce(responce)
		{
			responce = eval('(' + responce + ')');
			$("#menu_details_div").html(responce.data['html']);
			$('.list-unstyled').slimScroll({
				height: '196.8px'
			});
			$g_mm_group_edt_int_code=0;
		}
    });
}
function DeleteMMGroupNames(int_code)
{
	swal({
		title: 'Do You want to delete this Group Name ?',
		type: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'Yes'
	}).then((result) => { 
		if (result.value===true)
		{ 
			$.ajax({
				type: "POST",
				async: false,
				url: $host_url+"DeleteMMGroupNames",
				data:"int_code="+int_code,
				success: function DeleteMMGroupNamesResponce(responce)
				{
					responce = eval('(' + responce + ')');
					EnableMMGroupDetails();
				}
			});
		}
	});
}
function deleteMMMenuDetals(int_code)
{
	swal({
		title: 'Do You want to delete this Menu Name ?',
		type: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'Yes'
	}).then((result) => { 
		if (result.value===true)
		{ 
			$.ajax({
			type: "POST",
			async: false,
			url: $host_url+"deleteMMMenuDetals",
			data:"int_code="+int_code,
			success: function DeleteMMGroupNamesResponce(responce)
				{
					responce = eval('(' + responce + ')');
					EnableManageMenu();
				}
			});
		}
	});
}
function EditMMGroupNames(int_code)
{
    $g_mm_group_edt_int_code=int_code;
    $.ajax({
    type: "POST",
    async: false,
    url: $host_url+"EditMMGroupNames",
    data:"int_code="+int_code,
    success: function EditMMGroupNamesResponce(responce)
          {
          	responce = eval('(' + responce + ')');
             $("#mm_group_name").val(responce.data['value']);
             $("#mm_group_seq").val(responce.data['sequence']);
          }
    });
}
function SaveMMGroupNames()
{
    var group_name= $("#mm_group_name").val();
    var sequence= $("#mm_group_seq").val();
    if(empty(group_name))
    {
		ShowAlertMsg("Please Enter the group name");
		return false;
    }
    $.ajax({
		type: "POST",
		async: false,
		url: $host_url+"SaveMMGroupNames",
		data:"int_code="+$g_mm_group_edt_int_code+"&group_name="+group_name+"&sequence="+sequence,
		success: function EditMMGroupNamesResponce(responce)
		{
          	responce = eval('(' + responce + ')');
            ShowSuccessMsg(responce.data);
            if(responce.error_code==0)
            {
				EnableMMGroupDetails();
            }
		}
    });
}
function AssignMMCustomeModuleName()
{
	//if(empty($("#user_menu_name").val()))
	{
		$("#user_menu_name").val($("#manage_menu_names option:selected").text());
	}
}
function SaveMMModuleValues()
{
    var group_name= $("#manage_menu_groups").val();
    var manage_menu_type= $("#manage_menu_type").val();
    var manage_menu_names= $("#manage_menu_names").val();
    var user_menu_name= $("#user_menu_name").val();
    var mm_sequence= $("#mm_sequence").val();
    if(empty(mm_sequence))
    mm_sequence=0;
    if(empty(group_name))
    {
		ShowAlertMsg("Please Select the group name");
		return false;
    }
    else  if(empty(manage_menu_type))
    {
		ShowAlertMsg("Please Select Menu Type");
		return false;
    }

    else if(empty(manage_menu_names))
    {
		ShowAlertMsg("Please Select Module Name");
		return false;
    }
    else if(empty(user_menu_name))
    {
		ShowAlertMsg("Please Enter Menu Name");
		return false;
    }
    var lstr_data="";
        lstr_data+="&group_name="+group_name;
        lstr_data+="&manage_menu_type="+manage_menu_type;
        lstr_data+="&manage_menu_names="+manage_menu_names;
        lstr_data+="&user_menu_name="+user_menu_name;
        lstr_data+="&mm_sequence="+mm_sequence;
    $.ajax({
		type: "POST",
		async: false,
		url: $host_url+"SaveMMModuleValues",
		data:lstr_data,
		success: function SaveMMModuleValuessResponce(responce)
		{
          	responce = eval('(' + responce + ')');
            ShowSuccessMsg(responce.data);
            if(responce.error_code==0)
            {
                ShowUserMenuDetails();
            }

		}
    });
}
function ShowUserMegaMenu()
{
	$.ajax({
		type: "POST",
		async: false,
		url: $host_url+"ShowUserDashboardMenu",      
		success: function ShowUserDashboardMenuResponce(responce)
		{
			responce = eval('(' + responce + ')'); 	
			
			if(!empty(responce.data.my_menu_html))
			{
				$("#user_mega_menu").html(responce.data.my_menu_html); 
				$("#my_menus").show();			
			}
			else
			{
				$("#my_menus").hide(); 
			}
		}
	});
}
