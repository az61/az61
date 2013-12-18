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
	tx.executeSql(createTable + ' Lesson(LessonId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, LessonName TEXT NOT NULL, CategoryId INTEGER NOT NULL, OwnerId INTEGER NOT NULL)');
	tx.executeSql(createTable + ' Category(CategoryId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, CategoryName TEXT NOT NULL, OwnerId INTEGER NOT NULL)');	
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
				'VALUES("Administrator", "", "1","default","'+LEVEL6_DEFAULT+'","'+LEVEL5_DEFAULT+'","'+LEVEL4_DEFAULT+'","'+LEVEL3_DEFAULT+'","'+LEVEL2_DEFAULT+'","'+LEVEL1_DEFAULT+'",'+
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
}

function querySuccessUserInsert(tx, results) { 
    querySuccessInsert(tx, results); 
    
    GetDBUsers(loggedInUser);
    $("#userAddedSuccess").dialog( "open" );
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