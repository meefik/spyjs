var timeout = 0;
var initTime = new Date().getTime();
var page = null;
var arr_keypress = [];
var arr_click = [];
var arr_mouseover = [];
var arr_mousemove = [];

function init() {
    window.addEventListener("click", function(e) { save(e); });
    window.addEventListener("mousemove", function(e) { save(e); });
    window.addEventListener("mouseover", function(e) { save(e); });
    window.addEventListener("keypress", function(e) { save(e); });

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

    setInterval(send, 1000);
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
            var data = {"pageid": page.pageid, "time": time, "key": event.keyCode};
            //console.log(data);
            arr_keypress.push(data);
            break;
        case 'click':
            var data = {"pageid": page.pageid, "time": time, "tag": target.id};
            //console.log(data);
            arr_click.push(data);
            break;
        case 'mouseover':
            var data = {"pageid": page.pageid, "time": time, "tag": target.id};
            //console.log(data);
            arr_mouseover.push(data);
            break;
        case 'mousemove':
            var data = {"pageid": page.pageid, "time": time, "x": event.clientX, "y": event.clientY};
            //console.log(data);
            arr_mousemove.push(data);
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

function send(){

    var data = {
        "page": page, "keypress": arr_keypress, "click": arr_click,
        "mouseover": arr_mouseover, "mousemove": arr_mousemove
    };

    $.ajax({
        type: "POST",
        url: "api/report",
        data: data,
        dataType: "json"
    });

    arr_keypress = [];
    arr_click = [];
    arr_mouseover = [];
    arr_mousemove = [];
}