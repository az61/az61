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
	
	//Opens the Dialog to add new Lessons
	$(".category").on('click', '.addLessonClick', function(event){
		var cat = $(event.target).parent('button').attr('id');
		categoryId = cat.substring(10);
		
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
		
		return false;
	});
	
	//Function to Category Add
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
		
		return false;
	});
	
	//Open Menu on Top with Edit Icons on row click
	$(".category").on('click', 'li.lessonMenu', function () {
		//First hide Menu if it's visible and reset chosen row
		$('.editMenu.row').hide();
		$('li.lessonMenu').each(function(){
			$(this).removeClass('active');
		});
		
		lessonAttrId = $(this).attr('id');		
		lessonId = lessonAttrId.substr(8);
		
		catAttrId = $(this).closest('li.cat').attr('id');
		categoryId = catAttrId.substr(4);
		
		//Open top menu	
    	$('.editMenu.row').slideToggle();
    	$(this).addClass('active');
    	
    	return false;
    });
   
   //Hide TopMenu Icons on finished click
    $('.finished').click(function(event){	    
    	$('.editMenu.row').hide();
    	$('li#lektion_' + lessonId).removeClass('active');

	    return false;
	});
	
	//Edit Lesson
	$('.editLesson ').click(function(event){
    	$('.editMenu.row').hide();
    	$('li#letion_' + lessonId).removeClass('active');
    	
    	pageRedirectVocab(lessonId,categoryId);

	    return false;
	});
	
	//Rename Lesson
	$('.renameLesson ').click(function(event){	    
    	$('.editMenu.row').hide();
    	$('li#letion_' + lessonId).removeClass('active');
    	
    	var lessonName = $('li#lektion_'+lessonId).children('.lessonName').text();
		
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
		
	    return false;
	});
	
	//Delete Lesson
	$('.deleteLesson').click(function(event){
		$('.editMenu.row').hide();
		$('li#letion_' + lessonId).removeClass('active');
		
	    var del = confirm('Soll diese Lektion wirklich gelöscht werden?','Lektion löschen');
	    if (del){
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
		
		return false;
	});
	
	//Category Rename
	$('.category').on('click', '.renameCategoryIcon', function(){
	  	var cat = $(this).parent().attr('id');
	  	var catId = cat.substring(4);

	  	var catName = $('li#cat_' + catId).children('.cat-title').html();

		var newCatName = prompt('Fach umbennen',catName);
		
		if(newCatName != null){
			if (newCatName !=''){
				UpdateCategoryToDB(catId, newCatName);
			}
			else {
				alert('Bitte Fachnamen eingeben.');
			}
		}
		
		return false;
	});
});