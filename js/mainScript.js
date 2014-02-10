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
    
    menuOpen = false;
	
	document.addEventListener("pause", onPause, false);
	document.addEventListener("resume", onResume, false);
	//document.addEventListener("menubutton", onMenuKeyDown, false);
	
	console.log("Device is ready");
	
	connectToDB();
	
	ListDBValues();
	
	initBinding();
}

function onMenuKeyDown(){
	console.log("menu accessed");
	if(menuOpen) {
		console.log("close the menu");
		menuDiv.style.display="none";
		menuOpen = false;
	} else {
		console.log("open the menu");
		menuDiv.style.display="block";
		menuOpen = true;
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
