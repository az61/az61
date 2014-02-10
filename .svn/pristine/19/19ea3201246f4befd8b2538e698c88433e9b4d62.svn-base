/*
 * az61.db.test
 *
 * Created: 20.12.2013
 * Author: Rebeca Kurz <rk@inmedias.de>
 * Company: team in medias GmbH
 */

//Gets longterm Items
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

function GetLearnItemTestFromLesson(userId, lessonIds){
	db.transaction(function(tx) {
		doQuery(tx, 'SELECT * FROM LearnItem INNER JOIN Lesson ON LearnItem.LessonId = Lesson.LessonId '+	
		' WHERE Lesson.LessonId IN ('+lessonIds+') ORDER BY Lesson.LessonId;', [],function(tx,result){
			if (result != null && result.rows != null) {
						
	    		for (var i = 0; i < result.rows.length; i++) {
	      			var row = result.rows.item(i);
	      			$('.testContent ul').append('<li id="learnItemId_'+i+'"></li>');
						
	      			$('.testContent li#learnItemId_'+i).append('<div id="questionLearnItem_'+i+'" class="question"><span class="header"></span>'+
	      			'<input class="test" type="text" readonly="readonly" value="'+row.Question+'"/><input class="answerValue" type="hidden" value="'+row.Answer+'"/>'+
	      			'<input class="lessonNameItem" type="hidden" value="'+row.LessonName+'"/><input class="catNameItem" type="hidden" value="'+row.CategoryName+'"/></div>'+
	      			'<div id="answerlearnItem_'+i+'" class="answer"><span class="header"></span>'+
	      			'<input class="test answerUser" type="text" name="answer" /></div>');
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
			
		});
	});
}
