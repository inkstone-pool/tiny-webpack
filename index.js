import fs from 'fs'
import path from 'path'
import bableParser from '@babel/parser'
import traverse from '@babel/traverse'
import ejs from 'ejs'
import {transformFromAst} from 'babel-core'
import {jsonLoader}from './jsonLoader.js'
import {ChangeOutputPath}from './ChangeOutputPath.js'
import { SyncHook } from 'tapable'
let id=0
const webpcakConfig={
    module:{
        rules:[
          {
            test:/\.json$/,
            use:[jsonLoader]
          }
        ]
    },
    plugins:[
        new ChangeOutputPath()
    ]
 
}
const hooks={
    emitFile:new SyncHook(['context'])
}
function initPlugins(){
    const plugins=webpcakConfig.plugins
    plugins.forEach((plugin)=>{
        plugin.apply(hooks)
    })
}
function createAsset(filePath){
    let  source=fs.readFileSync(filePath,{
        encoding:'utf-8'
    })
    // useLoader
    const loaders=webpcakConfig.module.rules
    loaders.forEach(({test,use})=>{
        if(test.test(filePath)){
            if(Array.isArray(use)){
                use.reverse().forEach((fn)=>{
                    source=fn(source)
                })

            }else{
                source=use(source)
            }
        
        }
    })
    
    const ast=bableParser.parse(source,{
        sourceType:'module'
    })
    const deps=[]
    traverse.default(ast,{
        ImportDeclaration({node}){
            deps.push(node.source.value)
        },
    })
    const {code}=transformFromAst(ast,null,{
        presets:['env']
    })
    return {
        filePath,
        code,
        deps,
        id:id++,
        mapping:{}
    }
}
function createGraph(filePath='./example/main.js'){
    const mainAsset=createAsset(filePath)
    const queue=[mainAsset]
    for (const asset of queue) {
        asset.deps.forEach(assetPath => {
            const subAsset= createAsset(path.resolve('./example',assetPath))
            asset.mapping[assetPath]=subAsset.id
            queue.push(subAsset)
        });
     
    }
    return queue
}
initPlugins()
const graph=createGraph()
build(graph)
function build(graph){
    const template=fs.readFileSync('./bundle.ejs',{
        encoding:'utf-8'
    })
    const data=graph.map((asset)=>{
        const {id,code,mapping}=asset
        return {
            id,
            code,
            mapping
        }
    })
    const code=ejs.render(template,{data})
    let  outputPath='./dist/bundle.js'
    const context={
        changeOutputPath(path){
            outputPath=path
        }
    }
    hooks.emitFile.call(context)
    fs.writeFileSync(outputPath,code)
}
