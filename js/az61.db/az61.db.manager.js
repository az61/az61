function dbExists() {
	var bExists = false;
	
	if(!isClient) {
		var dbLocation = getDatabaseLocation();
		dbFileDir = new File(dbLocation);
		$.ajax({
			url: dbFileDir,
			success: function(data){
				bExists = true;
			},
			error: function(data) {
				bExists = false;
			},
		});
	}
	else {
		
	}
	
	return bExists;
}

function recoverDB(){
	
}

function setDBSystemDir(){

}

function createTable(tx){
	var createTable = 'CREATE TABLE IF NOT EXISTS';
	tx.executeSql(createTable + 'Users (id unique, data)');
	tx.executeSql(createTable + 'DEMO (id unique, data)');
	tx.executeSql(createTable + 'DEMO (id unique, data)');
	tx.executeSql(createTable + 'DEMO (id unique, data)');
	tx.executeSql(createTable + 'DEMO (id unique, data)');
	tx.executeSql(createTable + 'DEMO (id unique, data)');
	tx.executeSql(createTable + 'DEMO (id unique, data)');
	tx.executeSql(createTable + 'DEMO (id unique, data)');
	tx.executeSql(createTable + 'DEMO (id unique, data)');
	tx.executeSql(createTable + 'DEMO (id unique, data)');
	tx.executeSql(createTable + 'DEMO (id unique, data)');
	tx.executeSql(createTable + 'DEMO (id unique, data)');
	tx.executeSql(createTable + 'DEMO (id unique, data)');
	tx.executeSql(createTable + 'DEMO (id unique, data)');
	tx.executeSql(createTable + 'DEMO (id unique, data)');
	tx.executeSql(createTable + 'DEMO (id unique, data)');
}


function querySuccess(tx, results) {
	// this will be empty since no rows were inserted.
    console.log("Insert ID = " + results.insertId);
    // this will be 0 since it is a select statement
    console.log("Rows Affected = " + results.rowAffected);
    // the number of rows returned by the select statement
    console.log("Insert ID = " + results.rows.length);
}

function errorCB(err){
	console.log("Error processing SQL: " + err.code);
}

function successCB() {
    console.log("success!");
}

var db = window.openDatabase("Database", "1.0", "PhoneGap Demo", 200000);
db.transaction(createTable, errorCB);

