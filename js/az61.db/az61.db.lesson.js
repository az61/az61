/*
 * az61.db.manager
 *
 * Created: 14.10.2013
 * Author: Rebeca Kurz <rk@inmedias.de>
 * Company: team in medias GmbH
 */

//Gets all Lessons from DB for the passed Category
function GetDBLessons(catId, callback) {
	db.transaction(function(tx) {
		var innerJoin = '';
		var where = '';
		
		if (loggedInUser != 1){
			innerJoin = ' INNER JOIN UserLessons ON Lesson.LessonId = UserLessons.lesson_id';
			where = ' AND user_id ='+loggedInUser;
		}
		doQuery(tx, 'SELECT * FROM Lesson' + innerJoin + ' WHERE CategoryId = ' + catId + where + ' GROUP BY Lesson.LessonId ORDER BY LOWER(LessonName) ASC;', [],function(tx,result){
			if (result != null && result.rows != null) {
				if (result.rows.length != 0){
					var lessons = [];
					for (var i = 0; i < result.rows.length; i++) {
		      			var row = result.rows.item(i);
		      			var lesson = {};      			
		      			lesson['id'] = row.LessonId;
		      			lesson['name'] = row.LessonName;
		      			
		      			lessons.push(lesson);
		        	}
		        	callback(lessons, catId);
		        }

		        $('.category li#cat_' + catId).append('<button id="addLesson_'+ catId +'" class="addLessonClick">Lektion hinzufügen</button>');
		        initBinding();
	      	}
		});
	},errorCB,nullHandler);
}

//HTML for Lessons must be filled here because values are not returned
function setHtmlForLessons(elementArray, catId){
	lessonArray = elementArray;
	
	if (lessonArray.length > 0){
		$('.category li#cat_'+catId).append('<ul class="lesson"></ul>');
		for (var i = 0; i < lessonArray.length; i++) {
			lessonId = lessonArray[i]['id'];
			lessonName = lessonArray[i]['name'];
			
			//Count lesson Name characters - if more than 20 shorten and add "..." instead in the end
			if (lessonName.length > 20){
				lessonName = lessonName.substr(0,20);
				lessonName = lessonName + '...';
			}

			$('.category li#cat_'+catId +' ul.lesson').append('<li class="lessonMenu pointer" id="lektion_'+ lessonId +'"><span class="lessonName">' + lessonName + '</span><img class="lessonMenuIcon pointer" src="'+ PATH_IMG +'menu.png" /></li>');
			
			if(i == lessonArray.length-1){
				$('ul.lesson li').addClass('last');
			}
		}
	}	
}

//Adds a new Lesson to the Database
function AddLessonToDB(catId, lessonName) {
    db.transaction(function(tx) {
        doQuery(tx, 'SELECT LessonName FROM Lesson WHERE LessonName = "'+ lessonName +'" AND CategoryId = '+ catId +';',[],function(tx,result){
            if (result != null && result.rows != null) {
                if (result.rows.length != 0){
                    alert('Für dieses Fach ist schon einen Lektion mit diesem Namen vorhanden.');
                }
                else {
                    db.transaction(function(tx) {
                        doQuery(tx, 'INSERT INTO Lesson(LessonName,CategoryId,OwnerId) VALUES ("'+lessonName+'",' + catId + ',' + loggedInUser+')',[],function(tx,result){
                        	//Insert Lesson as UserLesson for Admin
		                    doQuery(tx, 'SELECT * FROM Lesson WHERE LessonName = "'+ lessonName + '" AND CategoryId =' + catId + ';',[],function(tx,result){
					            if (result != null && result.rows != null) {
					            	if (DEBUG_MODE) console.log('Enter Add UserLesson for Admin after Lesson Insert');
					            	
					            	if (DEBUG_MODE) console.log('Result rows Lessons: ' + result.rows.length);
					                //If Lesson with lesson name and Category exists add UserLesson to Result table
					                if (result.rows.length != 0 && result.rows.length == 1){
					                	var row = result.rows.item(0);
					                	
					                	//Add User Lesson for logged In User
					                	if (loggedInUser != 1){
					                		AddUserLessonToDB(loggedInUser,row.LessonId);
					                	}
					                	
					                	//Add User Lesson for Admin = id 1
					                	var userId = 1;					                	
					                	AddUserLessonToDB(userId,row.LessonId);
					                	
					                	ListDBValues();
					            	}
					        	}
		                	});
                        });
                    });       
            	}
            }
        });
    });
	return false; 
}

//Update Lesson to the Database
function UpdateLessonToDB(lessonId, lessonName){
	db.transaction(function(tx) {
		doQuery(tx,'UPDATE Lesson SET LessonName ="'+ lessonName +'" WHERE LessonId=' + lessonId +';',[],querySuccess); 
	});
	return false;
}

//Deletes the chosen Lesson from the Database
function DeleteLessonFromDB(lessonId){
	//Delete Lesson first
	db.transaction(function(tx) {
        doQuery(tx, 'DELETE FROM Lesson WHERE LessonId = ' + lessonId + ';',[],querySuccess);
    });
    //Delete Result before Vocabulary
    var removeResult = true;    
    GetDBVocabulary(lessonId, removeResult);
    
    //Delete Vocabulary
    db.transaction(function(tx) {
        doQuery(tx, 'DELETE FROM LearnItem WHERE LessonId = ' + lessonId + ';',[],querySuccess);
    });
    
    //Delete UserLesson with this lessonId
	db.transaction(function(tx) {
        doQuery(tx, 'DELETE FROM UserLessons WHERE lesson_id = ' + lessonId + ';',[],querySuccess);
    });
 	
	return;
}
