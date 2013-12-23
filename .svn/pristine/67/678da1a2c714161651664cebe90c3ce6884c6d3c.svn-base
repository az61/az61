/*
 * az61.ui.longterm
 *
 * Created: 28.10.2013
 * Author: Rebeca Kurz <rk@inmedias.de>
 * Company: team in medias GmbH
 */

$(function() {
	var itemCounter = 0;
	
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
	    resultItem['lastShown'] = parseInt(new Date().getTime()/1000,10);
	    resultItem['longtermLevel'];
	    resultItem['learnItemId'] = learnItemId;
		resultItem['userId'] = loggedInUser;
	    
	    $('.resultLongterm').html('');
	    if (answerUser != '') {	        
			if (answerUser == answerValue) {
				resultItem['longtermLevel'] = raiseLongtermLevel(longtermLevel);
				UpdateResultToDB(resultItem);
				$('.resultLongterm').html('<p class="green">Die Antwort war richtig.</p>');
			}
			else {
			    $('.resultLongterm').html('<p class="red">Die Antwort entspricht nicht der eigentlichen Antwort.</p>');
				//Sink longterm level
				resultItem['longtermLevel'] = sinkLongtermLevel(longtermLevel);
				UpdateResultToDB(resultItem);
			}
			$('#questionLearnItem_'+learnItemId+' .vocabLevel p.level').html(resultItem['longtermLevel']);
			var src = PATH_IMG_DEFAULT+'level_'+resultItem['longtermLevel']+'.png';
			$('span.vocabLevel > img').attr('src',src);
			$('.checkAnswer').hide();
			
			if (getCurrentLongtermItem() != parseInt($('.totalLearnItem').html(),10)){
				$('.container.longterm a.next').show();
			}
			else {
				$('.resultLongterm').append('<p><a class="button" href="langzeit.html">Zurück zur Fachauswahl</a></p>');
			}
		}
	});	
	
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
	
	$('.container.longterm').on('click','.rslides_nav.rslides1_nav.next',function(event) {
		$('.checkAnswer').show();
		$('.resultLongterm').html('');
		itemCounter = getCurrentLongtermItem();
		$('.countLearnItem').html(itemCounter);
		$('.container.longterm a.next').hide();
	});
});

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

function raiseLongtermLevel(longtermLevel) {
	if (longtermLevel > 0) {
		longtermLevel--;
	}
	var newLevel = longtermLevel;
	return newLevel;
}

function sinkLongtermLevel(longtermLevel) {
	if (longtermLevel < 6) {
		longtermLevel++;
	}
	var newLevel = longtermLevel;
	return newLevel;
}
