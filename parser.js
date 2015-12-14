function monad(f) {
    f.bind = function(g) {
        var _self = this;
        return function(input) {
            var val = _self(input);
            if (val === null) {
                return null;
            } else {
                return g(val[0])(val[1]);
            }
        };
    };

    return f;
};

// monadic value
var item = monad(function(input) {
    if (input === null) {
        return null;
    } else {
        return [input.charAt(0), input.slice(1)];
    }
});

// monadic value
var unit = monad(function(value) {
    return function(input) {
        return [value, input];
    }
});

// monadic value
var failure = monad(function(input) {
    return null;
});

// sample
var p2 = item.bind(function(x) {
    return item.bind(function() {
        return item.bind(function(y) {
            return unit([x, y]);
        });
    });
});


