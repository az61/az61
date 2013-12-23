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
		var innerJoin = '';
		var where = '';
		
		if (loggedInUser != 1){
			innerJoin = ' LEFT JOIN UserLessons ON Lesson.LessonId = UserLessons.lesson_id';
			where = ' WHERE UserLessons.user_id ='+loggedInUser + ' OR Category.OwnerId = '+loggedInUser;
		}
		
		doQuery(tx, 'SELECT * FROM Category LEFT JOIN Lesson ON Category.CategoryId = Lesson.CategoryId'+ innerJoin + where +' GROUP BY Category.CategoryName;', [],function(tx,result){
			if (result != null && result.rows != null) {
				if (result.rows.length != 0){
				    console.log(result.rows.length);
					for (var i = 0; i < result.rows.length; i++) {
		      			var row = result.rows.item(i);
		      			var catId = row.CategoryId;
		      			$('.category').append('<li class="cat" id="cat_'+ catId +'"><img class="folderIcon" src="'+ imgPath +'folder_closed.png" /><span class="cat-title">' + row.CategoryName + '</span></li>');
		      			$('.category li#cat_' + catId).append('<img class="deleteCategoryIcon pointer" src="'+ imgPath +'delete-w.png" /><br />'+
		      				'<button id="addLesson_'+ catId +'" class="addLessonClick">Lektion hinzufügen</button>');
								      			
		      			GetDBLessons(catId, setHtmlForLessons); 
		      			initBinding();			
		        	}
		        }
		        else {
		        	$('.category').append('<p>Für dich stehen momentan noch keine Fächer zur Verfügung. Lege ein eigenes Fach an oder bitte den Administrator darum, dir Lektionen zuzuweisen.</p>');
		        }
	      	}
		});
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
                        doQuery(tx, 'INSERT INTO Category(CategoryName, OwnerId) VALUES ("'+categoryName+'",' + ownerID+')',[],querySuccessInsert);
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
        doQuery(tx, 'SELECT * FROM Lesson WHERE CategoryId = ' + catId + ';', [],function(tx,result){
            if (result != null && result.rows != null) {
                if (result.rows.length != 0) {            
                    for (var i = 0; i < result.rows.length; i++) {
                        var row = result.rows.item(i);
                        var lessonId = row.LessonId;
                        //Delete Result before Vocabulary
                        var removeResult = true;    
                        GetDBVocabulary(lessonId, removeResult);
                        
                        //Delete Vocabulary
                        db.transaction(function(tx) {
                            doQuery(tx, 'DELETE FROM LearnItem WHERE LessonId = ' + lessonId + ';',[],querySuccess);
                        });
                        
                        //Delete UserLesson with this lessonId
                        db.transaction(function(tx) {
                            doQuery(tx, 'DELETE FROM UserLessons WHERE lesson_id = ' + lessonId + ';',[],querySuccess);
                        });
                    }
                }
            }
        });        
    
		doQuery(tx, 'DELETE FROM Lesson WHERE CategoryId = ' + catId + ';',[],nullHandler);
		doQuery(tx, 'DELETE FROM Category WHERE CategoryId = ' + catId + ';',[],nullHandler); 
	});
	return;
}