
(function(modules){
    function require(id){
        const [fn,mapping]= modules[id]
        const module={
            exports:{
            }
        }
        function locaRequire(filePath){
           const id= mapping[filePath]
           console.log(mapping,filePath,id)
           return require(id)
        }
        fn(locaRequire,module,module.exports)
        return module.exports
    }
    require(1)
}({
    1: [function(require,module,exports){
        const {foo}=require('./foo.js');
        foo()
        console.log('main')
    },{'./foo.js':2}]  ,
    2: [function(require,module,exports){
        function foo(){
            console.log('foo')
        }
        module.exports={
            foo
        }
    },{}]
}))
