// value
function Parser(value, stream) {
    this.value = value;
    this.stream = stream;
}

// monadic function
bind = function(mparser, mfunc) {
    return function(stream) {
        var result = mparser(stream);
        if (result === null) {
            return null;
        } else {
            return mfunc(result.value)(result.stream);
        }
    }
}

// monadic value
unit = function(value) {
    return function(stream) {
        return new Parser(value, stream);
    }
}

failure = function(stream) {
    return null;
}

item = function(stream) {
    if (stream === null) {
        return null;
    } else {
        return new Parser(stream.charAt(0), stream.substr(1));
    }
}

var p = bind(item, function(x) {
    return bind(item, function() {
        return bind(item, function(y) {
            return unit([x, y]);
        });
    });
});

var r = p("abcdef");
//var r = parse(item, "");
//var r = parse(item, "abc");
console.log(JSON.stringify(r));


