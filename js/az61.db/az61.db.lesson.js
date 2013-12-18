/*
 * az61.db.manager
 *
 * Created: 14.10.2013
 * Author: Rebeca Kurz <rk@inmedias.de>
 * Company: team in medias GmbH
 */

//Gets all Lessons from DB corresponding to passed Category
function GetDBLessons(catId, callback) {
	db.transaction(function(tx) {
		tx.executeSql('SELECT * FROM Lesson WHERE CategoryId = ' + catId + ' ORDER BY LOWER(LessonName) ASC;', [],
	 	function(tx, result) {
			if (result != null && result.rows != null) {
				var lessons = [];
	    		for (var i = 0; i < result.rows.length; i++) {
	      			var row = result.rows.item(i);
	      			var lesson = {};      			
	      			lesson['id'] = row.LessonId;
	      			lesson['name'] = row.LessonName;
	      			
	      			lessons.push(lesson);
	        	}
	        	callback(lessons, catId);
	        	initBinding();
	      	}
		}, errorCB);
	},errorCB,nullHandler);
}

//Get all Lessons (for checkboxes)
function GetLessonsFromDB(){
	db.transaction(function(tx) {
		doQuery(tx, 'SELECT LessonId, LessonName FROM Lesson;', [],function(tx,result){
			if (result != null && result.rows != null) {
				$('#addUserLessonsDialog').html('');
				for (var i = 0; i < result.rows.length; i++) {
	      			var row = result.rows.item(i);
	      			$('#addUserLessonsDialog').append('<input class="userLesson" type="checkbox" name="lessons" value="'+row.LessonName+'" id="lessonId_'+row.LessonId+'"/>'+
	      			'<label for="lessonId_'+row.LessonId+'">'+row.LessonName+'</label>');
	        	}
	      	}
		});
	});
}

//HTML for Lessons must be filled here because values are not returned
function setHtmlForLessons(elementArray, catId){
	lessonArray = elementArray;
	
	if (lessonArray.length > 0){
		$('.category li#cat_'+catId).append('<ul class="lesson"></ul>');
		for (var i = 0; i < lessonArray.length; i++) {
			lessonId = lessonArray[i]['id'];
			lessonName = lessonArray[i]['name'];
			
			$('.category li#cat_'+catId +' ul.lesson').append('<li id="lektion_'+ lessonId +'""><span class="lessonName left">' + lessonName + '</span><img class="lessonMenuIcon pointer" src="'+ imgPath +'menu.png" /></li>');
			
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
                    $("#lessonExists").dialog( "open" );
                }
                else {
                    db.transaction(function(tx) {
                        doQuery(tx, 'INSERT INTO Lesson(LessonName,CategoryId,OwnerId) VALUES ("'+lessonName+'",' + catId + ',' + ownerID+')',[],querySuccess);
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
		tx.executeSql('UPDATE Lesson SET LessonName ="'+ lessonName +'" WHERE LessonId=' + lessonId +';',[],successCB,errorCB); 
	});
	return false;
}

//Deletes the chosen Lesson from the Database
function DeleteLessonFromDB(lessonId){	
	db.transaction(function(tx) {
		tx.executeSql('DELETE FROM Lesson WHERE LessonId = ' + lessonId + ';',[],nullHandler,errorCB);
		tx.executeSql('DELETE FROM LearnItem WHERE LessonId = ' + lessonId + ';',[],nullHandler,errorCB); 
	});
 	
	return;
}