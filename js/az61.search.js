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
    		var jump = $('.vocabulary td:containsIn('+searchItem+')').parent('tr');
	        //jump.css('background-color',searchResultColor);
	        $("body").scrollTop(jump.offset().top);
    	}
    	else {
    		alert('Bitte etwas in die Suche eingeben.');
    	}        
    });   
});
