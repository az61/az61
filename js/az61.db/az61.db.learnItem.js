/*
 * az61.db.learnItem
 *
 * Created: 06.11..2013
 * Author: Rebeca Kurz <rk@inmedias.de>
 * Company: team in medias GmbH
 */

//Get all Vocabulary from chosen Lesson
function GetDBVocabulary(lessonId, removeResult){
	if (lessonId != null){
	    $('#dynamicLessonContent').attr('id','lessonContent_' + lessonId);
	    $('.vocabulary table tbody').html('');
	    	    
	    if(!removeResult){
	    	db.transaction(function(tx) {
    			doQuery(tx, 'SELECT * FROM LearnItem WHERE LessonId = ' + lessonId + ';', [],succesQueryGetLearnItems);
    		});
		}
		else {
            db.transaction(function(tx) {
                doQuery(tx, 'SELECT * FROM LearnItem WHERE LessonId = ' + lessonId + ';', [],succesQueryDeleteResult);
            });
        }
	}
}

function succesQueryGetLearnItems(tx, result){
    if (PATHNAME.indexOf('learnItems.html') != -1) {
        if (result != null && result.rows != null) {
            var vocabulary = [];
            
            for (var i = 0; i < result.rows.length; i++) {
                var row = result.rows.item(i);
                var learnItem = {};                 
                learnItem['id'] = row.LearnItemId;
                learnItem['question'] = row.Question;
                learnItem['answer'] = row.Answer;                   
                
                $('.vocabulary table tbody').append('<tr id="vocab_'+ row.LearnItemId +'"><td class="question">' + row.Question + '</td><td class="answer">' + row.Answer + '</td>' +
                    '<td><input type="checkbox" class="isLongterm" name="txIsLongterm" id="txIsLongterm_' + row.LearnItemId + '" value="' + row.IsLongterm +'" class="text ui-widget-content ui-corner-all" /></td>' +
                    '<td><img class="vocabEditMenuIcon pointer" src="'+ imgPath +'menu.png" /></td></tr>');
                
                if (row.IsLongterm == 1){
                    $('#txIsLongterm_' + row.LearnItemId).attr('checked', true);
                }
                
                vocabulary.push(learnItem);
                initBinding();
            }
        }
    }
    else if (PATHNAME.indexOf('userSettings.html') != -1){        
        if (result != null && result.rows != null) {
            var resultItem = {};            
            for (var i = 0; i < result.rows.length; i++) {
                var row = result.rows.item(i);
                if (row.IsLongterm == 1){
                    resultItem['lastShown'] = parseInt(new Date().getTime()/1000,10);
                    resultItem['longtermLevel'] = 6;
                    resultItem['learnItemId'] = row.LearnItemId;
                    resultItem['userId'] = $('#user option:selected').val();
                    AddResultToDB(resultItem);
                }
            }
        }
    }
}

function succesQueryDeleteResult(tx, result){      
    if (result != null && result.rows != null) {
        var resultItem = {};            
        for (var i = 0; i < result.rows.length; i++) {
            var row = result.rows.item(i);
            resultItem['learnItemId'] = row.LearnItemId;
            resultItem['userId'] = 0;
            
            if ($('#user option:selected').val() != '') {
            	resultItem['userId'] = $('#user option:selected').val();
            }
            
            DeleteResultFromDB(resultItem);
        }
    }
}

function GetLessonCategoryInfoFromLearnItem(lessonId, catId){
    if (lessonId != null && catId != null){
        db.transaction(function(tx) {
            doQuery(tx, 'SELECT l.LessonName, c.CategoryName FROM Lesson as l INNER JOIN Category AS c ON l.CategoryId = c.CategoryId WHERE LessonId = ' + lessonId + ';', [],
            function(tx, result) {
                if (result != null && result.rows != null) {
                    var row = result.rows.item(0);
                    $('.lessonContent').find('span.lessonName').html(row.LessonName);
                    $('.lessonContent').find('span.categoryName').html(row.CategoryName);
                }
            });
        });
    }
}

//Adds new Vocabulary to the databse (no determination of level here)
function AddVocabularyToDB(lessonId, newLernItem){
	var question = newLernItem['question'];
	var answer = newLernItem['answer'];
	var date = newLernItem['date'];
	var isLongterm = newLernItem['isLongterm'];
    
    db.transaction(function(tx) {
    	doQuery(tx, 'SELECT * FROM LearnItem WHERE Question = "'+ question +'" AND LessonId =' + lessonId,[],function(tx,result){
            if (result != null && result.rows != null) {
                if (result.rows.length != 0){
                    $("#vocabExists").dialog( "open" );
                }
                else {
                    db.transaction(function(tx) {
                        doQuery(tx, 'INSERT INTO LearnItem(Question,Answer,LessonId,OwnerId,Timestamp,IsLongterm)'+
                        ' VALUES ("'+question+'","'+answer+'",' + lessonId + ',' + ownerID+',"'+date+'",'+isLongterm+')',[],querySuccessInsert);
                    });
                    //Check if Lesson is UserLesson - then add vocabulary to Result table 
                    doQuery(tx, 'SELECT * FROM UserLessons WHERE lesson_id = '+ lessonId + ';',[],function(tx,result){
			            if (result != null && result.rows != null) {
			                //If UserLesson with lessonId exists add LearnItem to Result table
			                if (result.rows.length != 0){
			                	db.transaction(function(tx) {
			                        doQuery(tx, 'SELECT * FROM LearnItem INNER JOIN UserLessons ON LearnItem.LessonId = UserLessons.lesson_id WHERE Question = "'+ question +'" AND LessonId =' + lessonId,[],function(tx,result){
			                        	if (result != null && result.rows != null) {
							                if (result.rows.length != 0){
							                	for (var i = 0; i < result.rows.length; i++) {
							                		var row = result.rows.item(i);
							                		
							                		if(row.IsLongterm == 1){
									                	var resultItem = {};
									                	resultItem['learnItemId'] = row.LearnItemId;
														resultItem['userId'] = row.user_id;
														resultItem['lastShown'] = parseInt(new Date().getTime()/1000,10);
														resultItem['longtermLevel'] = 6;
									                    AddResultToDB(resultItem);
								                   }
							                   }
							                }
						                }
			                        });
			                    });
			                }               
			            }
			        });
                }               
            }
        });
    });
	
 	return;
}

//Update Vocabulary to the Database
function UpdateVocabularyToDB(newLearnItemValues){
	var vocabQuestion = newLearnItemValues['question'];
	var vocabAnswer = newLearnItemValues['answer'];
	var learnItemId = newLearnItemValues['id'];
	var isLongterm = newLearnItemValues['isLongterm'];
	
	var updateStatement = '';
	
	if (vocabQuestion != '' ) {
		updateStatement = updateStatement + 'Question="'+vocabQuestion+'"';
	}
	if (vocabAnswer != '' ) {
		if (updateStatement != ''){
			updateStatement = updateStatement + ',';
		}
		updateStatement = updateStatement + 'Answer="'+vocabAnswer+'"';
	}
	if (isLongterm != 99 ) {
		if (updateStatement != ''){
			updateStatement = updateStatement + ',';
		}
		updateStatement = updateStatement + 'IsLongterm='+isLongterm;
	}
	
	db.transaction(function(tx) {
        doQuery(tx, 'UPDATE LearnItem SET '+ updateStatement +' WHERE LearnItemId=' + learnItemId +';',[],querySuccessUpdate); 
	});
	return false;
}

//Deletes the chosen Vocabulary from the Database
function DeleteVocabularyFromDB(learnItemId){
	db.transaction(function(tx) {
        doQuery(tx, 'DELETE FROM LearnItem WHERE LearnItemId = ' + learnItemId + ';',[],querySuccess);
        doQuery(tx, 'DELETE FROM Result WHERE learnItem_id = ' + learnItemId + ';',[],querySuccess);
    });

	return;
}
