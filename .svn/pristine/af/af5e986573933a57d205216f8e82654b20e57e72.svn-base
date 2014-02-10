/*
 * az61.db.userLesson
 *
 * Created: 21.11..2013
 * Author: Rebeca Kurz <rk@inmedias.de>
 * Company: team in medias GmbH
 */

//Gets longterm Items
function GetAllLongtermItems(userId) {
	db.transaction(function(tx) {
		doQuery(tx, 'SELECT * FROM Users WHERE UserId = '+userId+';',[],function(tx,result){
			if (result != null && result.rows != null) {
				if (result.rows.length != 0 && result.rows.length == 1){
					var row = result.rows.item(0);
	      			$('.userData span.level6').html(row.Level6);
	      			$('.userData span.level5').html(row.Level5);
	      			$('.userData span.level4').html(row.Level4);
	      			$('.userData span.level3').html(row.Level3);
	      			$('.userData span.level2').html(row.Level2);
	      			$('.userData span.level1').html(row.Level1);
	      			$('.userData span.level0').html(row.Level0);
				}
			}
		});
	});
	
	db.transaction(function(tx) {
		doQuery(tx, 'SELECT LearnItem.Timestamp AS lItemTimestamp, *, Lesson.CategoryId AS catId FROM Result '+
		'LEFT JOIN LearnItem ON Result.learnItem_id = LearnItem.LearnItemId '+
		'LEFT JOIN Lesson ON Lesson.LessonId = LearnItem.LessonId '+
		'LEFT JOIN Category ON Lesson.CategoryId = Category.CategoryId WHERE Result.user_id = ' + userId + ';', [],
	 	function(tx, result) {
			if (result != null && result.rows != null) {
				if (result.rows.length != 0){
					var categoryCount = 0;
					var categoryName = '';
					var learnItemCountTotal = 0;
					var learnItemCount = 0;
					
					var newCatId = 0;
					
					var categories = [];
					var categoryIds = [];
					
		    		for (var i = 0; i < result.rows.length; i++) {
		      			var row = result.rows.item(i);
		      					      			
		      			//categoryCount = categoryCount + row.count;
		      			var now = parseInt(new Date().getTime()/1000,10);
		      			
		      			var levelInfo = {};
		      			levelInfo['level6'] = $('.userData span.level6').html();
		      			levelInfo['level5'] = $('.userData span.level5').html();
		      			levelInfo['level4'] = $('.userData span.level4').html();
		      			levelInfo['level3'] = $('.userData span.level3').html();
		      			levelInfo['level2'] = $('.userData span.level2').html();
		      			levelInfo['level1'] = $('.userData span.level1').html();
		      			levelInfo['level0'] = $('.userData span.level0').html();
		      			
		      			var createListItem = false;
		      			createListItem = CheckIfDisplayItem(row.LongtermLevel, row.LastShown, now, row.lItemTimestamp, levelInfo);
		      			
		      			if (DEBUG_MODE) console.log(row.Question + ' ' + createListItem);
		      			
		      			var category = {};

		      			newCatId = row.catId;
		      			
		      			if (createListItem == true) {
		      				learnItemCountTotal++;
		      				if($.inArray(newCatId,categoryIds) == -1){
		      					categoryCount++;
			      				category['categoryName'] = row.CategoryName;
			      				category['categoryId'] = newCatId;
			      				category['categoryResultCount'] = 1;
			      				categories.push(category);
			      				categoryIds.push(newCatId);
		      				}
		      				
		      				else {
		      					if (categories.length > 0){
		      						var resObj = $.grep(categories, function(obj){ 
		      							return obj['categoryId'] === newCatId; 
	      							});
	      							
		      						if (resObj.length == 1) {
									  resObj[0]['categoryResultCount']++;
									}
		      					}
		      				}
		      			}
		        	}
		        	
		        	if(learnItemCountTotal != 0){
		        		var lessonText = 'Fächern';
			        	if (categoryCount == 1){
			        		lessonText = 'Fach';
			        	}
			        	
			        	$('.longtermCount').html('<p>Insgesamt: <span class="allLongtermItem">'+learnItemCountTotal+'</span> Vokabeln in <span class="cateCount">' + categoryCount + '</span> ' + lessonText + '</p>');
			        	
			        	var lastCat = 0;
			        	for (i=0;i<categories.length;i++){
			        		var tempCat = categories[i]['categoryId'];
			        		
			        		if (lastCat != tempCat){
			      				$('ul.longtermList').append('<li id="longterm_'+ categories[i]['categoryId'] +'"><span class="longtermCategory">'+ categories[i]['categoryName'] +':</span><span class="longtermCategory">'+ 
			      				categories[i]['categoryResultCount'] +'</span><span class="enterLongterm"><img class="enterLongtermIcon pointer" src="img/forward.png"></span></li>');
		      				}
		      				lastCat = tempCat;
			        	}
		        	}
		        	else {
			        	$('.longtermCount').html('<p>Heute gibt es keine Vokabeln zu lernen.</p>');
			        }
		        }
	      	}
		}, errorCB);
		
	},errorCB,nullHandler);
}

function GetLongtermFromLesson(userId, lessonData){
	db.transaction(function(tx) {
		doQuery(tx, 'SELECT Result.learnItem_id as lItemId,* FROM Result INNER JOIN LearnItem ON LearnItem.LearnItemId = Result.learnItem_id'+
		' INNER JOIN Lesson ON LearnItem.LessonId = Lesson.LessonId '+		
		' WHERE Lesson.CategoryId ='+lessonData['catId']+' AND Result.user_id ='+userId+' ORDER BY LearnItem.LearnItemId;', [],function(tx,result){
			if (result != null && result.rows != null) {
						
	    		for (var i = 0; i < result.rows.length; i++) {
	      			var row = result.rows.item(i);
	      			
	      			var now = parseInt(new Date().getTime()/1000,10);
	      			
	      			var levelInfo = {};
	      			levelInfo['level6'] = $('.userData span.level6').html();
	      			levelInfo['level5'] = $('.userData span.level5').html();
	      			levelInfo['level4'] = $('.userData span.level4').html();
	      			levelInfo['level3'] = $('.userData span.level3').html();
	      			levelInfo['level2'] = $('.userData span.level2').html();
	      			levelInfo['level1'] = $('.userData span.level1').html();
	      			levelInfo['level0'] = $('.userData span.level0').html();
	      			
	      			var createListItem = false;
	      			createListItem = CheckIfDisplayItem(row.LongtermLevel, row.LastShown, now, row.Timestamp, levelInfo);
	      			
	      			//If createItem = true create list item
	      			if (createListItem){
						$('.longtermContent ul').append('<li id="learnItemId_'+row.lItemId+'"></li>');
						
		      			$('.longtermContent li#learnItemId_'+row.lItemId).append('<div id="questionLearnItem_'+row.lItemId+'" class="question"><span class="header"></span>'+
		      			'<input class="longterm" type="text" readonly="readonly" value="'+row.Question+'"/><input class="answerValue" type="hidden" value="'+row.Answer+'"/>'+
		      			'<span class="vocabLevel"><img src="img/default/level_'+row.LongtermLevel+'.png" /><p class="level hidden">'+row.LongtermLevel+'</p></span></div><div id="answerlearnItem_'+row.lItemId+'" class="answer"><span class="header"></span>'+
		      			'<input class="longterm answerUser" type="text" name="answer" /></div>');
	      			}
	        	}
	      	}
	      	$(".rslides").responsiveSlides({
                auto: false,            // Boolean: Animate automatically, true or false
                pager: false,           // Boolean: Show pager, true or false
                nav: true,              // Boolean: Show navigation, true or false
                random: false,          // Boolean: Randomize the order of the slides, true or false
                pause: false,           // Boolean: Pause on hover, true or false
                pauseControls: true,    // Boolean: Pause when hovering controls, true or false
                prevText: "",           // String: Text for the "previous" button
                nextText: "Weiter",     // String: Text for the "next" button
                maxwidth: "",           // Integer: Max-width of the slideshow, in pixels
                navContainer: "div.longtermLearn",  // Selector: Where controls should be appended to, default is after the 'ul'
                manualControls: "",     // Selector: Declare custom pager navigation
            });
            
            itemCounter = getCurrentLongtermItem();
			$('.countLearnItem').html(itemCounter);
			
			var itemTotalCount = $('.longtermContent li').length;
			$('.totalLearnItem').html(itemTotalCount);
			
			});
	});
}

function CheckIfDisplayItem(longtermLevel, lastShown, now, timestamp, levelInfo){
	//Go through levels, check date last shown, only create list item, if date set in levels passed
	var level = parseInt(longtermLevel,10);
	if (lastShown < now){
		var timeDiff = now - lastShown;
		var diffDays = parseInt(timeDiff / (3600 * 24),10);
		switch (level) {
			case 6:			
				dayLearnItem = new Date(timestamp*1000).setHours(0,0,0,0);
				today = new Date().setHours(0,0,0,0);				
				//show learn item for level 6 also if it was created today
				if (levelInfo['level6'] == diffDays || dayLearnItem == today){
					createListItem = true;
				}
				else {
					createListItem = false;
				}
				break;
			case 5:
				if (levelInfo['level5'] == diffDays){
					createListItem = true;
				}
				else {
					createListItem = false;
				}
				break;
			case 4:
				if (levelInfo['level4'] == diffDays){
					createListItem = true;
				}
				else {
					createListItem = false;
				}
				break;
			case 3:
				if (levelInfo['level3'] == diffDays){
					createListItem = true;
				}
				else {
					createListItem = false;
				}
				break;
			case 2:
				if (levelInfo['level2'] == diffDays){
					createListItem = true;
				}
				else {
					createListItem = false;
				}
				break;
			case 1:
				if (levelInfo['level1'] == diffDays){
					createListItem = true;
				}
				else {
					createListItem = false;
				}
				break;
			case 0:
				if (levelInfo['level6'] == diffDays){
					createListItem = true;
				}
				else {
					createListItem = false;
				}
				break;
			default:
				break;
		}
	}
	
	return createListItem;
}

//Check when logged In / enter App User Studied the last time
function CheckForLastShown(userId){
	db.transaction(function(tx) {
		doQuery(tx, 'SELECT * FROM Users WHERE UserId = '+userId+';',[],function(tx,result){
			if (result != null && result.rows != null) {
				if (result.rows.length != 0 && result.rows.length == 1){
					var row = result.rows.item(0);
	      			$('.userData span.level6').html(row.Level6);
	      			$('.userData span.level5').html(row.Level5);
	      			$('.userData span.level4').html(row.Level4);
	      			$('.userData span.level3').html(row.Level3);
	      			$('.userData span.level2').html(row.Level2);
	      			$('.userData span.level1').html(row.Level1);
	      			$('.userData span.level0').html(row.Level0);
				}
			}
		});
	});
	
	db.transaction(function(tx) {
		doQuery(tx, 'SELECT * FROM Result WHERE user_id = '+userId+';',[],function(tx,result){
			if (result != null && result.rows != null) {
				if (result.rows.length != 0){
					for (var i = 0; i < result.rows.length; i++) {
						var row = result.rows.item(i);
						
						if(DEBUG_MODE) console.log('update');
						
			      		var level = parseInt(row.LongtermLevel,10);
			      		var now = parseInt(new Date().getTime()/1000,10);
			      		
			      		var levelInfo = {};
		      			levelInfo['level6'] = $('.userData span.level6').html();
		      			levelInfo['level5'] = $('.userData span.level5').html();
		      			levelInfo['level4'] = $('.userData span.level4').html();
		      			levelInfo['level3'] = $('.userData span.level3').html();
		      			levelInfo['level2'] = $('.userData span.level2').html();
		      			levelInfo['level1'] = $('.userData span.level1').html();
		      			levelInfo['level0'] = $('.userData span.level0').html();
		      			
		      			if(DEBUG_MODE) console.log('level6 ' + levelInfo['level6']);
			      		
			      		var updateLastShownDate = false;
			      		
			      		var updateItem = {};
			      		updateItem['learnItemId'] = row.learnItem_id;			      		
						updateItem['userId'] = userId;
			      		
						if (row.LastShown < now){
							var timeDiff = now - row.LastShown;
							var diffDays = parseInt(timeDiff / (3600 * 24),10);
							
							var d = new Date();
							
							switch (level) {
								case 6:			
									//Check if 
									if (levelInfo['level6'] < diffDays){
										//updateItem['lastShown'] = d.setDate(d.getDate() - levelInfo['level6']);
										updateLastShownDate = true;
									}
									else {
										updateLastShownDate = false;
									}
									break;
								case 5:
									//Downgrade to level 6
									if (levelInfo['level5'] < diffDays){
										//updateItem['lastShown'] = d.setDate(d.getDate() - levelInfo['level5']);
										updateLastShownDate = true;
									}
									else {
										updateLastShownDate = false;
									}
									break;
								case 4:
									if (levelInfo['level4'] < diffDays){
										//updateItem['lastShown'] = d.setDate(d.getDate() - levelInfo['level4']);
										updateLastShownDate = true;
									}
									else {
										updateLastShownDate = false;
									}
									break;
								case 3:
									if (levelInfo['level3'] < diffDays){
										//updateItem['lastShown'] = d.setDate(d.getDate() - levelInfo['level3']);
										updateLastShownDate = true;
									}
									else {
										updateLastShownDate = false;
									}
									break;
								case 2:
									if (levelInfo['level2'] < diffDays){
										//updateItem['lastShown'] = d.setDate(d.getDate() - levelInfo['level2']);
										updateLastShownDate = true;
									}
									else {
										updateLastShownDate = false;
									}
									break;
								case 1:
									if (levelInfo['level1'] < diffDays){
										//updateItem['lastShown'] = d.setDate(d.getDate() - levelInfo['level1']);
										updateLastShownDate = true;
									}
									else {
										updateLastShownDate = false;
									}
									break;
								case 0:
									if (levelInfo['level6'] < diffDays){
										//updateItem['lastShown'] = d.setDate(d.getDate() - levelInfo['level0']);
										updateLastShownDate = true;
									}
									else {
										updateLastShownDate = false;
									}
									break;
								default:
									updateLastShownDate = false;
									break;
							}
						}
						
						if (updateLastShownDate){
							updateItem['longtermLevel'] = row.LongtermLevel;
							updateItem['lastShown'] = d.setDate(d.getDate() - levelInfo['level'+row.LongtermLevel]);
							
							UpdateResultToDB(updateItem);
						}
					}
				}
			}
		});
	});
}

//Add Result to DB
function AddResultToDB(resultItem){
	var learnItemId = resultItem['learnItemId'];
	var userId = resultItem['userId'];
	var lastShown = resultItem['lastShown'];
	var longtermLevel = resultItem['longtermLevel'];
    
	db.transaction(function(tx) {
		doQuery(tx, 'INSERT INTO Result(user_id, learnItem_id, LastShown, LongtermLevel)'+
			'VALUES('+userId+','+learnItemId+',"'+lastShown+'",'+longtermLevel+')',[],querySuccessInsert);
	});
	
 	return;
}

//Update Result to the Database
function UpdateResultToDB(resultItem){
	var learnItemId = resultItem['learnItemId'];
	var userId = resultItem['userId'];
	var lastShown = resultItem['lastShown'];
	var longtermLevel = resultItem['longtermLevel'];
	
	var updateStatement = 'LastShown ="'+lastShown+'",LongtermLevel ='+longtermLevel;
	
	db.transaction(function(tx) {
		doQuery(tx, 'UPDATE Result SET '+ updateStatement +' WHERE user_id='+userId+' AND learnItem_id='+learnItemId+';',[],querySuccessUpdate);
	});
	return false;
}

//Remove Result from the Database
function DeleteResultFromDB(resultItem){
    var learnItemId = resultItem['learnItemId'];
    var userId = resultItem['userId'];
    
    var whereStatement = 'WHERE learnItem_id='+learnItemId;
    
    if (userId != 0 && userId != null){
    	whereStatement = whereStatement + ' AND user_id='+userId;
    }
    
    db.transaction(function(tx) {
        doQuery(tx, 'DELETE FROM Result ' + whereStatement +';',[],querySuccess);
    });
    return false;
}
