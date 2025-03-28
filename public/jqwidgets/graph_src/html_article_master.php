<?php  
  class html_article_master
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
				$this->am_no=$aobj_context->mobj_data["data1"]; 
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
		
	$get_data="SELECT CONCAT(cm.code,'-',cm.name) AS customer,
					am.stock_code,am.internal_code,
					am.stock_description,
					ca.category_name,
					am.customer_article_code,
					am.hsn_code,am.pack_qty,
					pm.basic_price,
					pm.mrp,pm.internal_code as price_int_code,
					pm.tax_perc
					FROM article_master am
					LEFT JOIN customer_master cm ON cm.internal_code = am.customer
					LEFT JOIN category ca ON ca.internal_code = am.category
					LEFT JOIN price_master pm ON   am.customer = pm.customer AND am.stock_code = pm.stock_code 
					INNER JOIN customer_master c ON c.internal_code = am.customer
					WHERE am.internal_code = {$this->am_no} 
					ORDER BY cm.code
					LIMIT 1
					";
		  // echo "<pre>"; echo($get_data);die();
	  	$lobj_get_data = $this->aobj_context->mobj_db->GetRow($get_data);
	
		$this->header_table_arr['Customer']=$lobj_get_data[customer];
		$this->header_table_arr['Customer Article Code']=$lobj_get_data[customer_article_code];
		$this->header_table_arr['Stock Code']="<a onclick=\"getModulesDetailsNew('article_master','Article~Master',173,'Edit','Article Master',{$lobj_get_data[internal_code]},'FW');$('.modal').modal('hide');\">{$lobj_get_data[stock_code]}&nbsp&nbsp<i style='color: #fe913b; font-size: 12px;' class='fa fa-hand-o-right' aria-hidden='true'></i></a>";
		$this->header_table_arr['Stock Description']=$lobj_get_data[stock_description];
		$this->header_table_arr['Category Name']=$lobj_get_data[category_name];
		$this->header_table_arr['HSN Code']=$lobj_get_data[hsn_code];
		$this->header_table_arr['Basic Price']="<a onclick=\"getModulesDetailsNew('price_master','Price~Master',174,'Edit','Price Master',{$lobj_get_data[price_int_code]},'FW');$('.modal').modal('hide');\">{$lobj_get_data[basic_price]}&nbsp&nbsp<i style='color: #fe913b; font-size: 12px;' class='fa fa-hand-o-right' aria-hidden='true'></i></a>";
		$this->header_table_arr['MRP']=$lobj_get_data[mrp];
		$this->header_table_arr['Tax %']=$lobj_get_data[tax_perc];
		$this->header_table_arr['Case Size']=$lobj_get_data[pack_qty];
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