"use strict";

var mysql = require("mysql");
var faker = require("faker");
var async = require("async");

var connection = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: ""
});

var LIMIT = 1;

function createBD(callback){
	if (connection) {
		var sql = "CREATE DATABASE IF NOT EXISTS bd_performance_test";
		connection.query(sql, function(err, results) {
			if(err) throw err;
			callback();
		});
	}
}

function createTable(callback) {
	var truncate = "TRUNCATE bd_performance_test.user";
	var table = "CREATE TABLE IF NOT EXISTS bd_performance_test.user (`id` INT NOT NULL auto_increment, `name` VARCHAR(255) ,`email` VARCHAR(255), `password` VARCHAR(255), PRIMARY KEY (`id`))";
	
	connection.query(table, function(err, results) {
		if (err) throw err;
		connection.query(truncate, function(err, results) {
			callback();
		});
	});
}

function insert(callback) {
	var done = 0;

	var execute = function (cb) {
		var name = faker.name.findName();
		var email = faker.internet.email();
		var pass = faker.internet.password();
		var sql = "INSERT INTO bd_performance_test.user (`name`, `email`, `password`) VALUES (?, ?, ?)";

		connection.query(sql, [name, email, pass], function(err, results) {
			if(err) throw new Error(err);
			done++;
			if (done === LIMIT) {
				cb();
			} else {
				execute(cb);
			}
		});
	}

	console.time('mysql insert');
	execute(callback);
}

function update(callback) {
	var done = 0;

	var execute = function (cb) {
		var name = faker.name.findName();
		var sql = "UPDATE bd_performance_test.user SET name = ? WHERE id = ?";

		connection.query(sql, [name, done+1], function(err, results) {
			if(err) throw new Error(err);
			done++;
			if (done === LIMIT) {
				cb();
			} else {
				execute(cb);
			}
		});
	}

	console.time('mysql update');
	execute(callback);
}

function select(callback) {
	var done = 0;

	var execute = function (cb) {
		var sql = "SELECT * FROM bd_performance_test.user WHERE id = ?";

		connection.query(sql, [done+1], function(err, results) {
			if(err) throw new Error(err);
			done++;
			if (done === LIMIT) {
				cb();
			} else {
				execute(cb);
			}
		});
	}

	console.time('mysql select');
	execute(callback);
}

function deleteRows(callback) {
	var done = 0;

	var execute = function (cb) {
		var sql = "DELETE FROM bd_performance_test.user WHERE id = ?";

		connection.query(sql, [done+1], function(err, results) {
			if(err) throw new Error(err);
			done++;
			if (done === LIMIT) {
				cb();
			} else {
				execute(cb);
			}
		});
	}

	console.time('mysql delete');
	execute(callback);
}

function main() {
	createBD(function(){
		createTable(function(){
			insert(function(){
				console.timeEnd('mysql insert');
				update(function() {
					console.timeEnd('mysql update');
					select(function() {
						console.timeEnd('mysql select')
						deleteRows(function(){
							console.timeEnd('mysql delete');
							process.exit(1);
						})
					})
				});
			});
		})
	})
}

main();