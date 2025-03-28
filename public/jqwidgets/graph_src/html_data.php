<?php
class html_data
{
	public $aobj_context;
	function __construct($aobj_context)
    {
		$this->aobj_context=$aobj_context;
		$format_file=$aobj_context->main_src."/src/format.php";
		include_once($format_file);		 
		$this->login_ctr = $_SESSION['login_cnt'];		
		$this->user_id = $_SESSION['user_id'];
		$this->user_type=$_SESSION['user_type'];
		$aobj_context->mobj_db->SetFetchMode(ADODB_FETCH_ASSOC);
		$this->user_type=empty($this->user_type)?"Admin":$this->user_type;
		require_once($this->aobj_context->main_src."/graph_src/html_generator.php");
		require_once($this->aobj_context->main_src."/graph_src/excel_generator.php");
		require_once($this->aobj_context->main_src."/src/getnumtoword.php");
		require_once($this->aobj_context->main_src."/src/getnumword.php");
			
	} 
		
   function GetDataForHtml()
	{
      	
      	$module_name = $this->aobj_context->mobj_data["module_name"];
	  	
		switch($module_name)
		 {
			
			case "Html PO Details":
					require_once($this->aobj_context->main_src."/graph_src/html_grn.php");
					$obj = new html_grn($this->aobj_context);
					return $obj->getHtmlDetails();		
			break; 
			 
			case "Html Grn Details":
					require_once($this->aobj_context->main_src."/graph_src/html_grn_details.php");
					$obj = new html_grn_details($this->aobj_context);
					return $obj->getHtmlDetails();		
			break; 
			case "HTML Sales Turnover Details":
					require_once($this->aobj_context->main_src."/graph_src/html_sales_turnover_details.php");
					$obj = new html_sales_turnover_details($this->aobj_context);
					return $obj->getHtmlDetails();		
			break; 
		    case "HTML Inventory":
					require_once($this->aobj_context->main_src."/graph_src/html_inventory.php");
					$obj = new html_inventory($this->aobj_context);
					return $obj->getHtmlDetails();		
			break;
			case "HTML Stock Ledger":
					require_once($this->aobj_context->main_src."/graph_src/html_stock_ledger.php");
					$obj = new html_stock_ledger($this->aobj_context);
					return $obj->getHtmlDetails();		
			break;
			case "HTML Stock Details":
					require_once($this->aobj_context->main_src."/graph_src/html_store_details.php");
					$obj = new html_store_details($this->aobj_context);
					return $obj->getHtmlDetails();		
			break;
			case "HTML Sales Details":
					require_once($this->aobj_context->main_src."/graph_src/html_sales_details.php");
					$obj = new html_sales_details($this->aobj_context);
					return $obj->getHtmlDetails();		
			break;
			
			case "HTML AR Details":
					require_once($this->aobj_context->main_src."/graph_src/html_ar_details.php");
					$obj = new html_ar_details($this->aobj_context);
					return $obj->getHtmlDetails();		
			break;
			
			case "HTML AP Details":
					require_once($this->aobj_context->main_src."/graph_src/html_ap_details.php");
					$obj = new html_ap_details($this->aobj_context);
					return $obj->getHtmlDetails();		
			break;
			
			
			default:
				echo $this->aobj_context->mobj_output->ToJSONEnvelope($this->arr,-1,"failure");
			break;
		 }		 
	
	}
  function GetDashboardPopups()
	{			
		$dash_rpt_type = $this->aobj_context->mobj_data["dash_rpt_type"];
	
		$module_name = $this->aobj_context->mobj_data["module_name"];
		// echo $module_name;die();
		switch($module_name)
		 {
			           			
			
		// SALES DASHBOARD	
			case "Artical Master":
			require_once($this->aobj_context->main_src."/graph_src/html_article_master.php");
			$obj = new html_article_master($this->aobj_context);
			return $obj->getHtmlDetails();		
			break;
			
			case "Bill To Customer Master":
			require_once($this->aobj_context->main_src."/graph_src/html_bill_to_customer_master.php");
			$obj = new html_bill_to_customer_master($this->aobj_context);
			return $obj->getHtmlDetails();		
			break;
			
			case "Purchase Order":
			require_once($this->aobj_context->main_src."/graph_src/html_purchase_order.php");
			$obj = new html_purchase_order($this->aobj_context);
			return $obj->getHtmlDetails();		
			break;
			
           	case "Transactions_Dashboard":
			require_once($this->aobj_context->main_src."/graph_src/html_transactions_dashboard.php");
			$obj = new html_transactions_dashboard($this->aobj_context);
			return $obj->getHtmlDetails();		
			break; 

           	case "Account_Leadger":
			require_once($this->aobj_context->main_src."/graph_src/html_account_leadger.php");
			$obj = new html_account_leadger($this->aobj_context);
			return $obj->getHtmlDetails();		
			break; 

			case "Transactions_Dashboard_Month":
			require_once($this->aobj_context->main_src."/graph_src/html_transactions_dashboard_month.php");
			$obj = new html_transactions_dashboard_month($this->aobj_context);
			return $obj->getHtmlDetails();		
			break; 	 	
			
			case "Transactions_Dashboard_Details":
			require_once($this->aobj_context->main_src."/graph_src/html_transactions_dashboard_details.php");
			$obj = new html_transactions_dashboard_details($this->aobj_context);
			return $obj->getHtmlDetails();		
			break; 

            case "Delivery Challan":
			require_once($this->aobj_context->main_src."/graph_src/html_delivery_challan.php");
			$obj = new html_delivery_challan($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;			

		    case "Invoice":
			require_once($this->aobj_context->main_src."/graph_src/html_invoice.php");
			$obj = new html_invoice($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;
			
			case "Sales Return":
			require_once($this->aobj_context->main_src."/graph_src/html_sales_return.php");
			$obj = new html_sales_return($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;	 
			
			case "Purchase Return":
			require_once($this->aobj_context->main_src."/graph_src/html_purchase_return.php");
			$obj = new html_purchase_return($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;	 
			
			case "POS Return":
			require_once($this->aobj_context->main_src."/graph_src/html_pos_return.php");
			$obj = new html_pos_return($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;
			
			case "POS":
			require_once($this->aobj_context->main_src."/graph_src/html_pos.php");
			$obj = new html_pos($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;
								
			case "Customer Order":
			require_once($this->aobj_context->main_src."/graph_src/html_customer_order.php");
			$obj = new html_customer_order($this->aobj_context);
			return $obj->getHtmlDetails();		
			break;

			case "Report Leadger":
			require_once($this->aobj_context->main_src."/graph_src/html_report_leadger.php");
			$obj = new html_report_leadger($this->aobj_context);
			return $obj->getHtmlDetails();		
			break;

			case "Cash Book":
			require_once($this->aobj_context->main_src."/graph_src/html_report_cash_book.php");
			$obj = new html_cash_book($this->aobj_context);
			return $obj->getHtmlDetails();		
			break;
			
			case "Payment":
			require_once($this->aobj_context->main_src."/graph_src/html_payment.php");
			$obj = new html_payment($this->aobj_context);
			return $obj->getHtmlDetails();		
			break;
			
			case "Customer Quotation":
			require_once($this->aobj_context->main_src."/graph_src/html_customer_quotation.php");
			$obj = new html_customer_quotation($this->aobj_context);
			return $obj->getHtmlDetails();		
			break;	
			
			case "Purchase Order":
			require_once($this->aobj_context->main_src."/graph_src/html_po.php");
			$obj = new html_po($this->aobj_context);
			return $obj->getHtmlDetails();		
			break;
			
			case "Purchase Request":
			require_once($this->aobj_context->main_src."/graph_src/html_po.php");
			$obj = new html_po($this->aobj_context);
			return $obj->getHtmlDetails();		
			break;

			
			case "GRN":
			require_once($this->aobj_context->main_src."/graph_src/html_grn.php");
			$obj = new html_grn($this->aobj_context);
			return $obj->getHtmlDetails();		
			break;	
			
			case "Bill Passing":
			require_once($this->aobj_context->main_src."/graph_src/html_bill_passing.php");
			$obj = new html_bill_passing($this->aobj_context);
			return $obj->getHtmlDetails();		
			break;	
					
			case "DC":
			require_once($this->aobj_context->main_src."/graph_src/html_dc.php");
			$obj = new html_dc($this->aobj_context);
			return $obj->getHtmlDetails();		
			break;
			
			case "Receipt":
			require_once($this->aobj_context->main_src."/graph_src/html_receipt.php");
			$obj = new html_receipt($this->aobj_context);
			return $obj->getHtmlDetails();		
			break;
			
			case "Stock Adjustment":
			require_once($this->aobj_context->main_src."/graph_src/html_stock_adjustment.php");
			$obj = new html_stock_adjustment($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;
			
			case "Stock Transfer":
			require_once($this->aobj_context->main_src."/graph_src/html_stock_transfer.php");
			$obj = new html_stock_transfer($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;
			
			case "Stock Ledger":
			require_once($this->aobj_context->main_src."/graph_src/html_stock_ledger.php");
			$obj = new html_stock_ledger($this->aobj_context);
			return $obj->getHtmlDetails();		
			break;
			
			case "Pending COs":
			require_once($this->aobj_context->main_src."/graph_src/html_pend_cos.php");
			$obj = new html_pend_cos($this->aobj_context);
			return $obj->getHtmlDetails();		
			break;
			
			case "Pending POs":
			require_once($this->aobj_context->main_src."/graph_src/html_pend_pos.php");
			$obj = new html_pend_pos($this->aobj_context);
			return $obj->getHtmlDetails();		
			break;

			case "Vouchers_Post":
			require_once($this->aobj_context->main_src."/graph_src/html_voucher_post_details.php");
			$obj = new html_voucher_post_details($this->aobj_context);
			return $obj->getHtmlDetails();		
			break;
			
			case "Item Master":
			require_once($this->aobj_context->main_src."/graph_src/html_item_master.php");
			$obj = new html_item_master($this->aobj_context);
			return $obj->getHtmlDetails();		
			break;
			
			case "Party Master":
			require_once($this->aobj_context->main_src."/graph_src/html_party_master.php");
			$obj = new html_party_master($this->aobj_context);
			return $obj->getHtmlDetails();		
			break;
			
			case "Party History":
			require_once($this->aobj_context->main_src."/graph_src/html_party_history.php");
			$obj = new html_party_history($this->aobj_context);
			return $obj->getHtmlDetails();		
			break;
			
			case "Sales":
			require_once($this->aobj_context->main_src."/graph_src/html_sales.php");
			$obj = new html_sales($this->aobj_context);
			return $obj->getHtmlDetails();		
			break;
			
			case "Purchase":
			require_once($this->aobj_context->main_src."/graph_src/html_purchase.php");
			$obj = new html_purchase($this->aobj_context);
			return $obj->getHtmlDetails();		
			break;
			
			case "Create Items Price":
			require_once($this->aobj_context->main_src."/graph_src/html_create_items_price.php");
			$obj = new html_create_items_price($this->aobj_context);
			return $obj->getHtmlDetails();		
			break;
			
			case "Upload Price Master":
			require_once($this->aobj_context->main_src."/graph_src/html_upload_price_master.php");
			$obj = new html_upload_price_master($this->aobj_context);
			return $obj->getHtmlDetails();		
			break;
			
			case "Update Item Master":
			require_once($this->aobj_context->main_src."/graph_src/html_upload_item_master.php");
			$obj = new html_upload_item_master($this->aobj_context);
			return $obj->getHtmlDetails();		
			break;
			
			case "Upload Party Master":
			require_once($this->aobj_context->main_src."/graph_src/html_upload_party_master.php");
			$obj = new html_upload_party_master($this->aobj_context);
			return $obj->getHtmlDetails();		
			break;
			
			case "Update Item Master Bulk":
			require_once($this->aobj_context->main_src."/graph_src/html_update_item_master_bulk.php");
			$obj = new html_update_item_master_bulk($this->aobj_context);
			return $obj->getHtmlDetails();		
			break;
			
			case "Upload Physical Stock":
			require_once($this->aobj_context->main_src."/graph_src/html_upload_physical_stock.php");
			$obj = new html_upload_physical_stock($this->aobj_context);
			return $obj->getHtmlDetails();		
			break;
			
			case "Pending Bills":
			require_once($this->aobj_context->main_src."/graph_src/html_pending_bills.php");
			$obj = new html_pending_bills($this->aobj_context);
			return $obj->getHtmlDetails();		
			break;
			
			case "Payments Receipts":
			require_once($this->aobj_context->main_src."/graph_src/html_payments_receipts.php");
			$obj = new html_payments_receipts($this->aobj_context);
			return $obj->getHtmlDetails();		
			break;
			
			case "Party Ledger":
			require_once($this->aobj_context->main_src."/graph_src/html_party_ledger.php");
			$obj = new html_party_ledger($this->aobj_context);
			return $obj->getHtmlDetails();		
			break;
			
			case "Party Ledger Month Wise":
			require_once($this->aobj_context->main_src."/graph_src/html_party_ledger_month_wise.php");
			$obj = new html_party_ledger_month_wise($this->aobj_context);
			return $obj->getHtmlDetails();		
			break;

			case "Ledger Month Wise":
			require_once($this->aobj_context->main_src."/graph_src/html_ledger_month_wise.php");
			$obj = new html_ledger_month_wise($this->aobj_context);
			return $obj->getHtmlDetails();		
			break;
			
			case "Party Ledger Day Wise":
			require_once($this->aobj_context->main_src."/graph_src/html_party_ledger_day_wise.php");
			$obj = new html_party_ledger_day_wise($this->aobj_context);
			return $obj->getHtmlDetails();		
			break;
			
			case "PartyLedger":
			require_once($this->aobj_context->main_src."/graph_src/html_party_ledger.php");
			$obj = new html_party_ledger($this->aobj_context);
			return $obj->getHtmlDetails();		
			break;

			case "Sales Month Wise":
			require_once($this->aobj_context->main_src."/graph_src/html_sales_month_wise.php");
			$obj = new html_sales_month_wise($this->aobj_context);
			return $obj->getHtmlDetails();		
			break;

			case "AccSalesRegSum":
			require_once($this->aobj_context->main_src."/graph_src/html_acc_sales_reg_sum.php");
			$obj = new html_acc_sales_reg_sum($this->aobj_context);
			return $obj->getHtmlDetails();		
			break;
			
			case "Voucher Register":
			require_once($this->aobj_context->main_src."/graph_src/html_voucher_register.php");
			$obj = new html_voucher_register($this->aobj_context);
			return $obj->getHtmlDetails();		
			break;	

			case "Voucher Register Sum":
			require_once($this->aobj_context->main_src."/graph_src/html_voucher_register_sum.php");
			$obj = new html_voucher_register_sum($this->aobj_context);
			return $obj->getHtmlDetails();		
			break;

			case "Voucher Register Month":
			require_once($this->aobj_context->main_src."/graph_src/html_vch_register_month.php");
			$obj = new html_vch_register_month($this->aobj_context);
			return $obj->getHtmlDetails();		
			break;

			case "Purchase Month Wise":
			require_once($this->aobj_context->main_src."/graph_src/html_purchase_month_wise.php");
			$obj = new html_purchase_month_wise($this->aobj_context);
			return $obj->getHtmlDetails();		
			break;
			
			case "AccPurRegSum":
			require_once($this->aobj_context->main_src."/graph_src/html_acc_pur_reg_sum.php");
			$obj = new html_acc_pur_reg_sum($this->aobj_context);
			return $obj->getHtmlDetails();		
			break;
			
			case "PartyLedgerDBINV":
			require_once($this->aobj_context->main_src."/graph_src/html_party_ledger_daybook_inv.php");
			$obj = new html_party_ledger_daybook_inv($this->aobj_context);
			return $obj->getHtmlDetails();		
			break;
			
			case "CashFlowSummary":
			require_once($this->aobj_context->main_src."/graph_src/html_cash_flow_summary.php");
			$obj = new html_cash_flow_summary($this->aobj_context);
			return $obj->getHtmlDetails();		
			break;		
			
			case "CashFlowDetailed":
			require_once($this->aobj_context->main_src."/graph_src/html_cash_flow_detailed.php");
			$obj = new html_cash_flow_detailed($this->aobj_context);
			return $obj->getHtmlDetails();		
			break;	
			
			case "CashFlowPartySummary":
			require_once($this->aobj_context->main_src."/graph_src/html_cash_flow_party_summary.php");
			$obj = new html_cash_flow_party_summary($this->aobj_context);
			return $obj->getHtmlDetails();		
			break;	
			
			case "DayBookLedger":
			require_once($this->aobj_context->main_src."/graph_src/html_day_book_ledger.php");
			$obj = new html_day_book_ledger($this->aobj_context);
			return $obj->getHtmlDetails();		
			break;
			
			case "DayBookLedgerInv":
			require_once($this->aobj_context->main_src."/graph_src/html_day_book_inv_ledger.php");
			$obj = new html_day_book_inv_ledger($this->aobj_context);
			return $obj->getHtmlDetails();		
			break;
				
			case "Party Ledger INV":
			require_once($this->aobj_context->main_src."/graph_src/html_party_ledger_inv.php");
			$obj = new html_party_ledger_inv($this->aobj_context);
			return $obj->getHtmlDetails();		
			break;
			
			case "Party Balance":
			require_once($this->aobj_context->main_src."/graph_src/html_party_balance.php");
			$obj = new html_party_balance($this->aobj_context);
			return $obj->getHtmlDetails();		
			break;
						
			case "Bank Receipt":
			require_once($this->aobj_context->main_src."/graph_src/html_bank_receipt.php");
			$obj = new html_bank_receipt($this->aobj_context);
			return $obj->getHtmlDetails();		
			break;

			case "bank_receipt":
			require_once($this->aobj_context->main_src."/graph_src/html_bank_receipt.php");
			$obj = new html_bank_receipt($this->aobj_context);
			return $obj->getHtmlDetails();		
			break;
			
			case "Bank Payment":
			require_once($this->aobj_context->main_src."/graph_src/html_bank_payment.php");
			$obj = new html_bank_payment($this->aobj_context);
			return $obj->getHtmlDetails();		
			break;

			case "bank_payment":
			require_once($this->aobj_context->main_src."/graph_src/html_bank_payment.php");
			$obj = new html_bank_payment($this->aobj_context);
			return $obj->getHtmlDetails();		
			break;
			
			case "Cash Receipt":
			require_once($this->aobj_context->main_src."/graph_src/html_cash_receipt.php");
			$obj = new html_cash_receipt($this->aobj_context);
			return $obj->getHtmlDetails();		
			break;

			case "cash_receipt":
			require_once($this->aobj_context->main_src."/graph_src/html_cash_receipt.php");
			$obj = new html_cash_receipt($this->aobj_context);
			return $obj->getHtmlDetails();		
			break;
			
			case "Cash Payment":
			require_once($this->aobj_context->main_src."/graph_src/html_cash_payment.php");
			$obj = new html_cash_payment($this->aobj_context);
			return $obj->getHtmlDetails();		
			break;

			case "cash_payment":
			require_once($this->aobj_context->main_src."/graph_src/html_cash_payment.php");
			$obj = new html_cash_payment($this->aobj_context);
			return $obj->getHtmlDetails();		
			break;
						
			case "Journal":
			require_once($this->aobj_context->main_src."/graph_src/html_journal.php");
			$obj = new html_journal($this->aobj_context);
			return $obj->getHtmlDetails();		
			break;

			case "journal":
			require_once($this->aobj_context->main_src."/graph_src/html_journal.php");
			$obj = new html_journal($this->aobj_context);
			return $obj->getHtmlDetails();		
			break;
			
			case "Contra Voucher":
			require_once($this->aobj_context->main_src."/graph_src/html_contra_voucher.php");
			$obj = new html_contra_voucher($this->aobj_context);
			return $obj->getHtmlDetails();		
			break;

			case "contra_voucher":
			require_once($this->aobj_context->main_src."/graph_src/html_contra_voucher.php");
			$obj = new html_contra_voucher($this->aobj_context);
			return $obj->getHtmlDetails();		
			break;
			
			case "Sales Voucher":
			require_once($this->aobj_context->main_src."/graph_src/html_sales_voucher.php");
			$obj = new html_sales_voucher($this->aobj_context);
			return $obj->getHtmlDetails();		
			break;

			case "sales_voucher":
			require_once($this->aobj_context->main_src."/graph_src/html_sales_voucher.php");
			$obj = new html_sales_voucher($this->aobj_context);
			return $obj->getHtmlDetails();		
			break;
			
			case "Purchase Voucher":
			require_once($this->aobj_context->main_src."/graph_src/html_purchase_voucher.php");
			$obj = new html_purchase_voucher($this->aobj_context);
			return $obj->getHtmlDetails();		
			break;

			case "purchase_voucher":
			require_once($this->aobj_context->main_src."/graph_src/html_purchase_voucher.php");
			$obj = new html_purchase_voucher($this->aobj_context);
			return $obj->getHtmlDetails();		
			break;
			
			case "Debit Note":
			require_once($this->aobj_context->main_src."/graph_src/html_debit_note.php");
			$obj = new html_debit_note($this->aobj_context);
			return $obj->getHtmlDetails();		
			break;

			case "debit_note":
			require_once($this->aobj_context->main_src."/graph_src/html_debit_note.php");
			$obj = new html_debit_note($this->aobj_context);
			return $obj->getHtmlDetails();		
			break;
						
			case "Credit Note":
			require_once($this->aobj_context->main_src."/graph_src/html_credit_note.php");
			$obj = new html_credit_note($this->aobj_context);
			return $obj->getHtmlDetails();		
			break;

			case "credit_note":
			require_once($this->aobj_context->main_src."/graph_src/html_credit_note.php");
			$obj = new html_credit_note($this->aobj_context);
			return $obj->getHtmlDetails();		
			break;	
			
			case "Top Ten Customer":
			require_once($this->aobj_context->main_src."/graph_src/html_top_ten_cust.php");
			$obj = new html_top_ten_cust($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;
			
			case "Sales Customer Wise":
			require_once($this->aobj_context->main_src."/graph_src/html_sales_cust.php");
			$obj = new html_sales_cust($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;
			
			case "Sales Product Wise":
			require_once($this->aobj_context->main_src."/graph_src/html_sales_product.php");
			$obj = new html_sales_product($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;
					
			case "Sales Item Wise":
			require_once($this->aobj_context->main_src."/graph_src/html_sales_items.php");
			$obj = new html_sales_items($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;
			
			case "Sales Inv Wise":
			require_once($this->aobj_context->main_src."/graph_src/html_sales_inv.php");
			$obj = new html_sales_inv($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;
					
			case "Sales Monthly":
			require_once($this->aobj_context->main_src."/graph_src/html_sales_monthly.php");
			$obj = new html_sales_monthly($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;
			
			case "Inventory Sales":
			require_once($this->aobj_context->main_src."/graph_src/html_inventory_sales.php");
			$obj = new html_inventory_sales($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;	
			
			case "Inventory Sales Inv Wise":
			require_once($this->aobj_context->main_src."/graph_src/html_inventory_sales_inv_wise.php");
			$obj = new html_inventory_sales_inv_wise($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;
			
			
			case "Top Ten Supplier":
			require_once($this->aobj_context->main_src."/graph_src/html_top_ten_supp.php");
			$obj = new html_top_ten_supp($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;
			
			case "Purchase Customer Wise":
			require_once($this->aobj_context->main_src."/graph_src/html_purchase_cust.php");
			$obj = new html_purchase_cust($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;
			
			case "Purchase Product Wise":
			require_once($this->aobj_context->main_src."/graph_src/html_purchase_product.php");
			$obj = new html_purchase_product($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;
					
			case "Purchase Item Wise":
			require_once($this->aobj_context->main_src."/graph_src/html_purchase_items.php");
			$obj = new html_purchase_items($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;
			
			case "Purchase Inv Wise":
			require_once($this->aobj_context->main_src."/graph_src/html_purchase_inv.php");
			$obj = new html_purchase_inv($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;
			
			case "Purchase Monthly":
			require_once($this->aobj_context->main_src."/graph_src/html_purchase_monthly.php");
			$obj = new html_purchase_monthly($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;
			
			
		// FABRIC PRODUCTION
		
			case "Fabric Prod Loc Wise":
			require_once($this->aobj_context->main_src."/graph_src/html_fabric_prod_loc.php");
			$obj = new html_fabric_prod_loc($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;
			
			case "Fabric Prod Category Wise":
			require_once($this->aobj_context->main_src."/graph_src/html_fabric_prod_cat.php");
			$obj = new html_fabric_prod_cat($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;
			
			case "Fabric Prod Prod Wise":
			require_once($this->aobj_context->main_src."/graph_src/html_fabric_prod_prod.php");
			$obj = new html_fabric_prod_prod($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;
			
			case "Fabric Prod Items Wise":
			require_once($this->aobj_context->main_src."/graph_src/html_fabric_prod_item.php");
			$obj = new html_fabric_prod_item($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;
			
			case "Fabric Prod Wise":
			require_once($this->aobj_context->main_src."/graph_src/html_fabric_prod.php");
			$obj = new html_fabric_prod($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;
			
		// YARN PRODUCTION 	
			
			case "Yarn Prod Location Wise":
			require_once($this->aobj_context->main_src."/graph_src/html_yarn_prod_loc.php");
			$obj = new html_yarn_prod_loc($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;
			
			case "Yarn Prod Thickness Wise":
			require_once($this->aobj_context->main_src."/graph_src/html_yarn_prod_thick.php");
			$obj = new html_yarn_prod_thick($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;
						
			case "Yarn Prod Color Wise":
			require_once($this->aobj_context->main_src."/graph_src/html_yarn_prod_color.php");
			$obj = new html_yarn_prod_color($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;
			
			case "Yarn Prod Item Wise":
			require_once($this->aobj_context->main_src."/graph_src/html_yarn_prod_item.php");
			$obj = new html_yarn_prod_item($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;
			
			case "Yarn Prod":
			require_once($this->aobj_context->main_src."/graph_src/html_yarn_prod.php");
			$obj = new html_yarn_prod($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;
			
		// WARP PRODUCTION	
			
			case "Warp Prod Thickness Wise":
			require_once($this->aobj_context->main_src."/graph_src/html_warp_prod_thick.php");
			$obj = new html_warp_prod_thick($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;
						
			case "Warp Prod Color Wise":
			require_once($this->aobj_context->main_src."/graph_src/html_warp_prod_color.php");
			$obj = new html_warp_prod_color($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;
			
			case "Warp Prod Item Wise":
			require_once($this->aobj_context->main_src."/graph_src/html_warp_prod_item.php");
			$obj = new html_warp_prod_item($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;
			
			case "Warp Prod":
			require_once($this->aobj_context->main_src."/graph_src/html_warp_prod.php");
			$obj = new html_warp_prod($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;
			
		// STOCK RM , YARN , FABRIC	
			
			case "RM Items Stock":
			require_once($this->aobj_context->main_src."/graph_src/html_rm_items_stock.php");
			$obj = new html_rm_items_stock($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;
			
			case "Yarn Stock Thickness":
			require_once($this->aobj_context->main_src."/graph_src/html_yarn_thick_stock.php");
			$obj = new html_yarn_thick_stock($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;
			
			case "Yarn Stock Color Wise":
			require_once($this->aobj_context->main_src."/graph_src/html_yarn_color_stock.php");
			$obj = new html_yarn_color_stock($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;
			
			case "Yarn Stock Item Wise":
			require_once($this->aobj_context->main_src."/graph_src/html_yarn_item_stock.php");
			$obj = new html_yarn_item_stock($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;
			
			case "Fabric Stock Product Wise":
			require_once($this->aobj_context->main_src."/graph_src/html_fabric_product_stock.php");
			$obj = new html_fabric_product_stock($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;
					
			case "Fabric Stock Item Wise":
			require_once($this->aobj_context->main_src."/graph_src/html_fabric_item_stock.php");
			$obj = new html_fabric_item_stock($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;
			
		// ACCOUNTS

            case "Receipts Bill Wise":
			require_once($this->aobj_context->main_src."/graph_src/html_receipts_bill_wise.php");
			$obj = new html_receipts_bill_wise($this->aobj_context);
			return $obj->getHtmlDetails();					
			break; 	 
			
			case "Payments Bill Wise":
			require_once($this->aobj_context->main_src."/graph_src/html_payments_bill_wise.php");
			$obj = new html_payments_bill_wise($this->aobj_context);
			return $obj->getHtmlDetails();					
			break; 	

            case "Payables Ageing Cust Wise":
			require_once($this->aobj_context->main_src."/graph_src/html_payables_ageing_cust.php");
			$obj = new html_payables_ageing_cust($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;	
			
			case "Payables Ageing Inv Wise":
			require_once($this->aobj_context->main_src."/graph_src/html_payables_ageing_inv.php");
			$obj = new html_payables_ageing_inv($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;	

           	case "Receivables Ageing Cust Wise":
			require_once($this->aobj_context->main_src."/graph_src/html_receivables_ageing_cust.php");
			$obj = new html_receivables_ageing_cust($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;	
			
			case "Receivables Ageing Inv Wise":
			require_once($this->aobj_context->main_src."/graph_src/html_receivables_ageing_inv.php");
			$obj = new html_receivables_ageing_inv($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;	
			
			case "SOST PO":
			require_once($this->aobj_context->main_src."/graph_src/html_sost_po.php");
			$obj = new html_sost_po($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;	
			
			case "SOST GRN":
			require_once($this->aobj_context->main_src."/graph_src/html_sost_grn.php");
			$obj = new html_sost_grn($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;	
			
			case "SOST CUTTING":
			require_once($this->aobj_context->main_src."/graph_src/html_sost_cutting.php");
			$obj = new html_sost_cutting($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;	
			
			case "SOST FITTING":
			require_once($this->aobj_context->main_src."/graph_src/html_sost_fitting.php");
			$obj = new html_sost_fitting($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;	
			
			case "SOST PACKING":
			require_once($this->aobj_context->main_src."/graph_src/html_sost_packing.php");
			$obj = new html_sost_packing($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;	
			
			case "SOST INVOICE":
			require_once($this->aobj_context->main_src."/graph_src/html_sost_invoice.php");
			$obj = new html_sost_invoice($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;	
			
			case "Paybale Party Wise":
			require_once($this->aobj_context->main_src."/graph_src/html_payables_party_wise.php");
			$obj = new html_payables_party_wise($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;	
			
			case "Payables Pending Bills":
			require_once($this->aobj_context->main_src."/graph_src/html_payables_pending_bills.php");
			$obj = new html_payables_pending_bills($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;		
			
			case "Pending Posting Details":
			require_once($this->aobj_context->main_src."/graph_src/html_pending_posting_details.php");
			$obj = new html_pending_posting_details($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;	

			case "Pending Posting Month Details":
			require_once($this->aobj_context->main_src."/graph_src/html_pending_posting_month_details.php");
			$obj = new html_pending_posting_details($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;	
			
			case "Pending Documents SHW":
			require_once($this->aobj_context->main_src."/graph_src/html_pending_document_shw_details.php");
			$obj = new html_pending_document_shw_details($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;	
			
			case "Pending Documents SM":
			require_once($this->aobj_context->main_src."/graph_src/html_pending_document_sm_details.php");
			$obj = new html_pending_document_sm_details($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;	
			
			case "Pending Documents Summary":
			require_once($this->aobj_context->main_src."/graph_src/html_pending_document_summary.php");
			$obj = new html_pending_document_summary($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;	

			case "Pending Documents Month Summary":
			require_once($this->aobj_context->main_src."/graph_src/html_pending_document_month_summary.php");
			$obj = new html_pending_document_month_summary($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;	
			
			case "Pending Documents Month Details":
			require_once($this->aobj_context->main_src."/graph_src/html_pending_document_month_details.php");
			$obj = new html_pending_document_month_details($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;			

			case "Pending Documents Details":
			require_once($this->aobj_context->main_src."/graph_src/html_pending_document_details.php");
			$obj = new html_pending_document_details($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;	
			
			case "Pending Ack SHW":
			require_once($this->aobj_context->main_src."/graph_src/html_pending_ack_shw_details.php");
			$obj = new html_pending_ack_shw_details($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;	
					
			case "Pending Ack Summary":
			require_once($this->aobj_context->main_src."/graph_src/html_pending_ack_summary.php");
			$obj = new html_pending_ack_summary($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;	
			
			case "Pending Ack Details":
			require_once($this->aobj_context->main_src."/graph_src/html_pending_ack_details.php");
			$obj = new html_pending_ack_details($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;	
			
			case "Receivables Sales Man Wise":
			require_once($this->aobj_context->main_src."/graph_src/html_receivables_sales_man_wise.php");
			$obj = new html_receivables_sales_man_wise($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;	
			
			case "Receivables Party Wise":
			require_once($this->aobj_context->main_src."/graph_src/html_receivables_party_wise.php");
			$obj = new html_receivables_party_wise($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;	
			
			case "Receivables Bill Wise":
			require_once($this->aobj_context->main_src."/graph_src/html_receivables_bill_wise.php");
			$obj = new html_receivables_bill_wise($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;	
			
			case "Receivables Inv Sales Man Wise":
			require_once($this->aobj_context->main_src."/graph_src/html_receivables_inv_sales_man_wise.php");
			$obj = new html_receivables_inv_sales_man_wise($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;	
			
			case "Receivables Inv Party Wise":
			require_once($this->aobj_context->main_src."/graph_src/html_receivables_inv_party_wise.php");
			$obj = new html_receivables_inv_party_wise($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;	
			
			case "Receivables Inv Bill Wise":
			require_once($this->aobj_context->main_src."/graph_src/html_receivables_inv_bill_wise.php");
			$obj = new html_receivables_inv_bill_wise($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;	
			
			case "Sales Sales Man Wise":
			require_once($this->aobj_context->main_src."/graph_src/html_sales_sm_details.php");
			$obj = new html_sales_sm_details($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;	
			
			case "Sales Group Wise":
			require_once($this->aobj_context->main_src."/graph_src/html_sales_group_details.php");
			$obj = new html_sales_group_details($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;	
			
			case "Sales Brand Wise":
			require_once($this->aobj_context->main_src."/graph_src/html_sales_brand_details.php");
			$obj = new html_sales_brand_details($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;
			
			case "Sales Details":
			require_once($this->aobj_context->main_src."/graph_src/html_sales_details.php");
			$obj = new html_sales_details($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;
			
			case "SO Sales Man Wise":
			require_once($this->aobj_context->main_src."/graph_src/html_so_sm_details.php");
			$obj = new html_so_sm_details($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;	
			
			case "SO Group Wise":
			require_once($this->aobj_context->main_src."/graph_src/html_so_group_details.php");
			$obj = new html_so_group_details($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;	
			
			case "SO Brand Wise":
			require_once($this->aobj_context->main_src."/graph_src/html_so_brand_details.php");
			$obj = new html_so_brand_details($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;
			
			case "SO Details":
			require_once($this->aobj_context->main_src."/graph_src/html_so_details.php");
			$obj = new html_so_details($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;
			
			case "Purchase Group Wise":
			require_once($this->aobj_context->main_src."/graph_src/html_purchase_group_details.php");
			$obj = new html_purchase_group_details($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;	
			
			case "Purchase Brand Wise":
			require_once($this->aobj_context->main_src."/graph_src/html_purchase_brand_details.php");
			$obj = new html_purchase_brand_details($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;
			
			case "Purchase Details":
			require_once($this->aobj_context->main_src."/graph_src/html_purchase_details.php");
			$obj = new html_purchase_details($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;
			
			case "Incentives Sales Man Wise":
			require_once($this->aobj_context->main_src."/graph_src/html_incentives_sm_details.php");
			$obj = new html_incentives_sm_details($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;	
			
			case "Incentives Slabs Sales Man Wise":
			require_once($this->aobj_context->main_src."/graph_src/html_incentives_slabs_sm_details.php");
			$obj = new html_incentives_slabs_sm_details($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;	
					
					
			case "Incentives Cleared Sales":
			require_once($this->aobj_context->main_src."/graph_src/html_incentives_cleared_sales.php");
			$obj = new html_incentives_cleared_sales($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;	
					
			case "Incentives UnCleared Sales":
			require_once($this->aobj_context->main_src."/graph_src/html_incentives_uncleared_sales.php");
			$obj = new html_incentives_uncleared_sales($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;	
			
			case "Incentives Cleared Slabs Month Wise Sales":
			require_once($this->aobj_context->main_src."/graph_src/html_incentives_cleared_slabs_month_sales.php");
			$obj = new html_incentives_cleared_slabs_month_sales($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;	
			
			case "Incentives UnCleared Slabs Month Wise Sales":
			require_once($this->aobj_context->main_src."/graph_src/html_incentives_uncleared_slabs_month_sales.php");
			$obj = new html_incentives_uncleared_slabs_month_sales($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;	
			
			case "Incentives Cleared Slabs Sales":
			require_once($this->aobj_context->main_src."/graph_src/html_incentives_cleared_slabs_sales.php");
			$obj = new html_incentives_cleared_slabs_sales($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;	
			
			case "Incentives UnCleared Slabs Sales":
			require_once($this->aobj_context->main_src."/graph_src/html_incentives_uncleared_slabs_sales.php");
			$obj = new html_incentives_uncleared_slabs_sales($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;	
			
			case "Incentives Slabs Group Wise":
			require_once($this->aobj_context->main_src."/graph_src/html_incentives_slabs_group_sales.php");
			$obj = new html_incentives_slabs_group_sales($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;	
			
			case "Incentives Slabs Sales Return":
			require_once($this->aobj_context->main_src."/graph_src/html_incentives_slabs_sales_return.php");
			$obj = new html_incentives_slabs_sales_return($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;		
			
			case "Incentives Slabs Discounts":
			require_once($this->aobj_context->main_src."/graph_src/html_incentives_slabs_discount.php");
			$obj = new html_incentives_slabs_discount($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;
			
			case "Incentives Sales Return":
			require_once($this->aobj_context->main_src."/graph_src/html_incentives_sales_return.php");
			$obj = new html_incentives_sales_return($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;		
			
			case "Incentives Discount":
			require_once($this->aobj_context->main_src."/graph_src/html_incentives_discount.php");
			$obj = new html_incentives_discount($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;	
			
			
			case "Incentives Total Sales SM Wise":
			require_once($this->aobj_context->main_src."/graph_src/html_incentives_total_sales_sm_wise.php");
			$obj = new html_incentives_total_sales_sm_wise($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;		
			
			case "Incentives Cleared All Sales Month Wise":
			require_once($this->aobj_context->main_src."/graph_src/html_incentives_cleared_all_sales_month_wise.php");
			$obj = new html_incentives_cleared_all_sales_month_wise($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;	
			
			case "Incentives Cleared All Sales":
			require_once($this->aobj_context->main_src."/graph_src/html_incentives_cleared_all_sales.php");
			$obj = new html_incentives_cleared_all_sales($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;	
	        
			case "Incentives UnCleared All Sales Month Wise":
			require_once($this->aobj_context->main_src."/graph_src/html_incentives_uncleared_all_sales_month_wise.php");
			$obj = new html_incentives_uncleared_all_sales_month_wise($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;	
			
			case "Incentives UnCleared All Sales":
			require_once($this->aobj_context->main_src."/graph_src/html_incentives_uncleared_all_sales.php");
			$obj = new html_incentives_uncleared_all_sales($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;		
			
			case "Incentives All Sales Return":
			require_once($this->aobj_context->main_src."/graph_src/html_incentives_all_sales_return.php");
			$obj = new html_incentives_all_sales_return($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;	
			
			case "Incentives All Discounts":
			require_once($this->aobj_context->main_src."/graph_src/html_incentives_all_discounts.php");
			$obj = new html_incentives_all_discounts($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;	
	
			case "Showroom Gross Profit":
			require_once($this->aobj_context->main_src."/graph_src/html_showroom_gross_profit.php");
			$obj = new html_showroom_gross_profit($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;	
			
			case "Showroom GP Expenses":
			require_once($this->aobj_context->main_src."/graph_src/html_showroom_gp_expenses.php");
			$obj = new html_showroom_gp_expenses($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;	
			
			case "PO Status History":
			require_once($this->aobj_context->main_src."/graph_src/html_po_status_history.php");
			$obj = new html_po_status_history($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;	
			
			case "SO Status History":
			require_once($this->aobj_context->main_src."/graph_src/html_so_status_history.php");
			$obj = new html_so_status_history($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;		
			
			case "Price Update Vendor Details":
			require_once($this->aobj_context->main_src."/graph_src/html_price_update_vendor_wise.php");
			$obj = new html_price_update_vendor_wise($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;	
					
			case "Price Update Details":
			require_once($this->aobj_context->main_src."/graph_src/html_price_update_details.php");
			$obj = new html_price_update_details($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;	
			
			case "Previous SOs":
			require_once($this->aobj_context->main_src."/graph_src/html_previous_so.php");
			$obj = new html_previous_so($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;
			
			case "View Reminders":
			require_once($this->aobj_context->main_src."/graph_src/html_view_reminders.php");
			$obj = new html_view_reminders($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;

			case "Dash Complaints":
			require_once($this->aobj_context->main_src."/graph_src/html_view_complaints.php");
			$obj = new html_view_complaints($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;
			
			case "StockStatusSummary":
			require_once($this->aobj_context->main_src."/graph_src/html_stock_status_details.php");
			$obj = new html_stock_status_details($this->aobj_context);
			return $obj->getHtmlDetails();		
			break;
			
			case "StockStatusNonCurrentSummary":
			require_once($this->aobj_context->main_src."/graph_src/html_stock_status_non_current_details.php");
			$obj = new html_stock_status_non_current_details($this->aobj_context);
			return $obj->getHtmlDetails();		
			break;
			
			
			case "Leave Application":
			require_once($this->aobj_context->main_src."/graph_src/html_leave_application.php");
			$obj = new html_leave_application($this->aobj_context);
			return $obj->getHtmlDetails();		
			break;
			
			case "Short Close GOA":
			require_once($this->aobj_context->main_src."/graph_src/html_short_close_goa.php");
			$obj = new html_short_close_goa($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;

			case "Goods On Approval Returns":
			require_once($this->aobj_context->main_src."/graph_src/html_goods_on_approval_returns.php");
			$obj = new html_good_on_approval_returns($this->aobj_context);
			return $obj->getHtmlDetails();					
			break;
								
			default:
				echo $this->aobj_context->mobj_output->ToJSONEnvelope($this->arr,-1,"failure");
			break;
		 }		 
	
	}
	
	
}
function GetDataForHtml($aobj_context)
{
	$dash_obj=new html_data($aobj_context);
	$dash_obj->GetDataForHtml();
}
function GetDashboardPopups($aobj_context)
{
	$dash_obj=new html_data($aobj_context);
	 
	$dash_obj->GetDashboardPopups();
}


?>
