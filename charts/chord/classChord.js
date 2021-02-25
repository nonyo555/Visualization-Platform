var fs = require('fs');
var d3 = require('d3');
var chord = require('./chordEmbeded')
class Chord{
    constructor(){
        this.width = 800
        this.height = 800   
        this.data = []
        this.color = {}
        this.ribbonTitles = function (d) {
            let ribName = Array.from(new Set(dataset.flatMap(d => [d.source, d.target])))
            return `${ribName[d.source.index]} => ${ribName[d.target.index]} = ${d.source.value}` }
        this.pathTitles = function(d){
            let pathName = Array.from(new Set(dataset.flatMap(d => [d.source, d.target])))
            let pathIndex=  new Map(pathName.map((name, i) => [name, i]));
            let pathMatrix =   Array.from(pathIndex, () => new Array(pathName.length).fill(0));
            for (const {source, target, value} of dataset) pathMatrix[pathIndex.get(source)][pathIndex.get(target)] += value;
            return `${pathName[d.index]} => other =  ${d3.sum(pathMatrix[d.index])} \n  other => ${pathName[d.index]} = ${d3.sum(pathMatrix, row => row[d.index])} `
        }
    }
    setWidth(width) {
        if (!isNaN(width) ) {
            this.width = parseInt(width) 
        }
    }
    setHeight(height) {
        if (!isNaN(height)) {
            this.height = parseInt(height)
        }
    }
    setPathTitle(config){
        if (Object.keys(config).includes('ribbonTitles')){
            if(typeof config.ribbonTitles == 'string'){
                this.ribbonTitles = config.ribbonTitles
            }
        }
    }
    setRibbonTitle(config){
        if (Object.keys(config).includes('pathTitles')){
            if(typeof config.pathTitles  == 'string'){
                this.pathTitles  = config.pathTitles 
            }
        }
    }
    setJsontoJsonDataset(jsonList,config){
        var newJsonList = []
        jsonList.forEach(json => {
            let newJson = {}
            newJson['source'] = json[config['source']]
            newJson['target'] = json[config['target']]
            newJson['value'] = json[config['value']]
            newJsonList.push(newJson)
        });
        this.data = newJsonList
    }
    setColor(config){
        if(Object.keys(config).includes('color')){
            this.color = config.color
        }
    }
    setAttr(data,config){
        var keys = Object.keys(config)
        if (keys.includes('width') && keys.includes('height')) {
            this.setWidth(config.width)
            this.setHeight(config.height)
        }
        this.setJsontoJsonDataset(data,config)
        this.setRibbonTitle(config)
        this.setPathTitle(config)
        this.setColor(config)
    }
    getWidth() {
        return this.width
    }
    getHeight() {
        return this.height
    }  
    generateHTML(){
        var dom = `
        <head>
        <script src="https://d3js.org/d3.v5.js"></script>
        <script src="https://d3js.org/d3-color.v2.min.js"></script>
        <script src="https://d3js.org/d3-path.v2.min.js"></script>
        <script src="https://d3js.org/d3-chord.v2.min.js"></script>
    </head>

    <body>
      <div style="position: relative;">
      <svg id ='graph'>
      </svg>
      </div>
      </div>
      
    <script>
        var dataset = `+ JSON.stringify(this.data)+`
        `+chord.chords.toString()+`
        chords(dataset,`+this.width.toString()+`,`+this.height.toString()+`,`+this.ribbonTitles.toString()+`,`+this.pathTitles.toString()+`,`+JSON.stringify(this.color)+`)
    </script>
    </body>
        `
    return dom
    }
} 
function object (){return  new Chord();}
module.exports = {object}