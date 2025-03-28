var focus = {focus:1};
FWMultiGrid =  {

	FormFWMultiGroupGrid : function (system_module_name) {
		
		var geditinternalcode=all_obj[system_module_name].geditinternalcode;
		var multi_group_arr=all_obj[system_module_name].g_multi_group;
		var group_html="";
		if(empty(multi_group_arr))
			return;
		/* Loop through each multi group  */
		$.each(multi_group_arr, function (gk,gv) { 		
			focus.focus=0;
			var group_table_name=gv.table_name;
			var group_name=gv.group_name;
			var parent_group=gv.parent_group;
			var grp_ele_arr=gv.elements;
			$("#m_"+system_module_name+" #"+group_table_name+" tbody").html("");
			
			
			if(empty(grp_ele_arr) || geditinternalcode>0 || parent_group>0) return;
			
			FWMultiGrid.FormGridEditFields(system_module_name,group_table_name,0,'Add');
			$("#m_"+system_module_name+" #"+group_table_name).tablesorter();
		});
		focus.focus=1;
	},
	CopyRowData:function (system_module_name,group_table_name,base_tr_id)
	{
		var row_obj=FWMultiGrid.GetRowDataFromTable(system_module_name,group_table_name,base_tr_id);
	row_obj['group_int_code']=0;
	 
	 var last_id=parseInt($("#m_"+system_module_name+" #"+group_table_name+" tbody tr:last").attr('id'));
	 last_row_id=last_id+1;
	 
 
						var input_id="#m_"+system_module_name+" #"+group_table_name+" tbody";
				 
					 
					
						$(input_id).append("<tr id='"+last_row_id+"' onDblclick=\"FWMultiGrid.EditGridRow('"+system_module_name+"','"+group_table_name+"',"+last_row_id+");\"></tr>");
					 						   
							FWMultiGrid.FormGridRowFromInputToTableRow(system_module_name,group_table_name,row_obj,last_row_id,'No','No');
			  
	},
	//Form Grid Fields to Enter data
	FormGridEditFields : function (system_module_name,group_table_name,base_tr_id,type)
	{	
	  
		try {
		
			if(type == 'Edit')
			{
				var pre_edit_flag = ModuleGridPreSaveValidation.MultiGridPreEditRowEvent(system_module_name,group_table_name,base_tr_id); 
				if(pre_edit_flag == false)
					return false;
			}
			
			
			var select_id = "#m_"+system_module_name+" #"+group_table_name+" tbody tr";
			var grid_edit_box_cnt = $(select_id+" input:visible, "+select_id+" select:visible").length;
			
			if(grid_edit_box_cnt>0)
			{
				
				var row_type = $(select_id+" #actions #row_cancel").attr('data-row-type');
				var edit_row_id = $(select_id+" #actions #row_cancel").parent().parent().attr('id');
				
				if(row_type == 'New')
					$("#m_"+system_module_name+" #"+group_table_name+" tbody tr[id='"+edit_row_id+"']").remove();
				else
					FWMultiGrid.CancelEditGridRow(system_module_name,group_table_name,edit_row_id);
			}
			
			var cancel_row_obj=new Object();
			var tr_id_arr=new Array();
			var group_int_code=0;
			
			var t_tax_structure_exists = all_obj[system_module_name].t_tax_structure_exists;
			var tax_structure_type = all_obj[system_module_name].g_multi_group[group_table_name].tax_structure_type;
			var is_item_tax_data_exists = all_obj[[system_module_name]].g_multi_group[group_table_name].grp_system_name_full_arr.hasOwnProperty('item_tax_data');
			
			var tr_id="";
			if(type=='Add')
			{
				if(parseInt($(select_id).length)==0)
					tr_id=1;
				else
				{
					jQuery.each($(select_id), function (k,v) {

						tr_id_arr.push(parseInt(v['id']));
					})
					tr_id=Math.max.apply(Math, tr_id_arr)+1;
				}
				
			}
			else
			{
				tr_id=base_tr_id;
				group_int_code=$(select_id+"[id='"+tr_id+"'] #group_int_code_"+tr_id).val();
				var third_level_obj=$(select_id+"[id='"+tr_id+"'] #third_level_obj_"+tr_id).html();
				$(select_id+"[id='"+tr_id+"']").removeClass('last-saved ');
				$(select_id+"[id='"+tr_id+"']").addClass('editing');
				cancel_row_obj['group_int_code']=group_int_code;
			}
						
			var grp_ele_arr = all_obj[system_module_name].g_multi_group[group_table_name]['elements'];
			var  full_lov_values = all_obj[system_module_name].g_multi_group[group_table_name]['lov_values'];
			var is_child_exists=all_obj[system_module_name].g_multi_group[group_table_name]['is_child_exists'];
			var is_edit_pop_up=all_obj[system_module_name].g_multi_group[group_table_name]['is_edit_pop_up'];
			var is_grid_edit=all_obj[system_module_name].g_multi_group[group_table_name]['is_grid_edit'];
			var is_delete_row=all_obj[system_module_name].g_multi_group[group_table_name]['is_delete_row'];
			
			var parent_group=all_obj[system_module_name].g_multi_group[group_table_name]['parent_group'];
			var group_html="<td id='seq_"+tr_id+"'><p style='width:30px;'></p></td>";
			var auto_fill_ele_arr = [];
			/* Loop through each multi group  */
			$.each(grp_ele_arr, function (ek,ev) {			
			
				var data_type=ev.Type;
				
				var db_field=ev.db_field;
				var sub_group_code=ev.sub_group_code;
				var is_visible=ev.is_visible;
				var meta_data=ev.meta_data;
				var is_ref_module_code_lov=ev.is_ref_module_code_lov;
				var populate_lov=ev.populate_lov;
				var name=ev.name;
				var grid_width=parseInt(ev.grid_width);
			
				if(grid_width==0)
					grid_width=100;
				var system_name=ev.system_name;
				var optional=ev.optional;
				var is_read_only=ev.is_read_only;
				var width = ev.width*10;
				var on_exit = ev.on_exit;
				var on_enter = ev.on_enter;
				var on_exit_event="";
				var on_change_event="";
				var on_enter_event="";
				
				 if(data_type=="Auto Fill")
				{
					auto_fill_ele_arr.push(system_name);
				}
				
				if(!empty(on_exit))
					on_exit_event=" onBlur=\""+on_exit+"\"";
					
				if(!empty(on_exit))
					on_change_event="onchange='"+on_exit+"'";
					
				if(!empty(on_enter))
					on_enter_event=" onfocus=\""+on_enter+"\"";
					
				var read_only="";
				var disabled="";
				var tab_index="";
				if(is_read_only==1)
				{
					read_only='Readonly=Readonly';
					disabled='disabled';
					tab_index='tabindex=-1';
				}
					var optional_html="";
				if(optional=='0')
				{
					optional_html="<span class='required'>*</span>";
				}
				
				var accept_no="";
				var text_align="text-align:left;"
				var td_val="";
				var span_val="";
				
				if(t_tax_structure_exists=='Yes' && tax_structure_type=='Item' && is_item_tax_data_exists==true && system_name=='item_tax_data')
				{
				td_val=encodeURIComponent(JSON.stringify(all_obj[system_module_name]['t_item_tax_data'])); 
				}
				if(type=='Edit')
				{
					td_val=($(select_id +" #"+system_name+"_"+tr_id+" p").html());
					span_val=EncodeSingleQuote(encodeURIComponent($(select_id +" p #txt_ref_schema_"+system_name+"_"+tr_id).html()));
					cancel_row_obj[db_field]=EncodeSingleQuote(encodeURIComponent(td_val));
					
				}
					
				if(data_type=='Number')
				{
					accept_no= "onkeypress='return acceptNumbersOnlyForModule(event)'";
					text_align="text-align:right;";
				}
				
				var td_display="";
				if(sub_group_code>0 || is_visible==0)
					td_display=" style='display:none;'";
				
				if(data_type=='Reference Data')
				{
					td_val=0;

					if(type=='Edit')
					{
					  td_val=$(select_id +" p #"+system_name+"_"+tr_id).val();
					  cancel_row_obj["txt_ref_schema_"+db_field]=span_val;
					  cancel_row_obj[db_field]=EncodeSingleQuote(encodeURIComponent(td_val));;
					}
					var ref_module_code=ev.ref_module_code;
					var ref_module_table=ev.ref_module_table;
					var ref_module_dis_name=ev.ref_module_dis_name;
					span_val=decodeURIComponent(span_val);
				 
					if(populate_lov==1 && is_ref_module_code_lov==1)
					{
						db_list_of_values=full_lov_values[system_name];
						 
							group_html+="<td "+td_display+">";
								group_html+="		<select id='"+db_field+"' "+disabled+"  "+tab_index+"  "+on_change_event+" class='form-control input-sm' style='width:"+grid_width+"px;'>";
									group_html+="<option  value='0'>Select One</option>";
								$.each(db_list_of_values, function(lk,lv){
									var selected="";
									if(lv['internal_code']==td_val)
										selected=" selected ";
										group_html+="<option "+selected+" value='"+lv['internal_code']+"'>"+lv['value']+"</option>";
								});

								group_html+="</select></td>";
					}
					else
					{
						group_html+="<td "+td_display+">";
						group_html+="		<div class='input-icon right' style='width:"+grid_width+"px;'><input  class='form-control'   id='"+db_field+"'   type='hidden'  name='"+ref_module_code+"'  value='"+td_val+"' />";
						group_html+="			<i class='fa fa-search' onclick=\"POPUP.OpenFWPopup('"+ref_module_table+"','"+system_module_name+"' ,'"+system_name+"');\" style='cursor:pointer; color:#333333; margin-top: 4px;'></i>";
						group_html+="			<input class='form-control input-sm' placeholder='"+name+"'  value='"+span_val+"'  on_exit=\""+on_exit+"\"   "+on_enter_event+"   "+read_only+"  "+tab_index+" id='txt_ref_schema_"+db_field+"'  type='text' style=' ' value=''>";
						group_html+="<script>POPUP.AssignJqueryAutoCompleteNew('"+ref_module_table+"','"+system_module_name+"' ,'"+system_name+"','');</script>	</div>";
						group_html+="</td>";
					}
				}
				else if(data_type=='List Of Values')
				{
					var list_of_values=ev.list_of_values;
						list_of_values=list_of_values.split('|');
						
					group_html+="<td "+td_display+">";
					group_html+="		<select id='"+db_field+"' "+disabled+"  "+tab_index+"  "+on_change_event+" class='form-control input-sm' style='width:"+grid_width+"px;'>";
					
					$.each(list_of_values, function(lk,lv){
						var selected="";
						if(lv==td_val)
							selected=" selected ";
						group_html+="<option "+selected+" value='"+lv+"'>"+lv+"</option>";
					});

					group_html+="</select></td>";
				}
				else if(data_type=='Date')
				{
					var date_default_val_arr=all_obj[system_module_name]['g_user_schema_details_array']['data']['date_fields_default_values'];
					var default_val=date_default_val_arr[db_field];
					var date_val=default_val;
					if(type=='Edit')
					{
						date_val=td_val;
					}
					 
					group_html+="<td "+td_display+">";
					group_html+="<div data-date-viewmode='years' data-date-format='dd/mm/yyyy' class='input-icon right'  style='width:"+grid_width+"px;'>";	
					group_html+="<i style='cursor:pointer; color:#333333;' onclick=\"all_obj.CallTarkaDatePickerNew('"+system_module_name+"','"+db_field+"')\" class='fa fa-calendar'></i>";	
					group_html+="<input type='text' id='"+db_field+"' "+read_only+" "+tab_index+"  "+on_exit_event+"  "+on_enter_event+"  placeholder='"+name+"' value='"+date_val+"' class='form-control date date-picker input-sm'>";
					group_html+="</div></td>";
				}
				else if(data_type=='DateTime')
				{
					var date_default_val_arr=all_obj[system_module_name]['g_user_schema_details_array']['data']['date_fields_default_values'];
					var default_val=date_default_val_arr[db_field];
					var date_val=default_val;
					if(type=='Edit')
					{
						date_val=td_val;
					}
					 
					group_html+="<td "+td_display+">";
					group_html+="<div data-date-viewmode='years' data-date-format='dd/mm/yyyy' class='input-icon right'  style='width:"+grid_width+"px;'>";	
					group_html+="<i style='cursor:pointer; color:#333333;' onclick=\"CallTarkaDateTimePicker('"+db_field+"')\" class='fa fa-calendar'></i>";	
					group_html+="<input type='text' id='"+db_field+"' "+read_only+" "+tab_index+"  "+on_exit_event+"  "+on_enter_event+"  placeholder='"+name+"' value='"+date_val+"' class='form-control date date-picker input-sm'>";
					group_html+="</div></td>";
				}
				else if(data_type=='Number')
				{ 
					group_html+="<td "+td_display+">";
					group_html+="		<input type='text' "+on_exit_event+" "+on_enter_event+" placeholder='"+name+"' maxlength='20' id='"+db_field+"' value='"+td_val+"' style='"+text_align+"; width:"+grid_width+"px;'  "+tab_index+" "+read_only+" class='form-control input-sm' "+accept_no+">";
					group_html+="</td>";
				}
				else if(data_type=='Large Text')
				{ 
					var text_area_rows=parseInt(ev.text_area_rows);
			
					group_html+="<td "+td_display+">";
					group_html+="	 <textarea rows='"+text_area_rows+"' cols='1'   style='"+text_align+"; width:"+grid_width+"px;'   id='"+db_field+"'  class='form-control input-sm'> "+td_val+"</textarea> ";
					group_html+="</td>";
				}
				else if(data_type=='Attachment')
				{ 
			 
					group_html+="<td "+td_display+">";
					
					attach_name_val="";
					if(type=='Edit')
					{
						cancel_row_obj[db_field]="";
						data_att_state = $(select_id+"[id='"+tr_id+"'] td[id='"+system_name+"_"+tr_id+"'] p").attr('data-att-state');
					 
						data_file_name = $(select_id+"[id='"+tr_id+"'] td[id='"+system_name+"_"+tr_id+"'] p").attr('data-file-name');
						data_file_src = $(select_id+"[id='"+tr_id+"'] td[id='"+system_name+"_"+tr_id+"'] p").attr('data-file-src');
						
						attach_name_val=data_file_name;
						group_html+="<div style='width:100%;'><input type='file'  id='"+db_field+"' style='float:left; width: 200px;' data-att-state='"+data_att_state+"' onchange=\"all_obj.ReadAttachment('"+system_module_name+"','"+db_field+"')\" data-file-src='"+data_file_src+"'  data-file-name='"+data_file_name+"' type='text'   />";
						if(data_att_state=="db-attch")
						{
							group_html+="<a id='"+db_field+"_attch_name' target='_new' href='"+data_file_src+"' style='float:left; margin:3px; '>"+attach_name_val+"</a>";
						}
						else
							group_html+="<a id='"+db_field+"_attch_name' target='_new' href='' style='float:left; margin:3px; '>"+attach_name_val+"</a>";
						
						var display_style=" display:none; ";
						if(!empty(attach_name_val) && attach_name_val!='undefined')
						{
							display_style="";
						}
						if(data_att_state=='New' || data_att_state=='db-attch')
						{	
					 
							cancel_row_obj[db_field]=encodeURIComponent(data_file_src);
							cancel_row_obj[db_field+"_attch_name"]=encodeURIComponent(data_file_name);
							cancel_row_obj[db_field+"_data_attch_state"]=encodeURIComponent(data_att_state);
						}
						
						group_html+="<span class='btn  input-sm' id='"+db_field+"_attch_del' style='float:left;"+display_style+" ' onclick=\"all_obj.RemoveAttachment('"+system_module_name+"','"+db_field+"')\">";
						group_html+="	<i class='fa fa-trash-o' style='color:red;'></i>";
						group_html+=" </span>";
						group_html+=" </div>";
					}
					else
					{
						group_html+="<div style='width:100%;'><input type='file'  id='"+db_field+"' style='float:left; width: 200px;' data-att-state='' onchange=\"all_obj.ReadAttachment('"+system_module_name+"','"+db_field+"')\" data-file-src=''  data-file-name='' type='text'   />";
						group_html+="<a id='"+db_field+"_attch_name' target='_new' href='' style='float:left; margin:3px; '></a>";
						group_html+="<span class='btn  input-sm' id='"+db_field+"_attch_del' style='float:left; display:none;' onclick=\"all_obj.RemoveAttachment('"+system_module_name+"','"+db_field+"')\">";
						group_html+="	<i class='fa fa-trash-o' style='color:red;'></i>";
						group_html+=" </span>";
						group_html+=" </div>";
					
					}
									 
				}
				else if(data_type=='Image')
				{	
					var image_class='fileinput-new';
					var new_image_tag='';
					if(type=='Edit')
					{
						
						var image_type = $(select_id+"[id='"+tr_id+"'] td[id='"+system_name+"_"+tr_id+"']  img").attr('data-image-type');
						
						cancel_row_obj[db_field]="";
						if(image_type=='new-image' || image_type=='db-image')
						{	
							var image_data  = $(select_id+"[id='"+tr_id+"'] td[id='"+system_name+"_"+tr_id+"']  img").attr('src');
							var image_name = $(select_id+"[id='"+tr_id+"'] td[id='"+system_name+"_"+tr_id+"']  img").attr('data-image-name');
							
							new_image_tag="<img src='"+image_data+"' data-image-name='"+image_name+"'></img>";
							image_class='fileinput-exists';
							cancel_row_obj[db_field]=encodeURIComponent(image_data);
							cancel_row_obj[db_field+"_image_name"]=encodeURIComponent(image_name);
						}
					}
					
					group_html+="<td "+td_display+">";
					group_html+="<div id='"+db_field+"' style='width:"+grid_width+"px; text-align: center;'>";
					group_html+="	<div class='fileinput "+image_class+"' data-provides='fileinput'>";
					group_html+="		<div class='fileinput-new thumbnail' style='width: 100px; height: 100px;'>";
					group_html+="			<img src='img/NoPictureAvailable_sm.jpg' alt=''/>";
					group_html+="		</div>";
					group_html+="		<div class='fileinput-preview fileinput-exists thumbnail' style='max-width: 100px; max-height: 100px;'>"+new_image_tag+"</div>";
					group_html+="		<div>";
					group_html+="			<span class='btn default btn-file' style='padding:2px; font-size:12px;'>";
					group_html+="				<span class='fileinput-new'>Select image</span>";
					group_html+="				<span class='fileinput-exists'>Change</span>";
					group_html+="				<input type='file'  name='...'>";
					group_html+="			</span>";
					group_html+="			<a href='#' class='btn default fileinput-exists' data-dismiss='fileinput' style='padding:2px; font-size:12px;'>Remove</a>";
					group_html+="		</div>";
					group_html+="	</div>";
					group_html+="</div>";
					group_html+="</td>";
				}
				else if(data_type=="Checkbox")
				{
					var checked="";
				 
					if(type=='Edit')
					{
						var checked_val = $(select_id +"[id='"+tr_id+"'] #"+system_name+"_"+tr_id+" p :input[type='checkbox']").is(':checked');
						 
						if(checked_val)
							checked="checked";
						 
						cancel_row_obj[db_field]=checked;
					}
					group_html+="<td "+td_display+">";
					group_html+="	  <input type='checkbox' onclick=\""+on_enter+"\" "+checked+" id='"+db_field+"' "+disabled+"  "+tab_index+" class='input-sm' style='width:40px;'>";
					group_html+="</td>";
				}
				else 
				{
					
					var user_read_only="";
					if(meta_data=='User')
						user_read_only="readonly";
					group_html+="<td "+td_display+">";
					group_html+="		<input type='text' "+user_read_only+"  "+on_exit_event+"  "+on_enter_event+" placeholder='"+name+"' id='"+db_field+"' value=\""+EscapeDoubleQuote(td_val)+"\" style='"+text_align+"; width:"+grid_width+"px;' "+read_only+" "+tab_index+"  class='form-control input-sm' "+accept_no+">";
					// group_html+="<script>$('#"+db_field+"').val(\""+td_val+"\");</script></td>";
				}
			});
			var cancel_function="";
			var pop_up = "";
			var hover="";
			var row_type="";
			if(type=='Add')
			{
				pop_up = "NewPopup";
				hover=" Clear";
				row_type="New";
				cancel_function = " onclick=\"FWMultiGrid.ClearGroupFields('"+system_module_name+"','"+group_table_name+"','"+tr_id+"');\" ";
			}
			else
			{
				row_type="Edit";
				pop_up = "EditPopup";
				hover=" Cancel";
				// console.log(cancel_row_obj);
				cancel_row_obj=encodeURIComponent(JSON.stringify(cancel_row_obj));
				cancel_function = " onclick=\"FWMultiGrid.CancelEditGridRow('"+system_module_name+"','"+group_table_name+"','"+tr_id+"');\" ";
			}
			
			var child_group_html="";
			if(is_child_exists==1)
			{
				child_group_html+="		<span class='btn btn-sm dark tooltips' onkeypress='return keyHandler(event,this);'  tabindex=0 onclick=\"FWMultiGrid.OpenThirdLevelPopup('"+system_module_name+"','"+group_table_name+"','"+tr_id+"',"+group_int_code+");\" data-placement='bottom' data-original-title='Third Level' style='padding: 0px 3px;'>";
				child_group_html+="			<i class='fa fa-sitemap'></i>";
				child_group_html+="		</span>";
			}
			
			group_html+="<td style='width: 120px;' id='actions'>";
			group_html+="		<span class='btn btn-sm green tooltips' onkeypress='return keyHandler(event,this);' tabindex=0 onclick=\"return FWMultiGrid.SaveTableRecord('"+system_module_name+"','"+group_table_name+"','"+tr_id+"','Grid');\" data-placement='bottom' data-original-title='Save' style='padding: 0px 3px;'>";
			group_html+="			<i class='fa fa-save'></i>";
			group_html+="		</span>";
			group_html+="		<span class='btn btn-sm default tooltips'  onkeypress='return keyHandler(event,this);' tabindex=0 id='row_cancel' data-cancel='"+cancel_row_obj+"' "+cancel_function+" data-row-type='"+row_type+"' data-placement='bottom' data-original-title='"+hover+"' style='padding: 0px 3px;'>";
			group_html+="			<i class='fa fa-times'></i>";
			group_html+="		</span><input type='hidden' id='group_int_code_"+tr_id+"' value="+group_int_code+" />";
			
			if(parent_group==0)
			{
				if(is_edit_pop_up==1)
				{
					group_html+="&nbsp;<span class='btn btn-sm yellow tooltips' onkeypress='return keyHandler(event,this);'  tabindex=0 data-placement='bottom' onClick=\"FWMultiGrid.EditGroupRowinPopup('"+system_module_name+"','"+group_table_name+"',"+tr_id+",'"+pop_up+"')\"  data-original-title='Edit in Popup' style='padding: 0px 3px;'>"; 
					group_html+="<i class='fa fa-external-link'></i></span>";
					 
				}
				group_html+="<span id='third_level_obj_"+tr_id+"' style='display:none;'>"+third_level_obj+"</span>";
			}
			
			if($(select_id).length>0)
			{
				if(is_delete_row==1)
				{
					group_html+="&nbsp;<span class='btn btn-sm red tooltips' onkeypress='return keyHandler(event,this);'   tabindex=0 data-placement='bottom' onClick=\"FWMultiGrid.DeleteGroupRow('"+system_module_name+"','"+group_table_name+"',"+tr_id+")\"  data-original-title='Delete' style='padding: 0px 3px;'>"; 
					group_html+="<i class='fa fa-trash-o'></i></span>";
				}
			}
			group_html+=child_group_html;
			group_html+="<p style='width:120px;   margin: 0;'></p></td>";
						
			if(type=='Add')
			{	
				var add_html="<tr id='"+tr_id+"' class='' onDblclick=\"FWMultiGrid.EditGridRow('"+system_module_name+"','"+group_table_name+"',"+tr_id+");\">";
				add_html+=group_html;
				add_html+="</tr>";
			 
				var table_length = $("#m_"+system_module_name+" #"+group_table_name+" tbody tr").length;
				if(table_length==0)
					$("#m_"+system_module_name+" #"+group_table_name+" tbody").html(add_html);
				else
				{
					if(base_tr_id==0)
						$("#m_"+system_module_name+" #"+group_table_name+" tbody ").append(add_html);
					else
						$("#m_"+system_module_name+" #"+group_table_name+" tbody tr[id='"+base_tr_id+"']").after(add_html);
				}
			}
			else  
			{
				$("#m_"+system_module_name+" #"+group_table_name+" tbody tr[id='"+tr_id+"']").html(group_html);
			}
	 
			App.init();
						
			for(a = 0;a < auto_fill_ele_arr.length;a++)
			{
		   	   POPUP.AssignJqueryAutoFill(system_module_name,group_table_name,auto_fill_ele_arr[a],tr_id);
			}
			 
			this.ArrangeRowSequence(system_module_name,group_table_name);
			$("#m_"+system_module_name+" #"+group_table_name +" tbody").tableDnD({
				 dragHandle: ".td-txt",
				onDrop: function(table, row) {
					FWMultiGrid.ArrangeRowSequence(system_module_name,group_table_name);
				}
			});
			 
			var system_row=$("#m_"+system_module_name+" #"+group_table_name+" tbody tr[id='"+tr_id+"'] #system_row").val();
			
			$("#m_"+system_module_name+" #"+group_table_name).trigger("update", [true]);
			if(focus.focus==1)
			$("#m_"+system_module_name+" #"+group_table_name+" tbody tr[id='"+tr_id+"'] :input:visible:first").focus(); 
			var last_saved_id = $("#"+group_table_name+" tr[class='last-saved']").attr('id');
			if(system_row=="1")
			{
				$("#m_"+system_module_name+" #"+group_table_name+" tbody tr[id='"+tr_id+"'] :input:visible").attr('readonly','true');
				 if(typeof(ModuleGridPreSaveValidation.GetSystemRowEditableFields)=="function")
				 {
					 var editable_fields_arr=ModuleGridPreSaveValidation.GetSystemRowEditableFields(system_module_name,group_table_name);
					 
					 if(!empty(editable_fields_arr))
					 split_arr=editable_fields_arr.split(",");
					for(s=0;s<split_arr.length;s++)
					{
						var f_name=split_arr[s];
						$("#m_"+system_module_name+" #"+group_table_name+" tbody tr[id='"+tr_id+"'] #"+f_name).removeAttr('readonly');
					}
				 }
			}
			
			ModuleGridPreSaveValidation.MultiGridAfterEditRowEvent(system_module_name,group_table_name,tr_id);
			
			if(typeof(last_saved_id)!='undefined')
				ModuleGridPreSaveValidation.MultiGridAfterAddRowEvent(system_module_name,group_table_name,last_saved_id);
			
		}
		catch(err) {
			
			var message = err.message;
			message = err.message+" in FWMultiGrid.FormGridEditFields";
			bootbox.alert(message);
		}
	},
	
	/* ADD Row  */
	SaveTableRecord : function (system_module_name,table_id,tr_id,save_type) {
	
		try {
			var error="";
			var grp_ele_arr=all_obj[system_module_name]['g_multi_group'][table_id]['elements'];
			var is_error=true;
			var row_obj=new Object();
			if(save_type=='Popup')
				var group_name=table_id+"_popup";
			else
				var group_name=table_id;
				
			var input_id="#m_"+system_module_name+" #"+group_name;
		
			$.each(grp_ele_arr, function (ek,ev) {			
				
					var data_type=ev.Type;
					var db_field=ev.db_field;
					var name=ev.name;
					var optional=ev.optional;
					var sub_group_code=ev.sub_group_code;
					var sub_group_include_in=ev.sub_group_include_in;
					var is_ref_module_code_lov=ev.is_ref_module_code_lov;
					var populate_lov=ev.populate_lov;
					if(sub_group_code>0 && sub_group_include_in=='Third Level')
						return;
					else
					{
						var cell_val=$(input_id+" #"+db_field).val();
						 
						if(data_type=='Reference Data')
						{
							if(populate_lov==1 && is_ref_module_code_lov==1)
							{
								if(optional=='0' && empty(cell_val))
								{
									is_error=false;
									alert("Please Enter "+name);
									$(input_id+" #"+db_field).focus();
									return false;
								}
								row_obj[db_field]=cell_val;
								row_obj["txt_ref_schema_"+db_field]=encodeURIComponent($(input_id+" #"+db_field).find(":selected").text());
							}
							else
							{
								if(optional=='0' && empty(cell_val))
								{
									is_error=false;
									alert("Please Enter "+name);
									$(input_id+" #txt_ref_schema_"+db_field).focus();
									return false;
								}
								var ref_txt_val=$(input_id+" #txt_ref_schema_"+db_field).val();
								row_obj["txt_ref_schema_"+db_field]=encodeURIComponent(ref_txt_val);
								row_obj[db_field]=cell_val;
							}
						}
						
						else if(data_type=='Date'  )
						{
							if(optional=='0' && (empty(cell_val) || cell_val=='00/00/0000'))
							{
								is_error=false;
								alert("Please Enter "+name);
								$(input_id+" #"+db_field).focus();
								return false;
							}
							row_obj[db_field]=cell_val;
						}
						else if(data_type=='Image')
						{
							var image_name="";
							var image_data = encodeURIComponent($(input_id+" #"+db_field+" .fileinput-preview.fileinput-exists.thumbnail > img").attr('src'));
								image_name=$(input_id+" #"+db_field+" .fileinput-preview.fileinput-exists.thumbnail > img").attr('data-image-name');
								
							if(empty(image_name) || image_name=='undefined')
								image_name = $(input_id+" #"+db_field+"  input[type='file']").val();
							
							row_obj[db_field]=image_data;
							row_obj[db_field+"_image_name"]=image_name;
							
						}
						else if(data_type=='Attachment')
						{
							var attch_name="";
							var data_file_src = encodeURIComponent($(input_id+" #"+db_field).attr('data-file-src'));
								attch_name=$(input_id+" #"+db_field).attr('data-file-name');
								attch_state=$(input_id+" #"+db_field).attr('data-att-state');
							
							if(empty(attch_name) || attch_name=='undefined')
								attch_name = $(input_id+" #"+db_field+"  input[type='file']").val();
							
							row_obj[db_field]=data_file_src;
							row_obj[db_field+"_attch_name"]=attch_name;
							row_obj[db_field+"_data_attch_state"]=attch_state;
							
						}
						else if(data_type=='Checkbox')
						{
							var checkbox_val = $(input_id+" #"+db_field).is(':checked');
							if(checkbox_val)
								row_obj[db_field]="checked";
							else
								row_obj[db_field]="";
						}
						else
						{
							if(optional=='0' && (empty(cell_val)) )
							{
								is_error=false;
								
								alert("Please Enter "+name);
								$(input_id+" #"+db_field).focus();
								return false;
							}
							
							row_obj[db_field]=encodeURIComponent(cell_val);
						}
					}
					
				});
			
			if(is_error)
			{
				if(save_type=='Popup')
				{
					row_obj['group_int_code']=$(input_id+" #group_int_code").val();
					row_obj['third_level_obj']=$(input_id+" #third_level_obj").html();
					//#########TAX STRUCTURE DATA
					var t_tax_structure_exists = all_obj[system_module_name].t_tax_structure_exists;
					var tax_structure_type = all_obj[system_module_name].g_multi_group[table_id].tax_structure_type;
					var is_item_tax_data_exists = all_obj[[system_module_name]].g_multi_group[table_id].grp_system_name_full_arr.hasOwnProperty('item_tax_data');
						var item_tax_data="";
					if(t_tax_structure_exists=='Yes' && tax_structure_type=='Item' && is_item_tax_data_exists==true)
					{
						row_obj['item_tax_data']=Tax.SaveItemTaxStructureFromPopupToGrid(system_module_name);
					}
				}
				else
				{
					row_obj['group_int_code']=$(input_id+" tbody tr[id='"+tr_id+"'] #group_int_code_"+tr_id).val();
					row_obj['third_level_obj']=$(input_id+" tbody tr[id='"+tr_id+"'] #third_level_obj_"+tr_id).html();
				}
				
				var grid_row_obj = this.GetGridRowObjBeforeSave(system_module_name,table_id,tr_id);
				var save_record = ModuleGridPreSaveValidation.PreMultiSaveGridRow(system_module_name,table_id,tr_id,grid_row_obj);
				if(save_record)
				{
					if(save_type=='Popup')
					{
						jQuery.prompt.getCurrentState().die();
						$.prompt.close();
						$(input_id).parents().find(".jqibox:last").remove();
					}
				
					return  (this.FormGridRowFromInputToTableRow(system_module_name,table_id,row_obj,tr_id,'Yes','No'));
				}	
				else
					return false;
					
				
				
				
			}
			else 
				return is_error;
			
			
		}
		catch(err) {
			
			var message = err.message;
			message = err.message+" in FWMultiGrid.SaveTableRecord";
			bootbox.alert(message);
		}
	},
	
	// Generating Grid table row after save
	//fw_edit_mode it will be Yes, when the row is adding after module edit record
	FormGridRowFromInputToTableRow : function (system_module_name,group_table_name,row_obj,tr_id,new_row_required,fw_edit_mode) {
		
		try {
		
			var grp_ele_arr=all_obj[system_module_name]['g_multi_group'][group_table_name]['elements'];
			var is_child_exists=all_obj[system_module_name]['g_multi_group'][group_table_name]['is_child_exists'];
			var parent_group=all_obj[system_module_name]['g_multi_group'][group_table_name]['parent_group'];
			var is_add_row=all_obj[system_module_name].g_multi_group[group_table_name]['is_add_row'];
			var is_copy_row=all_obj[system_module_name].g_multi_group[group_table_name]['is_copy_row'];
			var is_delete_row=all_obj[system_module_name].g_multi_group[group_table_name]['is_delete_row'];
			var is_edit_pop_up=all_obj[system_module_name].g_multi_group[group_table_name]['is_edit_pop_up'];
			var is_grid_edit=all_obj[system_module_name].g_multi_group[group_table_name]['is_grid_edit'];
			
			if(new_row_required=='No')
			{
				if($("#m_"+system_module_name+" #"+group_table_name +" tbody tr.last-saved").length > 0)
				{
					$("#m_"+system_module_name+" #"+group_table_name +" tbody tr[id='"+tr_id+"']").removeClass('editing');
					$("#m_"+system_module_name+" #"+group_table_name +" tbody tr[id='"+tr_id+"']").removeClass('last-saved');
				}
				else
				{	
					$("#m_"+system_module_name+" #"+group_table_name +" tbody tr[id='"+tr_id+"']").removeClass('editing');
					$("#m_"+system_module_name+" #"+group_table_name +" tbody tr[id='"+tr_id+"']").addClass('last-saved');
				}
			}
			else
			{
				$("#m_"+system_module_name+" #"+group_table_name +" tbody tr.last-saved").removeClass();
				$("#m_"+system_module_name+" #"+group_table_name +" tbody tr.editing").removeClass();
				$("#m_"+system_module_name+" #"+group_table_name +" tbody tr[id='"+tr_id+"']").addClass('last-saved');
			}
			var tr_id_arr=new Array();
			var group_int_code=row_obj.group_int_code;
			var third_level_obj=row_obj.third_level_obj;
			
			var select_id = "#m_"+system_module_name+" #"+group_table_name +" tbody tr[id='"+tr_id+"']";
			
			var row_type = $(select_id+" #actions #row_cancel").attr('data-row-type');
			
			var tr="<td id='seq_"+tr_id+"' ><p style='width:30px;' class='td-txt' ></p></td>";
			$.each(grp_ele_arr, function (ek,ev) {	

				var data_type=ev.Type;
				var db_field=ev.db_field;
				var name=ev.name;
					var on_enter = ev.on_enter;
					var is_ref_module_code_lov=ev.is_ref_module_code_lov;
					var populate_lov=ev.populate_lov;
				var sub_group_code=ev.sub_group_code;
				var grid_width=parseInt(ev.grid_width);
				if(grid_width==0)
					grid_width=100;
				var is_visible=ev.is_visible;
				var sub_group_include_in=ev.sub_group_include_in;
				var row_val=row_obj[db_field];
				var	val=(empty(row_val) && row_val!=0 )? "" : row_val;
					
				var td_display="";
				if(sub_group_code>0 || is_visible==0)
					td_display=" style='display:none;'";
				
				if(data_type=='Reference Data')
				{
					if(populate_lov==1 && is_ref_module_code_lov==1)
					{
							var text_val=decodeURIComponent(row_obj["txt_ref_schema_"+db_field]);
						text_val=empty(text_val) ? "" : text_val;
						val=empty(row_val) ? "0" : row_val;
						tr+="<td "+td_display+"><p style='width:"+grid_width+"px;'  class='td-txt' title='"+text_val+"'> <input style='width:0px;' type='hidden' id='"+db_field+"_"+tr_id+"' value="+val+"><span id='txt_ref_schema_"+db_field+"_"+tr_id+"'>"+text_val+"</span></p></td>";
				
					}
					else
					{
						var text_val=decodeURIComponent(row_obj["txt_ref_schema_"+db_field]);
						text_val=empty(text_val) ? "" : text_val;
						val=empty(row_val) ? "0" : row_val;
						tr+="<td "+td_display+"><p style='width:"+grid_width+"px;'  class='td-txt' title='"+text_val+"'> <input style='width:0px;' type='hidden' id='"+db_field+"_"+tr_id+"' value="+val+"><span id='txt_ref_schema_"+db_field+"_"+tr_id+"'>"+text_val+"</span></p></td>";
					}
				}
				else if(data_type=='Date')
				{
					if(empty(val))
						val="00/00/0000";
					else
						val=decodeURIComponent(val);
					tr+="<td id='"+db_field+"_"+tr_id+"' class='text-right' "+td_display+"><p  class='td-txt' style='width:"+grid_width+"px;' title='"+val+"'>"+val+"</p></td>";
				}
				else if(data_type=='Number')
				{
					if(val == 'null')
						val="";
					tr+="<td id='"+db_field+"_"+tr_id+"' class='text-right' "+td_display+"><p  class='td-txt' style='width:"+grid_width+"px;' title='"+val+"'>"+val+"</p></td>";
				}
				else if(data_type=='Attachment')
				{
					  
						if(row_val=='undefined' || empty(row_val))
						{
							data_file_src="";
							attch_name="";
							data_att_state=	decodeURIComponent(row_obj[db_field+"_data_attch_state"]);
							if(empty(data_att_state))
								data_att_state="";
						 
						}
						else
						{
							attch_name=	decodeURIComponent(row_obj[db_field+"_attch_name"]);
							data_att_state=	decodeURIComponent(row_obj[db_field+"_data_attch_state"]);
							data_file_src=decodeURIComponent(val);
							if(group_int_code>0 && data_att_state!="New")
							{
								data_att_state='db-attch';
							}
						}
						 
					if(empty(val))
						data_file_src="";
						tr+="<td id='"+db_field+"_"+tr_id+"' class='text-right' "+td_display+"><p  data-att-state='"+data_att_state+"' data-file-src='"+data_file_src+"' class='td-txt' style='width:"+grid_width+"px;'  data-file-name ='"+attch_name+"' >"+attch_name+"</p></td>";
				}
				else if(data_type=='Image')
				{
					var image_data="";
					var image_attr="";
					var img_file_name =decodeURIComponent(row_obj[db_field+"_image_name"]);
					if(row_val=='undefined' || empty(row_val))
					{
						image_data="img/NoPictureAvailable_sm.jpg";
						image_attr='no-image'
					}
					else
					{
						image_data=decodeURIComponent(val);
						if(img_file_name==image_data.split('/').pop().split('_')[1] && group_int_code>0)
								image_attr='db-image';
						else
							image_attr='new-image';
					}
					
					
					var image_tag = "<img style='max-width:100px; max-height:100px;' src='"+image_data+"' data-image-type='"+image_attr+"' data-image-name='"+img_file_name+"'> </img>";
					tr+="<td id='"+db_field+"_"+tr_id+"' class='text-center' "+td_display+"><p class='td-txt' style='width:"+grid_width+"px;'>"+image_tag+"</p></td>";
				}
				else if(data_type=='Checkbox')
				{
					var checked='';
					if(val==1 || val == 'checked')
						checked='checked';
					var	checkbox_html="<input type='checkbox' onclick=\""+on_enter+"\"  class='form-control input-sm' "+checked+" >";
						
						
					tr+="<td id='"+db_field+"_"+tr_id+"' class='text-center' "+td_display+"><p  class='td-txt' style='width:"+grid_width+"px;'>"+checkbox_html+"</p></td>";
				}
				else if(data_type=='Large Text')
				{
				
					tr+="<td id='"+db_field+"_"+tr_id+"' class='text-left' "+td_display+"><p  class='td-txt' style='white-space:pre;width:"+grid_width+"px;' title='"+decodeURIComponent(val)+"'>"+decodeURIComponent(val)+"</p></td>";
				}
				else
				{
				
					tr+="<td id='"+db_field+"_"+tr_id+"' class='text-left' "+td_display+"><p  class='td-txt' style='width:"+grid_width+"px;' title='"+decodeURIComponent(val)+"'>"+decodeURIComponent(val)+"</p></td>";
				}
			});
			
			var tr_actions="<span class='btn btn-sm blue tooltips' tabindex=0  data-placement='bottom' onClick=\"FWMultiGrid.FormGridEditFields('"+system_module_name+"','"+group_table_name+"',"+tr_id+",'Edit')\" data-original-title='Edit' style='padding: 0px 3px;'>"; 
			tr_actions+="<i class='fa fa-edit' style='font-size:12px;'></i>";
			tr_actions+="</span>";
			
			if(is_add_row==1)
			{
				//Add New Row                                                                                                            
				tr_actions+="&nbsp;<span class='btn btn-sm purple tooltips'  tabindex=0 data-placement='bottom' onClick=\"FWMultiGrid.FormGridEditFields('"+system_module_name+"','"+group_table_name+"',"+tr_id+",'Add')\"  data-original-title='Add New ' style='padding: 0px 3px;'>"; 
				tr_actions+="<i class='fa fa-plus'></i></span>";
			}
			if(parent_group==0)
			{
				if(is_edit_pop_up==1)
				{
					//Edit Row in popup
					tr_actions+="&nbsp;<span class='btn btn-sm yellow tooltips' tabindex=0  data-placement='bottom' onClick=\"FWMultiGrid.EditGroupRowinPopup('"+system_module_name+"','"+group_table_name+"',"+tr_id+",'RowPopup')\"  data-original-title='Edit in Popup' style='padding: 0px 3px;'>"; 
					tr_actions+="<i class='fa fa-external-link'></i></span>";
					tr_actions+="<span id='third_level_obj_"+tr_id+"' style='display:none;'>"+third_level_obj+"</span>";
				}
			}
			
			if(is_delete_row==1)
			{
				//Delete Row
				tr_actions+="&nbsp;<span class='btn btn-sm red tooltips'  tabindex=0 data-placement='bottom' onClick=\"FWMultiGrid.DeleteGroupRow('"+system_module_name+"','"+group_table_name+"',"+tr_id+")\"  data-original-title='Delete' style='padding: 0px 3px;'>"; 
				tr_actions+="<i class='fa fa-trash-o'></i></span>";
			}
			var child_group_html="";
			if(is_child_exists==1)
			{
				child_group_html+="		<span class='btn btn-sm dark tooltips' tabindex=0  onclick=\"FWMultiGrid.OpenThirdLevelPopup('"+system_module_name+"','"+group_table_name+"','"+tr_id+"',"+group_int_code+");\" data-placement='bottom' data-original-title='Third Level' style='padding: 0px 3px;'>";
				child_group_html+="			<i class='fa fa-sitemap'></i>";
				child_group_html+="		</span>";
			}
			tr_actions+="<input type='hidden' id='group_int_code_"+tr_id+"' value="+group_int_code+" />";
			tr_actions+=child_group_html;
			if(is_copy_row==1)
			{
				tr_actions+="<span class='btn btn-sm green tooltips' tabindex=0  data-placement='bottom' onClick=\"FWMultiGrid.CopyRowData('"+system_module_name+"','"+group_table_name+"',"+tr_id+")\" data-original-title='Copy' style='padding: 0px 3px;'>"; 
				tr_actions+="<i class='fa fa-copy' style='font-size:12px;'></i>";
				tr_actions+="</span>";
			}
			tr+="<td id='actions_"+tr_id+"' style='width:120px;'>"+tr_actions+"<p style='width:120px;  margin: 0;'></p></td>";
			
			$("#m_"+system_module_name+" #"+group_table_name +" tbody tr[id='"+tr_id+"']").html(tr);
			
			ModuleGridPreSaveValidation.PostMultiSaveGridRow(system_module_name,group_table_name,tr_id,row_obj,fw_edit_mode);
			
			if(new_row_required=='Yes')
			{
				if(row_type=='New')
					this.FormGridEditFields(system_module_name,group_table_name,0,'Add');
			}
			// App.init();
		/*	$("#m_"+system_module_name+" #"+group_table_name +" tbody").tableDnD({
			 dragHandle: ".td-txt",
				onDrop: function(table, row) {
					FWMultiGrid.ArrangeRowSequence(system_module_name,group_table_name);
				}
			});*/
			
			this.ArrangeRowSequence(system_module_name,group_table_name);
			this.CalculateGroupColumnTotal(system_module_name,group_table_name);
			$("#m_"+system_module_name+" #"+group_table_name).trigger("update", [true]);
			
			return true;
		}
		catch(err) {
			
			var message = err.message;
			message = err.message+" in FWMultiGrid.FormGridRowFromInputToTableRow";
			bootbox.alert(message);
		}
	},
	
	//Call Edit row when double click on grid row 
	EditGridRow : function (system_module_name,group_table_name,tr_id) {
		
		try {
				
				var selcet_id = "#m_"+system_module_name+" #"+group_table_name+" tbody tr[id='"+tr_id+"'] ";
				var row_type = $(selcet_id+" #actions_"+tr_id+" span").attr('data-original-title');
				if(row_type=='Edit')
					$(selcet_id+" #actions_"+tr_id+" span .fa-edit").parent().trigger('click');
			
			}
		catch(err) {
			
			var message = err.message;
			message = err.message+" in FWMultiGrid.AddDBClickTOGridRow";
			bootbox.alert(message);
		}
	},
	
	//Get Row Data to Object
	GetRowDataFromTable : function (system_module_name,group_table_name,tr_id)	{
		
		try {
		
			var select_id = "#m_"+system_module_name+" #"+group_table_name +" tbody tr[id='"+tr_id+"']";
			var grp_ele_arr=all_obj[system_module_name]['g_multi_group'][group_table_name]['elements'];
			var row_obj=new Object();
			var row_type = $(select_id+" #actions  #row_cancel").attr('data-row-type');
			
			$.each(grp_ele_arr, function (ek,ev) {			
			
				var data_type=ev.Type;
				var db_field=ev.db_field;
				var name=ev.name;
				var system_name=ev.system_name;
				
				
				if(data_type=='Reference Data')
				{
					if(row_type=='New' || row_type=='Edit')
					{
						var txt_ref_val = $(select_id +" #txt_ref_schema_"+system_name).val();
						var td_val = $(select_id +" #"+system_name).val();
						row_obj["txt_ref_schema_"+db_field]=txt_ref_val;
						row_obj[db_field]=td_val;
					}
					else
					{
						var txt_ref_val = $(select_id +" p #txt_ref_schema_"+system_name+"_"+tr_id).html();
						var td_val=$(select_id +" p #"+system_name+"_"+tr_id).val();
						row_obj["txt_ref_schema_"+db_field]=txt_ref_val;
						row_obj[db_field]=td_val;
					}
					
				}
				else if(data_type=='Image')
				{
					
					if(row_type=='New' || row_type=='Edit')
					{
						var image_class="";
						var image_type="";
						var image_data = $(select_id+"[id='"+tr_id+"'] #"+system_name+" .fileinput-preview.fileinput-exists.thumbnail > img").attr('src');
						var	image_name = $(select_id+"[id='"+tr_id+"'] #"+system_name+" .fileinput-preview.fileinput-exists.thumbnail > img").attr('data-image-name');
						
						if(empty(image_name))
							image_name= $(select_id+"[id='"+tr_id+"'] #"+system_name+" :file").val();
						if(empty(image_data))	
						{
							image_class='fileinput-new';
							image_type='no-image';
							row_obj[db_field]="";
						}
						else
						{
							image_class='fileinput-exists';
							image_type='new-image';
							row_obj[db_field]=encodeURIComponent(image_data);				
						}
						row_obj[db_field+"_class"]=image_class;					
						row_obj[db_field+"_type"]=image_type;	
						row_obj[db_field+"_image_name"]=image_name;	
					}
					else
					{
						var image_type = $(select_id+"[id='"+tr_id+"'] td[id='"+system_name+"_"+tr_id+"']  img").attr('data-image-type');
						var image_class='fileinput-new';
						row_obj[db_field]="";					
						row_obj[db_field+"_class"]=image_class;					
						row_obj[db_field+"_type"]=image_type;	
										
						if(image_type=='new-image' || image_type=='db-image')
						{	
							var image_data  = $(select_id+"[id='"+tr_id+"'] td[id='"+system_name+"_"+tr_id+"']  img").attr('src');
							var image_name  = $(select_id+"[id='"+tr_id+"'] td[id='"+system_name+"_"+tr_id+"']  img").attr('data-image-name');
								
							image_class='fileinput-exists';
							row_obj[db_field]=encodeURIComponent(image_data);
							row_obj[db_field+"_class"]=image_class;	
							row_obj[db_field+"_image_name"]=image_name;							
						}
					}
				}
				else if(data_type=='Checkbox')
				{
					var checked="";
					if(row_type=='New' || row_type=='Edit')
					{
						var checked_val = $(select_id +" td #"+system_name).is(':checked');
						if(checked_val)
							checked="checked";
						
					}
					else
					{
						var checked_val = $(select_id +" #"+system_name+"_"+tr_id+" p :input[type='checkbox']").is(':checked');
						if(checked_val)
							checked="checked";
					}
					row_obj[db_field]=checked;
				}
				else/* (data_type=='Text') */
				{
					if(row_type=='New' || row_type=='Edit')
					{
						
						var td_val = encodeURIComponent($(select_id +" #"+system_name).val());
						row_obj[db_field]=td_val;
					}
					else
					{
						var td_val=$(select_id +" #"+system_name+"_"+tr_id+" p").html();
						
						row_obj[db_field]=encodeURIComponent(td_val);
					}
				}
			});
			row_obj['group_int_code']=$(select_id+" #group_int_code_"+tr_id).val();
			row_obj['row_sequence']=$(select_id+" #seq_"+tr_id+" p").html();
			row_obj['third_level_obj']=$(select_id+" #third_level_obj_"+tr_id).html();
			
			return row_obj;
		}
		catch(err){
			
			var message = err.message;
			message = err.message+" in FWMultiGrid.GetRowDataFromTable";
			bootbox.alert(message);
		}
	},
	
	//Assign Row Data to input
	AssignRowDataToPopupInput : function (system_module_name,group_table_name,row_obj) {
	
		try {
		
			var select_id = "#m_"+system_module_name+" #"+group_table_name+"_popup";
			var grp_ele_arr=all_obj[system_module_name]['g_multi_group'][group_table_name]['elements'];
			var group_int_code=row_obj.group_int_code;
			var third_level_obj=row_obj.third_level_obj;
			
			$.each(grp_ele_arr, function (ek,ev) {			
			
				var data_type=ev.Type;
				var db_field=ev.db_field;
				var name=ev.name;
				var system_name=ev.system_name;
				
				if(data_type=='Reference Data')
				{
					var txt_ref_val = row_obj["txt_ref_schema_"+db_field];
					var td_val = row_obj[db_field];
					$(select_id +" #txt_ref_schema_"+system_name).val(txt_ref_val);
					$(select_id +" #"+system_name).val(td_val);
				}
				if(data_type=='Image')
				{
					if(row_obj[db_field+"_type"]=='new-image' || row_obj[db_field+"_type"]=='db-image')
					{	
						var image_data=decodeURIComponent(row_obj[db_field]);
						var image_name=row_obj[db_field+"_image_name"];
						var img_tag = "<img src='"+image_data+"' data-image-name='"+image_name+"'></img>"
						$(select_id+" #"+system_name+" .fileinput-preview.fileinput-exists.thumbnail").html(img_tag);
						$(select_id+" #"+system_name+" .fileinput").removeClass('fileinput-new');
						$(select_id+" #"+system_name+" .fileinput").addClass('fileinput-exists');
					}
				}
				else if(data_type=='Checkbox')
				{
					var checkbox_val = row_obj[db_field];
					if(checkbox_val)
						$(select_id +" #"+system_name).attr("checked",'true');
				}
				else/* (data_type=='Text') */
				{
					var td_val = decodeURIComponent(row_obj[db_field]).replace(/&amp;/g,"&");
					// console.log((select_id +" #"+system_name));
					// console.log(td_val);
					$(select_id +" #"+system_name).val(td_val);
				}
			});
			$(select_id+" #group_int_code").val(group_int_code);
			$(select_id+" #third_level_obj").html(third_level_obj);
			system_row=row_obj['system_row'];
			if(system_row=="1")
			{
				$(select_id+" input:not([type=hidden])").attr('readonly',true);
			 
				 if(typeof(ModuleGridPreSaveValidation.GetSystemRowEditableFields)=="function")
				 {
					 var editable_fields_arr=ModuleGridPreSaveValidation.GetSystemRowEditableFields(system_module_name,group_table_name);
					 
					 if(!empty(editable_fields_arr))
					 split_arr=editable_fields_arr.split(",");
					for(s=0;s<split_arr.length;s++)
					{
						var f_name=split_arr[s];
						$(select_id +" #"+f_name).removeAttr('readonly');
					}
				 }
				 
			}				
		}
		catch(err){
			
			var message = err.message;
			message = err.message+" in FWMultiGrid.AssignRowDataToPopupInput";
			bootbox.alert(message);
		}
	},
	
	//Generating Row sequence
	ArrangeRowSequence : function (system_module_name,group_table_name) {
	
		try {
		
			var select_id = "#m_"+system_module_name+" #"+group_table_name+" tbody tr td[id*='seq_'] p";
			var seq=1;
			jQuery.each($(select_id), function (k,v) {

				$(this).html(seq);
				seq++;
			});
		}
		catch(err){
			
			var message = err.message;
			message = err.message+" in FWMultiGrid.ArrangeRowSequence";
			bootbox.alert(message);
		}
		
	},
	
	//Close Edit Grid Popup
	CloseEditGridPopup : function (system_module_name,group_table_name,tr_id,popup_type) {
		
		try {
		
			if(popup_type=='NewPopup')
			{
				var select_id = "#m_"+system_module_name+" #"+group_table_name+" tbody tr#"+tr_id;
				$(select_id).remove();
			}
			// $("#m_"+system_module_name+" #"+group_table_name +" tbody tr[id='"+tr_id+"']").css('background','#FFFFFF');
			FWMultiGrid.FormGridEditFields(system_module_name,group_table_name,0,'Add');
			
			
			jQuery.prompt.getCurrentState().die();
			$.prompt.close();
			$("#m_"+system_module_name+" #"+group_table_name).parents().find(".jqibox:last").remove();
			var t_tax_structure_exists=all_obj[system_module_name]['t_tax_structure_exists'];
			var t_tax_structure_item_table=all_obj[system_module_name]['t_tax_structure_item_table'];
			if(t_tax_structure_exists=="Yes" && t_tax_structure_item_table==group_table_name)// If User Clicks Cancel Button recaulclate Once again Commercials
			{
			 
				Tax.GetItemRowObjectsAndCallItemCommercials(system_module_name,group_table_name,tr_id);
			 
			}
		}
		catch(err){
			
			var message = err.message;
			message = err.message+" in FWMultiGrid.CloseEditGridPopup";
			bootbox.alert(message);
		}
	},
	
	//Popup Edit
	//EditPopup - Open popup when table row in edit mode when input columns are visibe
	//RowPopup - Open popup when table row in After Save record input columns are converted to td
	//NewPopup - Open popup when table row in Fresh record  Popup
	EditGroupRowinPopup : function(system_module_name,group_table_name,tr_id,popup_type) {
		
		try {
			
			   alert("Don't have Rights");
			   return true;    
		
			var select_id = "#m_"+system_module_name+" #"+group_table_name+" tbody tr";
			var grid_edit_box_cnt = $(select_id+" input:visible, "+select_id+" select:visible").length;
			//######## IF ITEM TAX EXISTS We are getting data from item_tax_data and displaying in table data
				var t_tax_structure_exists = all_obj[system_module_name].t_tax_structure_exists;
				var tax_structure_type = all_obj[system_module_name].g_multi_group[group_table_name].tax_structure_type;
				var is_item_tax_data_exists = all_obj[[system_module_name]].g_multi_group[group_table_name].grp_system_name_full_arr.hasOwnProperty('item_tax_data');
					var item_tax_data="";
				if(t_tax_structure_exists=='Yes' && tax_structure_type=='Item' && is_item_tax_data_exists==true)
				{
					 
					if(popup_type=="RowPopup")
						item_tax_data=$(select_id+"#"+tr_id+" #item_tax_data_"+tr_id+" p").html();
					else
						item_tax_data=$(select_id+"#"+tr_id+" #item_tax_data").val();
					  item_tax_data=JSON.parse(decodeURIComponent(item_tax_data));
				}	
				
				
					
			if(popup_type=='RowPopup' && grid_edit_box_cnt>0)
			{
				var row_type = $(select_id+" #actions #row_cancel").attr('data-row-type');
				var edit_row_id = $(select_id+" #actions #row_cancel").parent().parent().attr('id');
				
				if(row_type == 'New')
					$("#m_"+system_module_name+" #"+group_table_name+" tbody tr[id='"+edit_row_id+"']").remove();
				else
					FWMultiGrid.CancelEditGridRow(system_module_name,group_table_name,edit_row_id);
			}
		
			var row_obj=new Object();
			row_obj=this.GetRowDataFromTable(system_module_name,group_table_name,tr_id);
			
			if(popup_type=='NewPopup')
			{
				var n_select_id = "#m_"+system_module_name+" #"+group_table_name+" tbody tr#"+tr_id;
				$(n_select_id).html("");
			}
			else if(popup_type=='EditPopup')
			{
				// alert("sdfsd");
				this.CancelEditGridRow(system_module_name,group_table_name,tr_id);
			}
			
			var module_id=all_obj[system_module_name]['g_str_module_id'];
			var group_id=all_obj[system_module_name]['g_multi_group'][group_table_name]['group_id'];
			var group_name=all_obj[system_module_name]['g_multi_group'][group_table_name]['group_name'];
			var footer_row=' <div class="clearfix"></div> ';
			footer_row+="<div id='m_"+system_module_name+"_popup_footer'  style='margin:0; border:1px solid #E5E5E5; border-top:none;'"; 
			footer_row+='	class="form-actions right"> '; 
			footer_row+="	<span class='btn blue' onclick=\"FWMultiGrid.SaveTableRecord('"+system_module_name+"','"+group_table_name+"','"+tr_id+"','Popup');\">Save <i class='fa fa-check'></i></span>"; 
			footer_row+="	<input type='hidden' id='pop_up_row_int_code' value='"+tr_id+"' /> <span class='btn default'  onclick=\"FWMultiGrid.CloseEditGridPopup('"+system_module_name+"','"+group_table_name+"','"+tr_id+"','"+popup_type+"');\" >Cancel <i class='fa fa-times'></i></span></div> "; 
			
			var app_name = getCookie("jt_db");
			$.get("html_modules/modules/"+app_name+"/module_"+module_id+"_"+group_id+".html", function(data) {
				
				html = data+footer_row;
				$.prompt(html, {
								title:group_name,
								loaded:	function(event){
											$(this).find(".jqiclose").hide();
										},
								buttons: {},
								position: {  width: 1024},
								zIndex:10001
							});
				 
				FWMultiGrid.AssignRowDataToPopupInput(system_module_name,group_table_name,row_obj);
				if(!empty(item_tax_data))
				{
					Tax.AssignItemTaxStructureDataInPopup(system_module_name,group_table_name,tr_id,item_tax_data);
				}
				
				
			});
		}
		catch(err){
			
			var message = err.message;
			message = err.message+" in FWMultiGrid.EditGroupRowinPopup";
			bootbox.alert(message);
		}
	},
	
	// Clear entered data in New Record
	ClearGroupFields : function (system_module_name,group_table_name,tr_id) {
		
		try {
		
			var main_div_id="#m_"+system_module_name;
			$(main_div_id+" #"+group_table_name+" tbody tr[id='"+tr_id+"'] input:visible").val("");
			$(main_div_id+" #"+group_table_name+" tbody tr[id='"+tr_id+"'] input:hidden").not("#item_tax_data").val("0");
			
		}
		catch(err){
			
			var message = err.message;
			message = err.message+" in FWMultiGrid.ClearGroupFields";
			bootbox.alert(message);
		}
		
	},
	
	//cancel edit grid row
	 CancelEditGridRow : function(system_module_name,group_table_name,tr_id) {
		
		try {
		
			var input_id="#m_"+system_module_name+" #"+group_table_name+" tbody tr[id='"+tr_id+"'] td #row_cancel";
			row_obj=decodeURIComponent($(input_id).attr('data-cancel'));
			row_obj=JSON.parse(row_obj);
			var third_level_obj=$("#m_"+system_module_name+" #"+group_table_name+" tr[id='"+tr_id+"'] #third_level_obj_"+tr_id).html();
			row_obj['third_level_obj']=third_level_obj;
			
			this.FormGridRowFromInputToTableRow(system_module_name,group_table_name,row_obj,tr_id,'No','No');
			var t_tax_structure_exists=all_obj[system_module_name]['t_tax_structure_exists'];
			var t_tax_structure_item_table=all_obj[system_module_name]['t_tax_structure_item_table'];
			if(t_tax_structure_exists=="Yes" && t_tax_structure_item_table==group_table_name)// If User Clicks Cancel Button recaulclate Once again Commercials
			{
				Tax.GetItemRowObjectsAndCallItemCommercials(system_module_name,group_table_name,tr_id);
			 
			}
			
			// Post Cancel
			if(typeof(ModuleGridPreSaveValidation.PostCancelGridRow)=="function")
			{
				 ModuleGridPreSaveValidation.PostCancelGridRow(system_module_name,group_table_name,tr_id);
			}	
			
		}
		catch(err){
			
			var message = err.message;
			message = err.message+" in FWMultiGrid.CancelEditGridRow";
			bootbox.alert(message);
		}
	 },
	 
	//not required
	EditGroupRow : function (system_module_name,table_id,row_id) {
	
		try {
		
			var main_div_id="#m_"+system_module_name;
			var grp_ele_arr=all_obj[system_module_name]['g_multi_group'][table_id]['elements'];
			var input_head="#m_"+system_module_name+" #"+table_id+" thead tr";
			var input_id="#m_"+system_module_name+" #"+table_id+" tbody tr[id='"+row_id+"']";
			var row_obj=new Object();
			
			$.each(grp_ele_arr, function (ek,ev) {			
				
				var data_type=ev.Type;
				var db_field=ev.db_field;
				var cell_val=$(input_id+" #"+db_field+"_"+row_id).html();
				
				if(data_type=='Reference Data')
				{
					var text_ref_val=$(input_id+" #txt_ref_schema_"+db_field+"_"+row_id).html();
					var cell_val=$(input_id+" #"+db_field+"_"+row_id).val();
					
					$(input_head+" #txt_ref_schema_"+db_field).val(text_ref_val);
					$(input_head+" #"+db_field).val(cell_val);
				}
				else	
					$(input_head+" #"+db_field).val(cell_val);
			});
			$(main_div_id+" #"+table_id+" tbody tr#"+row_id).css('background','#FFCFBF');
		}
		catch(err){
			
			var message = err.message;
			message = err.message+" in FWMultiGrid.EditGroupRow";
			bootbox.alert(message);
		}
	},
	
	//Delete Grid Row
	DeleteGroupRow : function (system_module_name,table_id,row_id) {
		
		try {
			
			var main_div_id="#m_"+system_module_name;
			var system_row=$("#m_"+system_module_name+" #"+table_id+" tbody tr[id='"+row_id+"'] #system_row_"+row_id+" p").text();
		 
			if(system_row=="1")
			{
				alert("You cannot Delete the System Populated Row");
				return false;
			}	
           
		   // Prfe delete
		   
			if(typeof(ModuleGridPreSaveValidation.PreMultiDeleteGridRow)=="function")
			{
					 var is_delete=ModuleGridPreSaveValidation.PreMultiDeleteGridRow(system_module_name,table_id,row_id);
					 if(!is_delete) 
					   return false;
			}		 
			
			var confirm_result=confirm("Do you want to delete this record ");
			if(confirm_result)
			{
				$(main_div_id+" #"+table_id+" tbody tr[id='"+row_id+"']").remove();
				
			}
			if($(main_div_id+" #"+table_id+" tbody tr").length==0)
				FWMultiGrid.FormGridEditFields(system_module_name,table_id,0,'Add');
				
			this.ArrangeRowSequence(system_module_name,table_id);
			$("#m_"+system_module_name+" #"+table_id).trigger("update", [true]);
			
			var t_tax_structure_exists=all_obj[system_module_name]['t_tax_structure_exists'];
			var t_tax_structure_item_table=all_obj[system_module_name]['t_tax_structure_item_table'];
			if(t_tax_structure_exists=="Yes" && t_tax_structure_item_table==table_id)// If User Clicks Cancel Button recaulclate Once again Commercials
			{
				Tax.CalcDocCommercialsFromScreen(system_module_name);
			 
			}
			
			// Post Delete
			if(typeof(ModuleGridPreSaveValidation.PostMultiDeleteGridRow)=="function")
			{
				 ModuleGridPreSaveValidation.PostMultiDeleteGridRow(system_module_name,table_id);
			}	
			 FWMultiGrid.CalculateGroupColumnTotal(system_module_name,table_id);
		}
		catch(err){
				d
			var message = err.message;
			message = err.message+" in FWMultiGrid.DeleteGroupRow";
			bootbox.alert(message);
		}
	},
	
	//Not Required
	UpdateGridRow : function (system_module_name,table_id,row_obj,row_id) {
	
		try {
		
			var main_div_id="#m_"+system_module_name;
			var grp_ele_arr=all_obj[system_module_name]['g_multi_group'][table_id]['elements'];
			var input_id="#m_"+system_module_name+" #"+table_id+" tbody tr#"+row_id;
			
			$.each(grp_ele_arr, function (ek,ev) {			
				
				var data_type=ev.Type;
				var db_field=ev.db_field;
				var cell_val=row_obj[db_field];
				
				if(data_type=='Reference Data')
				{
					var txt_ref_val=row_obj["txt_ref_schema_"+db_field];
					$(input_id+" #txt_ref_schema_"+db_field+"_"+row_id).html(txt_ref_val);
					$(input_id+" #"+db_field+"_"+row_id).val(cell_val);
				}
				else	
					$(input_id+" #"+db_field+"_"+row_id).html(cell_val);
			});
		}
		catch(err){
				
			var message = err.message;
			message = err.message+" in FWMultiGrid.UpdateGridRow";
			bootbox.alert(message);
		}
	},
	
	//Assign Grid Details after edit
	AssignGroupDetailsAfterEdit : function (system_module_name,grp_details) {
		
		try {
			focus.focus=0;
			var main_div_id="#m_"+system_module_name;
			if(!empty(grp_details))
			{
				$.each(grp_details, function (gk,gv) {
					
					var table_id=gk;
					var grp_prop=all_obj[system_module_name]['g_multi_group'][table_id];
					 var is_grid_edit=grp_prop['is_grid_edit'];
					 var is_grid_edit_inline=grp_prop['is_grid_edit_inline'];
					 var group_id=grp_prop['group_id'];
					if(is_grid_edit=="1" && is_grid_edit_inline=="1" && !empty(gv))// only for jqgrid data
					{
						jQuery('#table_group_grid_'+group_id).jqGrid("clearGridData", true);
						$.each(gv,function(k,v)
						{
						$('#table_group_grid_'+group_id).jqGrid('addRowData',v['id'],v);
						});
										
					}
					else if(!empty(gv))
					{
						var grp_system_name_full_arr=all_obj[system_module_name]['g_multi_group'][table_id]['grp_system_name_full_arr'];
						var input_id="#m_"+system_module_name+" #"+table_id+" tbody";
						var tr_id=1;
						$(input_id).html("");
						$.each(gv, function (k,v) {
					
						$(input_id).append("<tr id='"+tr_id+"' onDblclick=\"FWMultiGrid.EditGridRow('"+system_module_name+"','"+table_id+"',"+tr_id+");\"></tr>");
						var row_obj=new Object;
						
							$.each(v, function (ek,ev) {
								var data_type="";
								if(grp_system_name_full_arr.hasOwnProperty(ek))
								{	
										 
									  data_type=grp_system_name_full_arr[ek]['data_type'];
								}
								if(data_type=='Image')
								{
									if(!empty(ev))
										row_obj[ek+"_image_name"]=ev.split('/').pop().split('_')[1];
									else
										row_obj[ek+"_image_name"]="";
								}
								
								if(data_type=='Attachment')
								{
								 
									if(!empty(ev))
										row_obj[ek+"_attch_name"]=ev.split('/').pop();
									else
										row_obj[ek+"_attch_name"]="";
								}
								
								if(ek=='child_data')
								{
									row_obj['third_level_obj']=encodeURIComponent(JSON.stringify(ev));
								}
								else
									row_obj[ek]=encodeURIComponent(ev);
							});
																		
							FWMultiGrid.FormGridRowFromInputToTableRow(system_module_name,table_id,row_obj,tr_id,'No','No');
							tr_id++;
						});
						FWMultiGrid.FormGridEditFields(system_module_name,table_id,0,'Add');
						$("#m_"+system_module_name+" #"+table_id).tablesorter();
					}	
					else
					{
						FWMultiGrid.FormGridEditFields(system_module_name,table_id,0,'Add');
					}
					});
			}
		}
		catch(err){
				
			var message = err.message;
			message = err.message+" in FWMultiGrid.AssignGroupDetailsAfterEdit";
			bootbox.alert(message);
		}
		
	},
	
	
	//Get Grid Row Data Beofre Save
	GetGridRowObjBeforeSave : function (system_module_name,group_table_name,tr_id) {
		
		try {
		
			var grid_row_obj=new Object();
			grid_row_obj['edit_row_obj']=FWMultiGrid.GetRowDataFromTable(system_module_name,group_table_name,tr_id);
		/*	grid_row_obj['other_row_obj']=new Object();
			var other_row_obj=new Object();;
			var input_id="#m_"+system_module_name+" #"+group_table_name+" tbody ";
			var table_tr = $(input_id+" tr:not(tr#"+tr_id+")")
			$.each(table_tr, function (k,v) {
			
				var row_id = v.id;
				other_row_obj[row_id]=new Object();
				other_row_obj[row_id]=FWMultiGrid.GetRowDataFromTable(system_module_name,group_table_name,row_id);
			});
			grid_row_obj['other_row_obj']=other_row_obj;*/
			return grid_row_obj;
		}
		catch(err){
				
			var message = err.message;
			message = err.message+" in FWMultiGrid.GetGridRowObjBeforeSave";
			bootbox.alert(message);
		}
	},
	
	//Assign Grid Edit Details
	AssignGridEditDetails : function (system_module_name,group_table_name,grp_details) {
	
		try {
		
			var main_div_id="#m_"+system_module_name;
			if(!empty(grp_details))
			{
					var input_id="#m_"+system_module_name+" #"+group_table_name+" tbody";
						$(input_id).html("");
					var tr_id=1;
					$(input_id+" tr").remove();
					$.each(grp_details, function (k,v) {
					
						$(input_id).append("<tr id='"+tr_id+"' onDblclick=\"FWMultiGrid.EditGridRow('"+system_module_name+"','"+group_table_name+"',"+tr_id+");\"></tr>");
						var row_obj=new Object;
						
							$.each(v, function (ek,ev) {
								
								if(ek=='child_data')
								{
									row_obj['third_level_obj']=encodeURIComponent(JSON.stringify(ev));
								}
								else if(ek=='item_tax_data')
								{
									row_obj['item_tax_data']=encodeURIComponent(JSON.stringify(ev));
								}
								else
									row_obj[ek]=encodeURIComponent(ev);
							});
							
							FWMultiGrid.FormGridRowFromInputToTableRow(system_module_name,group_table_name,row_obj,tr_id,'No','Yes');
							tr_id++;
						});
						
						$("#m_"+system_module_name+" #"+group_table_name).tablesorter();
			}
			else
			{
			   $("#m_"+system_module_name+" #"+group_table_name+" tbody tr").remove(); 
			}
		}
		catch(err){
				
			var message = err.message;
			message = err.message+" in FWMultiGrid.AssignGridEditDetails";
			bootbox.alert(message);
		}
		
	},
	// Calculate Group Row Total 
	CalculateGroupColumnTotal : function (system_module_name,group_table_name) {
	
		try {
		
			var group_footer=all_obj[system_module_name]['g_multi_group'][group_table_name]['group_footer'];
			if(group_footer=='Yes')
			{
				var grp_ele_arr=all_obj[system_module_name]['g_multi_group'][group_table_name]['elements'];
				
				$.each(grp_ele_arr, function (k,v) {
					
					var system_name = v.system_name;
					var group_total = v.group_total;
					if(group_total=='Yes')
					{
						var total=0 ;
						$("#m_"+system_module_name+" #"+group_table_name+" tbody tr td[id^='"+system_name+"'] p").map( function() {
							total+= parseFloat($(this).html()); 
						});
						total=parseFloat(total).toFixed(2);
						$("#m_"+system_module_name+" #"+group_table_name+" tfoot tr #t_foot_"+system_name+" p").html(total);
					}
				});
			}
		}
		catch(err){
				
			var message = err.message;
			message = err.message+" in FWMultiGrid.GetGridRowObjBeforeSave";
			bootbox.alert(message);
		}
	},
	
	//Third Level Popup
	OpenThirdLevelPopup : function (system_module_name,group_table_name,tr_id,group_int_code) {
	
		try {
		
			var module_id=all_obj[system_module_name]['g_str_module_id'];
			var group_id=all_obj[system_module_name]['g_multi_group'][group_table_name]['group_id'];
			var group_name=all_obj[system_module_name]['g_multi_group'][group_table_name]['group_name'];
			
			var footer_row=' <div class="clearfix"></div> ';
				footer_row+='	<div   style="margin:0; border:1px solid #E5E5E5; border-top:none;"'; 
				footer_row+='	class="pull-right"> '; 
				footer_row+="	<span class='btn blue'  onclick=\"FWMultiGrid.SaveThirdLevelGridData('"+system_module_name+"','"+group_table_name+"','"+tr_id+"');\" >Save <i class='fa fa-check'></i></span>"; 
				footer_row+="	<input type='hidden' id='pop_up_row_int_code' value='"+tr_id+"' /> <span class='btn default'  onclick=\"$.prompt.close();\" >Cancel <i class='fa fa-times'></i></span></div> "; 
			
			
			
			
			var app_name = window.location.pathname.split('/')[1];
			$.get("html_modules/modules/"+app_name+"/module_"+module_id+"_"+group_id+"_child.html", function(data) {
				html = data+footer_row;
				$.prompt(html, {
									title:group_name,
									loaded:function(event){
										setTimeout(function(){ FWMultiGrid.AssignThirdLevelDataToPopup(system_module_name,group_table_name,tr_id); }, 1000);
										
										$(".jqibox").css("z-index","10001");
									},
									buttons: {},
									position: {  width: 1100}
								}
				);
			});
		}
		catch(err){
				
			var message = err.message;
			message = err.message+" in FWMultiGrid.OpenThirdLevelPopup";
			bootbox.alert(message);
		}
	},
	
	//Forming Third Level Grid Elements
	FormThirdLevelGridEditFields : function (system_module_name,group_table_name)
	{
		try {
		
			App.blockUI();
			var third_level_group_arr=all_obj[system_module_name]['g_multi_group'][group_table_name]['child_group_arr'];
			$.each (third_level_group_arr, function (k,v) {
				
				var group_table_name=v.child_group_table_name;
				FWMultiGrid.FormGridEditFields(system_module_name,group_table_name,0,'Add');
			});
			App.unblockUI();	
		}
		catch(err){
				
			var message = err.message;
			message = err.message+" in FWMultiGrid.FormThirdLevelGridEditFields";
			bootbox.alert(message);
		}
	},
	
	//SaveThirdLevelGridData
	SaveThirdLevelGridData : function (system_module_name,group_table_name,tr_id) {
	
		try {
		
			var input = "#m_"+system_module_name+" #"+group_table_name+" tbody";
			var tl_row_obj = new Object();
			tl_row_obj=FWMultiGrid.GetThirdLevelMultiGridData(system_module_name,group_table_name);
			tl_row_obj=encodeURIComponent(JSON.stringify(tl_row_obj));
			
			$(input+" tr[id='"+tr_id+"'] #third_level_obj_"+tr_id).html(tl_row_obj);
			$.prompt.close();
			
			$("#m_"+system_module_name+" #"+group_table_name +" tbody tr.last-saved").removeClass();
			$("#m_"+system_module_name+" #"+group_table_name +" tbody tr.editing").removeClass();
			$("#m_"+system_module_name+" #"+group_table_name +" tbody tr[id='"+tr_id+"']").addClass('last-saved');
		}
		catch(err){
				
			var message = err.message;
			message = err.message+" in FWMultiGrid.FormThirdLevelGridEditFields";
			bootbox.alert(message);
		}
	},
	
	//Get Third Level Data
	GetThirdLevelMultiGridData : function (system_module_name,group_table_name) {
		
		try {
			var t_tax_structure_item_tax_table=all_obj[system_module_name]['t_tax_structure_item_tax_table'];
			var third_level_group_arr=all_obj[system_module_name]['g_multi_group'][group_table_name]['child_group_arr'];
			var row_obj = new Object();

			$.each (third_level_group_arr, function (k,v) {
				
				
				
				var group_table_name=v.child_group_table_name;
				if(t_tax_structure_item_tax_table==group_table_name) return;// if item_tax_structure exists ignore
				var input = "#m_"+system_module_name+" #"+group_table_name+" tbody tr";
				row_obj[group_table_name] = new Object();

					
				
				var is_grid_edit = all_obj[system_module_name]['g_multi_group'][group_table_name]['is_grid_edit'];
				var is_grid_edit_inline = all_obj[system_module_name]['g_multi_group'][group_table_name]['is_grid_edit_inline'];
				var group_id = 	 all_obj[system_module_name]['g_multi_group'][group_table_name]['group_id'];
				
				if(is_grid_edit_inline == "1" && is_grid_edit=="1")
				{
					var group_data = $("#table_group_grid_"+group_id).jqGrid('getGridParam','data');
					
					var i=0;
					$.each(group_data,function(gk,gv){
						
						row_obj[group_table_name][i] = new Object();
						$.each(gv,function(ggk,ggv){
							
							row_obj[group_table_name][i][ggk] = (ggv);
						
						});
						i++;
						
					});
					
				}
				else
				{
					$.each($(input), function(rk,rv) {
						
						var row_id = rv.id;
						var record_type = $("#m_"+system_module_name+" #"+group_table_name+" tbody tr[id='"+row_id+"'] #row_cancel").attr('data-row-type');
						if(record_type=='New')
							return;
						row_obj[group_table_name][row_id] = new Object();
						row_obj[group_table_name][row_id]=FWMultiGrid.GetRowDataFromTable(system_module_name,group_table_name,row_id);
					});
				}
			});
			return row_obj;
		}
		catch(err){
				
			var message = err.message;
			message = err.message+" in FWMultiGrid.GetThirdLevelMultiGridData";
			bootbox.alert(message);
		}
	},
	
	//Load Third Level Data to Grid - Popup
	AssignThirdLevelDataToPopup : function (system_module_name,group_table_name,tr_id) {
	
		//try {
			   
			 
			ModuleGridPreSaveValidation.PreThirdLevelGridRow(system_module_name,group_table_name,tr_id);
			 
			var t_tax_structure_item_tax_table=all_obj[system_module_name]['t_tax_structure_item_tax_table'];
			var input = "#m_"+system_module_name+" #"+group_table_name+" tbody";
			var third_row_obj=decodeURIComponent($(input+" tr[id='"+tr_id+"'] #third_level_obj_"+tr_id).html());
			third_row_obj = JSON.parse(third_row_obj);
			
			if(!empty(third_row_obj))
			{
				var third_level_group_arr=all_obj[system_module_name]['g_multi_group'][group_table_name]['child_group_arr'];
				 
				$.each(third_level_group_arr,function (k,v){
					
				
					
					var m_group_table_name=v.child_group_table_name;
						
					if(t_tax_structure_item_tax_table==group_table_name) return;// if item_tax_structure exists ignore
					var all_row_obj = third_row_obj[m_group_table_name];
					//console.log(all_row_obj);
					if(!empty(all_row_obj))
					{
						var tr_id=1;
						var input_id="#m_"+system_module_name+" #"+m_group_table_name+" tbody";
						var is_grid_edit = all_obj[system_module_name]['g_multi_group'][m_group_table_name]['is_grid_edit'];
						var is_grid_edit_inline = all_obj[system_module_name]['g_multi_group'][m_group_table_name]['is_grid_edit_inline'];
						var group_id = 	 all_obj[system_module_name]['g_multi_group'][m_group_table_name]['group_id'];
						
						if(is_grid_edit_inline == "1" && is_grid_edit=="1")
						{
							
							$.each(all_row_obj,function (ak,av) {
								
									$('#table_group_grid_'+group_id).jqGrid('addRowData',av['id'],av);
								
								
							});
						}
						else
						{ 
							$.each(all_row_obj,function (ak,av) {
								 
								$(input_id).append("<tr id='"+tr_id+"'></tr>");
							
								FWMultiGrid.FormGridRowFromInputToTableRow(system_module_name,m_group_table_name,av,tr_id,'No','No');
								tr_id++;
							});
						}
					}
				});
			}
			FWMultiGrid.FormThirdLevelGridEditFields(system_module_name,group_table_name);
		//}
		/* catch(err){
				
			var message = err.message;
			message = err.message+" in FWMultiGrid.AssignThirdLevelDataToPopup";
			bootbox.alert(message);
		} */
	},
	
	FormGEditInlineGrid : function (system_module_table_name,group_table_name,group_int_code) {
	
		var load_id="#m_"+system_module_table_name+" #g_edit_inline_"+group_table_name;
			var jt_db=getCookie("jt_db"); 
			var load_path = "grid_display_files/"+jt_db+"/"+group_table_name+".js";
			var main="<table id='table_group_grid_"+group_int_code+"' class='scroll'    ></table> <div id='sub_grid_group_div_"+group_int_code+"' class='scroll' style='text-align:center;'></div>";
			$(load_id).html(main);
			var th = document.getElementsByTagName('head')[0];
			var s = document.createElement('script');
			s.setAttribute('type','text/javascript');


			s.setAttribute('src',load_path);
			th.appendChild(s);
	}
}

function isNumberKey(evt){

		var charCode = (evt.which) ? evt.which : evt.keyCode;
		if (charCode > 31 &&  charCode!=46 && (charCode < 48 || charCode > 57 ) )
			return false;
		return true;

} 

function EncodeSingleQuote(string_val)
{
	return string_val.replace(/'/g, "%27");
}

function EscapeDoubleQuote(string_val)
{
	return string_val.replace(/"/g, "&quot;");
}
function keyHandler(event,element)
{
	switch (event.which) {
      case 13: {
        event.stopPropagation;
         $(element).trigger('click');
        break;
      }
    } //end switch
    return true;
}