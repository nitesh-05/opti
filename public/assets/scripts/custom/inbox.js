var Inbox = function () {

    var content = $('#messages .inbox-content');
    var loading = $('#messages .inbox-loading');
    var sending = $('#messages .sending');
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

	var GetUserLists = function(el,call_type){
	
		 $.ajax({
            type: "GET",
			url: $host_url+"GetUserLists",
            // data: "message_id="+message_id, 		
            success: function(responce) 
            {
				responce = eval('(' + responce + ')');   
				if (responce.error_code == 0)
				{
					
					
					Inbox.AssignMailIdsForSelect('compose_to',responce.data['users_lists']);
					Inbox.AssignMailIdsForSelect('compose_cc',responce.data['users_lists']);
					Inbox.AssignMailIdsForSelect('compose_bcc',responce.data['users_lists']);
					
					  
					if(call_type=='Replay' || call_type=='Replay_all'|| call_type=='forward')
					{
						Inbox.loadReply(el,call_type);
					}
					//var ar=new Array();$("#s2id_compose_to div").each(function(){ar.push($(this).text())});ar
				}
			}
		});
	}

   

    var handleCCInput = function () {
        var the = $('#inbox .inbox-compose .mail-to .inbox-cc');
        var input = $('#inbox .inbox-compose .input-cc');
        the.hide();
        input.show();
        $('#inbox .close', input).click(function () {
            input.hide();
            the.show();
			$("#inbox #compose_cc").select2("val",'');
			$("#inbox #compose_bcc").select2("val",'');
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
		
			Inbox.loadInbox($(this),'inbox',1);
        
			
        },
		HandlePrevPage:function() {
		
				var start_lmt=$('#inbox.inbox-content .pagination-control #pgnt_frst_lmt').text();
					 
				start_lmt=parseFloat(start_lmt)-10;
				
				var type=$('#inbox_head.inbox-header > h1').text();
					type=type.toLowerCase(); 
					Inbox.loadInbox($(this), type,start_lmt)
		},
		HandleNextPage:function() {
		
				var start_lmt=$('#inbox.inbox-content .pagination-control #pgnt_frst_lmt').text();
				
				start_lmt=parseFloat(start_lmt)+10;
				
				var type=$('#inbox_head.inbox-header > h1').text();
					type=type.toLowerCase(); 
					Inbox.loadInbox($(this), type,start_lmt);
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
		
			var url = 'html_modules/inbox_compose.html';
			
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
					$('#messages .inbox-nav > li.active').removeClass('active');
					$('#inbox_head.inbox-header > h1').text('Compose');

					loading.hide();
					$('#messages .inbox-content').html(res);
					$('#messages .inbox-compose').on('click', '.mail-to .inbox-cc', function () {
					handleCCInput();
					});
		
					if(call_type=='Compose')
					{
						// initFileupload();
						initWysihtml5();
						$('#inbox .inbox-wysihtml5').focus();
						App.fixContentHeight();
						App.initUniform();
					}
					GetUserLists(el,call_type);
				},
				error: function(xhr, ajaxOptions, thrownError)
				{
					toggleButton(el);
				},
				// async: false
			});
		},
		loadInbox : function (el, name,start_limit) {
			var title = $('#messages .inbox-nav > li.' + name + ' a').attr('data-title');
			listListing = "type="+name;
			listListing += "&start_limit="+start_limit;
		
			$('#messages .inbox-loading').show();
			$('#messages .inbox-content').html('');
			toggleButton(el);
			
		   $.ajax({
				type: "GET",
				// async:false,
				url: $host_url+"GetInboxFileName",
				data: listListing, 			
				success: function(responce) 
				{
					responce = eval('(' + responce + ')');   
					if (responce.error_code == 0)
					{
							toggleButton(el);
							$('#messages .inbox-nav > li.inbox > a').html("Inbox "+responce.data['mgs_cnt_html']);
							$('#messages .inbox-nav > li.active').removeClass('active');
							$('#messages .inbox-nav > li.' + name).addClass('active');
							$('#inbox_head.inbox-header > h1').text(title);

							$('#messages .inbox-loading').hide();
							$('#messages .inbox-content').load(responce.data['message_html']);
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
		
			var view_from=$.trim($("#messages .inbox-header").text());
			loading.show();
			$('#messages .inbox-content').html('');
			toggleButton(el);
			// var message_id = el.parent('tr').attr("data-messageid");  
			
			$.ajax({
				type: "GET",
				url: $host_url+"ViewMessage",
				data: "message_id="+message_id+"&view_from="+view_from, 		
				success: function(responce) 
				{
					responce = eval('(' + responce + ')');   
					if (responce.error_code == 0)
					{
						toggleButton(el);
						if (resetMenu) {
							$('#messages .inbox-nav > li.active').removeClass('active');
						}
						$('#inbox_head.inbox-header > h1').text('View Message');
						loading.hide();
					
						$('#messages .inbox-nav > li.inbox > a').html("Inbox "+responce.data['mgs_cnt_html']);
						msg_int_code=responce.data['msg_int_code'];
						$('#messages .inbox-content').load(responce.data['message_html'],function(){
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
		SendMessageDetails : function() {
		
			var message = $("#inbox #message").val();
			var subject = $("#inbox #subject").val();
			var to_arr=$("#inbox #compose_to").select2("val");
			var cc_arr=$("#inbox #compose_cc").select2("val");
			var bcc_arr=$("#inbox #compose_bcc").select2("val");
			 
			if(empty(to_arr))
			{
				alert("Please Enter To address");
				return false;
			} 
			
			if(empty(subject))
			{
				alert("Do you Want to send message without subject");
			}
		
		var attachment_file_name = $("#attachment").val();
		
		var attachment = $("#attachment").attr('data-file-src');
			
			var data_obj = new Object();
		 
		data_obj['message']=message;
		data_obj['subject']=subject;
		data_obj['to_arr']=to_arr;
		data_obj['cc_arr']=cc_arr;
		data_obj['bcc_arr']=bcc_arr;
			
		data_obj['attachment_file_name']=attachment_file_name;
		data_obj['attachment']=attachment;
	
			$('#messages .sending').show();
			$('#messages .inbox-content').html('');
			// console.log(data_obj);	
			$.ajax({
			type: "POST",
			// async:false,
			url: $host_url+"SendMessageDetails",
			data: JSON.stringify(data_obj), 			
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
	GetEmployeeDetails : function() 
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
					Inbox.enablemailSearch();
					$(".ui-dialog-titlebar-close").css("cursor" ,"pointer").css("padding" ,"0").css("height" ,"18px");
					$("#"+div_id).siblings('.ui-widget-header').css("background","#4CA6FF").css("border" ,"none");
					$(".ui-widget-header .ui-dialog-title").css("color","#ffffff");
					$(".ui-dialog").css("z-index","10000").css('box-shadow','1px 1px 5px 0px rgba(0,0,0,0.75)');
					$(".ui-dialog-titlebar").css('padding','1px 10px');
	},
	enablemailSearch : function() 
	{
		 
	  var main="<div><span class='btn btn-sm red' onclick=\"Inbox.GetEmployeeEmailIdsFromGrid('compose_to')\"><i class='fa fa-check'></i><b>To</b></span><span class='btn btn-sm green' onclick=\"Inbox.GetEmployeeEmailIdsFromGrid('compose_cc)\"><i class='fa fa-check'></i><b>Cc</b></span><span class='btn btn-sm blue' onclick=\"Inbox.GetEmployeeEmailIdsFromGrid('compose_bcc')\"><i class='fa fa-check'></i><b>Bcc</b></span></div><table id='select_rolls_grid_tbl' class='scroll'></table> <div id='sub_grid_div' class='scroll' style='text-align:center;'></div>";
		$("#popup_select_rolls_div").html(main);
	  
		
			    	  
		    var co_roll_grid = jQuery('#select_rolls_grid_tbl').jqGrid(
				{
				
				url:$host_url+"GetEmployeeDetails",
				datatype: 'json',
				colNames:['Emp Name','Emp Mail ID'],
							
				colModel:[
						 
							{name:'name',index:'name' , width:420} ,
							{name:'email',index:'email' , width:420} ,
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
	 
	GetEmployeeEmailIdsFromGrid : function(system_name) 
	{		
	var checked_ids = $("#select_rolls_grid_tbl").jqGrid('getGridParam', 'selarrrow');
	var roll_arr_obj = new Object();
	var i=0;
	roll_arr_obj=[];
	for(row_id=0;row_id<checked_ids.length;row_id++)
	{
    grid_row_id=checked_ids[row_id]
	  var rowObject =$('#select_rolls_grid_tbl').getRowData(grid_row_id);
	  email = rowObject['email'];
	  roll_arr_obj.push(email)
	}
	$a=(roll_arr_obj);
	 
	 
		$("#inbox #"+system_name).select2("val", roll_arr_obj);
 
         var div_id="select_rolls_div";	
			$('#'+div_id).dialog("close");
			$('#'+div_id).remove();	
			
         		
		
		
	}, 
	GetPartyDetails : function() 
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
					"width" : "930px",
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
					Inbox.enablepartymailSearch();
					$(".ui-dialog-titlebar-close").css("cursor" ,"pointer").css("padding" ,"0").css("height" ,"18px");
					$("#"+div_id).siblings('.ui-widget-header').css("background","#4CA6FF").css("border" ,"none");
					$(".ui-widget-header .ui-dialog-title").css("color","#ffffff");
					$(".ui-dialog").css("z-index","10000").css('box-shadow','1px 1px 5px 0px rgba(0,0,0,0.75)');
					$(".ui-dialog-titlebar").css('padding','1px 10px');
	},
	enablepartymailSearch : function() 
	{
		 
	  var main="<div><span class='btn btn-sm red' onclick=\"Inbox.GetPartyEmailIdsFromGrid('compose_to')\"><i class='fa fa-check'></i><b>To</b></span><span class='btn btn-sm green' onclick=\"Inbox.GetPartyEmailIdsFromGrid('compose_cc')\"><i class='fa fa-check'></i><b>Cc</b></span><span class='btn btn-sm blue' onclick=\"Inbox.GetPartyEmailIdsFromGrid('compose_bcc')\"><i class='fa fa-check'></i><b>Bcc</b></span></div><table id='select_rolls_grid_tbl' class='scroll'></table> <div id='sub_grid_div' class='scroll' style='text-align:center;'></div>";
		$("#popup_select_rolls_div").html(main);
	  
		
			    	  
		    var co_roll_grid = jQuery('#select_rolls_grid_tbl').jqGrid(
				{
				
				url:$host_url+"GetPartyDetails",
				datatype: 'json',
				colNames:['Party Name','Party Mail ID','Group'],
							
				colModel:[
						 
							{name:'name',index:'name' , width:250} ,
							{name:'email',index:'email' , width:360} ,
							{name:'cust_group',index:'cust_group' , width:250} ,
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
				width:910,
			
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
	 
	GetPartyEmailIdsFromGrid : function(system_name) 
	{		
	var checked_ids = $("#select_rolls_grid_tbl").jqGrid('getGridParam', 'selarrrow');
	var roll_arr_obj = new Object();
	var i=0;
	roll_arr_obj=[];
	for(row_id=0;row_id<checked_ids.length;row_id++)
	{
    grid_row_id=checked_ids[row_id]
	  var rowObject =$('#select_rolls_grid_tbl').getRowData(grid_row_id);
	  email = rowObject['email'];
	  roll_arr_obj.push(email)
	}
	$a=(roll_arr_obj);
	 
	 
		$("#inbox #"+system_name).select2("val", roll_arr_obj);
 
         var div_id="select_rolls_div";	
			$('#'+div_id).dialog("close");
			$('#'+div_id).remove();	
			
         		
		
		
	},
		
		//Handling Multi delete messages
	    deleteMessages : function (){
	
			var msg_ids = $('#inbox .inbox-small-cells input:checkbox:checked').map(function() {
								return this.id;
								}).get();
								
			var current_page=$('#inbox_head.inbox-header > h1').text();
		
			if(empty(msg_ids))
			{
				alert("Please Select atlest one Row to delete ");
				return flase;
			}
			
			$('#messages .delete').show();
			$('#messages .inbox-content').html('');
			
			var delete_from=$.trim($("#inbox_head.inbox-header").text());
			$.ajax({
				type: "POST",
				url : $host_url+"deleteMessages",
				data: "msg_ids="+msg_ids+"&delete_from="+delete_from,
				success :  function (responce) 
							{
								responce = eval('(' + responce + ')');   
								if (responce.error_code == 0)
								{
									$('#messages .delete').hide();
									if(current_page=='Inbox')
										Inbox.loadInbox($(this), 'inbox',1);
									else
										Inbox.loadInbox($(this), 'sent',1);
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
				url: $host_url+"replayMesssage",
				data: "msg_int_code="+msg_int_code,
				success: function(responce) 
				{
					responce = eval('(' + responce + ')');   
					if (responce.error_code == 0)
					{
						toggleButton(el);
						$('#messages .inbox-nav > li.active').removeClass('active');
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
						
						var bcc_arr=responce.data['bcc_addr_html'].split(",");
						var cc_arr=responce.data['cc_addr_html'].split(",");
						var to_arr=responce.data['to_addr_html'].split(",");
						if(call_type=='Replay')
						{
							$("#inbox #compose_to").select2("val", to_arr);
						}

						if(call_type=='Replay_all')
						{
							$("#inbox #compose_to").select2("val", to_arr);
							$("#inbox #compose_cc").select2("val", cc_arr);
							$("#inbox #compose_bcc").select2("val", bcc_arr);
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