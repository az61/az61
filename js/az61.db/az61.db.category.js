/*
 * az61.db.manager
 *
 * Created: 14.10.2013
 * Author: Rebeca Kurz <rk@inmedias.de>
 * Company: team in medias GmbH
 */

//Gets all the Categories from the Database and displays them in the HTML-Code
function GetDBCategories(){
	if (!window.openDatabase) { 
  		alert('Databases are not supported in this browser.'); 
  		return; 
 	} 

	$('.category').html('');
	
	db.transaction(function(tx) {
		tx.executeSql('SELECT * FROM Category;', [], 
	 	function(tx, result) {
	  		if (result != null && result.rows != null) {
	    		for (var i = 0; i < result.rows.length; i++) {
	      			var row = result.rows.item(i);
	      			var catId = row.CategoryId;
	      			$('.category').append('<li class="cat" id="cat_'+ catId +'"><img class="folderIcon" src="'+ imgPath +'folder_closed.png" /><span>' + row.CategoryName + '</span></li>');
	      			$('.category li#cat_' + catId).append('<img class="deleteCategoryIcon pointer" src="'+ imgPath +'delete.png" /><br />'+
	      				'<button id="addLesson_'+ catId +'" class="addLessonClick">Lektion hinzufügen</button>');
							      			
	      			GetDBLessons(catId, setHtmlForLessons); 
	      			initBinding();			
	        	}
	      	}
		},errorCB);
	},errorCB,nullHandler);

	return;
}

//Adds a new category (Fach) to the Database
function AddCategoryToDB(categoryName) {
    db.transaction(function(tx) {
        doQuery(tx, 'SELECT CategoryName FROM Category WHERE CategoryName = "'+ categoryName +'"',[],function(tx,result){
            if (result != null && result.rows != null) {
                if (result.rows.length != 0){
                    $("#categoryExists").dialog( "open" );
                }
                else {
                    db.transaction(function(tx) {
                        doQuery(tx, 'INSERT INTO Category(CategoryName, OwnerId) VALUES ("'+categoryName+'",' + ownerID+')',[],nullHandler);
                    });
                }               
            }
        });
    });	
	return false; 
}

//Delete the chosen category from the database
function DeleteCategoryFromToDB(catId){
	db.transaction(function(tx) {
		tx.executeSql('DELETE FROM Category WHERE CategoryId = ' + catId + ';',[],nullHandler,errorCB); 
		tx.executeSql('DELETE FROM Lesson WHERE CategoryId = ' + catId + ';',[],nullHandler,errorCB);
		//tx.executeSql('DELETE FROM LearnItem WHERE LessonId = ' + lessonId + ';',[],nullHandler,errorCB);  
	});
	return;
}