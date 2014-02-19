/*
 * az61.ui
 *
 * Created: 16.10.2013
 * Author: Rebeca Kurz <rk@inmedias.de>
 * Company: team in medias GmbH
 */

$(function() {	
	//Get Top Content
	$('.top').load(PATH_PARTIALS+'top.html #top-html');
	
	//If no one ist logged in (storage variable not set) show login, otherwise don't
	if(localStorage.getItem("loggedInUser") === null){
		showLogin();
	}	
	else {
		hideLogin();
		loadBottom();
	}
	
	//Declare variable before function so that value is kept
	var origDist = '';
	$('.closeContainer').click(function(){
		if ($('.closeContainer').hasClass('open')){
			
			//Define desitance from bottom for wrapper-container according to html
			var dist = '';
			//Detect orginial distance from the bottom to set it back on sliding up
			if (PATHNAME.indexOf('lessons.html') != -1 ) {
				dist = '-45';
				origDist = $('.form-action-buttons').css('bottom');
			}
			else if (PATHNAME.indexOf('learnItem.html') != -1) {
				dist = '-30';
				origDist = $('.form-action-buttons').css('bottom');
			}		
			else if (PATHNAME.indexOf('userSettings.html')){
				dist = '-30';
				origDist = $('.fixed-button').css('bottom');
			}
			
			
			$('.wrapper-container').animate({
				bottom: dist
			}, 1000, function() {
				$('.closeContainer').removeClass('open');
				//Change image to arrow up
				var src = PATH_IMG+'arrow-up.png';
				$('.closeContainer').css('background-image','url('+src+')');
			});
		}
		else {
			$('.wrapper-container').animate({
				bottom: origDist
			}, 1000, function() {
				$('.closeContainer').addClass('open');
				
				//Change image to arrow down
				var src = PATH_IMG+'arrow-down.png';
				$('.closeContainer').css('background-image','url('+src+')');
			});
			
			
		}
	});
	
});

function ListDBValues(){
	if (PATHNAME.indexOf('lessons.html') != -1 ) {
		GetDBCategories();
	}
	
	if (PATHNAME.indexOf('index.html') != -1 && loggedInUser == null ) {
		GetDBUsersLogin();
	}
	
	else if (PATHNAME.indexOf('learnItem.html') != -1) {
	    GetLessonCategoryInfoFromLearnItem(lesID,catID);
	    if (DEBUG_MODE) console.log('list db values');
		GetDBVocabulary(lesID, false);
	}
	
	else if (PATHNAME.indexOf('userSettings.html') != -1) {
		GetDBUsers(loggedInUser);
		GetAllLessonsFromDB();
		
		//If login user not admin (id=1) get and display user data
		if(loggedInUser != 1) {
			GetDBUserData(loggedInUser);
		}
		
		return false;
	}
	
	else if (PATHNAME.indexOf('longterm.html') != -1) {
		CheckForLastShown(loggedInUser);	
	   	GetAllLongtermItems(loggedInUser);   
	}
	
	else if (PATHNAME.indexOf('classTest.html') != -1) {	
	   GetUserLessons(loggedInUser);
	   showTestList();   
	}
}

function initBinding(){	
	$('input[type=button],input[type=submit], button').button();
	$('.vocabulary tbody tr').removeClass('alternate');
	$('.vocabulary tbody tr:nth-child(even)').addClass('alternate');
	
	//$('table.tablesorter th.question.sort-header').trigger('click');
	
	if(localStorage.getItem("loggedInUser") == 1){
        $('.deleteUser img').show();
        $('.addUser img').show();
    }    
    else {
        $('.deleteUser img').hide();
        $('.addUser img').hide();
    }   
}

//Load images in bottom (active images)
function loadBottom(){
	//$('#bottom').show();
	
	if(PATHNAME.indexOf('index.html') != -1){
		var src = PATH_IMG+'line_home_act.png';
		$('li.home a > img').attr('src',src);
	}
	
	else if(PATHNAME.indexOf('userSettings.html') != -1){
		var src = PATH_IMG+'line_user_act.png';
		$('li.userSettings a > img').attr('src',src);
	}
	
	else if(PATHNAME.indexOf('settings.html') != -1){
		var src = PATH_IMG+'line_settings_act.png';
		$('li.settings a > img').attr('src',src);
	}
	
	else if(PATHNAME.indexOf('lessons.html') != -1 || PATHNAME.indexOf('learnItem.html') != -1){
		var src = PATH_IMG+'line_pen_act.png';
		$('li.edit a > img').attr('src',src);
	}
}

//Hide Login form when logged in
function hideLogin(){
	$('#login').hide();
	$('.error').hide();
	$('.content').show();
	$('.bottom').show();
}

//Show Login Form when not logged in
function showLogin(){
	$('#login').show();
	$('.content').hide();
	$('.bottom').hide();
}