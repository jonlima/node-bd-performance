"use strict";

var async = require('async');
var mysqlTest = require('./mysql.js');
var mysql2Test = require('./node-mysql2.js');

function main() {
	async.series([
		mysqlTest.main,
		mysql2Test.main
	], function(err, results) {
		process.exit(1);
	})
}

main();