<?php
class display_custom_html
{
	public $data_set;
	
	// DEFAULT CONSTRUCTOR TO ASSIGN MEMBER VARIABLES 
 
	function __construct($arr)
    {
		$this->data_set=$arr[data];	
		$this->excel_dwn_flag=$arr[excel_dwn_flag];	
		$this->table_param_arr=$arr[table_param_arr];	
		$this->html_header_name=$arr[html_header_name];	
		$this->key=$arr[key];	
		$this->th_required=$arr[th_required];
		$this->table_class=$arr[table_class];
		$this->header_required=$arr[header_required];
		if(!isset($arr[header_required]))
		$this->header_required=1;
		if(!isset($arr[th_required]))
		$this->th_required=1;
		//if(empty($this->th_required))
		//$this->th_required=1;
		 	
			
 		$this->GetHtml();		
			 
	}
	function GetHtml()
	{
		$first_cols_arr=array("SL No");
		$header_vals= array_keys($this->data_set[0]); 
		$final_header_val=array_merge($first_cols_arr,$header_vals); 
		$col_span_count=count($final_header_val);
		if(empty($this->table_class))
			$class_name="dash_board_tbl";	
		else
			$class_name=$this->table_class;
		
		$this->html="<table width='100%' border='0' cellspacing=0 cellspacing='0' class='{$class_name}' ><thead>";	
		
		if($this->excel_dwn_flag == 1)
		{
			$module_src = $this->table_param_arr['module_src'];
			$module_name = $this->table_param_arr['module_name'];
			$data1 = $this->table_param_arr['data1'];
			$data2 = $this->table_param_arr['data2'];
			$data3 = $this->table_param_arr['data3'];
			$data4 = $this->table_param_arr['data4'];
			$data5 = $this->table_param_arr['data5'];
			$data6 = $this->table_param_arr['data6'];
					 
			$this->html.=" <tr> <a style='cursor:pointer; color:blue;' onclick=\"GetExcelDashboard('{$module_src}','{$module_name}','{$data1}','{$data2}','{$data3}','{$data4}','{$data5}','{$data6}',100);\"> Donwload </a></tr> ";
		}
		
		if($this->header_required==1)
		{
			$this->html.=" <tr><th align='left' colspan='{$col_span_count}'>{$this->html_header_name}</th></tr> ";
		}
			
		$cnt=1;
		$prop_arr=array();
		if($this->th_required==1)
		{
		  
			$this->html.="<tr>";	
			foreach($header_vals as $k=>$v)
			{
				$v_a=explode(":",$v);
				$name=$v_a[0];
				$width=$v_a[1];
				$al=$v_a[2];
				$align="";
				if(strtolower($al)=="l")
				$align="left";
				if(strtolower($al)=="c")
				$align="center";
				if(strtolower($al)=="r")
				$align="right";
				if(empty($align))
				$align="center";
				
				$prop_arr[$name]['align']=$align;
				$prop_arr[$name]['width']=$width;
				$w_style="";
				if(!empty($width))
				{
					$w_style=" width:{$width};";
				}				
				$this->html.="<td align='center' style=' {$w_style}'>{$name}</td>";
			}	
			$this->html.="</tr>";
		}
		$this->html.="</thead><tbody>";
		$sl_no=1;	
		
		foreach($this->data_set as $ck=>$cv)
		{ 
			$int_code=$cv[$this->key];
			if($sl_no%2==0)
			$color="#f9f9f9";
			else
			$color="#FFFFFF";
			$this->html.="<tr>";
			$cnt=1;			
					
			foreach($cv as $ckk=>$cvv)
			{	
				$v_a=explode(":",$ckk);
				$name=$v_a[0];
				$user_align=$prop_arr[$name]['align'];
				$user_width=$prop_arr[$name]['width'];
				
				$t_width="";
				$t_align="";
			   if(!empty($user_align))
				{
					$t_align=" text-align:{$user_align}; ";
				 
				} 
				if(!empty($user_width))
				{
					$t_width=" ; width:{$user_width}px; ";
				 
				} 
										
				if($cnt==1)
					$this->html.="<td style='{$t_align} {$t_width}'>{$cvv}</td>";
				else
			         $this->html.="<td style='{$t_align} {$t_width}'>{$cvv}</td>";
				$cnt++;
			}		
			$this->html.="</tr>";
			$sl_no++;
		}
		$this->html.="</tbody></table>";
		return $this->html; 		
	}	 
}
class display_custom_html_ggrid
{
	public $data_set;
	
	// DEFAULT CONSTRUCTOR TO ASSIGN MEMBER VARIABLES 
	function __construct($arr)
    {
		$this->data_set=$arr[data];	
		$this->html_header_name=$arr[html_header_name];	
		$this->header_required=$arr[header_required];	
		$this->table_class=$arr[table_class];	
		$this->no_of_cols=$arr[no_of_cols];	
		if(!isset($arr[header_required]))
		$this->header_required=1;
		if(!isset($arr[no_of_cols]))
		$this->no_of_cols=3;
		$this->header_table_arr_width=$arr[header_table_arr_width];	
 		$this->GetHtml();		
	}
	function GetHtml()
	{
		if(empty($this->table_class))
			$class_name="dash_board_header_tbl";	
		else
			$class_name=$this->table_class;

		$this->html="<table width='100%' border='0' cellspacing=0 cellspacing='0' class='{$class_name}'>";	
		if($this->header_required==1)
		{
			$col_span=$this->no_of_cols*2;
			$this->html.="<th align='left' colspan='{$col_span}'>{$this->html_header_name}</th>";
		}
		
		$sl_no=1;
		$final_arr=array()	;
	 
		$chunk_arr=(array_chunk($this->data_set, $this->no_of_cols, true));
		 
		foreach($chunk_arr as $ak=>$av)
		{ 	
			$this->html.="<tr>";
			$td_cnt=0;
			foreach($av as $akk=>$avv)
			{
				$this->html.="<td style='font-weight:bold;'>{$akk}</td><td>{$avv}</td>";
				$td_cnt++;
			}
			$dif_tds=$this->no_of_cols-$td_cnt;
			if($dif_tds>0)
			{
				$dif_tds_col_span=$dif_tds*2;
				for($z=0;$z<$dif_tds_col_span;$z++)
				$this->html.="<td>&nbsp;</td>";
			}
			$this->html.="</tr>";
		}	
		
		$this->html.="</table>";
		$this->html.="<br>";
		return $this->html; 		
	}	 
}
?>