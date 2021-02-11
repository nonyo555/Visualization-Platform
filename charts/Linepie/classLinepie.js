var linepie = require('./embeded');
var d3 = require('d3');
function checkColorSetting2(json) {
    var defaultColor = ['#ff9f40', '#ffcd56', '#4bc0c0', '#36a2eb', '#9966ff', '#ff6384']
    json.forEach(ajson => {
        var keys = Object.keys(ajson)
        if (!keys.includes('backgroundColor') || !keys.includes('borderColor')) {
            var color = defaultColor.pop()
            var bgcolor = d3.rgb(color)
            bgcolor.opacity = 0.7
            ajson['borderColor'] = color
            ajson['backgroundColor'] = `rgba(${bgcolor.r},${bgcolor.g},${bgcolor.b}, ${bgcolor.opacity})`
        }

    })
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
    setWidth(width) {
        if (typeof width === 'number') {
            this.width = width
        }
    }
    setHeight(height) {
        if (typeof height === 'number') {
            this.height = height
        }
    }
    setAttr(data, config) {
        console.log(data)
        var keys = Object.keys(config)
        //if (key.includes = )
        if (keys.includes('width') && keys.includes('height')) {
            this.setWidth(config.width)
            this.setHeight(config.height)
        }
        //this.setLabel(config.templatelabel)
        this.setJsontoJsonDataset(data, config);
    }
    getWidth() {
        return this.width
    }
    getHeight() {
        return this.height
    }
    setJsontoJsonDataset(jsonList, config) {
        let datsetsLabelColumn = config.label
        let dataColumn = config.data
        jsonList.forEach(ajson => {
            var label = ajson[datsetsLabelColumn]
            console.log(datsetsLabelColumn)
            var haveDataset = false;
            this.lineJson.forEach(ljson => {
                if (ljson.label == label) {
                    ljson.data.push(ajson[dataColumn])
                    haveDataset = true
                    return
                }
            })
            if (haveDataset == false) {
                this.lineJson.push({ 'label': ajson[datsetsLabelColumn], 'data': [ajson[dataColumn]] })
            }
        })
        this.pieJson = updatePieJson(this.lineJson)
    }
    generateHTML() {
        this.lineJson = checkColorSetting2(this.lineJson)
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