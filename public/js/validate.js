/**************************************************************************************************
*	FILE NAME…….......: Validate.js
*	MODIFIED_DATE.....: 26/05/2009  
* 	PROGRAMMER........: Beemaraj.V 
* 	DESCRIPTION…......: This Script file is used for maintaining all Validating function.
*	
*	FUNCTION….........: trim()
*	PARAMETERS........: String as ARGUMENTS
* 	DESCRIPTION.......: The function is used to trim the given string.
*
*	FUNCTION….........: validateemail()
*	PARAMETERS........: Email_id as ARGUMENTS
* 	DESCRIPTION.......: The function is used to Validate EmailId.

*	FUNCTION….........: acceptNumbersOnlyForModule()
*	PARAMETERS........: Key Event as ARGUMENTS
* 	DESCRIPTION.......: The function is used to Accept Only Numbers in Textbox.
*
*	FUNCTION….........: validnumber()
*	PARAMETERS........: no as ARGUMENTS
* 	DESCRIPTION.......: The function is used to validnumber for Textbox.
*
*	FUNCTION….........: isNumber()
*	PARAMETERS........: no as ARGUMENTS
* 	DESCRIPTION.......: The function is used to check Enter charecter is Number.
*
*	FUNCTION….........: isLetter()
*	PARAMETERS........: no as ARGUMENTS
* 	DESCRIPTION.......: The function is used to check Enter charecter is Letter.
*
*	FUNCTION….........: validDecimal()
*	PARAMETERS........: no,dec as ARGUMENTS
* 	DESCRIPTION.......: The function is used to validDecimal.
*
***************************************************************************************************/
// Naveen
// position should be < 0 
function tarkaRound(number,position)
{
	var zeors = 1;
	for(var i =1; i<=position; i++)
	{		
		zeors = zeors * 10 ; 
	}
	return Math.round(number*zeors)/zeors;
}


// Trim the given String
function trim($str)
{
return jQuery.trim($str);
}

function validateemail(emailid)
{
var check = /^([^0-9_@](\w+(?:\.\w+)*))@((?:\w+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
var check = '^[a-zA-Z0-9.-_]{1,}@[a-zA-Z0-9.-]{2,}[.]{1}[a-zA-Z]{2,}$'
	if (emailid.match(check))
		return true;
	else
		return false;
}

function acceptNumbersOnlyForModule(evt)
{
	var charCode = (evt.which) ? evt.which : evt.keyCode;
	// console.log(charCode);
	// alert(charCode);
	
	if (charCode > 31 && (charCode != 46 && charCode != 37 && charCode != 39 && (charCode < 48 || charCode > 57)))
        return false;
    
	return true;
}
function acceptNumbersWithNegativeForModule(evt)
{
	var charCode = (evt.which) ? evt.which : evt.keyCode;
	// console.log(charCode);
	// alert(charCode);
	
	if (charCode > 31 && (charCode != 46 && charCode != 37 && charCode != 39 && charCode != 45  && (charCode < 48 || charCode > 57)))
        return false;
    
	return true;
}
function acceptNumbersOnlyWithoutDotForModule(evt)
{
	var charCode = (evt.which) ? evt.which : evt.keyCode;
	// console.log(charCode);
	// alert(charCode);
	
	if (charCode > 31 && (charCode != 37 && charCode != 39 && charCode != 45 && (charCode < 48 || charCode > 57)))
        return false;
    
	return true;
}
function acceptNumbersOnlyForModuleForDec(val,evt,dec)
{
 
       /*   var charCode = (evt.which) ? evt.which : evt.keyCode;
	 if(charCode==45)
	 return true;
         if (charCode > 31 && (charCode < 46 || charCode > 57) && charCode!=47 && charCode!=99 && charCode!=118 && charCode!=120 )
            return false;

         return true; */
		 
	 var charCode = (evt.which) ? evt.which : evt.keyCode;
	 
    
	// alert(charCode);
	
	//charCode != 45 - For Minus Removed on 06-01-2018
	if(charCode==46 || charCode==8|| charCode==9 || charCode==37|| charCode==39)
	{
		return true;
	}
	if (charCode > 31 && (charCode != 46 && charCode != 37 && charCode != 39 && charCode != 45  && (charCode < 48 || charCode > 57)))
        return false;
	 
	 
	if(!empty(val) && val!='undefined')
	{
		/* console.log(val.match(/\./gi).length);
		if(val.match(/\./gi).length>=1)
			return false; */
		var dec_lenth_arr=val.split(".");
		
		if(!empty(dec_lenth_arr[1]))
		{
			var x = dec_lenth_arr[1];
			
			var dec_lenth = parseInt(x.toString().length+1);
				 
		if(!empty(dec_lenth) && parseInt(dec_lenth) > dec)
			{
				return false;
			}
		}
  
	}
	return true;
}
function acceptNumbersWithNegativeForModuleForDec(val,evt,dec)
{
 
       /*   var charCode = (evt.which) ? evt.which : evt.keyCode;
	 if(charCode==45)
	 return true;
         if (charCode > 31 && (charCode < 46 || charCode > 57) && charCode!=47 && charCode!=99 && charCode!=118 && charCode!=120 )
            return false;

         return true; */
		 
	 var charCode = (evt.which) ? evt.which : evt.keyCode;
	 
    
	// alert(charCode);
	
	//charCode != 45 - For Minus Removed on 06-01-2018
	if(charCode==46 || charCode==8|| charCode==9 || charCode==37|| charCode==39|| charCode==45)
	{
		return true;
	}
	if (charCode > 31 && (charCode != 46 && charCode != 37 && charCode != 39 && (charCode < 48 || charCode > 57)))
        return false;
	 
	 
	if(!empty(val) && val!='undefined')
	{
		/* console.log(val.match(/\./gi).length);
		if(val.match(/\./gi).length>=1)
			return false; */
		var dec_lenth_arr=val.split(".");
		
		if(!empty(dec_lenth_arr[1]))
		{
			var x = dec_lenth_arr[1];
			
			var dec_lenth = parseInt(x.toString().length+1);
				 
		if(!empty(dec_lenth) && parseInt(dec_lenth) > dec)
			{
				return false;
			}
		}
  
	}
	return true;
}


function validnumberold(no)
{
var dateRE = /^([0-9]{0,10})([\.]{0,1})([0-9]{0,9})$/;
if (no.match(dateRE))
return true;
else
return false;
}
function validnumber(no)
{
var dateRE = /^([0-9]{0,10})([\.]{0,1})([0-9]{0,9})$/;
if (no.match(dateRE))
return true;
else
return false;
}

function isNumber(no)
{
var dateRE = /^([0-9.])*$/;
return true;
if (no.match(dateRE))
return true;
else
return false;
}

function isLetter(no)
{
var dateRE = /^([A-Za-z])*$/;
if (no.match(dateRE))
return true;
else
return false;
}
function validDecimal(no,$dec)
{
 
 var dateRE=new RegExp("\^([\-]{0,1})([0-9]{0,10})([\.]{0,1})([0-9]{0,"+$dec+"})$");
  
if (no.match(dateRE))
return true;
else
return false;
}
function roundNumber(number,decimal_points) {
	if(!decimal_points) return Math.round(number);
	if(number == 0) {
		var decimals = "";
		for(var i=0;i<decimal_points;i++) decimals += "0";
		return "0."+decimals;
	}

	var exponent = Math.pow(10,decimal_points);
	var num = Math.round((number * exponent)).toString();
	
	return num.slice(0,-1*decimal_points) + "." + num.slice(-1*decimal_points);
 }
