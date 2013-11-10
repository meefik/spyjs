var pool = require('../db.js').pool();
var mysql = require('mysql');

exports.add = function(req, res){

    function query(sql,params) {
        pool.getConnection(function(err, connection) {
            connection.query(sql, params, function (err, results) {
                /*
                    if (!err) {
                        //res.send(200, "OK");
                    } else {
                        //res.send(406, "Not Acceptable");
                        console.log(err);
                    }
                */
                    connection.release();
                });
        });
    }
    //console.log(req.body);

    res.send(200, "OK");

    if (req.body.page) {
        query("INSERT INTO pages (pageid, timestamp, userid, uri, width, height, title, useragent) VALUES (?,NOW(),?,?,?,?,?,?)",
            [req.body.page.pageid,req.body.page.userid,req.body.page.uri,req.body.page.width,req.body.page.height,
                req.body.page.title,req.body.page.useragent]);
    }
    if (req.body.keyboard) {
        for (var i = 0; i < req.body.keyboard.length; i++) {
            query("INSERT INTO keyboard (pageid, time, keycode, delta) VALUES (?,?,?,?)",
                [req.body.keyboard[i].pageid,req.body.keyboard[i].time,req.body.keyboard[i].keycode,
                    req.body.keyboard[i].delta]);
        }
    }
    if (req.body.mouse) {
        for (var i = 0; i < req.body.mouse.length; i++) {
            query("INSERT INTO mouse (pageid, time, keycode, delta, x, y, tag) VALUES (?,?,?,?,?,?,?)",
                [req.body.mouse[i].pageid,req.body.mouse[i].time,req.body.mouse[i].keycode,
                    req.body.mouse[i].delta,req.body.mouse[i].x,req.body.mouse[i].y,req.body.mouse[i].tag]);
        }
    }

}