var sys = require('sys'),
    request = require('request'),
    Iconv = require('iconv').Iconv,
    fs = require('fs');

var e = exports;

/**
 * Print `msg`.
 *
 * @param {string} msg
 **/
e.p = function(msg) {
    sys.log(msg);
}

/**
 * If `body` is called in last of `list`, `done` is called.
 *
 * @param {Object[]} list - The list to call map.
 * @callback body - This is callback has 2 parameters. One is element of array. The other is callback to call `done`. Therefore it is necessary to call `done()` in `body`.
 * @callback done - This is called if `body` is called in last of `list`.
 **/
e.amap = function(list, body, done) {
    var count = 0;
    list.map(function(a) {
        body(a, function() {
            count++;
            if (count == list.length) {
                done();
            }
        });
    });
}

/**
 * Call http get with `url`.
 *
 * @param {string} url - This is a url to query.
 * @param {string} encode - This is an encoding for the response body. (Ex. Shift_JIS.)
 * @callback parser - This is called if the response code is 200.
 **/
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

/**
 * Write json date asynchronously.
 *
 * @param {string} fname - This is a file name to write.
 * @param {string} data - This is an original data.
 **/
e.write = function(fname, data) {
    fs.writeFile(fname, JSON.stringify(data),
            function(err) {
                if (err) {
                    p(err);
                }
            });

    e.p(JSON.stringify(data));
}

/**
 * Convert string with `encode`.
 *
 * @param {string} body - This is an original data.
 * @param {string} encode - This is an encoding. (Ex. Shift_JIS.)
 **/
e.convert = function(body, encode) {
    var iconv = new Iconv(encode, 'UTF-8//TRANSLIT//IGNORE');
    return iconv.convert(body).toString();
}

/**
 * Throw error for debug to stop callback.
 *
 * @param {Object} obj - This is object to print for debug.
 **/
e.debugBreak = function(obj) {
    e.p(obj);
    throw new Error("debug");
}

/**
 * Search a node identified in `localName` from sliblings of `node`.
 *
 * @param {Node} node - This is a node as a basis.
 * @param {string} localName - This is a local name to search
 * @callback callback - This is called when localName matches a sibling of `node`.
 **/
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


