<?php  
  class html_purchase_order
	{
		function __construct($aobj_context)
		{
			session_start();
			$this->aobj_context=$aobj_context;
			$aobj_context->mobj_db->SetFetchMode(ADODB_FETCH_ASSOC);	
			$format_file=$aobj_context->main_src."/src/format.php";
			include_once($format_file);
			require_once($this->aobj_context->main_src."/graph_src/dashboard_table.php");				
			$this->user_id = $_SESSION['user_id'];
			$this->login_ctr = 	$_SESSION['login_cnt'];
			$this->module_id=$aobj_context->mobj_data["module_id"];
			$this->po_int_code=$aobj_context->mobj_data["data1"]; 
			// echo $this->po_int_code;die(); 
		}
   function getHtmlDetails()
	{
		$this->FormQry();
		$this->FormHtmlArr();
		$this->html_obj=new html_generator($this->aobj_context);
		$this->html_obj->final_arr = $this->html_array;		
		return $this->html_obj->PopulateHtmlData();
		
	}
	function FormQry()
	{	
		$get_data="SELECT DATE_FORMAT(po.date,'%d-%m-%Y') AS processing_date,
						cm.name AS customer_name,
						po.po_number,po.internal_code,
						DATE_FORMAT(po.po_date,'%d-%m-%Y') AS po_date,
						s.status,IFNULL(ls.series,'') AS series,
						bc.customer_code AS bill_to,bc.internal_code as btl_int_code,
						po.erp_ref_no,po.erp_push_remarks,ifnull(po.pushed_to_erp,'No') as pushed_to_erp,
						po.bill_to_address,CONCAT(lw.warehouse_code,'-',lw.warehouse_name) AS ship_from_warehouse,
						po.ship_to_address
						FROM purchase_order po
						LEFT JOIN customer_master cm ON cm.internal_code = po.customer
						LEFT JOIN bill_to_customer_master bc ON bc.internal_code = po.bill_to
						LEFT JOIN location_wise_warehouse lw ON lw.internal_code = bc.ship_from_warehouse
						 LEFT JOIN location_wise_sap_series ls ON ls.location_code=bc.delivery_location_code AND ls.status='Active'
						LEFT JOIN status s ON s.internal_code = po.status
					   WHERE po.internal_code={$this->po_int_code}
					   GROUP BY po.internal_code
					   ORDER BY po.internal_code
					   LIMIT 1
					 ";
		  // echo "<pre>"; echo($get_data);die();
	  	$lobj_get_data = $this->aobj_context->mobj_db->GetRow($get_data);
		$status=$lobj_get_data[status];	
		$pushed_to_erp=$lobj_get_data[pushed_to_erp];	
		$internal_code=$lobj_get_data[internal_code];
		$btl_int_code=$lobj_get_data[btl_int_code];
		$url= $this->aobj_context->mobj_data['leap_host_url'];
		$this->header_table_arr['Processing Date']=$lobj_get_data[processing_date];
		$this->header_table_arr['Customer Name']=$lobj_get_data[customer_name];
		$this->header_table_arr['PO Number']="<a onclick=\"getModulesDetailsNew('purchase_order','Purchase~Order',172,'Edit','Purchase Order',{$lobj_get_data[internal_code]},'FW');$('.modal').modal('hide');\">{$lobj_get_data[po_number]}</a>
											  <a href='app.php?a=DownloadErrorPOsFromPendingPO&po_int_code={$internal_code}'\"><img src='img/download_format_icon.png' height='20' /></a>";
		$this->header_table_arr['PO Date']=$lobj_get_data[po_date];
		$this->header_table_arr['Status']=$lobj_get_data[status];
		if($btl_int_code > 0)
		{
		$this->header_table_arr['Bill To']="<a onclick=\"GetDashboardPopups('bill_to_customer_master_'+{$lobj_get_data[btl_int_code]},'Bill To Customer Master',{$lobj_get_data[btl_int_code]});\">{$lobj_get_data[bill_to]}&nbsp<i style='color: #fe913b; font-size: 12px;' class='fa fa-hand-o-right' aria-hidden='true'></i></a>";
		}
		$this->header_table_arr['Ship From Warehouse']=$lobj_get_data[ship_from_warehouse];
		$this->header_table_arr['Bill To Address']=$lobj_get_data[bill_to_address];
		$this->header_table_arr['ERP Ref No']="<span style='color:#d934eb;'><b>".$lobj_get_data[erp_ref_no]."</b></span>";
		$this->header_table_arr['ERP Push Remarks']=$lobj_get_data[erp_push_remarks];
		$this->header_table_arr['Pushed To ERP']=$lobj_get_data[pushed_to_erp];
		$this->header_table_arr['Location Series']=$lobj_get_data[series];
		$this->header_table_arr['U_LEAPSONO']=$lobj_get_data['internal_code'];
				
		if(($status=='SAP Error'||$status=='Order' )&& $pushed_to_erp=='No')
		{
			$this->header_table_arr['Re Push To SAP']="<a onclick=\"PushSalesOrdertoSAP({$internal_code})\"><i style='color: red; font-size: 21px;' class='fa fa-upload' aria-hidden='true'></i></a>";
		}
		$this->tables_arr=array();
	    $get_item_data="SELECT
							poi.po_item_sku_code,
							CONCAT(am.stock_code,'-',am.stock_description) AS item,
							poi.qty,am.internal_code AS artical_int_code,
							poi.erp_qty,
							poi.ignore_for_xlite,
							poi.erp_tax_code,
							poi.erp_price,
							poi.rate,
							poi.value,
							poi.po_item_mrp,
							poi.po_tax_rate,
							am.pack_qty,
							poi.po_original_qty,
							poi.po_item_hsn_code
							FROM purchase_order po
							INNER JOIN purchase_order_item_group poi ON poi.ref_s_ref_data_code = po.internal_code
							LEFT JOIN article_master am ON am.internal_code = poi.item
						where poi.ref_s_ref_data_code={$this->po_int_code}
						GROUP BY po.internal_code,poi.internal_code
						ORDER BY poi.internal_code
						";
						// echo  $get_item_data;die();
		$lobj_get_item_data = $this->aobj_context->mobj_db->GetAll($get_item_data);
	    $this->item_arr=array();
		$this->total_po_value=0;
		$this->total_pack_qty=0;
		$this->total_qty=0;
		$this->total_erp_qty=0;
		$cnt=0;
		$sl_no=1;
		foreach($lobj_get_item_data as $k=>$v)
		{
			
			$this->item_arr[$cnt]['Sl No::c']=$sl_no++;
			$this->item_arr[$cnt]['PO Item SKU Code::l']=$v['po_item_sku_code'];
			$this->item_arr[$cnt]['Item::l']="<a onclick=\"GetDashboardPopups('article_master_'+{$v['artical_int_code']},'Artical Master',{$v['artical_int_code']});\">{$v['item']}</a>";
			$this->ignore=$v['ignore_for_xlite'];
			if($this->ignore=='Yes')
			{
			$this->item_arr[$cnt]['Ignore::l']="<font color='red'>".$this->ignore."</font>";
			}
			else
			{
				$this->item_arr[$cnt]['Ignore::l']=$this->ignore;
			}
			$this->item_arr[$cnt]['Pack Qty::r']=$v['pack_qty'];
			$this->item_arr[$cnt]['PO Qty::r']=$v['qty'];
			$this->item_arr[$cnt]['ERP Qty::r']=$v['erp_qty'];
			$this->item_arr[$cnt]['PO Price::r']=$v['rate'];
			$this->item_arr[$cnt]['ERP Price::r']=$v['erp_price'];
			$this->item_arr[$cnt]['PO Item Value::r']=$v['value'];
			$this->item_arr[$cnt]['PO Item MRP::r']=$v['po_item_mrp'];
			$this->item_arr[$cnt]['PO Tax Rate::r']=$v['po_tax_rate'];
			$this->item_arr[$cnt]['ERP Tax Code::l']=$v['erp_tax_code'];
			
			if($this->ignore=='No')
			{
				$this->total_po_value += $v['value'];
			}
			
			$this->total_pack_qty += $v['pack_qty'];
			$this->total_qty += $v['qty'];
			$this->total_erp_qty += $v['erp_qty'];
			$cnt++;
		} 		
			$this->item_arr[$cnt]['Sl No::c']='<b>Totals</b>';
			$this->item_arr[$cnt]['PO Item SKU Code::l']='';
			$this->item_arr[$cnt]['Item::l']='';
			$this->item_arr[$cnt]['Ignore::l']='';
			$this->item_arr[$cnt]['Pack Qty::r']="<span style='color:red;'><b>".picture($this->total_pack_qty,INR_NAME_PICFORMAT)."</b></span>";
			$this->item_arr[$cnt]['PO Qty::r']="<span style='color:red;'><b>".picture($this->total_qty,INR_NAME_PICFORMAT)."</b></span>";
			$this->item_arr[$cnt]['ERP Qty::r']="<span style='color:red;'><b>".picture($this->total_erp_qty,INR_NAME_PICFORMAT)."</b></span>";
			$this->item_arr[$cnt]['PO Price::r']='';
			$this->item_arr[$cnt]['ERP Price::r']='';
			$this->item_arr[$cnt]['PO Item Value::r']="<span style='color:red;'><b>".picture($this->total_po_value,INR_NAME_PICFORMAT)."</b></span>";;
			$this->item_arr[$cnt]['PO Item MRP::r']='';
			$this->item_arr[$cnt]['PO Tax Rate::r']='';
			$this->item_arr[$cnt]['ERP Tax Code::l']='';
			$cnt++;
			
			$this->tables_arr[0][arr]='';
			$this->tables_arr[0][html_header_name]="";	
			$this->tables_arr[0][header_required]=0;	
			$this->tables_arr[0][th_required]=0;	
			$this->tables_arr[0][width]='70.5%';	 
			$this->tables_arr[0][table_class]="dash_board_tbl_th4";
			
			$this->tables_arr[1][arr]=$tax_arr;
			$this->tables_arr[1][html_header_name]="Item Details";	
			$this->tables_arr[1][header_required]=1;	
			$this->tables_arr[1][th_required]=0;	
			$this->tables_arr[1][width]='27.8%';	 
			$this->tables_arr[1][table_class]="dash_board_tbl_th4";
			
	}
	
	function FormHtmlArr()
	{
		$this->html_array[0]['type'] = 'header';
		$this->html_array[0]['no_of_cols'] = 2;
		$this->html_array[0]['data'] = $this->header_table_arr;
		$this->html_array[0]['th_name'] = 'General';
		$this->html_array[0]['th_required'] = 1;
		$this->html_array[0]['table_class'] = "dash_board_header_tbl_th4";
		
		$this->html_array[1]['type'] = 'grid';
		$this->html_array[1]['data'] = $this->item_arr;
	    $this->html_array[1]['tabel_header_name'] = "Item Details";
	    $this->html_array[1]['header_required'] = "1";
	    $this->html_array[1]['th_required'] = "1";
	    $this->html_array[1]['table_class'] = "dash_board_tbl_th2";
	}	
 }
   
?>
