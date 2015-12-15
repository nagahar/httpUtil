function monad(f) {
    f.bind = function(g) { return g(this()); };
    return f;
};

// monadic value
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

// monadic value
var unit = function(val) {
    return monad(function() {
        return [[val[0][0], val[0][2]], val[1]];
    });
}

// monadic value
var failure = function(val) {
    monad(function() {
        return null;
    });
};

var p = monad(function() {
    return [[], "abcdef"]
}).bind(item).bind(item).bind(item).bind(unit);
console.log(p())

