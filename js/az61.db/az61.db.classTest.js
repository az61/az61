/*
 * az61.db.test
 *
 * Created: 20.12.2013
 * Author: Rebeca Kurz <rk@inmedias.de>
 * Company: team in medias GmbH
 */

//Gets Learn Items from lessons that are connected to user to display in classtest list
function GetUserLessons(userId) {
	db.transaction(function(tx) {
		doQuery(tx, 'SELECT *, Category.CategoryId AS catId, Category.CategoryName FROM Lesson INNER JOIN UserLessons ON Lesson.LessonId = UserLessons.lesson_id '+
		'INNER JOIN Category on Lesson.CategoryId = Category.CategoryId WHERE user_id = '+userId+';',[],function(tx,result){
			if (result != null && result.rows != null) {
				if (result.rows.length != 0){
					$('ul.testList').html('');
					var categoryIds = [];
					var lessons = [];
					
					for (var i = 0; i < result.rows.length; i++) {
						var row = result.rows.item(i);
						var newCatId = row.catId;
						var category = {};
						
	      				if($.inArray(newCatId,categoryIds) == -1){
	      					categoryIds.push(newCatId);
	      					$('ul.testList').append('<li class="category" id="cat_'+row.catId+'"><span class="cat-title"">' + row.CategoryName + '</span><ul></ul></li>');
	      				}
	      				
	      				$('ul.testList').find('li#cat_'+row.catId + ' ul').append('<li class="lesson" id="lesson_'+row.LessonId+'"><input id="lesson'+row.LessonId+'" class="checkLesson" type="checkbox" value=""/><label for="lesson'+row.LessonId+'" class="lessonTitle">'+row.LessonName+'</span></label></li>');
					}
				}
			}
		});
	});
}

//Get learn items for test from chosen lessons
function GetLearnItemTestFromLesson(userId, lessonIds, reverse){
	db.transaction(function(tx) {
		doQuery(tx, 'SELECT * FROM LearnItem INNER JOIN Lesson ON LearnItem.LessonId = Lesson.LessonId '+	
		' WHERE Lesson.LessonId IN ('+lessonIds+') ORDER BY Lesson.LessonId;', [],function(tx,result){
			if (result != null && result.rows != null) {
				if (result.rows.length != 0){
					for (var i = 0; i < result.rows.length; i++) {
		      			var row = result.rows.item(i);
		      			$('.testContent ul').append('<li id="learnItemId_'+i+'"></li>');
		      			
		      			//If not reverse learning display question and ask for answer
		      			if (!reverse){
		      				$('.testContent li#learnItemId_'+i).append('<div id="questionLearnItem_'+i+'" class="question"><span class="header"></span>'+
				      			'<textarea class="test" readonly="readonly">'+row.Question+'</textarea><input class="answerValue" type="hidden" value="'+row.Answer+'"/>'+
				      			'<input class="lessonNameItem" type="hidden" value="'+row.LessonName+'"/><input class="catNameItem" type="hidden" value="'+row.CategoryName+'"/></div>'+
				      			'<div id="answerlearnItem_'+i+'" class="answer"><span class="header"></span>'+
				      			'<textarea class="test answerUser" name ="answer"></textarea></div>');
		      			}
		      			//If reverse learning display answer and ask for question 
						else {
							$('.testContent li#learnItemId_'+i).append('<div id="questionLearnItem_'+i+'" class="question"><span class="header"></span>'+
				      			'<textarea class="test" readonly="readonly">'+row.Answer+'</textarea><input class="answerValue" type="hidden" value="'+row.Question+'"/>'+
				      			'<input class="lessonNameItem" type="hidden" value="'+row.LessonName+'"/><input class="catNameItem" type="hidden" value="'+row.CategoryName+'"/></div>'+
				      			'<div id="answerlearnItem_'+i+'" class="answer"><span class="header"></span>'+
				      			'<textarea class="test answerUser" name ="answer"></textarea></div>');
						}		      			
		        	}
				}
				else {
					$('.checkAnswer').hide();
					$('.testContent').html('<p>Für diese Lektion gibt es keine Lerninhalte</p><br /><br />');
					$('.testContent').append('<a class="button form-button back-button" href="classTest.html">Zurück zur Übersicht</a>');
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
                navContainer: "div.testLearn",  // Selector: Where controls should be appended to, default is after the 'ul'
                manualControls: "",     // Selector: Declare custom pager navigation
            });
            
            itemCounter = getCurrentLongtermItem();
			$('.countLearnItem').html(itemCounter);
			
			var itemTotalCount = $('.testContent li').length;
			$('.totalLearnItem').html(itemTotalCount);
			
			//Set all .answerUser textareas to readonly if mode is on "show answer" and not "check answer"
			if($('.noTyping').is(':checked')){	
				$('.answerUser').each(function(e){
					$(this).attr('readonly','readonly');
				});
			}
			
		});
	});
}
