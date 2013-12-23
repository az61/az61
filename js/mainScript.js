/*
 * mainScript for AZ61 App
 *
 * Created: 14.10.2013
 * Author: Rebeca Kurz <rk@inmedias.de>
 * Company: team in medias GmbH
 */

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady(){
	//lesID = getUrlVars()['lessonId'];
	//catID = getUrlVars()['catId'];
	
	lesID = window.localStorage.getItem("lesId");
    catID = window.localStorage.getItem("catId");
	
	document.addEventListener("pause", onPause, false);
	document.addEventListener("resume", onResume, false);
	document.addEventListener("endcallbutton", onEndCallKeyDown, false);
	document.addEventListener("backbutton", ShowExitDialog, false);
	
	console.log("Device is ready");
	//window.localStorage.removeItem("launchCount");
	var applaunchCount = window.localStorage.getItem('launchCount');
		
	connectToDB();
	
	if(!applaunchCount){
		//Local storage is not set, hence first time launch. set the local storage item
		window.localStorage.setItem('launchCount',1);
		CheckForLastShown(loggedInUser);
	}
	
	ListDBValues();
	
	initBinding();
}

function ShowExitDialog(){
	navigator.notification.confirm(
            ("Willst du die App beenden?"), // message
            alertexit, // callback
            'AZ6-1', // title
            'Ok,Abbrechen' // buttonName
    );
}

function alertexit(button){
	if(button=="1" || button==1)
	{	
		window.localStorage.removeItem("launchCount");
	    device.exitApp();
	}

}

function onEndCallKeyDown() {
    // Handle the end call button
    
    exit = confirm("Willst du die App verlassen?");
    
    if(exit){
    	window.localStorage.removeItem("launchCount");
    	navigator.app.exitApp();
    }            
}

function onPause(){
	console.log("paused");
}

function onResume(){
	console.log("resume");
}

function getUrlVars(){
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

function pageRedirectVocab(lessonId, catId){
	window.location.href = 'learnItems.html?lessonId='+ lessonId +'&catId='+catId;
	window.localStorage.setItem("lesId", lessonId);
	window.localStorage.setItem("catId", catId);
}
