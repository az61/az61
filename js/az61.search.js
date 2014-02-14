var searchResultColor = 'rgba(255, 255, 0, 0.5)';

//Create new contains selector
$.extend($.expr[":"], {
	"containsIn": function(elem, i, match, array) {
		return (elem.textContent || elem.innerText || "").toLowerCase().indexOf((match[3] || "").toLowerCase()) >= 0;
	}
});


$(function() {	
	
	availableVocabulary = [];

	$('td.question').each(function (i, e) {
		availableVocabulary.push($(e).text());
	});
	
	$('td.answer').each(function (i, e) {
		availableVocabulary.push($(e).text());
	});
	
	$( "#searchField" ).autocomplete({
      source: availableVocabulary
    });
    
    $("#searchField").keyup(function() {
    	//Show reset image
    	$('.resetSearch').show();
    	
    	$('.vocabulary td').css('background-color','transparent');

    	var searchItem = $("#searchField").val();
    	if(searchItem != ''){
    		$('.vocabulary td:containsIn('+searchItem+')').css('background-color',searchResultColor);
    	}
    	
    });
    
    //When Search Button is clicked
    $( "#searchSubmit" ).click(function() {
    	var searchItem = $("#searchField").val();
    	
    	if (searchItem != null && searchItem != ''){
    		//Define row that has td that maches search - jump to that row
    		var jump = $('.vocabulary td:containsIn('+searchItem+')').parent('tr');
    		if (typeof jump === 'undefined'){
    			$("body").scrollTop(jump.offset().top);
    		}
    	}
    	else {
    		alert('Bitte etwas in die Suche eingeben.');
    	}        
    });
    
    //When reset search is clicked - empty input, hide image
    $('.resetSearch').click(function(){
    	$('#searchField').val('');
    	//Hide reset image
    	$('.resetSearch').hide();
    	//reset background color
    	$('.vocabulary td').css('background-color','transparent');
    }); 
});
