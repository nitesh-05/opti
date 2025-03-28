<?php
class excel_generator
{
	public $aobj_context;
	public $header_html;
	public $header_arr1;
	public $header_arr2;
	public $header_html_footer;
	public $details_display_name;
	public $details_arr;
	public $group_name;
	public $update_div_required;
	public $update_button_name;

	function __construct($aobj_context)
	{
		$this->aobj_context=$aobj_context;
		require_once($aobj_context->main_src.'/src/format.php');
		require_once($aobj_context->main_src.'/src/getnumword.php');
		require_once($aobj_context->main_src.'/src/getnumtoword.php');	
		$this->path=$aobj_context->main_src."/img/rpt_logo.gif";
		$this->user_id = $_SESSION['user_id']; 
		$this->pic_format = "XXX,XXX,XXX,XXX.XX";
		$this->login_ctr = $_SESSION['login_cnt'];
		$this->final_arr=array();
		$this->header_arr=array();
	}
	
	function PopulateExcelData()
	{
       	  	   	
		$this->createExcelObj();
		$this->formExcelData();
		$this->WriteOutput();
			
	}
	
	function createExcelObj()
	{
		$excel_writer=$this->aobj_context->main_src."/Excel_Writer/Writer.php";			
		include_once($excel_writer);
		$tarka_format_file=$this->aobj_context->main_src."/custom_src/TarkaFormatStyles.php";
		include_once($tarka_format_file);
		$this->workbook = new Spreadsheet_Excel_Writer();
		$this->objfrmt =& new FormatStyle();
	}
	
	function formExcelData()
	{
		    $this->worksheet =& $this->workbook->addWorksheet($this->report_type);
			$this->Title_Right =& $this->workbook->addFormat($this->objfrmt->Title_Right);					
			$this->Title_Left =& $this->workbook->addFormat($this->objfrmt->Title_Left);					
			$this->Title_Left_valign =& $this->workbook->addFormat($this->objfrmt->Title_Left_valign);					
			$this->Title_Center_size =& $this->workbook->addFormat($this->objfrmt->Title_Center_size);					
			$this->Title_Center =& $this->workbook->addFormat($this->objfrmt->Title_Center);					
		 	$this->Title_Center_B3 =& $this->workbook->addFormat($this->objfrmt->Title_Center_B3);
		 	$this->Data_Right_B1 =& $this->workbook->addFormat($this->objfrmt->Data_Right_B1);
		 	$this->Title_Right_B4 =& $this->workbook->addFormat($this->objfrmt->Title_Right_B4);
		 	$this->Title_Right_B5 =& $this->workbook->addFormat($this->objfrmt->Title_Right_B5);
			$this->Data_Left_B1 =& $this->workbook->addFormat($this->objfrmt->Data_Left_B1);
			$this->Data_Left_BF =& $this->workbook->addFormat($this->objfrmt->Data_Left_BF);
			$this->Data_Left_B_B =& $this->workbook->addFormat($this->objfrmt->Data_Left_B_B);
			$this->Data_Left =& $this->workbook->addFormat($this->objfrmt->Data_Left);
			$this->Data_Center_LRT_B =& $this->workbook->addFormat($this->objfrmt->Data_Center_LRT_B);
			$this->Data_Center_LRB_B =& $this->workbook->addFormat($this->objfrmt->Data_Center_LRB_B);
			$this->Data_Left->setTextWrap();
			$this->Title_Left->setTextWrap();
			$this->Title_Left_valign->setTextWrap();
			$this->Title_Center_B3->setTextWrap();
			$this->Data_Left_B1->setTextWrap();
			
			$this->worksheet->hideScreenGridlines();			
			$this->worksheet->repeatRows(0,6);			
			$this->worksheet->setPrintScale(100);
			$this->worksheet->setLandscape(); 
			$this->worksheet->setMarginLeft(0.70);				
			$this->worksheet->setMarginRight(0.30);			
			$this->row=0;
							
			$this->tabel_name = $this->final_arr[1]['tabel_name'];
			$select_data = $this->final_arr[1]['tabel_header_name'];
			$col_cnt = count($this->final_arr[1]['data'][0])-1;
			
			$this->worksheet->write($this->row,0,$this->tabel_name,$this->Title_Center_size);
			$this->worksheet->mergeCells($this->row,0,$this->row,$col_cnt);	
			$this->row++;
			$this->worksheet->write($this->row,0,$select_data,$this->Title_Center_size);
			$this->worksheet->mergeCells($this->row,0,$this->row,$col_cnt);
			$this->row++;
			$this->row++;
			
		/* 	echo "<pre>";
			print_r($this->final_arr[1]['data']);
			die(); */
								
			$i = 0;
			$this->col_arr = array();
			foreach($this->final_arr[1]['data'][0] as $hk => $hv)
			{
			
				    $v_a=explode(":",$hk);
					$name=$v_a[0];
					$width=$v_a[1];
					$al=$v_a[2];
					
					$align="";
					if(strtolower($al)=="l")
					{
						 $align=$this->Data_Left_B1;
						 $tot_align=$this->Title_Left;
					}
					
					if(strtolower($al)=="r")
					{
						 $align=$this->Data_Right_B1;
						 $tot_align=$this->Title_Right;
					}
				
				   if(empty($width))
					   $width = 15;
					
				   $this->worksheet->setColumn($i,$i,$width);
				   
				   $this->col_arr[$hk]['name'] = $name;
				   $this->col_arr[$hk]['align'] = $align;
				   $this->col_arr[$hk]['tot_align'] = $tot_align;
				   $this->col_arr[$hk]['width'] = $width;
				   $this->col_arr[$hk]['col'] = $i;
				   
				   $this->worksheet->write($this->row,$i,$name,$this->Title_Center_B3);
				   $i++;
			}
			
			$this->row++;
					              
			foreach($this->final_arr[1]['data'] as $ck=>$cv)
			  {
					foreach($cv as $dk => $dv)
					{
					  $col_no = $this->col_arr[$dk]['col'];
                      $col_align = $this->col_arr[$dk]['align'];						  
					  
					  if($dv == 'Total')
					  {
						  $col_fnd = 1;
					  }
					  
					  if($col_fnd == 1)
					    $col_align = $this->col_arr[$dk]['tot_align'];						  
					 		  
                       $this->worksheet->write($this->row,$col_no,$dv,$col_align);
					}
					
					$this->row++;
					
			   }
			
	}
	
	function WriteOutput()
	{
		$this->workbook->close();  
	    $this->workbook->send("{$this->tabel_name}.xls");
	}
	
}
?>