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
		newLesson = true;
		//$("#addLessonDialog_"+catId).dialog( "open" );
		$("#lessonDialog").dialog( "open" );
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
			$("#categoryNameMissingDialog").dialog( "open" );
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
    	newLesson = false;
    	$('#lessonEditMenu').bPopup().close();
    	var lessonName = $('li#lektion_'+lessonId).children('.lessonName').text();
		$('#txLessonName').val(lessonName);
		  	  			
		$("#lessonDialog").dialog( "open" );
		
	    return false;
	});
	
	//DeleteClicks
	//Delete Lesson
	$('.deleteLesson').click(function(event){
	    var del = confirm('Soll diese Lektion wirklich gelöscht werden?');
	    if (del){
	    	$('#lessonEditMenu').bPopup().close();
	    	DeleteLessonFromDB(lessonId);
	    	ListDBValues();
	    }
	    else {
			console.log('nicht löschen');
		}
	    return false;
	});	
	
	
	//Category Delete
	$('.category').on('click', '.deleteCategoryIcon', function(){
	  	var cat = $(this).parent().attr('id');
	  	var catId = cat.substring(4);
	  	
	  	var del = confirm('Soll das Fach wirklich gelöscht werden? \nAlle Lektionen, die in diesem Fach enthalten sind werden auch gelöscht.');
	  	if (del){
			DeleteCategoryFromToDB(catId);
			ListDBValues();
		}
		else {
			console.log('nicht löschen');
		}
	});
	
	//Dialogs
	//Dialog for missing category name
	$("#categoryNameMissingDialog").dialog({
	  autoOpen: false,
      modal: true,
      buttons: {
        Ok: function() {
          $( this ).dialog( "close" );
        }
      }
    });
    
    //Dialog for missing lesson name
	$("#lessonNameMissingDialog").dialog({
	  autoOpen: false,
      modal: true,
      buttons: {
        Ok: function() {
          $( this ).dialog( "close" );
        }
      }
    });
    
    $("#lessonExists").dialog({
      autoOpen: false,
      modal: true,
      buttons: {
        Ok: function() {
          $( this ).dialog( "close" );
        }
      }
    });
    
    $("#categoryExists").dialog({
      autoOpen: false,
      modal: true,
      buttons: {
        Ok: function() {
          $( this ).dialog( "close" );
        }
      }
    });
    
    //Dialog for adding or editing Lesson 
    $("#lessonDialog").dialog({
		  autoOpen: false,
		  //height: 200,
		  width: 350,
		  modal: true,
		  buttons: {
		  	"Lektion speichern": function() {
		  	  	var lessonName = $('#txLessonName').val();
		  	  	if (lessonName != '') {
		  	  		if (newLesson){
		  	  			AddLessonToDB(categoryId,lessonName);
		  	  		}
		  	  		else {
		  	  			UpdateLessonToDB(lessonId, lessonName);
		  	  		}
		  			
		  			ListDBValues();		  			  			
		  			$(this).dialog("close");		  			
		  		}
		  		else {
					$("#lessonNameMissingDialog").dialog("open");
				}
		  		
		  	},
		  	"Abbrechen": function(){
		  		$(this).dialog("close");		  		
		  	}
		  },
		  close: function(){
		  	$('#txLessonName').val('');
		  }
	});
});