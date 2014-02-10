/*
 * az61.ui.lesson
 *
 * Created: 28.10.2013
 * Author: Rebeca Kurz <rk@inmedias.de>
 * Company: team in medias GmbH
 */

$(function() {
	var lessonId = 0;
	var categoryId = 0;
	var newLesson = false;
	//Click Events
	//Opens edit lesson Menu
	$(".category").on('click', 'li.lessonMenu', function () {
		lessonAttrId = $(event.target).attr('id');		
		lessonId = lessonAttrId.substr(8);
		
		catAttrId = $(event.target).closest('li.cat').attr('id');
		categoryId = catAttrId.substr(4);	
    	$("#lessonEditMenu").bPopup();
    });
    
    $(".category").on('click', '.lessonMenuIcon', function () {
		lessonAttrId = $(event.target).parent().attr('id');		
		lessonId = lessonAttrId.substr(8);
		
		catAttrId = $(event.target).closest('li.cat').attr('id');
		categoryId = catAttrId.substr(4);	
    	$("#lessonEditMenu").bPopup();
    });
	
	//Opens the Dialog to add new Lessons
	$(".category").on('click', '.addLessonClick', function(event){
		var cat = $(event.target).parent('button').attr('id');
		categoryId = cat.substring(10);
		//newLesson = true;
		
		var lessonName = prompt('Neue Lektion','Lektionstitel eingeben');
		
		if(lessonName != null){
			if (lessonName !=''){
				AddLessonToDB(categoryId,lessonName);
				ListDBValues();
			}
			else {
				alert('Bitte Lektionsnamen eingeben.');
			}
		}
	});
	
	//Add Clicks
	//Category Add
	$('#addCategory').click(function(){
		var categoryName = $('#txCategoryName').val();
		if (categoryName != ''){
			AddCategoryToDB(categoryName);
			$('#txCategoryName').val('');
			ListDBValues();
		}
		else {
			alert('Bitte Fachnamen eingeben');
		}
	});
	
	//Edit Clicks
	//Edit Lesson
	$('.editLesson ').click(function(event){	    
    	$('#lessonEditMenu').bPopup().close();    	   	
    	pageRedirectVocab(lessonId,categoryId);

	    return false;
	});
	
	//Rename Lesson
	$('.renameLesson ').click(function(event){	    
    	//newLesson = false;
    	$('#lessonEditMenu').bPopup().close();
    	var lessonName = $('li#lektion_'+lessonId).children('.lessonName').text();
		//$('#txLessonName').val(lessonName);
		
		var newLessonName = prompt('Neue Lektion',lessonName);
		
		if(newLessonName != null){
			if (newLessonName !=''){
				UpdateLessonToDB(lessonId, newLessonName);
				ListDBValues();
			}
			else {
				alert('Bitte Lektionsnamen eingeben.');
			}
		}
		
		//$("#lessonDialog").dialog( "open" );
		
	    return false;
	});
	
	//DeleteClicks
	//Delete Lesson
	$('.deleteLesson').click(function(event){
	    var del = confirm('Soll diese Lektion wirklich gelöscht werden?','Lektion löschen');
	    if (del){
	    	$('#lessonEditMenu').bPopup().close();
	    	DeleteLessonFromDB(lessonId);
	    	ListDBValues();
	    }
	    
	    return false;
	});	
	
	
	//Category Delete
	$('.category').on('click', '.deleteCategoryIcon', function(){
	  	var cat = $(this).parent().attr('id');
	  	var catId = cat.substring(4);
	  	
	  	var del = confirm('Soll das Fach wirklich gelöscht werden? \nAlle Lektionen, die in diesem Fach enthalten sind werden auch gelöscht.','Fach löschen');
	  	if (del){
			DeleteCategoryFromToDB(catId);
			ListDBValues();
		}
	});
});