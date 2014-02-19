/*
 * az61.ui.longterm
 *
 * Created: 28.10.2013
 * Author: Rebeca Kurz <rk@inmedias.de>
 * Company: team in medias GmbH
 */

$(function() {
	var itemCounter = 0;
	
	//Function on Click "Prüfen" checkAnswer
	$('.checkAnswer').on('click',function(event){
		var liId = '';
		var learnItemId = 0;
		
		$('.longtermContent').find('li').each(function(){
		    if ($(this).css('position') == 'relative') {
		        liId = $(this).find('div.question').attr('id');
		        learnItemId = liId.substring(18);
		    }
		});
		//$('.longtermContent').find('li:visible div.question').attr('id');	    
	    //var learnItemId = liId.substring(18);
	    
	    var longtermLevel = parseInt($('#questionLearnItem_'+learnItemId+' .vocabLevel p.level').html(),10);
	    var answerValue = $.trim($('#questionLearnItem_'+learnItemId+' .answerValue').val()).toLowerCase();
	    var answerUser = $.trim($('#answerlearnItem_'+learnItemId+' .answerUser').val()).toLowerCase();
	    
	    var resultItem = {};
	    resultItem['lastShown'] = parseInt(new Date().setHours(0,0,0,0)/1000,10);
	    resultItem['longtermLevel'];
	    resultItem['learnItemId'] = learnItemId;
		resultItem['userId'] = loggedInUser;
	    
	    $('.resultLongterm').html('');
	    
	    //Procede if answer user not empty
	    if (answerUser != '') {	        
			if (answerUser == answerValue) {
				//Raise longterm level
				resultItem['longtermLevel'] = raiseLongtermLevel(longtermLevel);
				UpdateResultToDB(resultItem);
				$('.resultLongterm').html('<p class="green">Die Antwort is richtig.</p>');
				$('.answerUser').addClass('green');
			}
			else {
			    $('.resultLongterm').html('<p class="red">Die Antwort ist falsch.</p>');
			    $('.answerUser').addClass('red');
				//Sink longterm level
				resultItem['longtermLevel'] = sinkLongtermLevel(longtermLevel);
				UpdateResultToDB(resultItem);
			}
			$('#questionLearnItem_'+learnItemId+' .vocabLevel p.level').html(resultItem['longtermLevel']);
			var src = PATH_IMG_DEFAULT+'level_'+resultItem['longtermLevel']+'.png';
			$('#questionLearnItem_'+learnItemId+' span.vocabLevel > img').attr('src',src);
			$('.checkAnswer').hide();
			
			if (getCurrentLongtermItem() != parseInt($('.totalLearnItem').html(),10)){
				//$('.container.longterm a.next').show();
				$('.container.longterm a.next').css('display','inline-block');
			}
			else {
				$('.resultLongterm').append('<p><a class="button form-button" href="longterm.html">Zurück zur Fachauswahl</a></p>');
			}
		}
	});	
	
	//Function on enter Longterm (show Longterm Vocabulary from chosen Lesson)
	$('.longtermList').on('click','.enterLongterm',function(event){
		var liId = $(event.target).closest('li').attr('id');
		lessonData = {};
		lessonData['catId'] = liId.substring(9);
		
		//Hide introduction to Longterm
		$('div.longtermList').hide();
		
		//Show Longterm Content
		$('div.longtermLearn').show();
		$('.categoryName').html($('#'+liId + ' .longtermCategory').html());
		
		//Get Longterm Lesson for User
		GetLongtermFromLesson(loggedInUser, lessonData);
		
		//Prevent from Calling funtion twice
		event.stopPropagation();
	});
	
	//Function on click next question in longterm test
	$('.container.longterm').on('click','.rslides_nav.rslides1_nav.next',function(event) {
		//Remove class green or red from textarea
		if ($('.answerUser').hasClass('green')){
			$('.answerUser').removeClass('green');
		}
		else if ($('.answerUser').hasClass('red')){
			$('.answerUser').removeClass('red');
		}
		
		$('.checkAnswer').show();
		$('.resultLongterm').html('');
		
		//Get current item number for display purposes
		itemCounter = getCurrentLongtermItem();
		$('.countLearnItem').html(itemCounter);
		
		//Hide next button
		$('.container.longterm a.next').hide();
	});
});


//Get current Longterm Item (during testing)
function getCurrentLongtermItem(){
	var currentLongtermItem = '';		
	var liId = '';
	
	//Find visible Vocabulary
	$('.longtermContent li').each(function(){
	    if ($(this).hasClass('rslides1_on')) {
	        liId = $(this).attr('id');
	        currentLongtermItem = parseInt(liId.substring(10),10) + 1;
	    }
	});
	
	return currentLongtermItem;
}

//Raise the longterm level
function raiseLongtermLevel(longtermLevel) {
	if (longtermLevel > 0) {
		longtermLevel--;
	}
	var newLevel = longtermLevel;
	return newLevel;
}

//Sink longterm level
function sinkLongtermLevel(longtermLevel) {
	if (longtermLevel < 6) {
		longtermLevel++;
	}
	var newLevel = longtermLevel;
	return newLevel;
}
