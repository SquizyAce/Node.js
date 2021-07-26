const mysql = require ("mysql2");
const connection = mysql.createConnection({
host: "localhost",
user: "mysql",
database: "GolovinDE",
password: "mysql"});

connection.connect(function(err){
	if(err){
		return console.error("Error: " + err.message);
	}
	else{
		console.log("Success");
	}
});