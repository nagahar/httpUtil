Parser = (function() {
    // value
    function Parser(value, input) {
        this.value = value;
        this.input = input;
    }

    // monad
    Parser.bind = function(monadicV, monadicF) {
        return function(input) {
            var result = monadicV(input);
            if (result === null) {
                return null;
            } else {
                return monadicF(result.value)(result.input);
            }
        }
    }

    // monadic value
    Parser.unit = function(value) {
        return function(input) {
            return new Parser(value, input);
        }
    }

    // monadic value
    Parser.failure = function(input) {
        return null;
    }

    // monadic value
    Parser.item = function(input) {
        if (input === null) {
            return null;
        } else {
            return new Parser(input.charAt(0), input.slice(1));
        }
    }

    return Parser;
})();

var p = Parser.bind(Parser.item, function(x) {
    return Parser.bind(Parser.item, function() {
        return Parser.bind(Parser.item, function(y) {
            return Parser.unit([x, y]);
        });
    });
});

var s = p("abcdef");
console.log(JSON.stringify(s));
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

var p2 = item.bind(function(x) {
    return item.bind(function() {
        return item.bind(function(y) {
            return unit([x, y]);
        });
    });
});


var s = p2("abcdef");
console.log(JSON.stringify(s));


