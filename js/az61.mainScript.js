/*
 * mainScript for AZ61 App
 *
 * Created: 14.10.2013
 * Author: Rebeca Kurz <rk@inmedias.de>
 * Company: team in medias GmbH
 */

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady(){
	lesID = window.localStorage.getItem("lesId");
    catID = window.localStorage.getItem("catId");
	
	document.addEventListener("pause", onPause, false);
	document.addEventListener("resume", onResume, false);
	
	if (DEBUG_MODE) console.log("Device is ready");
	
	//Connect to the database
	connectToDB();
	
	//List all Values from DB
	ListDBValues();
	
	//Perform some initial functions
	initBinding();
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
