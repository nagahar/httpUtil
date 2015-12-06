var request = require('request'),
    Iconv = require('iconv').Iconv,
    dom = require('xmldom'),

var e = exports;

/**
 * Call http get with `url`.
 * @param {string} url - This is a url to get.
 * @param {string} encoding - This is an encoding for the response body. (Ex. Shift_JIS.)
 * @param {success} - This callback handles response when the status code is 200.
 * @param {failure} - This callback handles failure case. It is called when the request failed or the response code is not 200.
 **/
e.get = function(url, encoding, success, failure) {
    request({ uri: url, encoding: null },
            function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    success(e.convert(body, encoding))
                } else {
                    failure(statusCode, url)
                }
            });
};

/**
 * @callback success
 * @param {string} response - This is an encoded response body.
 **/

/**
 * @callback failure
 * @param {number} code - This is a status code of response.
 * @param {string} url - This is a requested url.
 **/

/**
 * Convert string with `encoding`.
 * @param {string} body - This is an original data.
 * @param {string} encoding - This is an encoding. (Ex. Shift_JIS.)
 * @return {string} Converted value.
 **/
e.convert = function(body, encoding) {
    var iconv = new Iconv(encode, 'UTF-8//TRANSLIT//IGNORE');
    return iconv.convert(body).toString();
};

/**
 * Search a node whose local name is `localName` in sliblings of `node`.
 * @param {Node} node - This is a node as a basis.
 * @param {string} localName - This is a local name to search
 * @param {siblingsCallback} - This callback handles a sibling of `node`.
 **/
e.searchSiblings = function(node, localName, callback) {
    while (node != undefined) {
        if (node.localName == localName) {
            if (callback(node)) {
                break;
            }
        }

        node = node.nextSibling;
    }
};

/**
 * @callback siblingsCallback
 * @param {Node} node - This is the found node.
 * @return {bool} true: continue to search, false: stop searching
 **/

/**
 * Get nodes identified in `localName` from childNodes of `node`.
 * @param {Node} node - This is a node as a basis.
 * @param {string} localName - This is a local name to search
 * @return Array of node identified
 **/
e.getChilds = function(node, localName) {
    var arr = [];
    var n = node.firstChild;
    while (n != undefined) {
        if (n.localName == localName) {
            arr.push(n);
        }

        n = n.nextSibling;
    }

    return arr;
};

/**
 * If `body` is called in last of `list`, `done` is called.
 * @param {Object[]} list - The list to call map.
 * @callback body - This is callback has 2 parameters. One is element of array. The other is callback to call `done`. Therefore it is necessary to call `done()` in `body`.
 * @callback done - This is called if `body` is called in last of `list`.
 **/
e.map = function(list, body, done) {
    var count = 0;
    list.map(function(a) {
        body(a, function() {
            count++;
            if (count == list.length) {
                done();
            }
        });
    });
};

