function SpyJS() {

    var timeout = 0;
    var initTime = new Date().getTime();
    var page = null;
    var arr_keydown = [];
    var arr_click = [];
    var arr_mousemove = [];

    init();

    function init() {

        window.addEventListener("keydown", function(e) { save(e); });
        window.addEventListener("click", function(e) { save(e); });
        window.addEventListener("mousemove", function(e) { save(e); });

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
            case 'keydown':
                var data = {"pageid": page.pageid, "time": time, "keycode": event.keyCode};
                console.log(data);
                arr_keydown.push(data);
                break;
            case 'click':
                var data = {"pageid": page.pageid, "time": time, "tag": target.id, "x": event.clientX, "y": event.clientY};
                console.log(data);
                arr_click.push(data);
                break;
            case 'mousemove':
                var data = {"pageid": page.pageid, "time": time, "tag": target.id, "x": event.clientX, "y": event.clientY};
                console.log(data);
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
            "page": page, "keydown": arr_keydown, "click": arr_click,
            "mousemove": arr_mousemove
        };

        $.ajax({
            type: "POST",
            url: "api/report",
            data: data,
            dataType: "json"
        });

        arr_keydown = [];
        arr_click = [];
        arr_mousemove = [];

    }

}

$(document).ready(function(){
    var spy = new SpyJS();
});
