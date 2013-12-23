/*
 * az61.db.manager
 *
 * Created: 14.10.2013
 * Author: Rebeca Kurz <rk@inmedias.de>
 * Company: team in medias GmbH
 */

//Gets all Users
function GetDBUsers(loggedInUserId) {
	db.transaction(function(tx) {
		tx.executeSql('SELECT UserId, UserName FROM Users ORDER BY LOWER(UserName) ASC;', [],
	 	function(tx, result) {
			if (result != null && result.rows != null) {
				if (result.rows.length != 0){
					$('.userSelect').html('');
					$('.userSelect').append('<option value="choose">---</option>');
					for (var i = 0; i < result.rows.length; i++) {
		      			var row = result.rows.item(i);
		      			if (loggedInUserId == 1) {		      				
		      				$('.userSelect').append('<option value="'+ row.UserId +'">'+ row.UserName +'</option>');
		      			}
		      			else {
		      				if (loggedInUserId == row.UserId){
		      					$('.userSelect').append('<option value="'+ row.UserId +'">'+ row.UserName +'</option>');
		      				}
		      			}
	        		}
				}	    		
	      	}
		}, errorCB);
		
	},errorCB,nullHandler);
}

//Gets all User Data
function GetDBUserData(userId) {
	db.transaction(function(tx) {
		tx.executeSql('SELECT * FROM Users WHERE UserId=' + userId + ';', [],
	 	function(tx, result) {
			if (result != null && result.rows != null) {
				if (result.rows.length != 0){
					for (var i = 0; i < result.rows.length; i++) {
		      			var row = result.rows.item(i);
		      			
		      			if (row.HolidayActive == 1){
							$('#holidayActive').attr('checked', true);
						}
						else {
							$('#holidayActive').attr('checked', false);
						}
						
						if (row.Principle == LEITNER_PRINCIPLE){
							$('input[name=principle]:radio[value=Leitner]').attr('checked', true);
						}
						else {
							$('input[name=principle]:radio[value=-1]').attr('checked', true);
						}
		      					      			
		      			$('#level6').val(row.Level6);
		      			$('#level5').val(row.Level5);
		      			$('#level4').val(row.Level4);
		      			$('#level3').val(row.Level3);
		      			$('#level2').val(row.Level2);
		      			$('#level1').val(row.Level1);
		      			$('#level0').val(row.Level0);
	        		}
				}	    		
	      	}
		}, errorCB);
		
	},errorCB,nullHandler);
}

//Get all User Lessons (for checkboxes)
function GetUserLessonsFromDB(userId){
    db.transaction(function(tx) {
        doQuery(tx, 'SELECT * FROM UserLessons WHERE user_id = '+userId+';', [],function(tx,result){
            if (result != null && result.rows != null) {
                var lessons = [];
                for (var i = 0; i < result.rows.length; i++) {
                    var row = result.rows.item(i);
                    $('#addUserLessonsDialog input#lessonId_'+row.lesson_id).prop('checked',true);
                    lessons.push(row.lesson_id);
                }
                $('.checkedLessons').html(lessons.join(", "));
            }             
        });
    });
}

function AddUserLessonToDB(userId,lessonId) {
    db.transaction(function(tx) {
        doQuery(tx, 'INSERT INTO UserLessons(user_id, lesson_id) VALUES('+userId+','+lessonId +')',[],querySuccessInsert);
    });
    
    return;
}

//Add UserData to DB
function AddUserToDB(userObject){
	var userName = userObject['userName'];
	var password = userObject['password'];
	var isParent = 0;
	var theme = 'default';
	var level6 = userObject['level6'];
	var level5 = userObject['level5'];
	var level4 = userObject['level4'];
	var level3 = userObject['level3'];
	var level2 = userObject['level2'];
	var level1 = userObject['level1'];
	var level0 = userObject['level0'];
	var sound = 0;
	var editOnFly = 0;
	var principle = userObject['principle'];
	var language = 'de';
	var holidayActive = userObject['holidayActive'];
	var enterHoliday = userObject['enterHoliday'];
    
    db.transaction(function(tx) {
        doQuery(tx, 'SELECT UserName FROM Users WHERE UserName = "'+ userName +'"',[],function(tx,result){
            if (result != null && result.rows != null) {
                if (result.rows.length != 0){
                    $("#userExists").dialog( "open" );
                }
                else {
                    db.transaction(function(tx) {
                        doQuery(tx, 'INSERT INTO Users(UserName,Password,IsParent,Theme,Level6,Level5,Level4,Level3,Level2,Level1,Level0,Sound,EditOnFly,Principle,Language,HolidayActive,EnterHoliday)'+
                            'VALUES("'+userName+'","'+password+'",'+isParent+',"'+theme+'",'+level6+','+level5+','+level4+','+level3+','+level2+','+level1+','+level0+','+sound+','+editOnFly+','+principle+',"'
                            +language+'",'+holidayActive +',"'+enterHoliday +'")',[],querySuccessUserInsert);
                    });
                }               
            }
        });
    });
 	return;
}

//Update User Data to the Database
function UpdateUserDataToDB(userObject){
	var password = userObject['password'];
	var isParent = userObject['isParent'];
	var theme = userObject['theme'];
	var level6 = userObject['level6'];
	var level5 = userObject['level5'];
	var level4 = userObject['level4'];
	var level3 = userObject['level3'];
	var level2 = userObject['level2'];
	var level1 = userObject['level1'];
	var level0 = userObject['level0'];
	var sound = userObject['sound'];
	var editOnFly = userObject['editOnFly'];
	var principle = userObject['principle'];
	var language = userObject['language'];
	var holidayActive = userObject['holidayActive'];
	var enterHoliday = userObject['enterHoliday'];
	
	var updateStatement = 'Password = "'+password+'",IsParent = '+isParent+',Theme = "'+theme+'",Level6 = '+level6+',Level5 = '+level5+',Level4 = '+level4+',Level3 = '+level3+','+
		'Level2 = '+level2+',Level1 = '+level1+',Level0 = '+level0+',Sound = '+sound+',EditOnFly = '+editOnFly+',Principle = '+principle+',Language = "'+language+'",'+
		'HolidayActive = ' + holidayActive + ',EnterHoliday = "'+enterHoliday+'"';
	
	db.transaction(function(tx) {
		doQuery(tx, 'UPDATE Users SET '+ updateStatement +' WHERE UserId=' + userObject['userId'] +';',[],querySuccessUpdate);
	});
	return false;
}

//Delete the chosen User from the Database
function DeleteUserFromDB(userId){
    //Delte Results
    db.transaction(function(tx) {
        doQuery(tx, 'DELETE FROM Result WHERE user_id = ' + userId + ';', [], querySuccessDelete);
    });
    
    //Delete User Lessons
	DeleteUserLessonFromDB(userId);
	
	db.transaction(function(tx) {
        doQuery(tx, 'DELETE FROM Users WHERE UserId = ' + userId + ';', [], querySuccessUserDelete);
    });
    
	return;
}

function DeleteUserLessonFromDB(userId) {
    db.transaction(function(tx) {
        doQuery(tx, 'DELETE FROM UserLessons WHERE user_id = '+userId+';', [], querySuccessDelete);
    });
}