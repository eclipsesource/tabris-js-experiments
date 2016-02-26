/*jshint sub:true, evil:true*/
/*globals global, Symbol, Promise*/

var syntaxTests = {
  "Promises": function(name, callback) {
    var promise = new Promise(function(resolve) {
      resolve("OK");
    });
    promise.then(function(result) {
      callback(name, result === "OK");
    });
  },
  "Arrow Functions": function(name, callback) {
    var fn = (new Function("return (x) => { return x + 1; };"))();
    callback(name, fn(1) === 2);
  },
  "Symbols": function(name, callback) {
    var sym1 = Symbol("foo");
    var sym2 = Symbol("foo");
    var x = {};
    x[sym1] = 1;
    x[sym2] = 2;
    callback(name, sym1 !== sym2 && x[sym1] === x[sym1] && x[sym1] !== x[sym2]);
  },
  "imports": function(name, callback) {
    callback(name, require("./es6module").bar === "bar");
  },
  "Classes (strict mode)": function(name, callback) {
    var Foo = (new Function("'use strict'; class Foo { constructor(a, b) { this.x = a; this.y = b;} get result() { return this.x + this.y; }} return Foo; "))();
    var foo = new Foo(1, 2);
    callback(name, foo.result === 3);
  },
  "let (strict mode)": function(name, callback) {
     var result = new Function("'use strict'; let x = 1; {let x = 2;} return x;")();
     callback(name, result === 1);    
  },
  "Classes (non-strict)": function(name, callback) {
    var Foo = (new Function("class Foo { constructor(a, b) { this.x = a; this.y = b;} get result() { return this.x + this.y; }} return Foo; "))();
    var foo = new Foo(1, 2);
    callback(name, foo.result === 3);
  },
  "let (non-strict)": function(name, callback) {
     var result = new Function("let x = 1; {let x = 2;} return x;")();
     callback(name, result === 1);    
  },
  "const (strict mode)": function(name, callback) {
    var o;
    var error = null;
    try {
       o = new Function("'use strict'; const x = 1; return {get: function() {return x;}, set: function(y) { x = y;}};")();
    } catch(ex) {
      // Chakra won't even parse an assignment to const
      error = ex;
       o = new Function("'use strict'; const x = 1; return {get: function() {return x;}, set: function(y) {}};")();
    }
    try {
      o.set(23);
    } catch(ex) {
      error = ex;
    }
    callback(name, o.get() === 1 && error !== null);
  },
  "const (non strict)": function(name, callback) {
    var o;
    var error = null;
    try {
       o = new Function("const x = 1; return {get: function() {return x;}, set: function(y) { x = y;}};")();
    } catch(ex) {
      // Chakra won't even parse an assignment to const
      error = ex;
       o = new Function("const x = 1; return {get: function() {return x;}, set: function(y) {}};")();
    }
    try {
      o.set(23);
    } catch(ex) {
      error = ex;
    }
    callback(name, o.get() === 1 && error !== null);
  },
  "for...of": function(name, callback) {
    var sum = new Function("var iterable = [1, 2, 3]; var sum = 0;for (var value of iterable) {sum += value;} return sum;")();
    callback(name, sum === 6);
  },
  "iterator": function(name, callback) {
    var f = new Function("return 'foo'[Symbol.iterator]().next().value;")();
    callback(name, f === "f");
  },
  "generators": function(name, callback) {
    var one = new Function("return function*() { yield 1;}().next().value;")();
    callback(name, one === 1);
  },
  "Proxies": function(name, callback) {
    var target = {};
    var handler = {
      get: function (receiver, name) {
        return "Hello, " + name;
      }
    };
    var p = new Proxy(target, handler);
    callback(name, p.world === "Hello, world!");    
  },
  "Subclass Array": function(name, callback) {
    var MyArray = new Function("'use strict'; return class MyArray extends Array {};")();
    var arr = new MyArray();
    arr[1] = 1;
    callback(name, arr[1] === 1 && arr.length === 2);
  },
  "Binary literal": function(name, callback) {
    var result = new Function("return 0b111110111;")();
    callback(name, result === 503);
  },
  "Octal literal": function(name, callback) {
    var result = new Function("return 0o767;")();
    callback(name, result === 503);
  },
  "Reflect": function(name, callback) {
    function C(a, b){
      this.c = a + b;
    }
    var instance = Reflect.construct(C, [20, 22]);
    callback(name, instance.c == 42);    
  },
  "Default Parameters": function(name, callback) {
    var f = new Function("return function f (x, y = 7, z = 42) {return x + y + z;};")();
    callback(name, f(1) === 50);    
  },
  "Rest Parameters": function(name, callback) {
    var f = new Function("return function f (x, y, ...a) {return (x + y) * a.length;};")();
    callback(name, f(1, 2, "hello", true, 7) === 9);    
  },
  "Spread Operator": function(name, callback) {
    var result = new Function("var params = [ 'hello', true, 7 ]; return [ 1, 2, ...params ];")();
    callback(name, result.join("") === "12hellotrue7");
  },
  "Template Literals": function(name, callback) {
    var result = new Function("var a = 5;var b = 10;return `Fifteen is ${a + b}`;")();
    callback(name, result === "Fifteen is 15");
  },
  "Object property shorthand literal": function(name, callback) {
    var result = new Function("var x = 1; var y = 2; return { x, y };")();
    callback(name, result.x === 1 && result.y === 2);
  },
  "Object property computed literal": function(name, callback) {
    var result = new Function("var baz = 'foo';var fn = function() {return 'bar';}; return {[ 'baz' + fn() ]: 42};")();
    callback(name, result.bazbar === 42);
  },
  "Object method literal": function(name, callback) {
    var obj = new Function("return {a: 1, foo(){return this.a;}}")();
    callback(name, obj.foo() === 1);
  },
  "Array -> var matching": function(name, callback) {
    var result = new Function("var [a, b] = [1, 2]; return a+b;")();
    callback(name, result === 3);
  },
  "Object -> var matching": function(name, callback) {
    var result = new Function("var {a, b} = {a: 1, b: 2}; return a+b;")();
    callback(name, result === 3);
  },
  "function object parameter matching": function(name, callback) {
    var result = new Function("function x({ name: n, val: v }) {return n+v;} return x({name: 1, val: 2});")();
    callback(name, result === 3);
  }
};

var lookFor = {
  "Array": ["from", "of"],
  "Array.prototype": ["fill", "find", "findIndex", "entries", "keys", "copyWithin"],
  "Map.prototype": ["forEach", "entries", "keys", "values"],
  "Set.prototype": ["forEach", "entries", "keys", "values"],
  "WeakMap": ["clear"],
  "Math": ["imul", "clz32", "fround", "log10", "log2", "log1p", "expm1", "cosh", "sinh", "tanh", "acosh", "asinh", "atanh", "hypot", "trunc", "sign", "cbrt"],
  "Number": ["isNaN", "isFinite", "isInteger", "parseInt", "parseFloat", "EPSILON", "MAX_SAFE_INTEGER", "MIN_SAFE_INTEGER", "isSafeInteger"],
  "Object": ["is", "setPrototypeOf", "assign", "getOwnPropertySymbols"],
  "String": ["fromCodePoint", "raw"],
  "String.prototype": ["codePointAt", "startsWith", "endsWith", "includes", "repeat", "normalize"]
};

var objFilter = function(name) {
  if (["constructor", "toString"].indexOf(name) !== -1){
    return false;
  }
  if (name.charAt(0) === "_") {
    return false;
  }
  return true;
};

var constructorFilter = function(name) {
  if (["name", "length", "caller", "prototype", "isView", "arguments"].indexOf(name) !== -1){
    return false;
  }
  if (name.charAt(0) === "_") {
    return false;
  }
  return true;
};

var statics = ["Math", "JSON", "Reflect"];
var constructors = [
  "RegExp", 
  "String", 
  "Array", 
  "Object", 
  "Number", 
  "Date", 
  "ArrayBuffer",
  "Int8Array",
  "Uint8Array",
  "Uint8ClampedArray",
  "Int16Array",
  "Uint16Array",
  "Int32Array",
  "Uint32Array",
  "Float32Array",
  "Float64Array",
  "Set",
  "WeakSet",
  "Map",
  "WeakMap",
  "Symbol",
  "Promise",
  "Proxy"
];

function runTests(callback) {
    var results = {};
    findStaticAPIs(results);
    findTypeAPIs(results);
    testSyntax(function(testResults) {
      results["Syntax"] = testResults;
      console.log(JSON.stringify(results));
      callback();        
    });
}

function findStaticAPIs(results) {
  statics.forEach(function(name) {
    if (!global[name]) {
      results[name] = {};
    } else {
      results[name] = findMembers(global[name], objFilter, lookFor[name]);
    }    
  });
}

function findTypeAPIs(results) {
  constructors.forEach(function(name) {
    var protoName = name + ".prototype";
    if (!global[name]) {
      results[name] = {};
      results[protoName] = {}; 
    } else {
      results[name] = findMembers(global[name], constructorFilter, lookFor[name]);
      results[protoName]  = findMembers(global[name].prototype, objFilter, lookFor[protoName]);
    }
  });
}

function findMembers(obj, filter, also) {
    var members = {};
    if (!obj) {
      obj = {};
    }
    var arr = Object.getOwnPropertyNames(obj).concat(also || []);
    for (var i = 0; i < arr.length; i++) {
      if ((filter && !filter(arr[i])) || members[arr[i]]) {
        continue;
      }
      try {
        members[arr[i]] = typeof obj[arr[i]]; 
      } catch(e) {
        members[arr[i]] = "exists";
      }
    }
    return members;
}

function testSyntax(callback) {
  var tests = Object.getOwnPropertyNames(syntaxTests);
  var results = {};
  runNext(tests.pop());
  function handleResult(fromTest, result) {
    if (results.hasOwnProperty(fromTest)) {
      throw new Error("Duplicate reports for " + fromTest);
    } 
    if (!syntaxTests[fromTest]) {
      throw new Error("Unknown report for " + fromTest);
    }
    results[fromTest] = result;
    if (tests.length > 0) {
      runNext(tests.pop());
    } else {
      callback(results);
    }
  }
  function runNext(test) {
    setTimeout(function() {
      if (!results.hasOwnProperty(test)) {
        handleResult(test, "timeout");
      }
    }, 100);
    setTimeout(function() {
      try {
        syntaxTests[test](test, handleResult);
      } catch(e) {
        handleResult(test, e.message);
      }        
    });
  }
}

runTests(function() {
  console.log("DONE"); 
});    
