var pool = require('../db.js').pool();
var mysql = require('mysql');

exports.list = function(req, res){
    res.render('report', { title: 'Report' });
};
