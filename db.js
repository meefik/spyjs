var mysql = require('mysql');
var db_conf = require('./dbconf.json');

var pool  = mysql.createPool(db_conf);

exports.pool = function () {
    return pool;
}