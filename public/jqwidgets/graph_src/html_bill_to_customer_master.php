<?php  
  class html_bill_to_customer_master
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
				$this->btl_no=$aobj_context->mobj_data["data1"]; 
		    }
		//End : Constructor 
	  
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
		
	$get_data="SELECT cm.name AS customer_reference,
					bc.customer_code,bc.internal_code,
					bc.customer_name,
					bc.btl_po_code,
					bc.delivery_location_code,
					bc.delivery_location_name,
					bc.address_1 AS bill_to_address,
					CONCAT(s.code,'-',s.name) AS bill_to_state,
					bc.ship_to_address,
					bc.ship_to_city,
					CONCAT(lw.warehouse_code,'-',lw.warehouse_name) AS ship_from_warehouse,
					CONCAT(st.code,'-',st.name) AS ship_to_state
					FROM bill_to_customer_master bc
					LEFT JOIN customer_master cm ON cm.internal_code = bc.customer_reference
					LEFT JOIN state s ON s.internal_code = bc.state
					LEFT JOIN location_wise_warehouse lw ON lw.internal_code = bc.ship_from_warehouse
					LEFT JOIN state st ON st.internal_code = bc.ship_to_state
					WHERE bc.internal_code = {$this->btl_no}
					LIMIT 1
					";
		 // echo "<pre>"; echo($get_data);die();
	  	$lobj_get_data = $this->aobj_context->mobj_db->GetRow($get_data);
		
		$this->header_table_arr['Customer Chain']=$lobj_get_data[customer_reference];
		$this->header_table_arr['Bill To Code']="<a onclick=\"getModulesDetailsNew('bill_to_customer_master','Bill~to~Customer~Master',170,'Edit','Bill to Customer Master',{$lobj_get_data[internal_code]},'FW');$('.modal').modal('hide');\">{$lobj_get_data[customer_code]}&nbsp<i style='color: #fe913b; font-size: 12px;' class='fa fa-hand-o-right' aria-hidden='true'></i></a>";
		$this->header_table_arr['Customer Name']=$lobj_get_data[customer_name];
		$this->header_table_arr['Customer Keyword']=$lobj_get_data[btl_po_code];
		$this->header_table_arr['Del. Loc. Code']=$lobj_get_data[delivery_location_code];
		$this->header_table_arr['Del. Loc. Name']=$lobj_get_data[delivery_location_name];
		$this->header_table_arr['Bill To Address']=$lobj_get_data[bill_to_address];
		$this->header_table_arr['Bill To State']=$lobj_get_data[bill_to_state];
		$this->header_table_arr['Ship To Address']=$lobj_get_data[ship_to_address];
		$this->header_table_arr['Ship To City']=$lobj_get_data[ship_to_city];
		$this->header_table_arr['Ship From Warehouse']=$lobj_get_data[ship_from_warehouse];
		$this->header_table_arr['Ship To State']=$lobj_get_data[ship_to_state];
	}
	function FormHtmlArr()
	{
		$this->html_array[0]['type'] = 'header';
		$this->html_array[0]['no_of_cols'] = 2;
		$this->html_array[0]['data'] = $this->header_table_arr;
		$this->html_array[0]['th_name'] = 'General';
		$this->html_array[0]['th_required'] = 1;
		$this->html_array[0]['table_class'] = "dash_board_header_tbl_th4";
			
	}	
 }
   
?>