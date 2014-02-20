/*
 * az61.ui.vocabulary
 *
 * Created: 24.10.2013
 * Author: Rebeca Kurz <rk@inmedias.de>
 * Company: team in medias GmbH
 */

$(function() {
	var question = $("#txVocabQuestion").val(),
		answer = $('#txVocabAnswer').val(),
		allFields = $([]).add(question).add(answer);
	var vocabId = 0;
	var newVocab = false;	
	
	//On Click checkbox for checking longterm
	$('.lessonContent').on('click', '.isLongterm', function(event){
		//Hhide Menu if it's visible
		$('.editMenu.row').hide();
		
		var checkboxId = $(event.target).attr('id');
    	var newLearnItem = {};
    	newLearnItem['id'] = checkboxId.substring(13);
		newLearnItem['question'] = '';
		newLearnItem['answer'] = '';
		
		resultItem = {};
		resultItem['learnItemId'] = checkboxId.substring(13);
		resultItem['userId'] = loggedInUser;
		var date = new Date();
    	var yesterday = parseInt(date.setDate(date.getDate() - 1)/1000,10);
    	yesterday = new Date(yesterday).setHours(0,0,0,0)/1000;
    	
        resultItem['lastShown'] = yesterday;
		resultItem['longtermLevel'] = 6;
		
    	var checked = 99;
    	if ($('#'+checkboxId).is(':checked')) {
    		checked = 1;
    		AddResultToDB(resultItem);
    	}
    	else {
    		checked = 0;
    		DeleteResultFromDB(resultItem);
    	}   	

		newLearnItem['isLongterm'] = checked;		
    	
    	UpdateVocabularyToDB(newLearnItem);
    	
    	//Prevent from Calling funtion twice
		event.stopPropagation();
	});
	
	$(".lessonContent").on('click', '.vocabulary tbody > tr', function (event) {
		//First hide Menu if it's visible and reset chosen row
		$('.editMenu.row').hide();
		$('.vocabulary tr').each(function(){
			$(this).removeClass('active');
		});
		
		// Open Top menu
		$('.editMenu.row').slideDown();
	    $(this).addClass('active');
	    
	    var trId = $(this).attr('id');
	    vocabId = trId.substring(6);
	    
	    //Prevent from Calling funtion twice
		event.stopPropagation();
		
	    return false;
    });	
	
	//Hide TopMenu Icons on finished click
    $('.finished').click(function(event){	    
    	$('.editMenu.row').hide();
    	$('tr#vocab_' + vocabId).removeClass('active');
    	
	    return false;
	});
	
	//Delete Vocab
	$('.deleteVocab').click(function(event){
		//Show Top Edit Menu
		$('.editMenu.row').hide();
		$('tr#vocab_' + vocabId).removeClass('active');
		
	    var del = confirm('Soll diese Vokabel wirklich gelöscht werden?');
	    if (del){	    	
	    	DeleteVocabularyFromDB(vocabId);
	    	
	    	resultItem = {};
	    	resultItem['userId'] = 0;
	    	resultItem['learnItemId'] = vocabId;    		
	    	DeleteResultFromDB(resultItem);
    
	    	ListDBValues();
	    }
	    
	    //Prevent from Calling funtion twice
		event.stopPropagation();
	    
	    return false;
	});
	
	//Edit Vocab
	$('.editVocab').click(function(event){
		//Hide Top Edit Menu
		$('.editMenu.row').hide();
		$('tr#vocab_' + vocabId).removeClass('active');
		
		//Show LearnItem Form area
		$('.addLearnItem').slideToggle();
		$('#create-vocabulary').hide();
		
		var question = $('tr#vocab_'+vocabId + ' .question').children('input.full').val();
		var answer = $('tr#vocab_'+vocabId + ' .answer').children('input.full').val();
		var isLongterm = $('tr#vocab_'+vocabId).find('td .isLongterm').is(":checked");
		
		$('#txVocabQuestion').val(question);
		$('#txVocabAnswer').val(answer);
		if (isLongterm){
			$('#txIsLongterm').attr('checked', true);
		}
		else {
			$('#txIsLongterm').attr('checked', false);
		}
		newVocab = false;
		
		//Prevent from Calling funtion twice
		event.stopPropagation();
	});
	
	//On Click open form to create new vocabulary
	$( "#create-vocabulary" )
		.button()
		.click(function() {
			newVocab = true;
			$('.addLearnItem').slideToggle();
			$('#create-vocabulary').hide();
		}); 
	
	//Save Learn Item
	$('.saveLearnItem').click(function(){
		var newLearnItem = [];
		newLearnItem['id'] = vocabId;	
		newLearnItem['question'] = $('#txVocabQuestion').val();
  		newLearnItem['answer'] = $('#txVocabAnswer').val();
  		newLearnItem['date'] = parseInt(new Date().setHours(0,0,0,0)/1000,10);
  		newLearnItem['isLongterm'] = 0;
		
		if($('#txIsLongterm').is(":checked")){
			newLearnItem['isLongterm'] = 1;
		}
  						
		if(newLearnItem['question'] != '' && newLearnItem['answer'] != ''){
			if (newVocab) {
				AddVocabularyToDB(lesID, newLearnItem);
			}
			else {
				UpdateVocabularyToDB(newLearnItem);
			}
			//Close Learn Item Form area
			$('.addLearnItem').slideToggle();
			$('#create-vocabulary').slideToggle();
			
			emptyLearnItemInput();
		}
		else {
			alert('Bitte fülle beide Vokabelfelder aus.');
		}
		
		//Prevent from Calling funtion twice
		event.stopPropagation();
	});
	
	//Cancel Learn Item Dialog
	$('.cancelLearnItem').click(function(){
		$('.addLearnItem').slideToggle();
		$('#create-vocabulary').slideToggle();
		emptyLearnItemInput();
		
		//Prevent from Calling funtion twice
		event.stopPropagation();
	});
	
	//Vocabulary Sorting
	//Sort Vocabulary by Question and Answer	
    var thSort = $('table.tablesorter th.sort-header'),
        inverse = true;
    
    thSort.click(function(event){
        sortVocabulary($(event.target));
        
        return false;
    });

	thSort.children('img').click(function(event){
		sortVocabulary($(event.target).parent());
		
		return false;
	});
    
    
    function sortVocabulary(header){
        var index = header.index();
    
        header
            .closest('table')
            .find('td')
            .filter(function(){
                return $(this).index() === index;
            })
            .sort(function(a, b){
                
                a = $(a).text().toLowerCase();
                b = $(b).text().toLowerCase();
                
                return (
                    isNaN(a) || isNaN(b) ?
                        a > b : +a > +b
                    ) ?
                        inverse ? -1 : 1 :
                        inverse ? 1 : -1;
                    
            }, function(){
                return this.parentNode;
            });
        
        inverse = !inverse;
        
        //Add Asc or Desc Class
        var src = '';
        if (inverse) {
        	$(header).removeClass('sortDesc').addClass('sortAsc');
        	src = PATH_IMG+'bt_a.png';
        	
        }
        else {
        	$(header).removeClass('sortAsc').addClass('sortDesc');
        	src = PATH_IMG+'bt_z.png';
        }
        
        $(header).children('img').attr('src',src);
        
        $('.vocabulary tbody tr').removeClass('alternate');
        $('.vocabulary tbody tr:nth-child(even)').addClass('alternate');
    }
});

function emptyLearnItemInput(){
	$("#txVocabQuestion").val('');
	$('#txVocabAnswer').val('');
}
