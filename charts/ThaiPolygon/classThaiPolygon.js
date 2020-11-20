const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const polygon = require('./embeded.js')
function checkColorSetting(json){
    var defaultColor = ['#ff9f40','#ffcd56','#4bc0c0','#36a2eb','#9966ff','#ff6384']
    var checkColorList={}
    var keys = Object.keys(json)
    keys.forEach(key=>{
        json[key].forEach(ele=>{
            if(!Object.keys(ele).includes('backgroundColor')){
                if(!Object.keys(checkColorList).includes(ele['label'])){
                    var color = defaultColor.pop()
                    ele['backgroundColor'] = color
                    checkColorList[ele['label']] = color
                }
                else{
                    ele['backgroundColor'] =  checkColorList[ele['label']]
                }
            }
        })
    })
    return json
}
// function changeCSVtoDatasets(provinceColumn,datsetsLabelColumn,dataColumn){
// }
class ThaiPolygon{
    constructor(){
        this.subGraph = 'Bar'
        this.width = 1920
        this.height = 1080
        this.json = {}
        this.label = ['a','b','c','d']
        this.datatest =  {'Bangkok': [{
                label: 'Hello',
                backgroundColor: '#ff6384',
                data: [
                    120,
                    114,
                    252,
                    212,
                ]
                }, {
                label: 'Mother',
                backgroundColor: '#36a2eb',
                data: [
                    120,
                    254,
                    172,
                    112,
                ]
                }, {
                label: 'Fucker',
                backgroundColor: '#9966ff',
                data: [
                    320,
                    214,
                    152,
                    312,
                ]
                }]
                };
    }
    changeDatasetColor(label,color){
        var keys =  Object.keys(this.json);
        keys.forEach(key=>{
            this.json[key].forEach(dataset=>{
                if(dataset['label'] == label){
                    dataset['backgroundColor'] = color
                }
            }
            )
        })
    }
    changeDatasetLabel(label,nlabel){
        var keys =  Object.keys(this.json);
        keys.forEach(key=>{
            this.json[key].forEach(dataset=>{
                if(dataset['label'] == label){
                    dataset['label'] = nlabel
                }
            }
            )
        })
    }
    setJsontoJsonDataset(jsonList,config){
        let provinceColumn =    config.province
        let typeColumn = config.type
        let labelColumn = config.label
        if (Object.keys(config).includes('data')){
            var dataColumn = config.data
        }
        jsonList.forEach(ajson =>{
                let province =  ajson[provinceColumn]
                let label =  ajson[labelColumn]
                if (Object.keys(this.json).includes(province)){
                    let haveDataset = false;
                    this.json[province].forEach(ele =>{
                        if (ele['label'] == ajson[typeColumn]){
                            let index = this.label.indexOf(label)
                            if (dataColumn != undefined){
                                ele['data'][index] += parseInt(ajson[dataColumn])
                            }
                            else{
                                ele['data'][index] += 1
                            }
                            haveDataset =true
                            return
                        }
                    })
                    if(haveDataset == false){
                        let startData = new Array(this.label.length).fill(0)
                        let index = this.label.indexOf(label)
                        if (dataColumn != undefined){
                            startData[index] = parseInt(ajson[dataColumn])
                        }
                        else{
                            startData[index] = 1
                        }
                        this.json[province].push({'label':ajson[typeColumn] ,'data':startData})
                    }
                }
                else{
                    let startData = new Array(this.label.length).fill(0)
                    let index = this.label.indexOf(label)
                    if (dataColumn != undefined){
                        startData[index] = parseInt(ajson[dataColumn])
                    }
                    else{
                        startData[index] = 1
                    }
                    this.json[province] = [{'label':ajson[typeColumn] ,'data':  startData}]
                }
            })
         
        //console.log(this.json['Nan'][1].data)
    }
    async setAttr(data,config){
        var keys = Object.keys(config)
        //if (key.includes = )
        if (keys.includes('width') &&keys.includes('height') ){
            this.setWidth(config.width)
            this.setHeight(config.height)
        }
        await this.setLabel(data,config.label);
        this.setJsontoJsonDataset(data,config);
        if(keys.includes('color')){
        Object.keys(config.color).forEach(key=>{
            this.changeDatasetColor(key,config.color[key])
        })
        }
    }
    getJson(){
        return this.json
    }
    getLabel(){
        return this.label 
    }
    setLabel(data,labelColumn){
        let label =[]
        data.forEach(ajson=>{
            if(!label.includes(ajson[labelColumn])){
                label.push(ajson[labelColumn])
            }
        })
        if(Array.isArray(label)){
            this.label=label.sort()
        }
        else{throw 'Label is not Array'}
    }
    setWidth(width) {
        if (typeof width === 'number'){
        this.width = width
        }
    }
    setHeight(height) {
        if (typeof height === 'number'){
        this.height = height
        }
    }
    getWidth() {
       return this.width
    }
    getHeight() {
        return this.height
    }
    generateHTML(){
        this.json = checkColorSetting(this.json)
        //console.log(this.label)
        for (let i =0;i<this.label.length;i++){
            this.label[i] = `'`+this.label[i]+`'`
        }
        console.log(this.label)
        var dom = new JSDOM(`
                </html><!DOCTYPE html>
                <html lang="en">
                    <style>
                        text.big-text{
                        font-size: 40px;
                        font-weight: 400;
                        position:absolute;
                        top: 60px;
                        left: 20px;
                        z-index:99;
                        float:left;
                        }
                        .map-layer {
                        fill: #fff;
                        stroke: #ddd;
                        }
                        </style>
                <head>
                    <script src="https://d3js.org/d3.v5.js"></script>
                    <script src="https://cdn.jsdelivr.net/npm/chart.js@2.9.3/dist/Chart.min.js"></script>
                </head>
                <body>
                    <div>
                        <canvas id="canvas"  class="chartjs-render-monitor"></canvas>
                    </div>
                <script>
                `+polygon.thaiPolygon.toString()+`
                thaiPolygon([`+ this.label+`],`+ JSON.stringify(this.json)+`,`+this.width+`,`+this.height+`)
                </script>
                </body>
                </html>
        `)
        return dom.serialize()
    }
}

function object (){return  new ThaiPolygon();}
module.exports = {object}