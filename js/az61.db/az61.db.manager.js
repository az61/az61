/*
 * az61.db.manager
 *
 * Created: 14.10.2013
 * Author: Rebeca Kurz <rk@inmedias.de>
 * Company: team in medias GmbH
 */

function connectToDB(){
	if (!window.openDatabase) {
   		alert('Databases are not supported in this browser.'); 
   		return; 
 	}
 	
 	setDBNameAccordingToVersion();
 	
 	db = window.openDatabase(dbName, version, displayName,maxSize);
 	db.transaction (createTable, errorCB, successCB);
}

function setDBNameAccordingToVersion(){
	switch(appVersion) {
		case 'Kids':
			dbName = dbNamePre + 'kids';
			displayName = displayName + 'Kids';
			break;
		case 'Teens':
			dbName = dbNamePre + 'teens';
			displayName = displayName + 'Teens';
			break;
		case 'Standard':
			dbName = dbNamePre + 'standard';
			displayName = displayName + 'Standard';
			break;
		default:
			dbName = dbNamePre + 'standard';
			displayName = displayName + 'Standard';
	}
}

function createTable(tx){
	var createTable = 'CREATE TABLE IF NOT EXISTS';
	//tx.executeSql('DROP TABLE Lesson;');
	tx.executeSql(createTable + ' Lesson(LessonId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, LessonName TEXT NOT NULL, CategoryId INTEGER NOT NULL, OwnerId INTEGER NOT NULL)');
	//tx.executeSql('DROP TABLE Category;');
	tx.executeSql(createTable + ' Category(CategoryId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, CategoryName TEXT NOT NULL, OwnerId INTEGER NOT NULL)');	
	//tx.executeSql('DROP TABLE LearnItem;');
	tx.executeSql(createTable + ' LearnItem(LearnItemId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, Question TEXT NOT NULL, Answer TEXT NOT NULL, IsLongterm INTEGER NOT NULL, ' +
		'LessonId INTEGER NOT NULL, OwnerId INTEGER NOT NULL, Timestamp TEXT NOT NULL)');
	//tx.executeSql('DROP TABLE Result;');
	tx.executeSql(createTable + ' Result(user_id INTEGER NOT NULL, learnItem_id INTEGER NOT NULL, LastShown TEXT NOT NULL, LongtermLevel INTEGER NOT NULL)');
	//tx.executeSql('DROP TABLE Users;');
	tableExists(tx, "Users", function(status) {
		if (!status){
			tx.executeSql('CREATE TABLE Users(UserId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, UserName TEXT NOT NULL, Password TEXT NOT NULL, IsParent INTEGER NOT NULL, Theme TEXT NOT NULL,'+
				'Level6 INTEGER NOT NULL, Level5 INTEGER NOT NULL, Level4 INTEGER NOT NULL, Level3 INTEGER NOT NULL,Level2 INTEGER NOT NULL,Level1 INTEGER NOT NULL, Level0 INTEGER NOT NULL,'+
				'Sound INTEGER NOT NULL, EditOnFly INTEGER NOT NULL, Principle INTEGER NOT NULL, Language TEXT NOT NULL, HolidayActive INTEGER NOT NULL, EnterHoliday TEXT NOT NULL)');
			//Insert Default User
			tx.executeSql('INSERT INTO Users(UserName,Password,IsParent,Theme,Level6,Level5,Level4,Level3,Level2,Level1,Level0,Sound,EditOnFly,Principle,Language,HolidayActive,EnterHoliday)'+
				'VALUES("Administrator", "d41d8cd98f00b204e9800998ecf8427e", "1","default","'+LEVEL6_DEFAULT+'","'+LEVEL5_DEFAULT+'","'+LEVEL4_DEFAULT+'","'+LEVEL3_DEFAULT+'","'+LEVEL2_DEFAULT+'","'+LEVEL1_DEFAULT+'",'+
				'"'+LEVEL0_DEFAULT+'","0","1","' + LEITNER_PRINCIPLE + '","de","0","")');
		}
		
	});
	//tx.executeSql('DROP TABLE UserLessons;');
	tx.executeSql(createTable + ' UserLessons(user_id INTEGER NOT NULL, lesson_id)');
	
}

function tableExists(tx, tablename, callback){
	tx.executeSql('SELECT * FROM '+tablename, [], function(tx, resultSet) {
		if (resultSet.rows.length <= 0){
			callback(false);
		}
		else {
			callback(true);
		}
	}, function(err){
		callback(false);
	});
}

function doQuery(tx, query,values,successHandler){
	tx.executeSql(query, values, successHandler, errorHandler);
	
    function errorHandler(transaction, error) {
        console.log("Error processing SQL: " + error.message + " in " + query);
    }
}


function querySuccess(tx, results) {
	successLog(results);
}

function querySuccessInsert(tx, results) {	
    successLog(results);
    // this will be empty since no rows were inserted.
    console.log("Insert ID = " + results.insertId);
    
    ListDBValues();
}

function querySuccessUpdate(tx, results) {  
    successLog(results);
    ListDBValues();
}

function querySuccessUserInsert(tx, results) { 
    querySuccessInsert(tx, results); 
    
    GetDBUsers(loggedInUser);
    $("#userAddedSuccess").dialog( "open" );
}

function querySuccessUserDelete(tx, results) { 
    querySuccess(tx, results);    
    GetDBUsers(loggedInUser);
    $("#deleteUserDialog").dialog("open");
}

function querySuccessUpdate(tx, results) {	
    successLog(results);
    
    if (PATHNAME.indexOf('userSettings.html') != -1) {
    	$("#userUpdateSuccess").dialog( "open" );
    }
}

function querySuccessDelete(tx, results){    
    successLog(results);
}

function successLog(results){
	// this will be 0 since it is a select statement
    console.log("Rows Affected = " + results.rowsAffected);
    // the number of rows returned by the select statement
    console.log("Returned rows = " + results.rows.length);
}

function nullHandler(){};

function errorCB(tx, err){
	console.log("Error processing SQL: " + err.message);
}

function successCB() {
    console.log("success!");
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