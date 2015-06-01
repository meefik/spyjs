var debug = true;
var keycodes = [];
var digraphs = [];
var data = [];
var people = [];

/**
 * Обработчик нажатий клавиш
 */
function handler(event) {
    var event = event || window.event;
    var target = event.target || event.srcElement;
    switch(event.type) {
        case 'keydown':
            var time = (new Date()).getTime();
            keycodes[event.keyCode] = time;
            break;
        case 'keyup':
            var time = (new Date()).getTime();
            var delta = time - keycodes[event.keyCode] || 0;
            delete keycodes[event.keyCode];
            var char = String.fromCharCode(event.keyCode);
            var re = /([a-zа-я]{1})/ig;
            if(char.match(re)) {
                data.push({
                    keycode: event.keyCode,
                    time: time,
                    delta: delta
                });
                if(debug) console.log('Keycode: ' + event.keyCode + ' Delta: ' + delta);
            }
            break;
        default:
            if(debug) console.log('Event: ' + event.type);
            break;
    }
}

/**
 * Установка обработчика событий на нажатие клавиш
 */
function listen() {
    window.addEventListener("keydown", handler);
    window.addEventListener("keyup", handler);
}

/**
 * Преобразование текста в массив диграфов
 * @param {string} str - текст
 * @param {number} n - максимальное число диграфов на выходе
 * @returns {Object[]} массив диграфов: digraph - символы диграфа,
 *                                      count - число повторений диграфа в тексте,
 *                                      keycodes[] - коды клавиш диграфа
 */
function digraph(str, n) {
    var xreplace = [];
    xreplace['113'] = '81'; // qй
    xreplace['119'] = '87'; // wц
    xreplace['101'] = '69'; // eу
    xreplace['114'] = '82'; // rк
    xreplace['116'] = '84'; // tе
    xreplace['121'] = '89'; // yн
    xreplace['117'] = '85'; // uг
    xreplace['105'] = '73'; // iш
    xreplace['111'] = '79'; // oщ
    xreplace['112'] = '80'; // pз
    xreplace['91'] = '219'; // [х
    xreplace['93'] = '221'; // ]ъ
    xreplace['97'] = '65'; // aф
    xreplace['115'] = '83'; // sы
    xreplace['100'] = '68'; // dв
    xreplace['102'] = '70'; // fа
    xreplace['103'] = '71'; // gп
    xreplace['104'] = '72'; // hр
    xreplace['106'] = '74'; // jо
    xreplace['107'] = '75'; // kл
    xreplace['108'] = '76'; // lд
    xreplace['59'] = '186'; // ;ж
    xreplace['39'] = '222'; // 'э
    xreplace['122'] = '90'; // zя
    xreplace['120'] = '88'; // xч
    xreplace['99'] = '67'; // cс
    xreplace['118'] = '86'; // vм
    xreplace['98'] = '66'; // bи
    xreplace['110'] = '78'; // nт
    xreplace['109'] = '77'; // mь
    xreplace['44'] = '188'; // ,б
    xreplace['46'] = '190'; // .ю
    xreplace['1081'] = '81'; // qй
    xreplace['1094'] = '87'; // wц
    xreplace['1091'] = '69'; // eу
    xreplace['1082'] = '82'; // rк
    xreplace['1077'] = '84'; // tе
    xreplace['1085'] = '89'; // yн
    xreplace['1075'] = '85'; // uг
    xreplace['1096'] = '73'; // iш
    xreplace['1097'] = '79'; // oщ
    xreplace['1079'] = '80'; // pз
    xreplace['1093'] = '219'; // [х
    xreplace['1098'] = '221'; // ]ъ
    xreplace['1092'] = '65'; // aф
    xreplace['1099'] = '83'; // sы
    xreplace['1074'] = '68'; // dв
    xreplace['1072'] = '70'; // fа
    xreplace['1087'] = '71'; // gп
    xreplace['1088'] = '72'; // hр
    xreplace['1086'] = '74'; // jо
    xreplace['1083'] = '75'; // kл
    xreplace['1076'] = '76'; // lд
    xreplace['1078'] = '186'; // ;ж
    xreplace['1101'] = '222'; // 'э
    xreplace['1103'] = '90'; // zя
    xreplace['1095'] = '88'; // xч
    xreplace['1089'] = '67'; // cс
    xreplace['1084'] = '86'; // vм
    xreplace['1080'] = '66'; // bи
    xreplace['1090'] = '78'; // nт
    xreplace['1100'] = '77'; // mь
    xreplace['1073'] = '188'; // ,б
    xreplace['1102'] = '190'; // .ю
    var re = /([a-zа-я]{2})/ig;
    //var re = /([a-zа-я\[\];',\.]{2})/ig;
    //console.log(str.match(re));
    var arr = [];
    for(var i = 0, len = str.length; i < len - 1; i++) {
        var digraph = str[i] + str[i + 1];
        if(digraph.match(re)) {
            arr.push(digraph);
        }
    }
    var counts = [];
    for(var i = 0, len = arr.length; i < len; i++) {
        var num = arr[i].charCodeAt(0) + '-' + arr[i].charCodeAt(1);
        counts[num] = counts[num] ? counts[num] + 1 : 1;
    }
    var obj_arr = [];
    for(var k in counts) {
        var kcodes = k.split('-');
        var digraph = String.fromCharCode(kcodes[0]) + String.fromCharCode(kcodes[1]);
        var cnt = counts[k];
        // translate keycodes ru to en
        var code1 = xreplace[kcodes[0]];
        if(code1) kcodes[0] = code1;
        var code2 = xreplace[kcodes[1]];
        if(code2) kcodes[1] = code2;
        obj_arr.push({
            "digraph": digraph,
            "count": cnt,
            "keycodes": kcodes
        });
    }

    function compare(a, b) {
        return b.count - a.count;
    }
    var sorted_arr = obj_arr.sort(compare);
    if(n) return sorted_arr.slice(0, n);
    else return sorted_arr;
}

/**
 * Расчет квадратичного коэффициента нечеткости (степень схожести двух выборок диграфов)
 * @param {number[][]} x и y - массив параметров диграфов (по три параметра на каждый диграф)
 * @returns {number} значение коэффициента нечеткости (0 - выборки эквивалентны, > 0 - определяет степень различия)
 */
function distance(x, y) {
    if(x.length !== y.length) return -1;
    var n = x.length,
        mu = [0, 0, 0, 0, 0, 0];
    for(var i = 0; i < n; i++) {
        mu[0] += x[i][0];
        mu[1] += x[i][1];
        mu[2] += x[i][2];
        mu[3] += y[i][0];
        mu[4] += y[i][1];
        mu[5] += y[i][2];
    }
    for(var i = 0; i < 6; i++) {
        mu[i] = mu[i] / n;
    }
    var z = 0;
    for(var i = 0; i < 3; i++) {
        z += 2 * Math.sqrt(Math.pow(mu[i] - mu[i + 3], 2) / n);
    }
    return z / 3;
}

/**
 * Обработка данных о нажатых клавишах и формирование массива параметров диграфов
 * @param {Object[]} x - массив данных о нажатых клавишах: time - отметка времени события нажатия клавиши,
 *                                                         delta - продолжительность удержания клавиши (мс)
 * @param {Object[]} d - массив диграфов, которые содержались в набираемом тексте
 * @returns {number[][]} массив параметров диграфов (по три параметра на каждый диграф)
 */
function calc(x, d) {
    var z = [];
    for(var i = 0, ld = d.length; i < ld; i++) {
        var k = 0,
            t = [0, 0, 0];
        for(var j = 0, lx = x.length; j < lx - 1; j++) {
            if(d[i].keycodes[0] == x[j].keycode && d[i].keycodes[1] == x[j + 1].keycode) {
                t[0] += x[j].delta;
                t[1] += x[j + 1].delta;
                t[2] += x[j + 1].time - x[j].time;
                k++;
            }
        }
        if(k > 0) {
            for(var j = 0; j < 3; j++) {
                t[j] = t[j] / k;
            }
        }
        z.push(t);
    }
    return z;
}

/**
 * Расчет матицы квадратичных коэффициентов нечеткости
 * @returns {number[][]} матрица коэффициентов
 */
function diff() {
    var arr = [];
    var l = people.length;
    for(var i = 0; i < l; i++) {
        arr[i] = [];
        for(var j = 0; j < l; j++) {
            arr[i][j] = distance(people[i], people[j]);
        }
    }
    return arr;
}

/**
 * Инициализация и запуск
 */
function init() {
    listen();
    var start = function() {
        var str = $('#origin-text').val().toLowerCase();
        digraphs = digraph(str, 20);
        if(debug) console.log(JSON.stringify(digraphs));
        data = [];
        var out = 'Диграфы исходного текста (' + digraphs.length + ' шт.):\n';
        for(var i = 0, l = digraphs.length; i < l; i++) {
            out += digraphs[i].digraph + ':' + digraphs[i].count + ' ';
        }
        $('#output').text(out);
    }
    var stop = function() {
        $("#typing-text").val('');
        var z = calc(data, digraphs);
        people.push(z);
        if(debug) console.log(JSON.stringify(people));
        var out = 'Число испытуемых: ' + people.length;
        $('#output').text(out);
    }
    var ident = function() {
        var arr = diff();
        if(debug) console.log(JSON.stringify(arr));
        var out = 'Матрица квадратичных коэффициентов нечеткости:\n';
        for(var i = 0, l = arr.length; i < l; i++) {
            var line = '';
            for(var j = 0; j < l; j++) {
                line += arr[i][j].toFixed(2) + '\t';
            }
            out += line + '\n';
        }
        $('#output').text(out);
    }
    $('#start-btn').click(start);
    $('#stop-btn').click(stop);
    $('#ident-btn').click(ident);
}