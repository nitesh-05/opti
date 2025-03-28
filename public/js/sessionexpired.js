//event to check session time variable declaration
var checkSessionTimeEvent;

//time session started
var pageRequestTime;
//session timeout length
var timeoutLength = 1900*1000;

//force redirect to log in page length (session timeout plus 10 seconds)
var forceRedirectLength = timeoutLength + (10*1000);

//set time for first warning, ten seconds before session expires
var warningTime = timeoutLength - (10*1000);

//set number of seconds to count down from for countdown ticker
var countdownTime = 10;

function checkSessionTime()
{
	//get time now
	var timeNow = new Date(); 
	
	//event create countdown ticker variable declaration
	var countdownTickerEvent; 	
	
	//difference between time now and time session started variable declartion
	var timeDifference = 0;
	
	timeDifference = timeNow - pageRequestTime;

    if (timeDifference > warningTime && timeDifference < timeoutLength)
        {            
            //call now for initial dialog box text (time left until session timeout)
            countdownTicker(); 
            
            //set as interval event to countdown seconds to session timeout
            countdownTickerEvent = setInterval("countdownTicker()", 1000);
            
            $('#dialogWarning').dialog('open');
        }
    else if (timeDifference > timeoutLength){
    		//close warning dialog box
            if ($('#dialogWarning').dialog('isOpen')) $('#dialogWarning').dialog('close');
            
            //$("p#dialogText-expired").html(timeDifference);
            $('#dialogExpired').dialog('open');
            
             //clear (stop) countdown ticker
            clearInterval(countdownTickerEvent);
        }
        
    if (timeDifference > forceRedirectLength)
     	{    
        	//clear (stop) checksession event
            clearInterval(checkSessionTimeEvent);
            //force relocation
            window.location="http://"+window.location.host+"/"+window.location.pathname.split('/')[1];
        }

}

function countdownTicker()
{
	//put countdown time left in dialog box
	$("span#dialogText-warning").html(countdownTime);
	
	//decrement countdownTime
	countdownTime--;
}
function ResetTimer()
{
	pageRequestTime = new Date();
}