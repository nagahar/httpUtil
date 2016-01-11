var _ = require('../index.js');
var assert = require('assert');
describe('convert(', function () {
    it('should return undefined when either the body or encoding is not specified', function () {
        assert.equal(undefined, _.convert());
        assert.equal(undefined, _.convert(null, null));
        assert.equal(undefined, _.convert(undefined, undefined));
    });
});

