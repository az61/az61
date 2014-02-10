/*
 * az61.ui
 *
 * Created: 16.10.2013
 * Author: Rebeca Kurz <rk@inmedias.de>
 * Company: team in medias GmbH
 */

/*function ListDBValues(){
	if (PATHNAME == pathRoot+'lessons.html') {
		GetDBCategories();
	}	
	
	else if (PATHNAME == pathRoot+'learnItems.html') {
	    GetLessonCategoryInfoFromLearnItem(lesID,catID);
		GetDBVocabulary(lesID);
	}
	
	else if (PATHNAME == pathRoot+'userSettings.html') {
		console.log(loggedInUser);
		GetDBUsers(loggedInUser);
		GetLessonsFromDB();		
	}
	
	else if (PATHNAME == pathRoot + 'langzeit.html'){	
	   GetAllLongtermItems(loggedInUser);   
	}
}*/
function ListDBValues(){
	if (PATHNAME.indexOf('lessons.html') != -1 ) {
		GetDBCategories();
	}	
	
	else if (PATHNAME.indexOf('learnItems.html') != -1) {
	    GetLessonCategoryInfoFromLearnItem(lesID,catID);
		GetDBVocabulary(lesID, false);
	}
	
	else if (PATHNAME.indexOf('userSettings.html') != -1) {
		GetDBUsers(loggedInUser);
		GetLessonsFromDB();		
	}
	
	else if (PATHNAME.indexOf('langzeit.html') != -1) {
		CheckForLastShown(loggedInUser);	
	   	GetAllLongtermItems(loggedInUser);   
	}
	
	else if (PATHNAME.indexOf('klassenarbeit.html') != -1) {	
	   GetUserLessons(loggedInUser);
	   showTestList();   
	}
}

function initBinding(){	
	$('input[type=button],input[type=submit], button').button();
	$('.vocabulary tbody tr').removeClass();
	$('.vocabulary tbody tr:nth-child(even)').addClass('alternate');
	
	$('table.tablesorter th.question.sort-header').trigger('click');
	
	if(localStorage.getItem("loggedInUser") == 1){
        $('.deleteUser img').show();
    }
    
    else {
        $('.deleteUser img').hide();
    }   
}

$(function() {	
	//Get Top/Bottom Content
	$('.top').load(pathPartials+'top.html #top-html');
	
	if(localStorage.getItem("loggedInUser") === null){
		showLogin();
	}
	
	else {
		hideLogin();
		loadBottom();
	}

	//Sort Vocabulary by Question and Answer	
    var thSort = $('table.tablesorter th.sort-header'),
        inverse = false;
    
    thSort.click(function(event){
        sortVocabulary($(event.target));        
    }); 
    
    
    function sortVocabulary(header){
    	// var header = $(this),
            // index = header.index();
        var index = header.index();
    
        header
            .closest('table')
            .find('td')
            .filter(function(){
                return $(this).index() === index;
            })
            .sort(function(a, b){
                
                a = $(a).text().toLowerCase();
                b = $(b).text().toLowerCase();
                
                return (
                    isNaN(a) || isNaN(b) ?
                        a > b : +a > +b
                    ) ?
                        inverse ? -1 : 1 :
                        inverse ? 1 : -1;
                    
            }, function(){
                return this.parentNode;
            });
        
        inverse = !inverse;
        
        //Add Asc or Desc Class
        if (inverse) {
        	$(header).removeClass('sortDesc').addClass('sortAsc');
        }
        else {
        	$(header).removeClass('sortAsc').addClass('sortDesc');
        }
        
        $('.vocabulary tbody tr').removeClass();
        $('.vocabulary tbody tr:nth-child(even)').addClass('alternate');
    }
});

function loadBottom(){
	/*$('.bottom').load(pathPartials+'bottom.html #bottom-html', function(){
		//Change Bottom Menu Icons According to current page		

		if(PATHNAME == pathRoot+'index.html'){
			var src = pathImg+'line_home_act.png';
			$('li.home a > img').attr('src',src);
		}
		
		else if(PATHNAME == pathRoot+'userSettings.html'){
			var src = pathImg+'line_user_act.png';
			$('li.userSettings a > img').attr('src',src);
		}
		
		else if(PATHNAME == pathRoot+'settings.html'){
			var src = pathImg+'line_settings_act.png';
			$('li.settings a > img').attr('src',src);
		}
		
		else if(PATHNAME == pathRoot+'lessons.html' || PATHNAME == pathRoot+'learnItems.html'){
			var src = pathImg+'line_pen_act.png';
			$('li.edit a > img').attr('src',src);
		}
	});*/
	
	$('#bottom-html').show();
	
	if(PATHNAME.indexOf('index.html') != -1){
		var src = pathImg+'line_home_act.png';
		$('li.home a > img').attr('src',src);
	}
	
	else if(PATHNAME.indexOf('userSettings.html') != -1){
		var src = pathImg+'line_user_act.png';
		$('li.userSettings a > img').attr('src',src);
	}
	
	else if(PATHNAME.indexOf('settings.html') != -1){
		var src = pathImg+'line_settings_act.png';
		$('li.settings a > img').attr('src',src);
	}
	
	else if(PATHNAME.indexOf('lessons.html') != -1 || PATHNAME.indexOf('learnItems.html') != -1){
		var src = pathImg+'line_pen_act.png';
		$('li.edit a > img').attr('src',src);
	}
}

function hideLogin(){
	$('#login').hide();
	$('.error').hide();
	$('.content').show();
}

function showLogin(){
	$('#login').show();
	$('.content').hide();
	$('#bottom-html').hide();
}