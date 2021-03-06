"use strict";

var mysql2 = require('mysql2');
var faker = require("faker");
var async = require("async");

var connection = mysql2.createConnection({
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
				console.timeEnd('node-mysql insert');
				cb();
			} else {
				execute(cb);
			}
		});
	}

	console.time('node-mysql insert');
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
				console.timeEnd('node-mysql update');
				cb();
			} else {
				execute(cb);
			}
		});
	}

	console.time('node-mysql update');
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
				console.timeEnd('node-mysql select')
				cb();
			} else {
				execute(cb);
			}
		});
	}

	console.time('node-mysql select');
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
				console.timeEnd('node-mysql delete');
				cb();
			} else {
				execute(cb);
			}
		});
	}

	console.time('node-mysql delete');
	execute(callback);
}

function main(cb) {
	console.log("\n### NODE-MYSQL2 (", LIMIT, 'rows): ');
	async.series([
		createBD,
		createTable,
		insert,
		update,
		select,
		deleteRows
	], function(err, results) {
		if(err) throw new Error(err);
		cb();
	});
}

module.exports = {
	main: main
}