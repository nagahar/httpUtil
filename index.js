/*
   HTTP utility
   Copyright (c) 2015, Takanori Nagahara <takanori.nagahara@gmail.com>

   Permission to use, copy, modify, and/or distribute this software for any
   purpose with or without fee is hereby granted, provided that the above
   copyright notice and this permission notice appear in all copies.

   THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
   WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
   MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
   ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
   WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
   ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
   OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
   */

var request = require('request'),
    Iconv = require('iconv').Iconv,
    dom = require('xmldom');

var e = exports;

/**
 * Call http get with `url`.
 * @param {String} url This is a url to get.
 * @param {String} encoding This is an encoding for the response body. (Ex. Shift_JIS.)
 * @param {success} This callback handles response when the status code is 200.
 * @param {failure} This callback handles failure case. It is called when the request failed or the response code is not 200.
 **/
e.get = function(url, encoding, success, failure) {
    request({ uri: url, encoding: null },
            function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    success(e.convert(body, encoding));
                } else {
                    failure(statusCode, error, url);
                }
            });
};

/**
 * @callback success
 * @param {String} response This is an encoded response body.
 **/

/**
 * @callback failure
 * @param {number} code This is a status code of response.
 * @param {String} url This is a requested url.
 **/

/**
 * Convert string with `encoding`.
 * @param {String} body This is an original data.
 * @param {String} encoding This is an encoding. (Ex. Shift_JIS.)
 * @return {String} Converted value.
 **/
e.convert = function(body, encoding) {
    var iconv = new Iconv(encode, 'UTF-8//TRANSLIT//IGNORE');
    return iconv.convert(body).toString();
};

/**
 * Search a node whose local name is `localName` in sliblings of `node`.
 * @param {Node} node This is a node as a basis.
 * @param {String} localName This is a local name to search
 * @param {siblingsCallback} This callback handles a sibling of `node`.
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
 * @param {Node} node This is the found node.
 * @return {Boolean} true: continue to search, false: stop searching
 **/

/**
 * Get nodes identified in `localName` from childNodes of `node`.
 * @param {Node} node This is a node as a basis.
 * @param {String} localName This is a local name to search
 * @return {Array.<Node>} Array of nodes
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

/**
 * Get monad from Function `f`.
 * @param {Function} f - This is a function (ex. parser function)
 * @return {Function} - Return a monad value including f
 *
 * @example
 * // returns [['a', 'c'], 'def']
 * var parse = monad(function() { return [[], "abcdef"] }).bind(item).bind(item).bind(item)
 *     .bind(function(val) {
 *         return monad(function() {
 *             return [[val[0][0], val[0][2]], val[1]];
 *         })});
 * console.log(parse());
 **/
e.monad = function(f) {
    f.bind = function(g) { return g(this()); };
    return f;
};


/**
 * A parser sample to return "as is" strings.
 * @param {Object} val - This is a value
 * @return {Function} - Return a monad value
 **/
var unit = function(val) {
    return monad(function() {
        return val;
    });
}

/**
 * A parser sample to pick up first characters.
 * @param {Object} val - This is a value
 * @return {Function} - Return a monad value
 **/
var item = function(val) {
    return monad(function() {
        if (val === null) {
            return null;
        } else {
            val[0].push(val[1].charAt(0));
            return [val[0], val[1].slice(1)];
        }
    });
};

/**
 * A parser sample to return null.
 * @param {Object} val - This is a value
 * @return {Function} - Return a monad value
 **/
var failure = function(val) {
    monad(function() {
        return null;
    });
};


