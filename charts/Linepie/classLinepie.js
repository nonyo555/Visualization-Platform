var linepie = require('./embeded');
var d3 = require('d3');
function checkColorSetting2(json,config) {
    var defaultColor = ['#ff9f40', '#ffcd56', '#4bc0c0', '#36a2eb', '#9966ff', '#ff6384']
    var Rainbowcolor =d3.scaleSequential()
        .domain([0, json.length])
        .interpolator(d3.interpolateRainbow);
   for (let i = 0 ;i<json.length;i++){
        let ajson = json[i]
        let keys = Object.keys(ajson)
        if (!keys.includes('backgroundColor') || !keys.includes('borderColor')) {
            let color = '' ;
            if (Object.keys(config.color).includes(ajson['label'])){
                color = config.color[ajson['label']]
            }
            else{
                color = Rainbowcolor(i)
            }
            let bgcolor = d3.rgb(color)
            bgcolor.opacity = 0.7
            ajson['borderColor'] = color
            ajson['backgroundColor'] = `rgba(${bgcolor.r},${bgcolor.g},${bgcolor.b}, ${bgcolor.opacity})`
        }

    }
    return json
}
function updatePieJson(json) {
    var pieJson = {};
    json.forEach(ajson => {
        pieJson[ajson['label']] = ajson['data'].reduce((a, b) => parseInt(a) + parseInt(b), 0)
    })
    return pieJson
}
class LinePie {
    constructor() {
        this.width = 800;
        this.height = 800;
        this.label = ['a', 'b', 'c', 'd']
        this.lineJson = []
        this.pieJson = {}
        this.percenMode = true
    }
    setPercenMode(config){
        if(Object.keys(config).includes('percenMode')){
            if(config.percenMode.toLowerCase() == 'true'){
                this.percenMode = true
            }
            else if (config.percenMode.toLowerCase() == 'false'){
                this.percenMode = false
            }
            else
                throw 'percenMode column is wrong'
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
    setAttr(data, config) {
        var keys = Object.keys(config)
        if (keys.includes('width') && keys.includes('height')) {
            this.setWidth(config.width)
            this.setHeight(config.height)
        }
        this.setLabel(data,config)
        this.setPercenMode(config)
        this.setJsontoJsonDataset(data, config);
        this.lineJson = checkColorSetting2(this.lineJson,config)
    }
    setLabel(data,config){
        if(Object.keys(config).includes('label')){
            let label = []
            data.forEach(ele=>{
                if(!label.includes(ele[config.label])){
                    label.push(ele[config.label])
                }
            })
            this.label = label
        }
    }
    setJsontoJsonDataset(jsonList, config) {
        let datsetsTypeColumn = config.type
        let dataColumn = config.data
        jsonList.forEach(ajson => {
            var label = ajson[datsetsTypeColumn]
            var haveDataset = false;
            this.lineJson.forEach(ljson => {
                if (ljson.label == label) {
                    ljson.data.push(ajson[dataColumn])
                    haveDataset = true
                    return
                }
            })
            if (haveDataset == false) {
                this.lineJson.push({ 'label': ajson[datsetsTypeColumn], 'data': [ajson[dataColumn]] })
            }
        })
        this.pieJson = updatePieJson(this.lineJson)
    }
    generateHTML() {
        var label = []
        for (let i = 0; i < this.label.length; i++) {
            label.push(`'` + this.label[i] + `'`)
        }
        var dom = `

        <head>
            <script src="https://d3js.org/d3.v5.js"></script>
            <script src="https://cdn.jsdelivr.net/npm/chart.js@2.9.3/dist/Chart.min.js"></script>
            <script src="https://d3js.org/d3-color.v2.min.js"></script>
        </head>

        <body>
          <div style="position: relative;">
          <div id ='divC'>
          <canvas id="canvas" width="800" height="400" class="chartjs-render-monitor" style="width: 800px; height: 400px;"></canvas>
          </div>
          <div id='pie'  style="display: inline-block;" ></div>
          </div>
        <script>
            `+ linepie.linepie.toString() + `
            linepie([`+ label + `],` + JSON.stringify(this.lineJson) + `,` + JSON.stringify(this.pieJson) + `,` + this.width + `,` + this.height + `,` +  this.percenMode + `)
        </script>
        </body>
        `
        return dom
    }
}
function object() { return new LinePie() }
module.exports = { object }