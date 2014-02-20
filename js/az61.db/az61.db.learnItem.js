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
	    	if (DEBUG_MODE) console.log('Enter not remove result');
	    	
	    	db.transaction(function(tx) {
    			doQuery(tx, 'SELECT * FROM LearnItem WHERE LessonId = ' + lessonId + ' ORDER BY LOWER (Question);', [],succesQueryGetLearnItems);
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
	if (PATHNAME.indexOf('learnItem.html') != -1) {
		if (DEBUG_MODE) console.log('Enter get learn items for vocabulary');
		
        if (result != null && result.rows != null) {
            var vocabulary = [];
            
            for (var i = 0; i < result.rows.length; i++) {
                var row = result.rows.item(i);
                var learnItem = {};                 
                learnItem['id'] = row.LearnItemId;
                learnItem['question'] = row.Question;
                learnItem['answer'] = row.Answer;
                
                var question = row.Question;
                var answer = row.Answer;
                
                //Count learn item characters - if more than 20 shorten and add "..." instead in the end
				if (row.Question.length > 10){
					question = question.substr(0,10);
					question = question + '...';
				}
				
				if (row.Answer.length > 10){
					answer = answer.substr(0,10);
					answer = answer + '...';
				}
                
                $('.vocabulary table tbody').append('<tr id="vocab_'+ row.LearnItemId +'" class="pointer"><td class="question">' + question + '<input type="hidden" class="full" value="' + row.Question + '" /></td>'+
                	'<td class="answer">' + answer + '<input type="hidden" class="full" value="' + row.Answer + '" /></td>' +
                    '<td><input type="checkbox" class="isLongterm" name="txIsLongterm" id="txIsLongterm_' + row.LearnItemId + '" value="' + row.IsLongterm +'" class="text ui-widget-content ui-corner-all" /></td>' +
                    '<td><img class="vocabEditMenuIcon pointer" src="'+ PATH_IMG +'menu.png" /></td></tr>');
                
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
                	var date = new Date();
                	var yesterday = parseInt(date.setDate(date.getDate() - 1)/1000,10);
                	yesterday = new Date(yesterday).setHours(0,0,0,0)/1000;
                	
                    //resultItem['lastShown'] = parseInt(new Date().getTime()/1000,10);
                    resultItem['lastShown'] = yesterday;
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
                    alert('Diese Vokabel ist bereits in dieser Lektion enthalten.');
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
														var date = new Date();
									                	var yesterday = parseInt(date.setDate(date.getDate() - 1),10);
									                	
									                	yesterday = new Date(yesterday).setHours(0,0,0,0)/1000;
									                	
									              		if (DEBUG_MODE) console.log(yesterday);
									              		
									                    resultItem['lastShown'] = yesterday;
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
	if (DEBUG_MODE) console.log('Enter learn item update');
	
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
