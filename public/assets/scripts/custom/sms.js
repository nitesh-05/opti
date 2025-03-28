var Sms = function () {

    var content = $('#sms .inbox-content');
    var loading = $('#sms .inbox-loading');
    var sending = $('#sms .sending');
    var listListing = '';
    var msg_int_code=0;

    var initWysihtml5 = function () {
        $('.inbox-wysihtml5').wysihtml5({
            "stylesheets": ["assets/plugins/bootstrap-wysihtml5/wysiwyg-color.css"]
        });
    }
	
	var initFileupload = function () {

        $('#fileupload').fileupload({
            // Uncomment the following to send cross-domain cookies:
            //xhrFields: {withCredentials: true},
            url: 'mail_attachments/',
            autoUpload: true
        });

        // Upload server status check for browsers with CORS support:
        if ($.support.cors) {
            $.ajax({
                url: 'mail_attachments/',
                type: 'HEAD'
            }).fail(function () {
                $('<span class="alert alert-error"/>')
                    .text('Upload server currently unavailable - ' +
                    new Date())
                    .appendTo('#fileupload');
            });
        }
    } 

	// var GetUserSmsLists = function(el,call_type){
	
		 // $.ajax({
            // type: "GET",
			// url: $host_url+"GetUserSmsLists",
            // data: "message_id="+message_id, 		
            // success: function(responce) 
            // {
				// responce = eval('(' + responce + ')');   
				// if (responce.error_code == 0)
				// {
					
					
					// Sms.AssignMailIdsForSelect('compose_sms_to',[]);
					// Sms.AssignMailIdsForSelect('compose_cc',responce.data['users_lists']);
					// Sms.AssignMailIdsForSelect('compose_bcc',responce.data['users_lists']);
					
					  
					// if(call_type=='Replay' || call_type=='Replay_all'|| call_type=='forward')
					// {
						// Sms.loadReply(el,call_type);
					// }
					// var ar=new Array();$("#s2id_compose_to div").each(function(){ar.push($(this).text())});ar
				// }
			// }
		// });
	// }

   

    var handleCCInput = function () {
        var the = $('#inbox .inbox-compose .mail-to .inbox-cc');
        var input = $('#inbox .inbox-compose .input-cc');
        the.hide();
        input.show();
        $('#inbox .close', input).click(function () {
            input.hide();
            the.show();
			// $("#inbox #compose_cc").select2("val",'');
			// $("#inbox #compose_bcc").select2("val",'');
        });
    }

    var handleBCCInput = function () {

        var the = $('.inbox-compose .mail-to .inbox-bcc');
        var input = $('.inbox-compose .input-bcc');
        the.hide();
        input.show();
        $('.close', input).click(function () {
            input.hide();
            the.show();
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
        init: function () {
		
			Sms.loadInbox($(this),'inbox',1);
			 
        },
		HandlePrevPage:function() {
		
				var start_lmt=$('#inbox.inbox-content .pagination-control #pgnt_frst_lmt').text();
					 
				start_lmt=parseFloat(start_lmt)-10;
				
				var type=$('#inbox_head.inbox-header > h1').text();
					type=type.toLowerCase(); 
					Sms.loadInbox($(this), type,start_lmt)
		},
		HandleNextPage:function() {
		
				var start_lmt=$('#inbox.inbox-content .pagination-control #pgnt_frst_lmt').text();
				
				start_lmt=parseFloat(start_lmt)+10;
				
				var type=$('#inbox_head.inbox-header > h1').text();
					type=type.toLowerCase(); 
					Sms.loadInbox($(this), type,start_lmt);
		},
		AssignMailIdsForSelect:function(system_name,data_arr)
		{
		// console.log(data_arr);
			//$("#inbox #compose_to,#inbox #compose_cc,#inbox #compose_bcc").html(responce.data['users_lists']);
			   $('#'+system_name).select2({
			tags:data_arr 
			});  
		},
		loadCompose : function (el,call_type) {
		
			var url = 'html_modules/sms_compose.html';
			
			loading.show();
			content.html('');
			toggleButton(el);

			// load the form via ajax
			$.ajax({
				type: "GET",
				cache: false,
				url: url,
				dataType: "html",
				success: function(res) 
				{
					toggleButton(el);
					$('#sms .inbox-nav > li.active').removeClass('active');
					$('#inbox_head.inbox-header > h1').text('Compose');

					loading.hide();
					$('#sms .inbox-content').html(res);
					$('#sms .inbox-compose').on('click', '.mail-to .inbox-cc', function () {
					handleCCInput();
					});
		
					if(call_type=='Compose')
					{
						Sms.AssignMailIdsForSelect('compose_sms_to',[]);
						// initFileupload();
						initWysihtml5();
						$('#inbox .inbox-wysihtml5').focus();
						App.fixContentHeight();
						App.initUniform();
					}
					// GetUserSmsLists(el,call_type);
				},
				error: function(xhr, ajaxOptions, thrownError)
				{
					toggleButton(el);
				},
				// async: false
			});
		},
		loadInbox : function (el, name,start_limit) {
			var title = $('#sms .inbox-nav > li.' + name + ' a').attr('data-title');
			listListing = "type="+name;
			listListing += "&start_limit="+start_limit;
		
			$('#sms .inbox-loading').show();
			$('#sms .inbox-content').html('');
			toggleButton(el);
			
		   $.ajax({
				type: "GET",
				// async:false,
				url: $host_url+"GetSmsInboxFileName",
				data: listListing, 			
				success: function(responce) 
				{
					responce = eval('(' + responce + ')');   
					if (responce.error_code == 0)
					{
							toggleButton(el);
							$('#sms .inbox-nav > li.inbox > a').html("Inbox "+responce.data['mgs_cnt_html']);
							$('#sms .inbox-nav > li.active').removeClass('active');
							$('#sms .inbox-nav > li.' + name).addClass('active');
							$('#inbox_head.inbox-header > h1').text(title);

							$('#sms .inbox-loading').hide();
							$('#sms .inbox-content').load(responce.data['message_html']);
							App.fixContentHeight();
							App.initUniform();
					}
				},
				error: function(xhr, ajaxOptions, thrownError)
				{
					toggleButton(el);
				},
				// async: false
			});

			// handle group checkbox:
			jQuery('body').on('change', '.mail-group-checkbox', function () {
				var set = jQuery('.mail-checkbox');
				var checked = jQuery(this).is(":checked");
				jQuery(set).each(function () {
					$(this).attr("checked", checked);
				});
				jQuery.uniform.update(set);
			});
		},
		loadMessage : function (el, message_id, resetMenu) {
		
			var view_from=$.trim($("#sms .inbox-header").text());
			loading.show();
			$('#sms .inbox-content').html('');
			toggleButton(el);
			// var message_id = el.parent('tr').attr("data-messageid");  
			
			$.ajax({
				type: "GET",
				url: $host_url+"ViewSmsMessage",
				data: "message_id="+message_id+"&view_from="+view_from, 		
				success: function(responce) 
				{
					responce = eval('(' + responce + ')');   
					if (responce.error_code == 0)
					{
						toggleButton(el);
						if (resetMenu) {
							$('#sms .inbox-nav > li.active').removeClass('active');
						}
						$('#inbox_head.inbox-header > h1').text('View Message');
						loading.hide();
					
						$('#sms .inbox-nav > li.inbox > a').html("Sms "+responce.data['mgs_cnt_html']);
						msg_int_code=responce.data['msg_int_code'];
						$('#sms .inbox-content').load(responce.data['message_html'],function(){
						App.fixContentHeight();
						App.initUniform();
						App.init();
						});
					}
				},
				error: function(xhr, ajaxOptions, thrownError)
				{
					toggleButton(el);
				},
				async: false
			});
		},
		SendSmsMessageDetails : function() {
		
			var message = $("#inbox #message").val();
			var to_arr=$("#inbox #compose_sms_to").select2("val");
			
			if(empty(to_arr))
			{
				alert("Please Enter To address");
				return false;
			} 
			$('#messages .sending').show();
			$('#messages .inbox-content').html('');
			
			$.ajax({
			type: "POST",
			// async:false,
			url: $host_url+"SendSmsMessageDetails",
			data: "to_arr="+to_arr+"&compose_message="+message, 			
			success: function(responce) 
					{
						responce = eval('(' + responce + ')');   
						if (responce.error_code == 0)
						{
							$('#messages .sending').hide();
							Inbox.loadInbox($(this), 'inbox',1);
							alert("Message Sent Sucessfully");
							
						}
						else
						{
							alert("Sending Message failed");
							return false;
						}	
					}
			 });

		},
	GetEmployeeSmsDetails : function() 
	{
	   var dialog_color_arr = new Array("#4CA6FF", "#979752", "#FF2693", "#FF981D", "#26FF26", "#FF0097");  
		var jt_db=getCookie("jt_db");
	 
		 var div_id="select_rolls_div";	
		 var popup_content_div_id="popup_select_rolls_div";
		 var dialog_state = $("#"+div_id).dialogExtend("state");
		 var is_dialog_open = $("#"+div_id).dialog('isOpen');
		 
				$('#'+div_id).dialog("close")
				$('#'+div_id).remove();

				$("#page-content").append("<div id='"+div_id+"' title='' style='padding-left:0;'><div style='height:90%;' id='"+popup_content_div_id+"'></div> </div>");
				
					var dialog_height = screen.height-300;
						IncludeFrameWorkSupportFiles(); 
					  $('#'+div_id).dialog({"title" : "Employee Details",
					"width" : "900px",
					"height" : dialog_height, position: [150,50],
					resizable:false,
					draggable:false 

					}).dialogExtend({
					"closable" : true,
					"maximizable" : false,
					"collapsable" : false,
					"minimizable" :false,
					"minimizeLocation" :"left",
					// "dblclick" : "collapse",
					"titlebar" : false,
					"maximize" : function(evt,ui) 
					   {$(this).parent().css("top","50px"); },
					icons:{"close":"ui-icon-close"}
					});
					Sms.enablephoneSearch();
					$(".ui-dialog-titlebar-close").css("cursor" ,"pointer").css("padding" ,"0").css("height" ,"18px");
					$("#"+div_id).siblings('.ui-widget-header').css("background","#4CA6FF").css("border" ,"none");
					$(".ui-widget-header .ui-dialog-title").css("color","#ffffff");
					$(".ui-dialog").css("z-index","10000").css('box-shadow','1px 1px 5px 0px rgba(0,0,0,0.75)');
					$(".ui-dialog-titlebar").css('padding','1px 10px');
	},
	enablephoneSearch : function() 
	{
		 
	  var main="<div><span class='btn btn-sm red' onclick=\"Sms.GetEmployeePhoneNoFromGrid('compose_sms_to')\"><i class='fa fa-check'></i><b>To</b></span></div><table id='select_rolls_grid_tbl' class='scroll'></table> <div id='sub_grid_div' class='scroll' style='text-align:center;'></div>";
		$("#popup_select_rolls_div").html(main);
	  
		
			    	  
		    var co_roll_grid = jQuery('#select_rolls_grid_tbl').jqGrid(
				{
				
				url:$host_url+"GetEmployeeSmsDetails",
				datatype: 'json',
				colNames:['Emp Name','Emp Phone No'],
							
				colModel:[
						 
							{name:'name',index:'name' , width:420} ,
							{name:'phone',index:'phone' , width:420} ,
							// {name:'ref_roll_code',index:'ref_roll_code' , width:100,hidden:true},
							// {name:'ref_item_code',index:'ref_item_code' , width:100,hidden:true},
							// {name:'module',index:'module', width:100,hidden:true}
					     ],
				rowNum:100,
				rowList:[5,10,30,50,75,100,200,500,1000],
				imgpath:$img_path,
				pager: jQuery('#sub_grid_div'),
				sortname: 'id',
				height:'330',
				viewrecords: true,
				sortorder: 'desc',
				shrinkToFit: false,forceFit:true,
				width:890,
			
				cellEdit: true,multiselect: true,
				cellsubmit:'clientArray' ,
					
				loadComplete:function() {
					$('.ui-jqgrid-htable').css('border-collapse','separate');
								   },
				ondblClickRow: function(rowid)
					{
						// SlitEntry.insertInputRolls(rowid) ;
					   return;
					},	
	
				}
				).navGrid('#sub_grid_div',{edit:false,add:false,del:false,search:false},{},{},{},{multipleSearch:true});			
               
			   co_roll_grid.filterToolbar();	
			   
			  
	},
	 
	GetEmployeePhoneNoFromGrid : function(system_name) 
	{		
	var checked_ids = $("#select_rolls_grid_tbl").jqGrid('getGridParam', 'selarrrow');
	var roll_arr_obj = new Object();
	var i=0;
	roll_arr_obj=[];
	for(row_id=0;row_id<checked_ids.length;row_id++)
	{
    grid_row_id=checked_ids[row_id]
	  var rowObject =$('#select_rolls_grid_tbl').getRowData(grid_row_id);
	  phone = rowObject['phone'];
	  roll_arr_obj.push(phone)
	}
	$a=(roll_arr_obj);
	 
	 
		$("#inbox #"+system_name).select2("val", roll_arr_obj);
 
         var div_id="select_rolls_div";	
			$('#'+div_id).dialog("close");
			$('#'+div_id).remove();	
			
         		
		
		
	}, 
	GetPartySmsDetails : function() 
	{
	      var dialog_color_arr = new Array("#4CA6FF", "#979752", "#FF2693", "#FF981D", "#26FF26", "#FF0097");  
		var jt_db=getCookie("jt_db");
	 
		 var div_id="select_rolls_div";	
		 var popup_content_div_id="popup_select_rolls_div";
		 var dialog_state = $("#"+div_id).dialogExtend("state");
		 var is_dialog_open = $("#"+div_id).dialog('isOpen');
		 
				$('#'+div_id).dialog("close")
				$('#'+div_id).remove();

				$("#page-content").append("<div id='"+div_id+"' title='' style='padding-left:0;'><div style='height:90%;' id='"+popup_content_div_id+"'></div> </div>");
				
					var dialog_height = screen.height-300;
						IncludeFrameWorkSupportFiles(); 
					  $('#'+div_id).dialog({"title" : "Party Details",
					"width" : "905px",
					"height" : dialog_height, position: [150,50],
					resizable:false,
					draggable:false 

					}).dialogExtend({
					"closable" : true,
					"maximizable" : false,
					"collapsable" : false,
					"minimizable" :false,
					"minimizeLocation" :"left",
					// "dblclick" : "collapse",
					"titlebar" : false,
					"maximize" : function(evt,ui) 
					   {$(this).parent().css("top","50px"); },
					icons:{"close":"ui-icon-close"}
					});
					Sms.enablepartyphoneSearch();
					$(".ui-dialog-titlebar-close").css("cursor" ,"pointer").css("padding" ,"0").css("height" ,"18px");
					$("#"+div_id).siblings('.ui-widget-header').css("background","#4CA6FF").css("border" ,"none");
					$(".ui-widget-header .ui-dialog-title").css("color","#ffffff");
					$(".ui-dialog").css("z-index","10000").css('box-shadow','1px 1px 5px 0px rgba(0,0,0,0.75)');
					$(".ui-dialog-titlebar").css('padding','1px 10px');
	},
	enablepartyphoneSearch : function() 
	{
			 
	  var main="<div><span class='btn btn-sm red' onclick=\"Sms.GetPartyPhoneNoFromGrid('compose_sms_to')\"><i class='fa fa-check'></i><b>To</b></span></div><table id='select_rolls_grid_tbl' class='scroll'></table> <div id='sub_grid_div' class='scroll' style='text-align:center;'></div>";
		$("#popup_select_rolls_div").html(main);
	  
		
			    	  
		    var co_roll_grid = jQuery('#select_rolls_grid_tbl').jqGrid(
				{
				
				url:$host_url+"GetPartySmsDetails",
				datatype: 'json',
				colNames:['Party Name','Party Phone No','Group'],
							
				colModel:[
						 
							{name:'name',index:'name' , width:275} ,
							{name:'phone',index:'phone' , width:275} ,
							{name:'cust_group',index:'cust_group' , width:275} 
							// {name:'ref_roll_code',index:'ref_roll_code' , width:100,hidden:true},
							// {name:'ref_item_code',index:'ref_item_code' , width:100,hidden:true},
							// {name:'module',index:'module', width:100,hidden:true}
					     ],
				rowNum:100,
				rowList:[5,10,30,50,75,100,200,500,1000],
				imgpath:$img_path,
				pager: jQuery('#sub_grid_div'),
				sortname: 'id',
				height:'330',
				viewrecords: true,
				sortorder: 'desc',
				shrinkToFit: false,forceFit:true,
				width:890,
			
				cellEdit: true,multiselect: true,
				cellsubmit:'clientArray' ,
					
				loadComplete:function() {
					$('.ui-jqgrid-htable').css('border-collapse','separate');
								   },
				ondblClickRow: function(rowid)
					{
						// SlitEntry.insertInputRolls(rowid) ;
					   return;
					},	
	
				}
				).navGrid('#sub_grid_div',{edit:false,add:false,del:false,search:false},{},{},{},{multipleSearch:true});			
               
			   co_roll_grid.filterToolbar();
			  
	},
	 
	GetPartyPhoneNoFromGrid : function(system_name) 
	{		
	var checked_ids = $("#select_rolls_grid_tbl").jqGrid('getGridParam', 'selarrrow');
	var roll_arr_obj = new Object();
	var i=0;
	roll_arr_obj=[];
	for(row_id=0;row_id<checked_ids.length;row_id++)
	{
    grid_row_id=checked_ids[row_id]
	  var rowObject =$('#select_rolls_grid_tbl').getRowData(grid_row_id);
	  phone = rowObject['phone'];
	  roll_arr_obj.push(phone)
	}
	$a=(roll_arr_obj);
	 
	 
		$("#inbox #"+system_name).select2("val", roll_arr_obj);
 
         var div_id="select_rolls_div";	
			$('#'+div_id).dialog("close");
			$('#'+div_id).remove();	
	
	},
		
		//Handling Multi delete sms
	    deleteSmsMessages : function (){
	
			var msg_ids = $('#inbox .inbox-small-cells input:checkbox:checked').map(function() {
								return this.id;
								}).get();
								
			var current_page=$('#inbox_head.inbox-header > h1').text();
		
			if(empty(msg_ids))
			{
				alert("Please Select atlest one Row to delete ");
				return flase;
			}
			
			$('#sms .delete').show();
			$('#sms .inbox-content').html('');
			
			var delete_from=$.trim($("#inbox_head.inbox-header").text());
			$.ajax({
				type: "POST",
				url : $host_url+"deleteSmsMessages",
				data: "msg_ids="+msg_ids+"&delete_from="+delete_from,
				success :  function (responce) 
							{
								responce = eval('(' + responce + ')');   
								if (responce.error_code == 0)
								{
									$('#sms .delete').hide();
									if(current_page=='Sms')
										Sms.loadInbox($(this), 'inbox',1);
									else
										Sms.loadInbox($(this), 'sent',1);
									alert(responce.data);
										
								}
							}
			});
		},
		loadReply : function (el,call_type) {
			loading.show();
			content.html('');
			toggleButton(el);

			// load the form via ajax
			$.ajax({
				type: "GET",
				cache: false,
				url: $host_url+"replaySmsMesssage",
				data: "msg_int_code="+msg_int_code,
				success: function(responce) 
				{
					responce = eval('(' + responce + ')');   
					if (responce.error_code == 0)
					{
						toggleButton(el);
						$('#sms .inbox-nav > li.active').removeClass('active');
						loading.hide();
						$('[name="message"]').val($('#reply_email_content_body').html());
						initWysihtml5();
						$('#message').val(responce.data['message']);
						$('.inbox-wysihtml5').focus();
						App.fixContentHeight();
						App.initUniform();
						
						if(call_type=='forward')
						{
							$('#inbox #subject').val("Fw: "+responce.data['subject']);
							$('#inbox_head.inbox-header > h1').text('Forward');
						}
						else
						{	
							$('#inbox #subject').val("Re: "+responce.data['subject']);
							$('#inbox_head.inbox-header > h1').text('Reply');
						}
						
						// var bcc_arr=responce.data['bcc_addr_html'].split(",");
						// var cc_arr=responce.data['cc_addr_html'].split(",");
						var to_arr=responce.data['to_addr_html'].split(",");
						if(call_type=='Replay')
						{
							$("#inbox #compose_sms_to").select2("val", to_arr);
						}

						if(call_type=='Replay_all')
						{
							$("#inbox #compose_sms_to").select2("val", to_arr);
							// $("#inbox #compose_cc").select2("val", cc_arr);
							// $("#inbox #compose_bcc").select2("val", bcc_arr);
							handleCCInput();
						}
						// $("#compose_to").select2("val", ["admin", "shafeeq_old", "anusuya", "suhas", "shruthi", "ganesh"]);
					}
				},
				error: function(xhr, ajaxOptions, thrownError)
				{
					toggleButton(el);
				}
				// async: false
			});
		}
    };
}();
$g_inbox_init=0;

 function ReadAttachment()
	{
	
		var load_id = "#inbox #attachment";
		var input =$(load_id).fileinput()[0];
		
		if (input.files[0])
		{
			var file_name = $(load_id).fileinput()[0].files[0].name;
				
			var file = input.files[0];
			var fr = new FileReader();
			fr.readAsDataURL(file);
			var result;
			fr.onload = function () {
				result = fr.result;
			
				$(load_id).attr("data-file-src",result);
				$(load_id).attr("data-file-name",file_name);
				$(load_id).attr("data-att-state","New");
				$(load_id+"_attch_del").show();
				$(load_id+"_attch_name").attr('href',"");
				$(load_id+"_attch_name").html("");
			};
		}
	}
function RemoveAttachment()
	{
		var load_id = "#inbox #attachment";
		$(load_id).val("");
		$(load_id).attr("data-file-src","");
		$(load_id).attr("data-file-name","");
		$(load_id).attr("data-att-state","Delete");
		$(load_id+"_attch_name").attr('href',"");
		$(load_id+"_attch_name").html("");
		$(load_id+"_attch_del").hide();
		
	}