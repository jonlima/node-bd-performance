"use strict";

var mysql = require("mysql");
var faker = require("faker");
var async = require("async");

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: ''
});

function createBD(conn){
	conn.connect(function(err) {
		if(err) {
			console.log('error connecting: ' + err.stack);
			return false;
		}

		var sql = 'CREATE DATABASE IF NOT EXISTS bd_performance_test'
		conn.query(sql, function(err, results) {console.log("vall");
			if(err) throw err;
			process.exit(1);
		});
	});
}