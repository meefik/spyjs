var pool = require('../db.js').pool();
var mysql = require('mysql');

exports.add = function(req, res){

    function query(sql,params) {
        pool.getConnection(function(err, connection) {
            connection.query(sql, params, function (err, results) {
                /*
                    if (!err) {
                        res.send(200, "OK");
                    } else {
                        res.send(406, "Not Acceptable");
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
    if (req.body.keypress) {
        for (var i = 0; i < req.body.keypress.length; i++) {
            query("INSERT INTO keypress (pageid, time, key) VALUES (?,?,?)",
                [req.body.keypress[i].pageid,req.body.keypress[i].time,req.body.keypress[i].key]);
        }
    }
    if (req.body.click) {
        for (var i = 0; i < req.body.click.length; i++) {
            query("INSERT INTO click (pageid, time, tag) VALUES (?,?,?)",
                [req.body.click[i].pageid,req.body.click[i].time,req.body.click[i].tag]);
        }
    }
    if (req.body.mouseover) {
        for (var i = 0; i < req.body.mouseover.length; i++) {
            query("INSERT INTO mouseover (pageid, time, tag) VALUES (?,?,?)",
                [req.body.mouseover[i].pageid,req.body.mouseover[i].time,req.body.mouseover[i].tag]);
        }
    }
    if (req.body.mousemove) {
        for (var i = 0; i < req.body.mousemove.length; i++) {
            query("INSERT INTO mousemove (pageid, time, x, y) VALUES (?,?,?,?)",
                [req.body.mousemove[i].pageid,req.body.mousemove[i].time,req.body.mousemove[i].x,req.body.mousemove[i].y]);
        }
    }

}