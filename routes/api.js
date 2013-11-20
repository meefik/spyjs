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

exports.list = function(req, res) {
    res.set('Content-Type', 'text/plain');
    switch (req.query.table) {
        case 'pages':
            pool.getConnection(function(err, connection) {
                var sql = "SELECT * FROM pages ORDER BY timestamp";
                var params = [];
                if (req.query.userid) {
                    var sql = "SELECT * FROM pages WHERE userid=? ORDER BY timestamp";
                    var params = [req.query.userid];
                }
                connection.query(sql, params, function (err, results) {
                    if (!err) {
                        var response = '"pageid";"timestamp";"userid";"uri";"width";"height";"title";"useragent"\n';
                        for (var i = 0; i < results.length; i++) {
                            response += '"'+results[i].pageid+'";"'+results[i].timestamp+'";"'+results[i].userid+'";"'+
                                results[i].uri+'";"'+results[i].width+'";"'+results[i].height+'";"'+results[i].title+'";"'+results[i].useragent+'"\n';
                        }
                        res.send(200, response);
                    } else {
                        res.send(406, "Not Acceptable");
                        console.log(err);
                    }
                    connection.release();
                });
            });
            break;
        case 'keyboard':
            if (!req.query.pageid) {
                return res.send(400, "Bad Request");
            }
            pool.getConnection(function(err, connection) {
                var sql = "SELECT * FROM keyboard WHERE pageid=? ORDER BY time";
                var params = [req.query.pageid];
                var lasttime = 0;
                connection.query(sql, params, function (err, results) {
                    if (!err) {
                        //var response = '"pageid";"time";"keycode";"delta"\n';
                        var response = '';
                        for (var i = 0; i < results.length; i++) {
                            //response += '"'+results[i].pageid+'";"'+results[i].time+'";"'+results[i].keycode+'";"'+
                            //    results[i].delta+'"\n';
                            var interval = results[i].time - lasttime;
                            response += results[i].keycode+';'+results[i].delta+';'+interval+'\n';
                            lasttime = results[i].time;
                        }
                        res.send(200, response);
                    } else {
                        res.send(406, "Not Acceptable");
                        console.log(err);
                    }
                    connection.release();
                });
            });
            break;
        case 'mouse':
            if (!req.query.pageid) {
                return res.send(400, "Bad Request");
            }
            pool.getConnection(function(err, connection) {
                var sql = "SELECT * FROM mouse WHERE pageid=? ORDER BY time";
                var params = [req.query.pageid];
                if (req.query.keycode) {
                    var sql = "SELECT * FROM mouse WHERE pageid=? AND keycode=? ORDER BY time";
                    params.push(req.query.keycode);
                }
                var lasttime = 0;
                connection.query(sql, params, function (err, results) {
                    if (!err) {
                        //var response = '"pageid";"time";"keycode";"delta";"x";"y";"tag"\n';
                        var response = '';
                        for (var i = 0; i < results.length; i++) {
                            //response += '"'+results[i].pageid+'";"'+results[i].time+'";"'+results[i].keycode+'";"'+
                            //    results[i].delta+'";"'+results[i].x+'";"'+results[i].y+'";"'+results[i].tag+'"\n';
                            var interval = results[i].time - lasttime;
                            response += results[i].delta+';'+interval+'\n';
                            lasttime = results[i].time;
                        }
                        res.send(200, response);
                    } else {
                        res.send(406, "Not Acceptable");
                        console.log(err);
                    }
                    connection.release();
                });
            });
            break;
        default:
            res.send(400, "Bad Request");
    }
}
