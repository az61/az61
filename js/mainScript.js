/*
 * mainScript for AZ61 App
 *
 * Created: 14.10.2013
 * Author: Rebeca Kurz <rk@inmedias.de>
 * Company: team in medias GmbH
 */

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady(){
	lesID = getUrlVars()['lessonId'];
	catID = getUrlVars()['catId'];
	
	document.addEventListener("pause", onPause, false);
	document.addEventListener("resume", onResume, false);
	console.log("Device is ready");	

	connectToDB();
	
	if($.cookie('loggedInUser') == null){
		window.location.href='login.html';
	}
	
	ListDBValues();
	
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
}
