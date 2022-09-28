
(function(modules){
    function require(id){
        const [fn,mapping]= modules[id]
        const module={
            exports:{
            }
        }
        function locaRequire(filePath){
           const id= mapping[filePath]
           return require(id)
        }
        fn(locaRequire,module,module.exports)
        return module.exports
    }
    require(0)
}({
    
        "0":  [ function(require,module,exports){
            "use strict";

var _foo = require("./foo.js");

(0, _foo.foo)();
console.log('main');
        },{"./foo.js":1}],
    
        "1":  [ function(require,module,exports){
            "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.foo = foo;

var _bar = require("./bar.js");

var _dags = require("./dags.json");

var _dags2 = _interopRequireDefault(_dags);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _bar.bar)();
console.log(_dags2.default);

function foo() {
  console.log('foo');
}
        },{"./bar.js":2,"./dags.json":3}],
    
        "2":  [ function(require,module,exports){
            "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bar = bar;

function bar() {
  console.log('bar');
}
        },{}],
    
        "3":  [ function(require,module,exports){
            "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = "[{\r\n    \"name\":\"tom\",\r\n    \"get\":6\r\n},\r\n{\r\n    \"name\":\"jerry\",\r\n    \"get\":3\r\n}]";
        },{}],
    
  
}))
