var fs = require('fs');
var d3 = require('d3');
var chord = require('./chordEmbeded')


class Chord{
    constructor(){
        this.width = 800
        this.height = 800   
        this.data = []
        this.ribbonTitles = ["","=>","=","B"]
        this.pathTitles = ["","=>","=>","B"] 
    }
    setWidth(width) {
        if (!isNaN(width) ) {
            console.log('hello')
            this.width = parseInt(width) 
        }
    }
    setPathTitle(config){
        var keys = Object.keys(config)
        if(keys.includes('pathTitle0')){
            this.leftTitle = config.leftTitle
        }
        else if(keys.includes('pathTitle1')){
            this.middleLeftTitle = config.middleLeftTitle
        }
        else if(keys.includes('pathTitle2')){
            this.middleRightTitle = config.middleRightTitle
        }
        else if (keys.includes('pathTitle3')){
            this.rightTitle = config.rigthTitle
        }
    }
    setRibbonTitle(config){
        var keys = Object.keys(config)
        if(keys.includes('ribbonTitle0')){
            this.leftTitle = config.leftTitle
        }
        else if(keys.includes('ribbonTitle1')){
            this.middleLeftTitle = config.middleLeftTitle
        }
        else if(keys.includes('ribbonTitle2')){
            this.middleRightTitle = config.middleRightTitle
        }
        else if (keys.includes('ribbonTitle3')){
            this.rightTitle = config.rigthTitle
        }
    }
    setJsontoJsonDataset(jsonList,config){
        var newJsonList = []
        console.log(jsonList)
        jsonList.forEach(json => {
            let newJson = {}
            newJson['source'] = json[config['source']]
            newJson['target'] = json[config['target']]
            newJson['value'] = json[config['value']]
            newJsonList.push(newJson)
        });
        this.data = newJsonList
    }
    setAttr(data,config){
        var keys = Object.keys(config)
        //if (key.includes = )
        if (keys.includes('width') && keys.includes('height')) {
            this.setWidth(config.width)
            this.setHeight(config.height)
        }
        this.setJsontoJsonDataset(data,config)
        this.setRibbonTitle(config)
        this.setPathTitle(config)
    }
    setHeight(height) {
        if (!isNaN(height)) {
            this.height = parseInt(height)
        }
    }
    getWidth() {
        return this.width
    }
    getHeight() {
        return this.height
    }  
    getTest(){
        return this.test
    }
    generateHTML(){
        let ribbons = []
        let paths = []
        for (let i = 0; i < this.ribbonTitles.length; i++) {
            ribbons.push(`'` + this.ribbonTitles[i] + `'`)
            paths.push(`'` + this.pathTitles[i] + `'`)
        }
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
        chords(dataset,`+this.width.toString()+`,`+this.height.toString()+`,[`+ribbons+`],[`+paths+`],`+JSON.stringify(this.color)+`)
    </script>
    </body>
        `
    return dom
    }
} 
function object (){return  new Chord();}
module.exports = {object}