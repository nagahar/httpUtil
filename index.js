var sys = require('sys'),
    request = require('request'),
    Iconv = require('iconv').Iconv,
    fs = require('fs');

var e = exports;

/**
 * print message
 *
 * @param  {String} msg
 **/
e.p = function(msg) {
    sys.log(msg);
}

e.amap = function(arr, body, done) {
    var count = 0;
    arr.map(function(a) {
        body(a, function() {
            count++;
            if (count == arr.length) {
                done();
            }
        });
    });
}

e.get = function(url, encode, parser) {
    request({ uri: url, encoding: null },
            function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    parser(e.convert(body, encode))
                } else {
                    e.p('error : ' + response.statusCode);
                }
            });
}

e.write = function(fname, data) {
    fs.writeFile(fname, JSON.stringify(data),
            function(err) {
                if (err) {
                    p(err);
                }
            });

    e.p(JSON.stringify(data));
}

e.convert = function(body, encode) {
    var iconv = new Iconv(encode, 'UTF-8//TRANSLIT//IGNORE');
    return iconv.convert(body).toString();
}

e.debugBreak = function(obj) {
    e.p(obj);
    throw new Error("debug");
}

e.searchSiblings = function(node, localName, callback) {
    while(node != null) {
        if (node.localName == localName) {
            if (callback(node)) {
                break;
            }
        }

        node = node.nextSibling;
    }
}


