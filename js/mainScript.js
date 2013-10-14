document.addEventListener("deviceready", onDeviceReady, false);

var db = '';

function onDeviceReady(){
	document.addEventListener("pause", onPause, false);
	document.addEventListener("resume", onResume, false);
	alert("Device is ready");
	
	db = window.openDatabase("test", "1.0", "Test DB", 1000000);
	
	db.transaction(createTable, errorCB, successCB);

}


function onPause(){
	alert("paused");
}

function onResume(){
	alert("resume");
}

function createTable(tx){
	//var createTable = 'CREATE TABLE IF NOT EXISTS';
	tx.executeSql('DROP TABLE IF EXISTS DEMO');
	//tx.executeSql(createTable + 'Users (id unique, data)');
	tx.executeSql('CREATE TABLE IF NOT EXISTS DEMO (id unique, data)');
	tx.executeSql('INSERT INTO DEMO (id, data) VALUES (1, "First row")');
    tx.executeSql('INSERT INTO DEMO (id, data) VALUES (2, "Second row")');

}

function errorCB(err){
	console.log("Error processing SQL: " + err.code);
}

function successCB() {
    db.transaction(queryDB, errorCB);
}

// Query the database
//
function queryDB(tx) {
    tx.executeSql('SELECT * FROM DEMO', [], querySuccess, errorCB);
}

// Query the success callback
//
function querySuccess(tx, results) {
    // this will be empty since no rows were inserted.
    console.log("Insert ID = " + results.insertId);
    // this will be 0 since it is a select statement
    console.log("Rows Affected = " + results.rowAffected);
    // the number of rows returned by the select statement
    console.log("Insert ID = " + results.rows.length);
}


