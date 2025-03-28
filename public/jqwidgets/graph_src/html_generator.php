<?php
class html_generator
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
		$format_file=$aobj_context->main_src."/src/format.php";
		include_once($format_file);
		$this->user_id = $_SESSION['user_id']; 
		$this->final_arr=array();
		$this->header_arr=array();
		require_once($this->aobj_context->main_src."/graph_src/dashboard_table.php");
	 
	}
	
	function PopulateHtmlData()
	{
		$this->final_html="";
		// echo "<pre>";
		// print_r($this->final_arr);
		
		foreach($this->final_arr as $ak=>$av)
		{
			$type=$av['type'];
			$this->data_arr=$av;
			if($type=="header")
			{
				$this->FormheaderDataWithTables();
			}
			else if($type=="grid")
			{
				$this->FormDetailData();
			}
			else if($type=="multi_div")
			{
				$this->FormMultiDivData();
			}
		} 

		$this->SendDataback();     
	}
	
	 
	function FormheaderDataWithTables()
	{ 
		if(!empty($this->data_arr))
		{
			$this->final_html.="<style>
				@media (max-width:768px)
				{
					#multi_div_table{
						width:100% !important;
					}
				}
			</style>
			<div style='clear:both;'><div id='ggrid_header_table_div' style='border:0px;' class='table-responsive'>";
		 
			$arr[data]=$this->data_arr['data'];
			$arr[excel_dwn_flag]=$this->data_arr['excel_dwn_flag'];
			$arr[table_param_arr]=$this->data_arr['table_param_arr'];
			$arr[header_table_arr_width]=$this->data_arr['width'];
			$arr[header_required]=$this->data_arr['th_required'];
			$arr[html_header_name]=$this->data_arr['th_name'];
			$arr[no_of_cols]=$this->data_arr['no_of_cols'];
			$arr[table_class]=$this->data_arr['table_class'];
		 
			$obj=new display_custom_html_ggrid($arr);
			 
			$this->final_html.=$obj->html."</div>";	
		}
	}
	function FormMultiDivData()
	{
		 $this->above_update_html="";
		 if(!empty($this->data_arr['data']))
		 {
		  $this->above_update_html="<div style='clear:both;'></div>";
			foreach($this->data_arr['data'] as $ak=>$av)
			{
					 
					$width=$av[width];
					$width_style=" width:{$width}; ";
					if(empty($width)) 
					    $width_style="";
					$arr[data]=$av[arr];
					$arr[header_required]=$av[header_required];
					$arr[th_required]=$av[th_required];
					$arr[table_class]=$av['table_class'];
					$arr[html_header_name]=$av[html_header_name];	
                    $arr[excel_dwn_flag]=$av['excel_dwn_flag'];
			        $arr[table_param_arr]=$av['table_param_arr'];					
					$obj=new display_custom_html($arr);
					 			
					$this->above_update_html.="<div style='float:left;{$width_style} overflow:auto;border:0px;' id='multi_div_table' class='table-responsive'>
										{$obj->html}	
										</div>";
										
										
			}
		 }
		 	$this->final_html.=$this->above_update_html;
		 
			 
	}
	function FormDetailData()
	{	
       
		if(!empty($this->data_arr['data']))
		{		   
			$label_div_name=$this->data_arr['label_div_name'];
			if(!empty($label_div_name))
			$this->final_html.="<div style='clear:both;'></div><div class='ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix table_head'><div style='float:left;'><span>{$label_div_name}</span></div><div id='ggrid_html_hide_show' class='ggrid_hide_show' onclick=\"HideAndShowGGridPopup('gandhi_grid_table_html_div','ggrid_html_hide_show')\">-</div></div>";			
		}
	 
			$arr[data]=$this->data_arr['data'];
			$arr[header_required]=$this->data_arr['header_required'];;
			$arr[html_header_name]=$this->data_arr['tabel_header_name'];
			$arr[th_required]=$this->data_arr['th_required'];
			$arr[table_class]=$this->data_arr['table_class'];
			$arr[excel_dwn_flag]=$this->data_arr['excel_dwn_flag'];
			$arr[table_param_arr]=$this->data_arr['table_param_arr'];		 
			$obj=new display_custom_html($arr);
			
			
			$this->final_html.="<div class='table-responsive' style='border:0px;'>{$obj->html}</div>";
			
    
	}
 
	function SendDataback()
	{
	    // $this->final_html.="<div style='clear:both;'></div><div class='home_link' id='home_link' onclick='GoToHomePage()'>Home</div>";
		$this->arr["html"]=$this->final_html;
		echo $this->aobj_context->mobj_output->ToJSONEnvelope($this->arr,0,"success");		
	}
}

 
 

?>