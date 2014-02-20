/*
 * az61.ui.test
 *
 * Created: 20.12.2013
 * Author: Rebeca Kurz <rk@inmedias.de>
 * Company: team in medias GmbH
 */

$(function() {
	var counterRight = 0;	    
	var counterWrong = 0;
	var wrongLessonIds = [];
	
	//Check and uncheck boxes
	$('.container.test').on('click','input[type=checkbox]', function(event){
		var checked = false;
		
		//If checking no lessons, check if it is checked or unchecked
		if($(event.target).hasClass('noLessons')){
			if ($(event.target).is(':checked')){
				checked = false;
				
				$('.checkLesson').each(function(e){
					if ($(this).is(':checked')) {
		    			$(this).prop('checked',false);
		    		}
				});
			}
		}		
		//If checking all lessons, check if it is checked or unchecked
		else {
			if($(event.target).hasClass('all')){
				if ($(event.target).is(':checked')){
					checked = true;
					
					$('.checkLesson').each(function(e){
						if ($(this).is(':checked') == false) {
			    			$(this).prop('checked',true);
			    		}
					});
					
					$('.noLessons').prop('checked',false);
				}
				else {
					checked = false;
					
					$('.checkLesson').each(function(e){
						if ($(this).is(':checked')) {
			    			$(this).prop('checked',false);
			    		}
					});
				}
			}
		
			$('.checkLesson').each(function(e){
				if ($(this).is(':checked')) {
	    			checked = true;
	    		}
			});
		}
		
		if (checked){
			$('.enterTest').removeClass('inactive');
			$('.enterTest').addClass('active');
		}
		else {
			$('.enterTest').removeClass('active');
			$('.enterTest').addClass('inactive');
		}
		
		event.stopPropagation();
	});
	
	//On clicking reverse direction
	$('#reverseLearning').change(function(){
		var src = '';
		
		//Change image to reverse arrow
		if($('#reverseLearning').is(':checked')){
			src = PATH_IMG+'reverse_AQ.png';
		}
		
		else {
			src = PATH_IMG+'reverse_QA.png';
		}
		$('label.reverseLearning').css('background-image','url('+src+')');
		
		//Prevent from calling function twice
		event.stopPropagation();
	});
	
	//Enter Test with chosen lessons
	$('.container.test').on('click','.enterTest', function(event){
		var checkedLessons = [];
		
		$('li.lesson .checkLesson').each(function(e){
			if ($(this).is(':checked')) {
    			var liId = $(this).parent().attr('id');
    			var lessonId = liId.substr(7);
    			checkedLessons.push(lessonId);
    		}
		});
		
		if (checkedLessons.length != 0) {
			var reverse = false;
			
			if($('#reverseLearning').is(':checked')){
				reverse = true;
			}
		
			//Get all learnitems from lesson(s)
			GetLearnItemTestFromLesson(loggedInUser, checkedLessons.join(','),reverse);
			//Hide listing of lessons and show learning
			showTestLearnItems();
			
			//if no typing is checked - show Button "Antwort anzeigen", 
			// no checking of answer of user
			if($('.noTyping').is(':checked')){
				$('.showAnswer').show();
			}
			else {
				$('.checkAnswer').show();
			}
		}
		else {
			alert('Du muss eine Lektion auswählen um fortzufahren.');
		}
		
		//Prevent from calling function twice
		event.stopPropagation();
	});
	
	//On clicking answer show
	$('.showAnswer').on('click',function(event){
		var learnItemId = getIdOfCurrentItem();
		
		$('.answerUser').val($('#questionLearnItem_'+learnItemId+' .answerValue').val());
		
		//If current item was last, show result
		if (getCurrentLongtermItem() == parseInt($('.totalLearnItem').html(),10)){
			$('.container.test a.next').hide();
			$('.testLearn').append('<a class="button form-button back-button" href="classTest.html">Zurück zur Übersicht</a>');
		}
		else {
			//Display block important - so that background is not cut off and "Weiter" over the border of background
			$('.container.test a.next').css('display','inline-block');
		}
		
		$('.showAnswer').hide();
		
		//Prevent from calling function twice
		event.stopPropagation();
	});
	
	//On clicking answer check
	$('.checkAnswer').on('click',function(event){
		var learnItemId = getIdOfCurrentItem();
		
		var answerValue = $.trim($('#questionLearnItem_'+learnItemId+' .answerValue').val()).toLowerCase();
	    var answerUser = $.trim($('#answerlearnItem_'+learnItemId+' .answerUser').val()).toLowerCase();
	    var lessonId = parseInt($('#answerlearnItem_'+learnItemId+' .lessonIdItem').val(),10);
	    
	    $('.resultTest').html('');
	    $('.showResult').hide();
	    
	    //Procede only if answer is not empty
	    if (answerUser != '') {
			if (answerUser == answerValue) {
				$('.resultTest').html('<p class="green">Die Antwort war Richtig</p>');
				$('.answerUser').addClass('green');
				
				counterRight++;
			}
			else {
			    $('.resultTest').html('<p class="red">Die Antwort war Falsch</p>');
			    $('.answerUser').addClass('red');
			    
			    counterWrong++;
			    
			    if($.inArray(lessonId,wrongLessonIds) == -1){
			    	wrongLessonIds.push(lessonId);
			    }
			}
			
			//If current item was last, show result
			if (getCurrentLongtermItem() == parseInt($('.totalLearnItem').html(),10)){
				$('.container.test a.next').hide();
				$('.showResult').show();
				//$('.showResult').show();
			}
			else {
				//$('.container.test a.next').show();
				//Display block important - so that background is not cut off and "Weiter" over the border of background
				$('.container.test a.next').css('display','inline-block');
			}
			
			//Hide Check Answer after answer is checked (checking not possible twice)
			$('.checkAnswer').hide();
		}
		else {
			alert('Bitte Antwort eingeben, um fortzufahren.');
		}
		
		//Prevent from calling function twice
		event.stopPropagation();
	});
	
	$('.container.test').on('click','.rslides_nav.rslides1_nav.next',function(event) {
		//Hide divs and spans not to display during answer checking		
		$('.rslides_nav.rslides1_nav.next').hide();
		$('.resultTest').html('');
		$('.showResult').hide();
		
		//if no typing is checked - show Button "Antwort anzeigen", 
		// no checking of answer of user
		if($('.noTyping').is(':checked')){
			$('.showAnswer').show();
			$('.answerUser').val('');
		}
		else {
			$('.checkAnswer').show();
			
			//Remove class green or red from textarea
			if ($('.answerUser').hasClass('green')){
				$('.answerUser').removeClass('green');
			}
			else if ($('.answerUser').hasClass('red')){
				$('.answerUser').removeClass('red');
			}
		}
		
		//Get current item to display current slide
		itemCounter = getCurrentLongtermItem();
		$('.countLearnItem').html(itemCounter);
		
		var learnItemId = getIdOfCurrentItem();
		
		//Display current Lesson name
		var lessonName = $.trim($('#questionLearnItem_'+learnItemId+' .lessonNameItem').val());
		$('.lessonName').html(lessonName);
		
		if (getCurrentLongtermItem() == parseInt($('.totalLearnItem').html(),10)){
			$('.container.test a.next').hide();
		}
	});
	
	$('.container.test').on('click','.finish',function(event) {
		showTestSummary();
		$('.showResult').hide();
		getTestSummary();
		
		//Prevent from calling function twice
		event.stopPropagation();
	});
	
	$('.againTest').on('click',function(event) {
		GetLearnItemTestFromLesson(loggedInUser, wrongLessons.join(','));
		
		//Prevent from calling function twice
		event.stopPropagation();
	});
	
	//Count % of right and wrong answers
	function getTestSummary(){
		var counterTotal = parseInt($('.totalLearnItem').html(),10);
		
		var percRight = 0;
		var percWrong = 0;
		
		if (counterTotal != 0) {
			percRight = ((100/counterTotal)*counterRight).toFixed(0);
			percWrong = ((100/counterTotal)*counterWrong).toFixed(0);
		}

		$('.right .counter').html(counterRight);
		$('.wrong .counter').html(counterWrong);
		
		$('.right .percent').html(percRight);
		$('.wrong .percent').html(percWrong);
	}	
});

function getCurrentLongtermItem(){
	var currentLongtermItem = '';		
	var liId = '';
	
	//Find visible Vocabulary
	$('.testContent li').each(function(){
	    if ($(this).hasClass('rslides1_on')) {
	        liId = $(this).attr('id');
	        currentLongtermItem = parseInt(liId.substring(10),10) + 1;
	    }
	});
	
	return currentLongtermItem;
}

function getIdOfCurrentItem(){
	var liId = '';
	var learnItemId = 0;
	
	$('.testContent').find('li').each(function(){
	    if ($(this).hasClass('rslides1_on')) {
	        liId = $(this).find('div.question').attr('id');
	        learnItemId = liId.substring(18);
	    }
	});
	
	return learnItemId;
}

function showTestLearnItems(){
	$('.testLearn').show();
	$('.testSummary').hide();
	$('.testList').hide();
}

function showTestSummary(){
	$('.testLearn').hide();
	$('.testSummary').show();
	$('.testList').hide();
}

function showTestList(){
	$('.testLearn').hide();
	$('.testSummary').hide();
	$('.testList').show();
}