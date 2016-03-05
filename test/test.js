"use strict";
var _ = require('../lib/http_util.js');
var assert = require('assert');

describe('get()', function () {
    it('should not throw exception', function () {
        assert.doesNotThrow(function() { _.get(); });
        assert.doesNotThrow(function() { _.get(null, null, null, null); });
        assert.doesNotThrow(function() { _.get('hoge', 'utf8', function() {}); });
        assert.doesNotThrow(function() { _.get('hoge', 'utf9', function() {}); });
    });
}); 
describe('get()', function () {
    it('should read local file (./test/1) as url', function (done) {
        _.get('./test/1', 'utf8',
                function(v) {
                    assert.equal(1, v);
                    done();
                });
    });
    it('should read local file (../http_util/test/1) as url', function (done) {
        _.get('../http_util/test/1', 'utf8',
                function(v) {
                    assert.equal(1, v, "true");
                    done();
                });
    });
});

describe('convert()', function () {
    it('should return undefined when either the body or encoding is not specified', function () {
        assert.deepEqual(undefined, _.convert());
        assert.deepEqual(undefined, _.convert(null, null));
    });
});

describe('searchSiblings()', function () {
    it('should not throw exception', function () {
        assert.doesNotThrow(function() { _.searchSiblings(); });
        assert.doesNotThrow(function() { _.searchSiblings(null, null, null); });
        assert.doesNotThrow(function() { _.searchSiblings([], ''); });

    });
});

describe('getChilds()', function () {
    it('should not throw exception', function () {
        assert.doesNotThrow(function() { _.getChilds(); });
        assert.doesNotThrow(function() { _.getChilds(null, null); });
    });
    it('should return [](empty array)', function () {
        assert.deepEqual([], _.getChilds());
        assert.deepEqual([], _.getChilds(null, null));
    });

});



describe('serial()', function () {
    it('should not throw exception', function () {
        assert.doesNotThrow(function() { _.serial(); });
        assert.doesNotThrow(function() { _.serial(null, null, null); });
        assert.doesNotThrow(function() { _.serial([], function() {}, undefined); });

    });
});

