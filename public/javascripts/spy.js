var timeout = 0;
var initTime = new Date().getTime();
var userId = null;
var pageId = Math.uuid();
var uri = document.URL;

function init() {
    window.addEventListener("click", function(e) { save(e); });
    window.addEventListener("mousemove", function(e) { save(e); });
    window.addEventListener("mouseover", function(e) { save(e); });
    window.addEventListener("keypress", function(e) { save(e); });

    userId = getCookie("userId");
    if (userId == null) {
        userId = Math.uuid();
        document.cookie = "userId="+userId;
    }

    var data = {
        "pageid": pageId, "userid": userId, "uri": uri,
        "width": window.innerWidth, "height": window.innerHeight,
        "useragent": navigator.userAgent, "title": document.title
    }
    console.log(data);
}

function save(event) {

    if(new Date().getTime() < timeout) {
        return;
    }
    timeout = new Date().getTime() + 100;  // 100 ms

    var event = event || window.event;
    var target = event.target || event.srcElement;
    var time = new Date().getTime() - initTime;

    switch (event.type) {
        case 'keypress':
            var data = {"pageId": pageId, "time": time, "event": event.type, "key": event.keyCode}
            console.log(data);
            break;
        case 'mousemove':
            var data = {"pageId": pageId, "time": time, "event": event.type, "x": event.clientX, "y": event.clientY}
            console.log(data);
            break;
        case 'mouseover':
            var data = {"pageId": pageId, "time": time, "event": event.type, "tag": target.tagName}
            console.log(data);
            break;
        case 'click':
            var data = {"pageId": pageId, "time": time, "event": event.type, "tag": target.tagName}
            console.log(data);
            break;
        default:
            console.log(time+': '+event.type);
            break;
    }
}

function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}
