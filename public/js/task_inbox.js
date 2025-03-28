var $g_task_id=0;   
var $g_replay_trail_footer="";
var Task = function () {
    
	var content = $('.inbox-content');
    var loading = $('.inbox-loading');
    var listListing = '';
    var task_int_code=0;
   
    var initWysihtml5 = function () {
        if (CKEDITOR.instances['task_ckeditor']) {
		CKEDITOR.instances['task_ckeditor'].destroy();
		}
		CKEDITOR.replace( 'task_ckeditor')	;		
    }
    var loadSearchResults = function (el) {
        var url = 'inbox_search_result.html';

        loading.show();
        $('.inbox-content').html('');
        toggleButton(el);

        $.ajax({
            type: "GET",
            cache: false,
            url: url,
			   error:AjaxErrorMessage,
            dataType: "html",
            success: function(res) 
            {
                toggleButton(el);

                $('.inbox-nav > li.active').removeClass('active');
                $('.inbox-header > h3').text('Search');
                loading.hide();
                $('.inbox-content').html(res);
                App.fixContentHeight();
                App.initUniform();
            },
            error: function(xhr, ajaxOptions, thrownError)
            {
                toggleButton(el);
            }
        });
    }

    var handleCCInput = function () {
        var the = $('.inbox-compose .mail-to .inbox-cc');
        var input = $('.inbox-compose .input-cc');
        the.hide();
        input.show();
        $('.close', input).click(function () {
            input.hide();
            the.show();
			$("#compose_cc").select2("val",'');
        });
    }

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
        init: function ()
		{
			Task.GetStatusWiseOnlyCount('My Tasks');
		},
		HandlePrevPage:function()
		{
			var start_lmt=$('#tasks_inbox .inbox-content .pagination-control #pgnt_frst_lmt').text();
			start_lmt=parseFloat(start_lmt)-10;
			var task_type=$('#tasks_inbox .inbox-header > h3').text();
			Task.loadInbox($(this), task_type,start_lmt,"internal_code","desc")
		},
		HandleNextPage:function()
		{
			var start_lmt=$('#tasks_inbox .inbox-content .pagination-control #pgnt_frst_lmt').text();
			start_lmt=parseFloat(start_lmt)+10;
			var task_type=$('#tasks_inbox .inbox-header > h3').text();
			Task.loadInbox($(this), task_type,start_lmt,"internal_code","desc");
		},
		
		TaskLoadMessagePopup :function (task_id,task_creator_id,login_user_id) 
		{
			$.ajax({
				type: "GET",
				url: $host_url+"ViewTask",
				error:AjaxErrorMessage,
				data: "task_id="+task_id, 		
				success: function(responce) 
				{
					responce = eval('(' + responce + ')');   
					if (responce.error_code == 0)
					{
						var p_width=1200;
						$.get(responce.data['task_view_html'], function( data ) {
							
							$(".modal-dialog").css("width","");
							html = data;	
							
							$('#model_body').html(html);
							$('#myModalLabel').html('Task');
							setTimeout(function()
							{ 
								App.fixContentHeight();
								App.initUniform();
								App.init();
								$('.inbox-loading').hide();
								$g_replay_trail_footer=$("#replay_trial_div").html();
								
								if(task_creator_id != login_user_id)
								{
									$("#fileupload").load("html_modules/task_replay.html",function(){
										initWysihtml5();
										Task.GetReplyDetailsForTaskId(task_id);
									});
								}
								else
								{
									$("#fileupload").load("html_modules/task_reply_for_creator.html",function(){
										initWysihtml5();
										Task.GetReplyDetailsForTaskId(task_id);
										POPUP.AssignJqueryAutoCompleteNew('s_sysdb','manual_auto_complete_fields','assigned_to','');	
									});
								}
							}, 	1000);
							if($(window).width()>1200)
							{
								$(".modal-dialog").css("width","80%");
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
					}
				},
				error: function(xhr, ajaxOptions, thrownError)
				{
				},
				async: false
			});
		},
		TaskLoadMessage : function (task_id,task_creator_id,login_user_id) 
		{
			$.ajax({
				type: "GET",
				url: $host_url+"ViewTask",
				error:AjaxErrorMessage,
				data: "task_id="+task_id, 		
				success: function(responce) 
				{
					responce = eval('(' + responce + ')');   
					if (responce.error_code == 0)
					{
						var p_width=1200;
						$.get(responce.data['task_view_html'], function( data ) {
							$.prompt(data, {
								buttons: {},
								loaded : function(){
									App.fixContentHeight();
									App.initUniform();
									App.init();
									$('.inbox-loading').hide();
									$g_replay_trail_footer=$("#replay_trial_div").html();
									
									if(task_creator_id != login_user_id)
									{
										$("#fileupload").load("html_modules/task_replay.html",function(){
											initWysihtml5();
											Task.GetReplyDetailsForTaskId(task_id);
										});
									}
									else
									{
										$("#fileupload").load("html_modules/task_reply_for_creator.html",function(){
											initWysihtml5();
											Task.GetReplyDetailsForTaskId(task_id);
											POPUP.AssignJqueryAutoCompleteNew('s_sysdb','manual_auto_complete_fields','assigned_to','');	
										});
									}
								},
								title: "Task - "+task_id,
								position: {width: p_width},
								//zIndex:90909090
							}); 
						});  
						
					}
				},
				error: function(xhr, ajaxOptions, thrownError)
				{
				},
				async: false
			});
		},

		ToggleTaskDiv:function (int_code)
		{
			$( "#task_deatils_"+int_code).toggle( "slow" );
		},
		
		MaskOrderTime : function()
		{ 
			
			$(" #start_time").inputmask("hh:mm", {
				autoUnmask: true
			});  
			$("#end_time").inputmask("hh:mm", {
				autoUnmask: true
			});   
			
		},
		
		CalculateDutyHours : function()
		{
			var start_time = $("#start_time").val();
			var end_time = $("#end_time").val();
			
			if(!empty(start_time) && !empty(end_time))
			{  
				if(start_time < end_time){
					var lstr_string="start_time="+start_time;
						lstr_string+="&end_time="+end_time;
					
					$.ajax({
						type: "POST",	 
						url: $host_url+"CalculateDutyHours", 
						async: true,	
						data:lstr_string,	
						error:AjaxErrorMessage,		
						success:  function CalculateDutyHoursSuccess(responce)
						{
							App.unblockUI();
							
							responce = eval('(' + responce + ')');
							
							if(responce.error_code == 0)
							{
								$(" #total_time").val(responce.data);
							}
						}
					});
				}
				else
				{
					alert("End Time should be greater than Start Time in 24 Hour Format ----> HH:MM");
					$("#end_time").val('');
					return false;
				}
			}
		},
		GetReplyDetailsForTaskId:function(task_id)
		{
			$g_task_id = task_id;
			
			var assigned_task_view=$("#assigned_task_view").is(':checked');	
			var task_active_list_type=$("#task_list_ul li.active a").attr("data-title");
			$.ajax({
				type: "POST",
				async:false,
				url: $host_url+"GetReplyDetailsForTaskId",
				error:AjaxErrorMessage,
				data: "task_id="+$g_task_id+"&task_active_list_type="+task_active_list_type+"&assigned_task_view="+assigned_task_view, 			
				success: function(responce) 
				{
					responce = eval('(' + responce + ')');   
					if (responce.error_code == 0)
					{
						var task_data=responce.data['task_data'];
						$("#status").append(responce.data['status_html']);
						Task.AssignMailIdsForSelect('external_email_id',responce.data['mail_ids']);
						Task.AssignMailIdsForSelect('external_to_email_id',responce.data['mail_ids']);					
						$("#subject").html("Subject :"+task_data.subject);
			
						Task.ReasignSelect2Val("compose_cc",task_data.cc);
						Task.ReasignSelect2Val("external_email_id",task_data.external_email_id);
						Task.ReasignSelect2Val("external_to_email_id",task_data.external_to_email_id);

						$("#assigned_to").val(task_data.assigned_to);
						$("#target_date").val(task_data.target_date);
						$("#count").html(responce.data.html);
						$("#assigned").html(responce.data.assigend_html);
						$("#status_count").html(responce.data.status_count_html);
						$("#start_count").html(responce.data.start_count_html);
						$("#end_count").html(responce.data.end_count_html);
						$("#txt_ref_schema_assigned_to").val(task_data.assigned_name);
						$("#follow_up_by").val(task_data.follow_up_by);
						$("#txt_ref_schema_follow_up_by").val(task_data.follow_up_name);
						$("#message").val(task_data.description);
						
						var query_for_pf=task_data.query_for_pf;
						var query_for_saf=task_data.query_for_saf;
						var query_for_gratuity=task_data.query_for_gratuity;
						var query_for_esi=task_data.query_for_esi;
						var query_for_others=task_data.query_for_others;
						
						if(query_for_pf=='Yes')
						{
							$("#qry_pf").attr("checked",true);
							$("#qry_pf").parent().addClass('checked')
						}
						if(query_for_saf=='Yes')
						{
							$("#qry_saf").attr("checked",true);
							$("#qry_saf").parent().addClass('checked')
						}
						if(query_for_gratuity=='Yes')
						{
							$("#qry_gratuity").attr("checked",true);
							$("#qry_gratuity").parent().addClass('checked')
						}
						if(query_for_esi=='Yes')
						{
							$("#qry_esi").attr("checked",true);
							$("#qry_esi").parent().addClass('checked')
						}
						if(query_for_others=='Yes')
						{
							$("#qry_others").attr("checked",true); 
							$("#qry_others").parent().addClass('checked')
						}
							
					}				
				}
			});
		},
		
		GetComposeDetailsForNewTask:function()
		{
			$.ajax({
			type: "POST",
			async:false,
			url: $host_url+"GetComposeDetailsForNewTask",
			error:AjaxErrorMessage,
			data: "task_id="+$g_task_id, 			
			success: function(responce) 
			{
				responce = eval('(' + responce + ')');   
				if (responce.error_code == 0)
				{				
					$("#status").append(responce.data['status_html']);
					$("#assigned_from").val(responce.data['login_user_int_code']);
					$("#txt_ref_schema_assigned_from").val(responce.data['login_user_name']);
					Task.AssignUsersListForSelect('assigned_to',responce.data['user_list']);	
					Task.AssignMailIdsForSelect('external_email_id',responce.data['mail_ids']);
					Task.AssignMailIdsForSelect('external_to_email_id',responce.data['mail_ids']);
					 $("#status").val($("#status").find('option:contains(New)').val());					
				}				
			}
			});
		
		},
		
		OpenTaskComposePopup :function (el,call_type) 
		{
			$.get("html_modules/task_compose.html", function(data) {
				
				$(".modal-dialog").css("width","");
				html = data;	
				
				$('#model_body').html(html)
				$('#myModalLabel').html('Compose Task');
				setTimeout(function()
				{ 
					toggleButton(el);
					$('.inbox-nav > li.active').removeClass('active');
					$('.inbox-header > h3').text('');

					loading.hide();
					$('.inbox-content').html(data);
					$('.inbox-compose').on('click', '.mail-to .inbox-cc', function () {
					handleCCInput();
					});
		
					if(call_type=='Compose')
					{
						$("#task_pagin_div").hide();
						initWysihtml5();
						$('.inbox-wysihtml5').focus();
						App.fixContentHeight();
						App.initUniform();
						Task.GetComposeDetailsForNewTask();
						POPUP.AssignJqueryAutoCompleteNew('s_sysdb','manual_auto_complete_fields','assigned_from','');	
						POPUP.AssignJqueryAutoCompleteNew('s_sysdb','manual_auto_complete_fields','real_name','');	
						POPUP.AssignJqueryAutoCompleteNew('s_sysdb','manual_auto_complete_fields','follow_up_by','');	
						POPUP.AssignJqueryAutoCompleteNew('customer','manual_auto_complete_fields','customer','');	
						POPUP.AssignJqueryAutoCompleteNew('enquiry_register','manual_auto_complete_fields','q_no','');	
						POPUP.AssignJqueryAutoCompleteNew('department','manual_auto_complete_fields','name','');	
						POPUP.AssignJqueryAutoCompleteNew('project_master','manual_auto_complete_fields','project_name','');
					}			
				}, 1000);
				if($(window).width()>1200)
				{
					$(".modal-dialog").css("width","80%");
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
		
		TaskCompose :function (el,call_type)
		{
			var url = 'html_modules/task_compose.html';
			
			loading.show();
			content.html('');
			toggleButton(el);
			$('#myModalLabel').html('Compose Task');	
				
			// load the form via ajax
			$.ajax({
				type: "GET",
				cache: false,
				url: url,
				error:AjaxErrorMessage,
				dataType: "html",
				success: function(res) 
				{
					toggleButton(el);
					$('.inbox-nav > li.active').removeClass('active');
					$('.inbox-header > h3').text('');

					loading.hide();
					$('.inbox-content').html(res);
					$('.inbox-compose').on('click', '.mail-to .inbox-cc', function () {
					handleCCInput();
					});
		
					if(call_type=='Compose')
					{
						$("#task_pagin_div").hide();
						initWysihtml5();
						$('.inbox-wysihtml5').focus();
						App.fixContentHeight();
						App.initUniform();
						Task.GetComposeDetailsForNewTask();
						POPUP.AssignJqueryAutoCompleteNew('s_sysdb','manual_auto_complete_fields','assigned_from','');	
						POPUP.AssignJqueryAutoCompleteNew('s_sysdb','manual_auto_complete_fields','real_name','');	
						POPUP.AssignJqueryAutoCompleteNew('s_sysdb','manual_auto_complete_fields','follow_up_by','');	
						POPUP.AssignJqueryAutoCompleteNew('customer','manual_auto_complete_fields','customer','');	
						POPUP.AssignJqueryAutoCompleteNew('enquiry_register','manual_auto_complete_fields','q_no','');	
						POPUP.AssignJqueryAutoCompleteNew('department','manual_auto_complete_fields','name','');	
						POPUP.AssignJqueryAutoCompleteNew('project_master','manual_auto_complete_fields','project_name','');	
					}				
				},
				error: function(xhr, ajaxOptions, thrownError)
				{
					toggleButton(el);
				}
			});
		},
	
		SubTaskCompose :function (el,call_type,parent_task_id,current_status_code,current_status_name) 
		{
			Task.GetStatusWiseCount('My Task');
			
			setTimeout(function()
			{ 
				$('#myModalLabel').html('Compose Sub Task');
				var url = 'html_modules/task_compose.html';
				
				loading.show();
				content.html('');
				toggleButton(el);

				// load the form via ajax
				$.ajax({
					type: "GET",
					cache: false,
					url: url,
					error:AjaxErrorMessage,
					dataType: "html",
					success: function(res) 
					{
						toggleButton(el);
						$('.inbox-nav > li.active').removeClass('active');
						$('.inbox-header > h3').text('');

						loading.hide();
						$('.inbox-content').html(res);
						$('.inbox-compose').on('click', '.mail-to .inbox-cc', function () {
						handleCCInput();
						});
			
						if(call_type=='Sub Task')
						{
							$("#task_pagin_div").hide();
							initWysihtml5();
							$('.inbox-wysihtml5').focus();
							App.fixContentHeight();
							App.initUniform();
							Task.GetComposeDetailsForNewTask();
							POPUP.AssignJqueryAutoCompleteNew('s_sysdb','manual_auto_complete_fields','assigned_from','');	
							POPUP.AssignJqueryAutoCompleteNew('s_sysdb','manual_auto_complete_fields','real_name','');	
							POPUP.AssignJqueryAutoCompleteNew('s_sysdb','manual_auto_complete_fields','follow_up_by','');	
							POPUP.AssignJqueryAutoCompleteNew('customer','manual_auto_complete_fields','customer','');	
							POPUP.AssignJqueryAutoCompleteNew('enquiry_register','manual_auto_complete_fields','q_no','');	
							POPUP.AssignJqueryAutoCompleteNew('department','manual_auto_complete_fields','name','');	
							POPUP.AssignJqueryAutoCompleteNew('project_master','manual_auto_complete_fields','project_name','');
							
							$("#parent_task_id").val(parent_task_id);
							// $('#status').append("<option selected value="+current_status_code+">"+current_status_name+"</option>");
						}				
					},
					error: function(xhr, ajaxOptions, thrownError)
					{
						toggleButton(el);
					}
				});
			}, 	2000);
		},
		AssignUsersListForSelect:function(system_name,data_arr)
		{
			$("#"+system_name).html(data_arr);
			$("#"+system_name).select2({
			placeholder: " ", 
			allowClear: true
			}); 
		},
		AssignMailIdsForSelect:function(system_name,data_arr)
		{
			$("#"+system_name).select2({
			tags:data_arr 
			}); 
		},
		ReasignSelect2Val:function(system_name,val)
		{
			if(!empty(val))
			{
				var exp_arr=val.split(",");
				$("#"+system_name).select2('val',exp_arr);
				for(i=0;i<exp_arr.length;i++)
				{
					// console.log(exp_arr[i]);
					//$("#"+system_name).select2('val',exp_arr);
					//$("#compose_cc").select2('val',exp_arr[i]);
				}
			}
		},
		
		GetStatusWiseCount:function(task_call_type)
		{
			var status_name = $("#status :selected").text();
			
			if($("#status :selected").text() == 'Select One')
				status_name = 'New';
			else if($("#status :selected").text() == '')
				status_name = 'All';
			
			$.ajax({
				type: "GET",
				url: $host_url+"GetStatusWiseCount",
				error:AjaxErrorMessage,
				data:"task_call_type="+task_call_type, 		
				success: function(responce) 
				{
					responce = eval('(' + responce + ')');   
					if (responce.error_code == 0)
					{
						$("#task_list_ul").html(responce.data['html']);
						
						if(task_call_type=='My Tasks')
						{
							$("#task_status_ul").html(responce.data['dash_html']);
							$("#my_task_view").prop('checked', true);
							$("#assigned_task_view").prop('checked', false);
						}
						else if(task_call_type=='Assigned Tasks')
						{
							$("#my_task_view").prop('checked', false);
							$("#assigned_task_view").prop('checked', true);
						}
						
						if(task_call_type!='Assigned Tasks')
						{
							$("#task_list_ul .inbox.active a").trigger("click");
							Task.LoadTaskInboxPopup($(this),status_name,1,'','',0,'',task_call_type);
						}
						else
						{
							// if(user_type == 'creator')
							// {
								// Task.LoadTaskInboxPopup($(this),status_name,1,'','',0,'',task_call_type);
								// setTimeout(function()
								// { 
									// $("#my_task_view").prop('checked', false);
									// $("#assigned_task_view").prop('checked', true).trigger('click');
									// $("#task_list_ul .inbox a:contains("+status_name+")").trigger("click");
								// }, 	2000);
							// } 
							// else
							// {
								Task.loadInbox($(this),status_name,1,'','',0,'');
								$("#task_list_ul .inbox a:contains("+status_name+")").trigger("click");
							// }
						}
					}
				},
				error: function(xhr, ajaxOptions, thrownError)
				{
					toggleButton(el);
				},
				async: false
			});
		},
		GetStatusWiseOnlyCount:function(task_call_type)
		{
			$.ajax({
				type: "GET",
				url: $host_url+"GetStatusWiseCount",
				error:AjaxErrorMessage,
				data:"", 		
				success: function(responce) 
				{
					responce = eval('(' + responce + ')');   
					if (responce.error_code == 0)
					{
						$("#task_list_ul").html(responce.data['html']);
						if(task_call_type=='My Tasks')
						{
							$("#task_status_ul").html(responce.data['dash_html']);
						}
					}
				},
				error: function(xhr, ajaxOptions, thrownError)
				{
					toggleButton(el);
				},
				async: false
			});
		},	
		ReadMailsFromMailId:function()
		{
			$.ajax({
				type: "GET",
				url: $host_url+"ReadMailsFromMailId",
				error:AjaxErrorMessage,
				data:"", 		
				success: function(responce) 
				{
					responce = eval('(' + responce + ')');   
					if (responce.error_code == 0)
					{
						 alert(responce.data);					 
					}
				},
				error: function(xhr, ajaxOptions, thrownError)
				{
					toggleButton(el);
				},
				async: false
			});
		},	
		ValidateEmail :function (mail)   
		{  
			if(empty(mail)) return true;
			split_arr=mail.split(",");
			
			var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; 
			var flag=true;	
			for(j=0;j<split_arr.length;j++)
			{
				if(split_arr[j].match(mailformat))  
				{  
					flag=true;  
				}
				else
					flag=false; 
			}		
			return flag;
		},
		
		LoadTaskInboxPopup :function (el, name,page_id,sidx,sord,parent_task_id,task_type,task_call_type) 
		{
			$.get("html_modules/task_inbox.html", function(data) {
				
				$(".modal-dialog").css("width","");
				html = data;	
				
				$('#model_body').html(html);
				$('#myModalLabel').html('Task');
				setTimeout(function()
				{ 
					Task.GetStatusWiseOnlyCount(task_call_type);
					
					Task.loadInbox(el, name,page_id,sidx,sord,parent_task_id,task_type);
				}, 	1000);
				if($(window).width()>1200)
				{
					$(".modal-dialog").css("width","80%");
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
		
		loadInbox :function (el, name,page_id,sidx,sord,parent_task_id,task_type) 
		{
			var assigned_task_view=$("#assigned_task_view").is(':checked');	
			var my_task_view=$("#my_task_view").is(':checked');	
			var search_string=$("#tasks_inbox #search_option_div label.active").map(function() {return $(this).text().trim();}).toArray();

			listListing = "type="+name;
			listListing += "&search_string="+search_string;
			listListing += "&assigned_task_view="+assigned_task_view;
			listListing += "&my_task_view="+my_task_view;
			listListing += "&sidx="+sidx;
			listListing += "&sord="+sord;
			listListing += "&search_v="+encodeURIComponent($("#search_txt").val());
			listListing += "&page_id="+page_id;
			listListing += "&start_limit="+$("#page_count_view").val();
			listListing += "&tot_cnt="+$("#tasks_inbox #task_list_ul li").find("a:contains('"+name+"')").attr("total-cnt");
			listListing += "&parent_task_id="+parent_task_id;
			listListing += "&tasktype="+task_type;
				
			$('.inbox-loading').show();
			$('.inbox-content').html('');
			toggleButton(el);
			
		   $.ajax({
				type: "GET",
				url: $host_url+"GetTaskInboxFileName",
				error:AjaxErrorMessage,
				data: listListing, 			
				success: function(responce) 
				{
					try 
					{
						responce = eval('(' + responce + ')');   
						if (responce.error_code == 0)
						{
							toggleButton(el);
							$('.inbox-nav > li.active').removeClass('active');
							 $("#tasks_inbox #task_list_ul li").find("a:contains('"+name+"')").parent().addClass('active');
							$('.inbox-header > h3').text(name);

							$('.inbox-loading').hide();
							$('.inbox-content').load(responce.data['task_html'],function()
							{
								 if(trim($("#search_txt").val()).length>0)
								 {
								  $("#search_option_div").show();
								 }
								Task.HandleSortImages(sidx,sord); 
								 
							});
							
							App.fixContentHeight();
							App.initUniform();
							
							if(parent_task_id > 0)
							{
								setTimeout(function(){
									$('#prev_task_td').show();
									}, 500);
							}
							else
							{
								setTimeout(function(){
									$('#prev_task_td').hide();
									}, 500);
							}
							Task.ProcessViewPoPagination(responce)
						}
					}
					catch(err)
					{
						txt= err.message;
						ShowAlertMsg(txt+"<br>"+responce);
					}
				},
				error: function(xhr, ajaxOptions, thrownError)
				{
					toggleButton(el);
				}
			});
		},

		loadApproveInbox :function (el,name,page_id,sidx,sord)
		{
			var assigned_task_view=$("#assigned_task_view").is(':checked');	
			var my_task_view=$("#my_task_view").is(':checked');	
			var search_string=$("#tasks_inbox #search_option_div label.active").map(function() {return $(this).text().trim();}).toArray();
	
			listListing = "type="+name;
			listListing += "&assigned_task_view="+assigned_task_view;
			listListing += "&my_task_view="+my_task_view;
			listListing += "&search_string="+search_string;
			listListing += "&sidx="+sidx;
			listListing += "&sord="+sord;
			listListing += "&search_v="+encodeURIComponent($("#search_txt").val());
			listListing += "&page_id="+page_id;
			listListing += "&start_limit="+$("#page_count_view").val();
			listListing += "&tot_cnt="+$("#tasks_inbox #task_list_ul li").find("a:contains('"+name+"')").attr("total-cnt");
				
			$('.inbox-loading').show();
			$('.inbox-content').html('');
			toggleButton(el);
			
			$.ajax({
				type: "GET",
				url: $host_url+"GetTaskInboxFileName",
				error:AjaxErrorMessage,
				data: listListing, 			
				success: function(responce) 
				{
					try 
					{
						responce = eval('(' + responce + ')');   
						if (responce.error_code == 0)
						{
							toggleButton(el);
							$('.inbox-nav > li.active').removeClass('active');
							 $("#tasks_inbox #task_list_ul li").find("a:contains('"+name+"')").parent().addClass('active');
							$('.inbox-header > h3').text(name);

							$('.inbox-loading').hide();
							$('.inbox-content').load(responce.data['task_html'],function()
							{
								 if(trim($("#search_txt").val()).length>0)
								 {
								  $("#search_option_div").show();
								 }
								Task.HandleSortImages(sidx,sord); 
								 
							});
							App.fixContentHeight();
							App.initUniform();
							Task.ProcessViewPoPagination(responce)
						}
					}
					catch(err)
					{
						txt= err.message;
						bootbox.alert(txt+"<br>"+responce);
					}
				},
				error: function(xhr, ajaxOptions, thrownError)
				{
					toggleButton(el);
				}
			});
		},
		loadFollowUpInbox :function (el, name,page_id,sidx,sord,assigned_to,click_type,tot_cnt)
		{
			var search_string=$("#tasks_inbox #search_option_div label.active").map(function() {return $(this).text().trim();}).toArray();
	
			listListing = "&type="+name;
			listListing += "&assigned_to="+assigned_to;
			listListing += "&click_type="+click_type;
			listListing += "&search_string="+search_string;
			listListing += "&sidx="+sidx;
			listListing += "&sord="+sord;
			listListing += "&search_v="+encodeURIComponent($("#search_txt").val());
			listListing += "&page_id="+page_id;
			listListing += "&start_limit="+$("#page_count_view").val();
			listListing += "&tot_cnt="+tot_cnt;
				
			$('.inbox-loading').show();
			$('.inbox-content').html('');
			toggleButton(el);
			
			$.ajax({
				type: "GET",
				url: $host_url+"GetApproveTaskInboxFileName",
				error:AjaxErrorMessage,
				data: listListing, 			
				success: function(responce) 
				{
					try 
					{
						responce = eval('(' + responce + ')');   
						if (responce.error_code == 0)
						{
							toggleButton(el);
							$('.inbox-nav > li.active').removeClass('active');
							 $("#tasks_inbox #task_list_ul li").find("a:contains('"+name+"')").parent().addClass('active');
							$('.inbox-header > h3').text(name);

							$('.inbox-loading').hide();
							$('.inbox-content').load(responce.data['task_html'],function()
							{
								 if(trim($("#search_txt").val()).length>0)
								 {
								  $("#search_option_div").show();
								 }
								Task.HandleSortImages(sidx,sord); 
								 
							});
							App.fixContentHeight();
							App.initUniform();
							Task.ProcessViewPoPagination(responce)
						}
					}
					catch(err)
					{
						txt= err.message;
						bootbox.alert(txt+"<br>"+responce);
					}
				},
				error: function(xhr, ajaxOptions, thrownError)
				{
					toggleButton(el);
				}
			});
		},
		HandleSortImages:function (sidx,sord)
		{
			if(sord=="desc")
			{
				if(sidx=='date')
					$('#img_sort_date').attr('src', 'img/up_arrow.png');
				else if(sidx=='internal_code')
					$('#img_sort_internal_code').attr('src', 'img/up_arrow.png');
				else if(sidx=='age')
					$('#img_sort_age').attr('src', 'img/up_arrow.png');
				else if(sidx=='subject')
					$('#img_sort_subject').attr('src', 'img/up_arrow.png');
				else if(sidx=='from')
					$('#img_sort_from').attr('src', 'img/up_arrow.png');
				else if(sidx=='status')
					$('#img_sort_status').attr('src', 'img/up_arrow.png');
				else if(sidx=='f_date')
					$('#img_sort_f_date').attr('src', 'img/up_arrow.png');
				else if(sidx=='assignee')
					$('#img_assignee').attr('src', 'img/up_arrow.png');
			}
			if(sord=="asc")
			{
				if(sidx=='date')
					$('#img_sort_date').attr('src', 'img/down_arrow.png');
				else if(sidx=='internal_code')
					$('#img_sort_internal_code').attr('src', 'img/down_arrow.png');
				else if(sidx=='age')
					$('#img_sort_age').attr('src', 'img/down_arrow.png');
				else if(sidx=='subject')
					$('#img_sort_subject').attr('src', 'img/down_arrow.png');
				else if(sidx=='from')
					$('#img_sort_from').attr('src', 'img/down_arrow.png');
				 else if(sidx=='status')
				  $('#img_sort_status').attr('src', 'img/down_arrow.png');
				else if(sidx=='f_date')
					$('#img_sort_f_date').attr('src', 'img/down_arrow.png');
				else if(sidx=='assignee')
					$('#img_assignee').attr('src', 'img/down_arrow.png');
			}
		},
		TaskLoadReplay : function (el,task_id) 
		{
			$g_task_id=task_id;
			var url = 'html_modules/task_replay.html';			
			content.html('');
			toggleButton(el);
			$('.inbox-loading').show();
			// load the form via ajax
			$.ajax({
				type: "GET",
				cache: false,
				url: url,
				   error:AjaxErrorMessage,
				dataType: "html",
				success: function(res) 
				{
					toggleButton(el);
					$('.inbox-header > h3').text('Task-'+task_id);

					$('.inbox-loading').hide();
					$('.inbox-content').html(res);
					$('.inbox-compose').on('click', '.mail-to .inbox-cc', function () {					
					handleCCInput();
					
					});
					initWysihtml5();
					$('.inbox-wysihtml5').focus();
					App.fixContentHeight();
					App.initUniform();					
					Task.GetReplyDetailsForTaskId();
					POPUP.AssignJqueryAutoCompleteNew('s_sysdb','manual_auto_complete_fields','assigned_to','');	
					POPUP.AssignJqueryAutoCompleteNew('s_sysdb','manual_auto_complete_fields','follow_up_by','');	
					POPUP.AssignJqueryAutoCompleteNew('customer','manual_auto_complete_fields','customer','');	
					$("#replay_trial_footer_div").html($g_replay_trail_footer);	
					$("#uniform-send_external_mail").removeClass("checker");
					$(".inbox-info-btn").remove();
				},
				error: function(xhr, ajaxOptions, thrownError)
				{
					toggleButton(el);
				}
			})
		},
		UpdateTaskMessage : function(user_type) 
		{
			var compose_subject = encodeURIComponent($("#subject").html());
			var task_list_type=$("#task_list_ul li.active a").attr("data-title");
			var status = $("#status").val();
			var assigned_to = $("#assigned_to").val();		
			var follow_up_by = $("#follow_up_by").val();
			var updation_date = $("#updation_date").val();
			var start_time = $("#start_time").val();
			var end_time = $("#end_time").val();
			var total_time = $("#total_time").val();
			var cc_arr=$("#compose_cc").select2("val");
			var compose_message = encodeURIComponent(CKEDITOR.instances.task_message.getData());
			var send_external_mail=0;			
		 
			if(empty(compose_message))
			{
				alert("Please enter the message!");
				return false;			 
			}
			else if(empty(status))
			{
				alert("Please select status!");
				return false;			 
			}
			
			if(user_type == 'user')
			{
				if(empty(updation_date) || updation_date == '00/00/0000')
				{
					alert("Please enter the date!");
					return false;			 
				}
				else if(empty(start_time))
				{
					alert("Please enter the start time!");
					return false;			 
				}
				else if(empty(end_time))
				{
					alert("Please enter the end time!");
					return false;			 
				}
				
				var list_data=$host_url+"UpdateTaskMessage";
				list_data+="&cc_arr="+cc_arr;
				list_data+="&compose_subject="+compose_subject;
				list_data+="&status="+status;
				list_data+="&assigned_to="+assigned_to;
				list_data+="&compose_message="+compose_message;
				list_data+="&end_time="+end_time;
				list_data+="&start_time="+start_time;
				list_data+="&updation_date="+updation_date;
				list_data+="&task_list_type="+task_list_type;
				list_data+="&total_time="+total_time;
				list_data+="&task_id="+$g_task_id;
				
				App.blockUI({target:'#fileupload',boxed:true,message:"Please wait, Task is updating"});
				var ext = document.getElementById('module_details_uploaded_file').value;
				var filepath = ext;	
				list_data+="&filepath="+filepath;
				
				document.getElementById("fileupload").setAttribute("action",list_data);
			 
				App.blockUI({target: $(".form-body"),message:"Please Wait, Task is updating and sending mails..."});
				
				return AIM.submit(document.getElementById("fileupload"), 'same_tab',{'onComplete' : Task.UpdateTaskMessageResponse});
			}
			else
			{		
				if(empty(updation_date))
					updation_date = '00/00/0000';
					
				var list_data=$host_url+"UpdateTaskMessage";
				list_data+="&cc_arr="+cc_arr;
				list_data+="&compose_subject="+compose_subject;
				list_data+="&status="+status;
				list_data+="&assigned_to="+assigned_to;
				list_data+="&compose_message="+compose_message;
				list_data+="&end_time="+end_time;
				list_data+="&start_time="+start_time;
				list_data+="&updation_date="+updation_date;
				list_data+="&task_list_type="+task_list_type;
				list_data+="&total_time="+total_time;
				list_data+="&task_id="+$g_task_id;
				
				App.blockUI({target:'#fileupload',boxed:true,message:"Please wait, Task is updating"});
				var ext = document.getElementById('module_details_uploaded_file').value;
				var filepath = ext;	
				list_data+="&filepath="+filepath;
				
				document.getElementById("fileupload").setAttribute("action",list_data);
			 
				App.blockUI({target: $(".form-body"),message:"Please Wait, Task is updating and sending mails..."});
				
				return AIM.submit(document.getElementById("fileupload"), 'same_tab',{'onComplete' : Task.UpdateTaskMessageResponse});   
			}
		},
		UpdateTaskMessageResponse:function(responce) 
		{
			try
			{
				App.unblockUI('#fileupload');
				responce = eval('(' + responce + ')');   
				if (responce.error_code == 0)
				{
					// $.prompt.close();
					ShowSuccessMsg(responce.data);
					Task.GetStatusWiseCount("My Task");
				}
				else
				{
					ShowAlertMsg(responce.data);
					return false;
				}	
			}
			catch(err)
			{
				txt= err.message;
				ShowAlertMsg(txt+"<br>"+responce);
			}	
		},		
		SaveComposeTaskMessage : function() 
		{
			var assigned_from = $("#assigned_from").val();
			var assigned_to = $("#assigned_to").val();
			var coordinator = $("#real_name").val();
			var customer = $("#customer").val();
			var status = $("#status").val();
			var compose_subject = $("#subject").val();
			var name = '';
			var priority = $("#priority").val();
			var target_date = date_format($("#target_date").val());	
			var project_name = $("#project_name").val();
			var total_time = $("#total_time").val();				
			var external_email_id =  ($("#external_email_id").val());
			var compose_message = encodeURIComponent(CKEDITOR.instances.task_message.getData());
			var external_to_email_id =  ($("#external_to_email_id").val());
			var parent_task_id = $("#parent_task_id").val();
			
			var send_external_mail=0;			
			
			if(empty(priority) || priority==0)
			{
				alert("Please enter the Priority!");
				return false;			 
			}
			else if(empty(compose_subject))
			{
				alert("Please enter the Subject!");
				return false;			 
			}
			
			else if(empty(target_date) || target_date=='0000-00-00')
			{
				alert("Please enter the Target Date!");
				return false;			 
			}
			if(empty(assigned_from) || assigned_from==0)
			{
				alert("Please enter the Assigned From!");
				return false;			 
			}
			if(empty(assigned_to) || assigned_to==0)
			{
				alert("Please enter the Assigned To!");
				return false;			 
			}
			else if(empty(compose_message))
			{
				alert("Please enter the message!");
				return false;			 
			}
			else
			{			
				var list_data=$host_url+"SaveComposeTaskMessage";
				list_data+="&assigned_from="+assigned_from;
				list_data+="&assigned_to="+assigned_to;
				list_data+="&coordinator="+coordinator;
				list_data+="&status="+status;
				list_data+="&compose_subject="+compose_subject;						
				list_data+="&target_date="+target_date;
				list_data+="&project_name="+project_name;
				list_data+="&name="+name;
				list_data+="&priority="+priority;
				list_data+="&total_time="+total_time;
				list_data+="&external_email_id="+external_email_id;
				list_data+="&external_to_email_id="+external_to_email_id;
				list_data+="&t_send_external_mail="+send_external_mail;
				list_data+="&compose_message="+compose_message;				
				list_data+="&internal_code="+$geditinternalcode
				list_data+="&parent_task_id="+parent_task_id
				
				App.blockUI({boxed:true,message:"Please wait, Task is updating"});
				var ext = document.getElementById('module_details_uploaded_file').value;
				var filepath = ext;	
				list_data+="&filepath="+filepath;
				
				document.getElementById("fileupload").setAttribute("action",list_data);
				App.blockUI({target: $(".form-body"),message:"Please Wait, Task is updating and sending mails..."});
				return AIM.submit(document.getElementById("fileupload"), 'same_tab',{'onComplete' : Task.SaveComposeTaskMessageResponse});   
			}
		},
		SaveComposeTaskMessageResponse:function(responce) 
		{
			try
			{
				App.unblockUI();
				responce = eval('(' + responce + ')');   
				if (responce.error_code == 0)
				{
					ShowSuccessMsg(responce.data);
					Task.GetStatusWiseCount("My Task");
				}
				else
				{
					ShowAlertMsg(responce.data);
					return false;
				}	
			}
			catch(err)
			{
				txt= err.message;
				ShowAlertMsg(txt+"<br>"+responce);
			}	
		},
		GetLatestTaskCount:function()
		{
			if ( $("#tasks_inbox").is(":visible") )
			{
				Task.GetStatusWiseOnlyCount();
			}
		},	
		SortTaskDetails:function(image_id,sort_id)
		{
			var img_src= $('#'+image_id).attr('src');
			
            if(img_src=="img/up_arrow.png")
			{
				$('#'+image_id).attr('src', 'img/down_arrow.png');
				Task.loadInbox($this,$('#tasks_inbox .inbox-header > h3').text(),1,sort_id,"asc");
            }
            else  if(img_src=="img/down_arrow.png")
            {
				$('#'+image_id).attr('src', 'img/up_arrow.png');
				Task.loadInbox($this,$('#tasks_inbox .inbox-header > h3').text(),1,sort_id,"desc");
            }
		},	
		EnableorDisableSendExternalMail:function() 
		{
			var status = $("#status option:selected").text();	
			var chek=$("#send_external_mail").is(':checked');
			if(status=='Junk')	
			{
				if(chek)
				$("#send_external_mail").trigger("click");
				$("#send_external_mail").attr("disabled",true);
			}
			else  
				$("#send_external_mail").attr("disabled",false);
			if(!chek)
				$("#send_external_mail").trigger("click");
		},
		ShowfFilterOption:function(this_obj,event)		
		{		
			if(trim($("#search_txt").val()).length>0)
			{
				$("#search_option_div").show();
			}
			else
				$("#search_option_div").hide();
			 
			if (event.keyCode == 13)
			{
				Task.loadInbox($(this_obj),$('#tasks_inbox .inbox-header > h3').text(),1,"internal_code","desc");
			}
		},
		TaskFollowups :function (el,call_type) 
		{
			var url = 'html_modules/task_followups.html';
			
			loading.show();
			content.html('');
			toggleButton(el);

			// load the form via ajax
			$.ajax({
				type: "GET",
				cache: false,
				url: url,
				error:AjaxErrorMessage,
				dataType: "html",
				success: function(res) 
				{
					toggleButton(el);
					$('.inbox-nav > li.active').removeClass('active');
					$('.inbox-header > h3').text('Followups');

					loading.hide();
					$('.inbox-content').html(res);			
		
					if(call_type=='Followups')
					{					
						App.fixContentHeight();
						App.initUniform();		
						$("#task_pagin_div").hide();
						Task.GetFollowpDetails();
					}				
				},
				error: function(xhr, ajaxOptions, thrownError)
				{
					toggleButton(el);
				}
			});
		},
		GetFollowpDetails:function()
		{
			$.ajax({
				type: "GET",
				url: $host_url+"GetFollowpDetails",
				error:AjaxErrorMessage,
				data:"", 		
				success: function(responce) 
				{
					responce = eval('(' + responce + ')');   
					if (responce.error_code == 0)
					{
						$("#followup_div").html(responce.data.html);
					}
				},
				error: function(xhr, ajaxOptions, thrownError)
				{
					toggleButton(el);
				},
				async: false
			});
		},
			
		DeleteTaskJunkData:function(task_id)
		{
			var task_type=$('#tasks_inbox .inbox-header > h3').text();
			var parameters = "task_id="+task_id;
			var yes = confirm("Do you want to delete!");
			if(yes==true)
			{ 
				$.ajax({
					type: "GET",
					url: $host_url+"DeleteTaskJunkData",
					error:AjaxErrorMessage,
					data:parameters, 		
					success: function(responce) 
					{
						responce = eval('(' + responce + ')');   
						if (responce.error_code == 0)
						{
							Task.loadInbox($(this), task_type,1,"internal_code","desc")
							Task.GetStatusWiseCount("My Task");
						}
					},
					error: function(xhr, ajaxOptions, thrownError)
					{
						toggleButton(el);
					},
					async: false
				});
			}
		},
		
		ProcessViewPoPagination : function (responce)
		{
			if(responce.data.total_pages>0)
			{
				var task_type=$('#tasks_inbox .inbox-header > h3').text();
				$("#task_pagin_div").show();
				$("#task_pagin_div").paginate({
				count 		: responce.data.total_pages,
				start 		: responce.data.page_id,
				display     : 5,
				border					: true,
				border_color			: '#dddddd',
				text_color  			: '#2A6496',
				background_color    	: '#FFFFFF',	
				border_hover_color		: '#dddddd',
				text_hover_color  		: 'black',
				background_hover_color	: '#EEEEEE', 
				images					: false,
				mouse					: 'press',
				onChange     			: function(page){
				Task.loadInbox($(this),task_type,page,"internal_code","desc",0,"")
				}
				});
			}
		},
   	
		GenerateTaskAccExcel : function(from_date,to_date) 
		{
			var data="from_date="+from_date+"&to_date="+to_date+"&report_type=Excel";
			window.location.href=$host_url+"GenerateTaskAccExcel&"+data;
		},
		getTaskHistory: function() 
		{
			var dialog_color_arr = new Array("#4CA6FF", "#979752", "#FF2693", "#FF981D", "#26FF26", "#FF0097");  

			var div_id="select_pl_div";	
			var popup_content_div_id="popup_select_pl_div";
			var dialog_state = $("#"+div_id).dialogExtend("state");
			var is_dialog_open = $("#"+div_id).dialog('isOpen');
			 
			$('#'+div_id).dialog("close")
			$('#'+div_id).remove();

			$("#page-content").append("<div id='"+div_id+"' title='' style='padding-left:0;'><div style='height:90%;' id='"+popup_content_div_id+"'></div> </div>");
		
			var dialog_height = screen.height-200;
				IncludeFrameWorkSupportFiles(); 
			$('#'+div_id).dialog({"title" : "Task History",
				"width" : "80%",
				"height" : dialog_height, position: [200,20],
				resizable:false,
				draggable:false 
			}).dialogExtend({
				"closable" : true,
				"maximizable" : false,
				"collapsable" : false,
				"minimizable" :false,
				"minimizeLocation" :"left",
				"titlebar" : false,
				"maximize" : function(evt,ui) 
				   {$(this).parent().css("top","300px"); },
				icons:{"close":"ui-icon-close"}
			});
			var main="<div style='padding:1% 0;'><span class='checkbox-list' style='margin-right:8%;'>";
				main+="<span class='btn btn-sm blue' style='margin-left:90%;align:right;' onclick=\"Task.GenerateTaskAccExcel()\"><b>Generate Excel</b></span>";
				main+="</div>";
				main+="<div style='width:100%'>";
				main+="<table id='select_pl_grid_tbl' class='scroll'></table> <div id='sub_pl_grid_div' class='scroll' style='text-align:left;'></div></br/>";
				main+="</div>";
			$("#popup_select_pl_div").html(main);
			Task.enablePLSearch();
			$(".ui-dialog-titlebar-close").css("cursor" ,"pointer").css("padding" ,"0").css("height" ,"18px");
			$("#"+div_id).siblings('.ui-widget-header').css("background","#4CA6FF").css("border" ,"none");
			$(".ui-widget-header .ui-dialog-title").css("color","#ffffff");
			$(".ui-dialog").css("z-index","999999999999").css('box-shadow','1px 1px 5px 0px rgba(0,0,0,0.75)');
			$(".ui-dialog-titlebar").css('padding','1px 10px');
		},
		enablePLSearch : function()  
		{
			$.ajax({
				type: "POST",	 
				url: $host_url+"getGridCheckBoxTaskHistory", 
				async:true,					
				data:"",
				error:AjaxErrorMessage,				 
				success: function getGridCheckBoxTaskHistorySuccess(responce)
				{
					responce = eval('(' +  responce + ')');	
					$("#sub_pl_grid_div").html(responce.data);
				}
			});
		},
		getTaskcount: function() 
		{
			var dialog_color_arr = new Array("#4CA6FF", "#979752", "#FF2693", "#FF981D", "#26FF26", "#FF0097");  

			var div_id="select_pl_div";	
			var popup_content_div_id="popup_select_pl_div";
			var dialog_state = $("#"+div_id).dialogExtend("state");
			var is_dialog_open = $("#"+div_id).dialog('isOpen');
		 
			$('#'+div_id).dialog("close")
			$('#'+div_id).remove();

			$("#page-content").append("<div id='"+div_id+"' title='' style='padding-left:0;'><div style='height:90%;' id='"+popup_content_div_id+"'></div> </div>");
			
			var dialog_height = screen.height-400;
			IncludeFrameWorkSupportFiles(); 
			$('#'+div_id).dialog({"title" : "Task History",
				"width" : "40%",
				"height" : dialog_height, position: [200,50],
				resizable:false,
				draggable:false 
			}).dialogExtend({
				"closable" : true,
				"maximizable" : false,
				"collapsable" : false,
				"minimizable" :false,
				"minimizeLocation" :"left",
				"titlebar" : false,
				"maximize" : function(evt,ui) 
				{$(this).parent().css("top","300px"); },
				icons:{"close":"ui-icon-close"}
			});
			var main="<div style='padding:1% 0;'><span class='checkbox-list' style='margin-right:8%;'>"
				main+="</div>";
				main+="<div style='width:100%'>";
				main+="<table id='select_pl_grid_tbl' class='scroll'></table> <div id='sub_pl_grid_div' class='scroll' style='text-align:left;'></div></br/>";
				main+="</div>";
			$("#popup_select_pl_div").html(main);
			Task.enablePLSearchcount();
			$(".ui-dialog-titlebar-close").css("cursor" ,"pointer").css("padding" ,"0").css("height" ,"18px");
			$("#"+div_id).siblings('.ui-widget-header').css("background","#4CA6FF").css("border" ,"none");
			$(".ui-widget-header .ui-dialog-title").css("color","#ffffff");
			$(".ui-dialog").css("z-index","999999999999").css('box-shadow','1px 1px 5px 0px rgba(0,0,0,0.75)');
			$(".ui-dialog-titlebar").css('padding','1px 10px');
		},
		 
		enablePLSearchcount : function()  
		{  
			$.ajax({
				type: "POST",	 
				url: $host_url+"GetCommittedCount", 
				async:true,					
				data:"task_id="+$g_task_id, 
				error:AjaxErrorMessage,				 
				success: function GetCommittedCountSuccess(responce)
				{
					responce = eval('(' +  responce + ')');	
					$("#sub_pl_grid_div").html(responce.data.html);
				}
			});
		},
		getTaskassigen: function() 
		{
			var dialog_color_arr = new Array("#4CA6FF", "#979752", "#FF2693", "#FF981D", "#26FF26", "#FF0097");  

			var div_id="select_pl_div";	
			var popup_content_div_id="popup_select_pl_div";
			var dialog_state = $("#"+div_id).dialogExtend("state");
			var is_dialog_open = $("#"+div_id).dialog('isOpen');
			 
			$('#'+div_id).dialog("close")
			$('#'+div_id).remove();

			$("#page-content").append("<div id='"+div_id+"' title='' style='padding-left:0;'><div style='height:90%;' id='"+popup_content_div_id+"'></div> </div>");
		
			var dialog_height = screen.height-400;
			IncludeFrameWorkSupportFiles(); 
			$('#'+div_id).dialog({"title" : "Task Assign",
				"width" : "40%",
				"height" : dialog_height, position: [200,50],
				resizable:false,
				draggable:false 
			}).dialogExtend({
				"closable" : true,
				"maximizable" : false,
				"collapsable" : false,
				"minimizable" :false,
				"minimizeLocation" :"left",
				"titlebar" : false,
				"maximize" : function(evt,ui) 
				{$(this).parent().css("top","300px"); },
				icons:{"close":"ui-icon-close"}
			});
			var main="<div style='padding:1% 0;'><span class='checkbox-list' style='margin-right:8%;'>"
				main+="</div>";
				main+="<div style='width:100%'>";
				main+="<table id='select_pl_grid_tbl' class='scroll'></table> <div id='sub_pl_grid_div' class='scroll' style='text-align:left;'></div></br/>";
				main+="</div>";
			$("#popup_select_pl_div").html(main);
			Task.enablePLSearchassign();
			$(".ui-dialog-titlebar-close").css("cursor" ,"pointer").css("padding" ,"0").css("height" ,"18px");
			$("#"+div_id).siblings('.ui-widget-header').css("background","#4CA6FF").css("border" ,"none");
			$(".ui-widget-header .ui-dialog-title").css("color","#ffffff");
			$(".ui-dialog").css("z-index","999999999999").css('box-shadow','1px 1px 5px 0px rgba(0,0,0,0.75)');
			$(".ui-dialog-titlebar").css('padding','1px 10px');
		},
		 
		enablePLSearchassign : function()  
		{  
			$.ajax({
				type: "POST",	 
				url: $host_url+"Getassigned_count", 
				async:true,					
				data:"task_id="+$g_task_id, 
				error:AjaxErrorMessage,				 
				success: function GetCommittedCountSuccess(responce)
				{
					responce = eval('(' +  responce + ')');	
					$("#sub_pl_grid_div").html(responce.data.html);
				}
			});
		},
		getTaskstatus: function() 
		{
			var dialog_color_arr = new Array("#4CA6FF", "#979752", "#FF2693", "#FF981D", "#26FF26", "#FF0097");  

			var div_id="select_pl_div";	
			var popup_content_div_id="popup_select_pl_div";
			var dialog_state = $("#"+div_id).dialogExtend("state");
			var is_dialog_open = $("#"+div_id).dialog('isOpen');
			 
			$('#'+div_id).dialog("close")
			$('#'+div_id).remove();

			$("#page-content").append("<div id='"+div_id+"' title='' style='padding-left:0;'><div style='height:90%;' id='"+popup_content_div_id+"'></div> </div>");
			
			var dialog_height = screen.height-400;
			IncludeFrameWorkSupportFiles(); 
			$('#'+div_id).dialog({"title" : "Task Assign",
				"width" : "40%",
				"height" : dialog_height, position: [200,50],
				resizable:false,
				draggable:false 
			}).dialogExtend({
				"closable" : true,
				"maximizable" : false,
				"collapsable" : false,
				"minimizable" :false,
				"minimizeLocation" :"left",
				"titlebar" : false,
				"maximize" : function(evt,ui) 
				{$(this).parent().css("top","300px"); },
				icons:{"close":"ui-icon-close"}
			});
			var main="<div style='padding:1% 0;'><span class='checkbox-list' style='margin-right:8%;'>"
				main+="</div>";
				main+="<div style='width:100%'>";
				main+="<table id='select_pl_grid_tbl' class='scroll'></table> <div id='sub_pl_grid_div' class='scroll' style='text-align:left;'></div></br/>";
				main+="</div>";
			$("#popup_select_pl_div").html(main);
			Task.enablePLSearchstatus();
			$(".ui-dialog-titlebar-close").css("cursor" ,"pointer").css("padding" ,"0").css("height" ,"18px");
			$("#"+div_id).siblings('.ui-widget-header').css("background","#4CA6FF").css("border" ,"none");
			$(".ui-widget-header .ui-dialog-title").css("color","#ffffff");
			$(".ui-dialog").css("z-index","999999999999").css('box-shadow','1px 1px 5px 0px rgba(0,0,0,0.75)');
			$(".ui-dialog-titlebar").css('padding','1px 10px');
		},
		 
		enablePLSearchstatus: function()  
		{  
			$.ajax({
				type: "POST",	 
				url: $host_url+"Getstatus_count", 
				async:true,					
				data:"task_id="+$g_task_id, 
				error:AjaxErrorMessage,				 
				success: function GetCommittedCountSuccess(responce)
				{
					responce = eval('(' +  responce + ')');	
					
					$("#sub_pl_grid_div").html(responce.data.html);
					
				}
			});
		},
		getTaskstart: function() 
		{
			var dialog_color_arr = new Array("#4CA6FF", "#979752", "#FF2693", "#FF981D", "#26FF26", "#FF0097");  

			var div_id="select_pl_div";	
			var popup_content_div_id="popup_select_pl_div";
			var dialog_state = $("#"+div_id).dialogExtend("state");
			var is_dialog_open = $("#"+div_id).dialog('isOpen');
			 
			$('#'+div_id).dialog("close")
			$('#'+div_id).remove();

			$("#page-content").append("<div id='"+div_id+"' title='' style='padding-left:0;'><div style='height:90%;' id='"+popup_content_div_id+"'></div> </div>");
		
			var dialog_height = screen.height-400;
			IncludeFrameWorkSupportFiles(); 
			$('#'+div_id).dialog({"title" : "Task Assign",
				"width" : "40%",
				"height" : dialog_height, position: [200,50],
				resizable:false,
				draggable:false 
			}).dialogExtend({
				"closable" : true,
				"maximizable" : false,
				"collapsable" : false,
				"minimizable" :false,
				"minimizeLocation" :"left",
				"titlebar" : false,
				"maximize" : function(evt,ui) 
				{$(this).parent().css("top","300px"); },
				icons:{"close":"ui-icon-close"}
			});
			var main="<div style='padding:1% 0;'><span class='checkbox-list' style='margin-right:8%;'>"
				main+="</div>";
				main+="<div style='width:100%'>";
				main+="<table id='select_pl_grid_tbl' class='scroll'></table> <div id='sub_pl_grid_div' class='scroll' style='text-align:left;'></div></br/>";
				main+="</div>";
			$("#popup_select_pl_div").html(main);
			Task.enablePLSearchstarts();
			$(".ui-dialog-titlebar-close").css("cursor" ,"pointer").css("padding" ,"0").css("height" ,"18px");
			$("#"+div_id).siblings('.ui-widget-header').css("background","#4CA6FF").css("border" ,"none");
			$(".ui-widget-header .ui-dialog-title").css("color","#ffffff");
			$(".ui-dialog").css("z-index","999999999999").css('box-shadow','1px 1px 5px 0px rgba(0,0,0,0.75)');
			$(".ui-dialog-titlebar").css('padding','1px 10px');
		},
		 
		enablePLSearchstarts: function()  
		{  
			$.ajax({
				type: "POST",	 
				url: $host_url+"getTaskstart", 
				async:true,					
				data:"task_id="+$g_task_id, 
				error:AjaxErrorMessage,				 
				success: function GetCommittedCountSuccess(responce)
				{
					responce = eval('(' +  responce + ')');	
					$("#sub_pl_grid_div").html(responce.data.html);
				}
			});
		}

	};		
}();
$g_task_init=0;