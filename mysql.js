"use strict";

var mysql = require("mysql");
var faker = require("faker");
var async = require("async");

var connection = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: ""
});

function createBD(callback){
	if (connection) {
		var sql = "CREATE DATABASE IF NOT EXISTS bd_performance_test";
		connection.query(sql, function(err, results) {
			if(err) throw err;

			// Setting DATABASE
			connection.query("USE bd_performance_test");
			callback();
		});
	}
}

function createTable() {
	var truncate = "TRUNCATE `user`";
	var table = "CREATE TABLE IF NOT EXISTS `user` (`id` INT NOT NULL auto_increment, `name` VARCHAR(255) ,`email` VARCHAR(255), `password` VARCHAR(255), PRIMARY KEY (`id`))";
	
	connection.query(table, function(err, results) {
		if (err) throw err;
		connection.query(truncate, function(err, results) {
			console.log("success", results);
		});
	});
}

function main() {
	createBD(createTable);
}

main();