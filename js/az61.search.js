var searchResultColor = 'yellow';

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
    	$('td').css('background-color','transparent');

    	var searchItem = $("#searchField").val();
    	if(searchItem != ''){
    		$('td:containsIn('+searchItem+')').css('background-color',searchResultColor);
    	}
    	
    });
    
    //When Search Button is clicked
    $( "#searchSubmit" ).click(function() {
    	var searchItem = $("#searchField").val();
        //var jump = $('td:contains('+searchItem+')').parent('tr');
        var jump = $('td:containsIn('+searchItem+')').parent('tr');
        jump.css('background-color',searchResultColor);
        $("body").scrollTop(jump.offset().top);
    });   
});
