/*
 * az61.db.manager
 *
 * Created: 14.10.2013
 * Author: Rebeca Kurz <rk@inmedias.de>
 * Company: team in medias GmbH
 */

//Connection to the databse
function connectToDB(){
	if (!window.openDatabase) {
   		alert('Databases are not supported in this browser.'); 
   		return; 
 	}
 	
 	setDBNameAccordingToVersion();
 	
 	db = window.openDatabase(DB_NAME, DB_VERSION, DB_DISPLAY_NAME,DB_MAX_SIZE);
 	db.transaction (createTable);
}

//This is not relevant yet, when updating the program to have different versions (kids, teen, standard) 
// this function sets the DB name according to the version
function setDBNameAccordingToVersion(){
	switch(APP_VERSION) {
		case 'Kids':
			DB_NAME = DB_NAME_PRE + 'kids';
			DB_DISPLAY_NAME = DB_DISPLAY_NAME + 'Kids';
			break;
		case 'Teens':
			DB_NAME = DB_NAME_PRE + 'teens';
			DB_DISPLAY_NAME = DB_DISPLAY_NAME + 'Teens';
			break;
		case 'Standard':
			DB_NAME = DB_NAME_PRE + 'standard';
			DB_DISPLAY_NAME = DB_DISPLAY_NAME + 'Standard';
			break;
		default:
			DB_NAME = DB_NAME_PRE + 'standard';
			DB_DISPLAY_NAME = DB_DISPLAY_NAME + 'Standard';
	}
}

//Create all tables
function createTable(tx){
	
	//doQuery(tx, 'Update Result SET LastShown = 1392073200 WHERE user_id = 1 AND learnItem_id = 21',[],querySuccess);
	
	tableExists(tx, "Lesson", function(status) {
		if (!status){
			//doQuery(tx,'DROP TABLE Lesson;',[],querySuccess);
			doQuery(tx, 'CREATE TABLE Lesson(LessonId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, LessonName TEXT NOT NULL, CategoryId INTEGER NOT NULL, OwnerId INTEGER NOT NULL)',[],querySuccess);
		}
		
	});
	
	tableExists(tx, "Category", function(status) {
		if (!status){
			//doQuery(tx,'DROP TABLE Category;',[],querySuccess);
			doQuery(tx,'CREATE TABLE Category(CategoryId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, CategoryName TEXT NOT NULL, OwnerId INTEGER NOT NULL)',[],querySuccess);
		}
		
	});
	
	tableExists(tx, "Category", function(status) {
		if (!status){
			//doQuery(tx,'DROP TABLE Category;',[],querySuccess);
			doQuery(tx, 'CREATE TABLE Category(CategoryId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, CategoryName TEXT NOT NULL, OwnerId INTEGER NOT NULL)',[],querySuccess);
		}
		
	});
	
	tableExists(tx, "LearnItem", function(status) {
		if (!status){
			//doQuery(tx,'DROP TABLE LearnItem;',[],querySuccess);
			doQuery(tx, 'CREATE TABLE LearnItem(LearnItemId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, Question TEXT NOT NULL, Answer TEXT NOT NULL, IsLongterm INTEGER NOT NULL, ' +
				'LessonId INTEGER NOT NULL, OwnerId INTEGER NOT NULL, Timestamp TEXT NOT NULL)',[],querySuccess);
		}
		
	});
	
	tableExists(tx, "Result", function(status) {
		if (!status){
			//doQuery(tx,'DROP TABLE Result;',[],querySuccess);
			doQuery(tx, 'CREATE TABLE Result(user_id INTEGER NOT NULL, learnItem_id INTEGER NOT NULL, LastShown TEXT NOT NULL, LongtermLevel INTEGER NOT NULL)',[],querySuccess);
		}
		
	});
	
	tableExists(tx, "Users", function(status) {
		if (!status){
			//doQuery(tx,'DROP TABLE Users;',[],querySuccess);
			doQuery(tx, 'CREATE TABLE Users(UserId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, UserName TEXT NOT NULL, Password TEXT NOT NULL, IsParent INTEGER NOT NULL, Theme TEXT NOT NULL,'+
				'Level6 INTEGER NOT NULL, Level5 INTEGER NOT NULL, Level4 INTEGER NOT NULL, Level3 INTEGER NOT NULL,Level2 INTEGER NOT NULL,Level1 INTEGER NOT NULL, Level0 INTEGER NOT NULL,'+
				'Sound INTEGER NOT NULL, EditOnFly INTEGER NOT NULL, Principle INTEGER NOT NULL, Language TEXT NOT NULL, HolidayActive INTEGER NOT NULL, EnterHoliday TEXT NOT NULL)',[],querySuccess);
			//Insert Default User
			doQuery(tx, 'INSERT INTO Users(UserName,Password,IsParent,Theme,Level6,Level5,Level4,Level3,Level2,Level1,Level0,Sound,EditOnFly,Principle,Language,HolidayActive,EnterHoliday)'+
				'VALUES("Administrator", "d41d8cd98f00b204e9800998ecf8427e", "1","default","'+LEVEL6_DEFAULT+'","'+LEVEL5_DEFAULT+'","'+LEVEL4_DEFAULT+'","'+LEVEL3_DEFAULT+'","'+LEVEL2_DEFAULT+'","'+LEVEL1_DEFAULT+'",'+
				'"'+LEVEL0_DEFAULT+'","0","1","' + LEITNER_PRINCIPLE + '","de","0","")',[],querySuccess);
		}
		
	});
	
	tableExists(tx, "UserLessons", function(status) {
		if (!status){
			//doQuery(tx,'DROP TABLE UserLessons;',[],querySuccess);
			doQuery(tx, 'CREATE TABLE UserLessons(user_id INTEGER NOT NULL, lesson_id)',[],querySuccess);
		}
		
	});
}

// Function to check if table exists
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

//This function ist important so that the error message can display the query that went wrong
function doQuery(tx, query,values,successHandler){
	tx.executeSql(query, values, successHandler, errorHandler);
	//Callback for error on query showing query
    function errorHandler(transaction, error) {
        if (DEBUG_MODE) console.log("Error processing SQL: " + error.message + " in " + query);
    }
}

//Callback for Success
function querySuccess(tx, results) {
	successLog(results);
}

//Callback for Successful Insert
function querySuccessInsert(tx, results) {	
    successLog(results);
    // this will be empty since no rows were inserted.
    if (DEBUG_MODE) console.log("Insert ID = " + results.insertId);
    
    ListDBValues();
}

//Callback for Successful Insert
function querySuccessUserLessonInsert(tx, results) {	
    successLog(results);
    // this will be empty since no rows were inserted.
    if (DEBUG_MODE) console.log("Insert ID = " + results.insertId);
}

//Callback for Successful Result Insert
function querySuccessInsertResult(tx, results) {	
    successLog(results);
    // this will be empty since no rows were inserted.
    if (DEBUG_MODE) console.log("Insert ID = " + results.insertId);
}

//Callback for Successful User Insert
function querySuccessUserInsert(tx, results) { 
    querySuccessInsert(tx, results); 
    
    GetDBUsers(loggedInUser);
    alert('Neuer Benutzer wurde erfolgreich angelegt.');
}

//Callback for Successful User Delete
function querySuccessUserDelete(tx, results) { 
    querySuccess(tx, results);    
    GetDBUsers(loggedInUser);
    alert('Benutzer wurde erfolgreich gelöscht.');
}

//Callback for Successful Update
function querySuccessUpdate(tx, results) {	
    successLog(results);
    
    if (PATHNAME.indexOf('userSettings.html') != -1) {
    	alert('Benutzerdaten wurden erfolgreich geändert.');
    }
    
    ListDBValues();
}

//Callback for Successful Update of results
function querySuccessUpdateResult(tx, results) {	
    successLog(results);
}

//Callback for Successful Delete
function querySuccessDelete(tx, results){    
    successLog(results);
}

function successLog(results){
	// this will be 0 since it is a select statement
    if (DEBUG_MODE) console.log("Rows Affected = " + results.rowsAffected);
    // the number of rows returned by the select statement
    if (DEBUG_MODE) console.log("Returned rows = " + results.rows.length);
}

function nullHandler(){};

function errorCB(tx, err){
	if (DEBUG_MODE) console.log("Error processing SQL: " + err.message);
}

function successCB() {
    if (DEBUG_MODE) console.log("success!");
}