/*
 * az61.db.userLesson
 *
 * Created: 21.11..2013
 * Author: Rebeca Kurz <rk@inmedias.de>
 * Company: team in medias GmbH
 */

//Gets longterm Items
function GetAllLongtermItems(userId) {
	db.transaction(function(tx) {
		tx.executeSql('SELECT COUNT(LearnItem.LessonId) as count,* FROM LearnItem '+
		'INNER JOIN UserLessons ON LearnItem.LessonId = UserLessons.lesson_id '+
		'INNER JOIN Lesson ON LearnItem.LessonId = Lesson.LessonId '+
		'INNER JOIN Category ON Lesson.CategoryId = Category.CategoryId WHERE IsLongterm = 1 AND UserLessons.user_id = ' + userId + ' GROUP BY Category.CategoryName;', [],
	 	function(tx, result) {
			if (result != null && result.rows != null) {
				var lessonCount = 0;				

	    		for (var i = 0; i < result.rows.length; i++) {
	      			var row = result.rows.item(i);
	      			lessonCount = lessonCount + row.count;

	      			$('div.longtermList').append('<li id="longterm_'+ row.LessonId +'"><span class="longtermCategory">'+ row.CategoryName +'</span><span class="longtermCategory">'+ row.count +'</span>'+
	      			'<span class="enterLongterm"><img class="enterLongtermIcon pointer" src="img/forward.png"></span></li>');
	        	}
	        	
	        	var lessonText = 'Fächern';
	        	if (result.rows.length == 1){
	        		lessonText = 'Fach';
	        	}
	        	$('.longtermCount').html('Insgesamt: ' + lessonCount + ' Vokabeln in ' + result.rows.length + ' ' + lessonText);
	      	}
		}, errorCB);
		
	},errorCB,nullHandler);
}

function GetLongtermFromLesson(userId, lessonData){
	db.transaction(function(tx) {
		doQuery(tx, 'SELECT Result.learnItem_id as lItemId,* FROM LearnItem INNER JOIN Result ON LearnItem.LearnItemId = Result.learnItem_id'+
		' LEFT JOIN Users ON Result.user_id = Users.UserId '+
		' WHERE LessonId ='+lessonData['lessonId']+' AND Result.user_id ='+userId+' ORDER BY LearnItem.LearnItemId;', [],function(tx,result){
			if (result != null && result.rows != null) {
				var longtermLesson = {};
						
	    		for (var i = 0; i < result.rows.length; i++) {
	      			var row = result.rows.item(i);
	      			
	      			var now = parseInt(new Date().getTime()/1000,10);
	      			var createListItem = false;
	      			
	      			//Go through levels, check date last shown, only create list item, if date set in levels passed
	      			var level = parseInt(row.LongtermLevel,10);
	      			if (row.LastShown < now){
	      				var timeDiff = now - row.LastShown;
						var diffDays = parseInt(timeDiff / (3600 * 24),10);
		      			switch (level) {
		      				case 6:
		      					dayLearnItem = new Date(row.Timestamp*1000).setHours(0,0,0,0);
		      					today = new Date().setHours(0,0,0,0);
								
								//show learn item for level 6 also if it was created today
		      					if (row.Level6 == diffDays || dayLearnItem == today){
		      						createListItem = true;
		      					}
		      					else {
		      						createListItem = false;
		      					}
		      					break;
		      				case 5:
		      					if (row.Level5 == diffDays){
		      						createListItem = true;
		      					}
		      					else {
		      						createListItem = false;
		      					}
		      					break;
		      				case 4:
		      					if (row.Level4 == diffDays){
		      						createListItem = true;
		      					}
		      					else {
		      						createListItem = false;
		      					}
		      					break;
		      				case 3:
		      					if (row.Level3 == diffDays){
		      						createListItem = true;
		      					}
		      					else {
		      						createListItem = false;
		      					}
		      					break;
		      				case 2:
		      					if (row.Level2 == diffDays){
		      						createListItem = true;
		      					}
		      					else {
		      						createListItem = false;
		      					}
		      					break;
		      				case 1:
		      					if (row.Level1 == diffDays){
		      						createListItem = true;
		      					}
		      					else {
		      						createListItem = false;
		      					}
		      					break;
		      				case 0:
		      					if (row.Level0 == diffDays){
		      						createListItem = true;
		      					}
		      					else {
		      						createListItem = false;
		      					}
		      					break;
		      				default:
		      					break;
		      			}
	      			}
	      			
	      			//If createItem = true create list item
	      			if (createListItem){
						$('.longtermContent ul').append('<li id="learnItemId_'+row.lItemId+'"></li>');
						
		      			$('.longtermContent li#learnItemId_'+row.lItemId).append('<div id="questionLearnItem_'+row.lItemId+'" class="question"><span class="header"></span>'+
		      			'<input class="longterm" type="text" readonly="readonly" value="'+row.Question+'"/><input class="answerValue" type="hidden" value="'+row.Answer+'"/>'+
		      			'<span class="vocabLevel">'+row.LongtermLevel+'</span></div><div id="answerlearnItem_'+row.lItemId+'" class="answer"><span class="header"></span>'+
		      			'<input class="longterm answerUser" type="text" name="answer" /></div>');
	      			}
	        	}
	      	}
	      	$(".rslides").responsiveSlides({
                auto: false,            // Boolean: Animate automatically, true or false
                pager: false,           // Boolean: Show pager, true or false
                nav: true,              // Boolean: Show navigation, true or false
                random: false,          // Boolean: Randomize the order of the slides, true or false
                pause: false,           // Boolean: Pause on hover, true or false
                pauseControls: true,    // Boolean: Pause when hovering controls, true or false
                prevText: "",           // String: Text for the "previous" button
                nextText: "Weiter",     // String: Text for the "next" button
                maxwidth: "",           // Integer: Max-width of the slideshow, in pixels
                navContainer: "div.longtermLearn",  // Selector: Where controls should be appended to, default is after the 'ul'
                manualControls: "",     // Selector: Declare custom pager navigation
            });
            
            itemCounter = getCurrentLongtermItem();
			$('.countLearnItem').html(itemCounter);
			
			var itemTotalCount = $('.longtermContent li').length;
			$('.totalLearnItem').html(itemTotalCount);
			});
	});
}

//Check when logged In User Studied the last time
function CheckForLastTimeStudied(loggedInUser){
	
}

//Add Result to DB
function AddResultToDB(resultItem){
    console.log('test');
	var learnItemId = resultItem['learnItemId'];
	var userId = resultItem['userId'];
	var lastShown = resultItem['lastShown'];
	var longtermLevel = resultItem['longtermLevel'];
    
	db.transaction(function(tx) {
		doQuery(tx, 'INSERT INTO Result(user_id, learnItem_id, LastShown, LongtermLevel)'+
			'VALUES('+userId+','+learnItemId+',"'+lastShown+'",'+longtermLevel+')',[],querySuccessInsert);
	});
	
 	return;
}

//Update Result to the Database
function UpdateResultToDB(resultItem){
	var learnItemId = resultItem['learnItemId'];
	var userId = resultItem['userId'];
	var lastShown = resultItem['lastShown'];
	var longtermLevel = resultItem['longtermLevel'];
	
	var updateStatement = 'LastShown ="'+lastShown+'",LongtermLevel ='+longtermLevel;
	
	db.transaction(function(tx) {
		doQuery(tx, 'UPDATE Result SET '+ updateStatement +' WHERE user_id='+userId+' AND learnItem_id='+learnItemId+';',[],querySuccessUpdate);
	});
	return false;
}

//Remove Result from the Database
function DeleteResultFromDB(resultItem){
    var learnItemId = resultItem['learnItemId'];
    var userId = resultItem['userId'];
    
    var whereStatement = 'WHERE learnItem_id='+learnItemId;
    
    if (userId != 0){
    	whereStatement = whereStatement + ' AND user_id='+userId;
    }
    
    db.transaction(function(tx) {
        doQuery(tx, 'DELETE FROM Result ' + whereStatement +';',[],querySuccess);
    });
    return false;
}
