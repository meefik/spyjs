/**
 * SpyJS
 * @author Anton Skshidlevksy <anton@cde.ifmo.ru>
 * @license GPL v3
 *
 * Usage:
 * $(document).ready(function(){
 *     var spy = new SpyJS();
 *     spy.start();
 * });
 */

function SpyJS() {

    // properties
    var debug = true;
    var update = 1000; // 1000 ms
    var limit = 100; // 100 ms

    // local variables
    var timeout = 0;
    var initTime = new Date().getTime();
    var page = null;
    var keyboard = [];
    var mouse = [];
    var keycodes = [];
    var lastXY = null;
    var timer = null;

    var userId = getCookie("userId");
    if (userId == null) {
        userId = Math.uuid();
        document.cookie = "userId="+userId;
    }

    page = {
        "pageid": Math.uuid(), "userid": userId, "uri": document.URL,
        "width": window.innerWidth, "height": window.innerHeight,
        "useragent": navigator.userAgent, "title": document.title
    }

    if (debug) console.log(page);

    SpyJS.prototype.start = function () {

        window.addEventListener("keydown", handler);
        window.addEventListener("keyup", handler);
        window.addEventListener("mousedown", handler);
        window.addEventListener("mouseup", handler);
        window.addEventListener("mousemove", handler);

        timer = setInterval(send, update);

    }

    SpyJS.prototype.stop = function () {

        window.removeEventListener("keydown", handler);
        window.removeEventListener("keyup", handler);
        window.removeEventListener("mousedown", handler);
        window.removeEventListener("mouseup", handler);
        window.removeEventListener("mousemove", handler);

        clearInterval(timer);

    }

    SpyJS.prototype.remove = function () {
        deleteCookie("userId");
    }

    SpyJS.prototype.info = page;

    function handler(event) {

        var event = event || window.event;
        var target = event.target || event.srcElement;
        var time = new Date().getTime() - initTime;

        switch (event.type) {
            case 'keydown':
                keycodes['k'+event.keyCode] = (new Date()).getTime();
                break;
            case 'keyup':
                var delta = (new Date()).getTime() - keycodes['k'+event.keyCode];
                var data = {"pageid": page.pageid, "time": time, "keycode": event.keyCode, "delta": delta};
                keyboard.push(data);
                if (debug) console.log(data);
                break;
            case 'mousedown':
                keycodes['m'+event.button] = (new Date()).getTime();
                break;
            case 'mouseup':
                var delta = (new Date()).getTime() - keycodes['m'+event.button];
                var data = {"pageid": page.pageid, "time": time, "keycode": event.button, "delta": delta,
                    "x": event.clientX, "y": event.clientY, "tag": target.id};
                mouse.push(data);
                if (debug) console.log(data);
                break;
            case 'mousemove':
                // set timeout
                if(new Date().getTime() < timeout) break;
                timeout = new Date().getTime() + limit;  // ms

                var delta = 0;
                if (lastXY) {
                    delta = Math.round(Math.sqrt(Math.pow(event.clientX - lastXY.x,2) + Math.pow(event.clientY - lastXY.y,2)));
                }
                lastXY = {"x": event.clientX, "y": event.clientY};
                var data = {"pageid": page.pageid, "time": time, "keycode": -1, "delta": delta,
                    "x": event.clientX, "y": event.clientY, "tag": target.id};
                mouse.push(data);
                if (debug) console.log(data);
                break;
            default:
                if (debug) console.log(time+': '+event.type);
                break;
        }

    }

    function send() {

        var data = {
            "page": page, "keyboard": keyboard, "mouse": mouse
        };

        $.ajax({
            type: "POST",
            url: "api/report",
            data: data,
            dataType: "json"
        });

        keyboard = [];
        mouse = [];

    }

    function getCookie(name) {
        var matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    function deleteCookie(name) {
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    };

}
