// DM- Display Module
// Use -  Modules under manu type 'Display'
DM = {

	GetModuleElementsData : function (system_module_name) {
				
		var save_obj=all_obj[system_module_name];
		var div_id="m_"+system_module_name;
		var save_second_level=save_obj['g_user_schema_details_array']['data'][1];
		var save_schema_details_arr = new Object();
		for($k = 0; $k < save_second_level.length; $k++)
		{
			var field_id=save_second_level[$k].meta_field;
			var meta_data=save_second_level[$k].meta_data;
			var field_id_val='';

			if(meta_data=="User") continue;
			if(save_second_level[$k].meta_field!='' && save_second_level[$k].Type!='Ref Display')
			{
				var system_name= save_second_level[$k].system_name;
				var cell_val= (trim($("#"+div_id+" #"+save_second_level[$k].system_name).val()));
				var int_code=save_second_level[$k].internal_code;;
			 
				if(save_second_level[$k].Type=='DateTime' && cell_val!='')
				{
					field_id_val=date_format_time(cell_val);						 
				}
				else if(save_second_level[$k].Type=='DateTime' && cell_val=='')
				{
					field_id_val="0000-00-00 00:00:00";
				}
				else if(save_second_level[$k].Type=='Month' && cell_val!='')
				{
					field_id_val=getYearMonthDBValue(cell_val);
				}
				else if(save_second_level[$k].Type=='Month' && cell_val=='')
				{
					field_id_val="000000"
				}
				else if (save_second_level[$k].Type=='Reference Data' && save_second_level[$k].is_ref_module_code_lov=='0')
				{
					var txt_ref_val=trim($("#"+div_id+" #"+'txt_ref_schema_'+save_second_level[$k].system_name).val());
					if(empty(txt_ref_val))
					{
						field_id_val="0"
					}
					else 
					{
						field_id_val=cell_val;
						field_id_val=empty(field_id_val)?0:field_id_val;
					}
				}
				else 
				{
					field_id_val=cell_val;
				}
				save_schema_details_arr[field_id]=encodeURIComponent(field_id_val);
			}
		}
		return save_schema_details_arr;
	},
	
	DisplayModuleGetHTMLData : function (system_module_name){
		
		try {
		
			if(!all_obj.validateFormFields(system_module_name)) return;
			var filter_data = this.GetModuleElementsData(system_module_name);

			App.blockUI({
                target: '#m_'+system_module_name,
                boxed: true,
                message: "Generating  Data....!"
            });
			
				$.ajax
				({
					   type: "POST",
					   url: $host_url+"DisplayModuleGetHTMLData",
					   // dataType: "json",
					   // contentType: "charset=utf-8",
					   error:AjaxErrorMessage,		       
					   //async: false,
					   data:"filter_data="+JSON.stringify(filter_data)+"&system_module_name="+system_module_name,
					   success:  function DisplayModuleGetHTMLDataResponce(responce)
								{
									 try
										{
											App.unblockUI('#m_'+system_module_name);
											responce = eval('(' + responce + ')');
											if(responce.error_code=='-9')
											{
												alert(responce.data);
												CallLogout();
												return false;
											}
											if (responce.error_code == 2) 
											{
												bootbox.alert(responce.data);
												return false;
											}
											if(responce.error_code == 0)
											{
												var data_set = responce.data;
												$.each(data_set,function(k,v){
													
													$("#m_"+system_module_name+" #"+k+" .form-body .clearfix:first").nextAll().remove();
													$("#m_"+system_module_name+" #"+k+" .form-body ").append(v);
												});
											}
											if(responce.error_code == -1)
											{
												bootbox.alert(responce.data);
											}
										}	
										catch(err)
										{
											txt= err.message;
											bootbox.alert(txt+"<br> in saveModuleDetails");
										} 
								}	
						   
				  });
		} //try close
		catch(err)
		{
			txt= err.message;
			App.unblockUI();
			bootbox.alert(txt+"<br> in DisplayModuleGetHTMLData");
		}  
	}
	
	
}