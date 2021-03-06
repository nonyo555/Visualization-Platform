const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const zsunburst = require('./zoomablesunburst.js')
const thai = require('./thailandPolygon.js');
const fs = require('fs');
function changeJsonKey(jsons,jconfig){
    var jsonstr = JSON.stringify(jsons)
    var keys = Object.keys(jconfig)
    keys.forEach(key => {
        jsonstr.split(`"`+jconfig[key] +`":`).join(`'`+key+`':`)
    });
    return JSON.parse(jsonstr)
}
function checkJsonconfig(json){
    var keys = Object.keys(json)
    var bool = true;
    if(keys.includes('children') && !keys.includes('value')){
        if(!Array.isArray(json['children'])){
            json['children']= [ json['children']]
        }
        for (let i = 0; i < json['children'].length; i++) {
            json['children'][i] = checkJsonconfig(json['children'][i]);
        }
    }
    else if (keys.includes('children') && keys.includes('value')){
        json['children'].push({
            'name':'self('+json.name+')',
            'value': json.value
        })
        delete json.value
    }
    return json
}

// all last Children and json which has a value key have a value is 1  
function jsonSingleValue(json){
    var keys = Object.keys(json)
    var bool = true;
    if(keys.includes('children') && !keys.includes('value')){
        if(!Array.isArray(json['children'])){
            json['children']= [ json['children']]
        }
        for (let i = 0; i < json['children'].length; i++) {
            json['children'][i] =jsonSingleValue(json['children'][i]);
        }
    }
    else if (keys.includes('value')){
        json['value']=1
    }
    else if(!keys.includes('children') && !keys.includes('value')){
        json['value']=1
    }
    return json
}
class Vgen{
    constructor() {
        this.graphs = [1,2,3,4,5] 
        // var data = fs.readFileSync('test/path.json','utf8')
        // var ajson =JSON.parse(data)
        // this.graphobject= {}
        // this.graphs =  Object.keys(ajson)
        // this.graphs.forEach(graphName=>{
        //     this.graphobject[graphName] = require(ajson[graphName]).classObject()
        // })
    }
    static getGrap(){
        return graphs
    }
    static createSunburst()
    {
        return new Sunburst()
    }
    static createThaiPolygon()
    {
        return new ThaiPolygon()
    }
    static createLinepie()
    {
        return new LinePie()
    }
}







class Sunburst {
    constructor(){
    this.width = 800;
    this.height = 800;
    this.title = function title (d){return d.data.name+`   `+String(d.value)}
    this.label = function label (d){return d.data.name}
    this.json= {'name': 'root','children':[]}
    //example data 
    //change name to 'json' to test
    this.json = {
        "name": "flare",
        "children": [
         {
          "name": "analytics",
          "children": [
           {
            "name": "cluster",
            "children": [
             {"name": "AgglomerativeCluster", "value": 3938},
             {"name": "CommunityStructure", "value": 3812},
             {"name": "HierarchicalCluster", "value": 6714},
             {"name": "MergeEdge", "value": 743}
            ]
           },
           {
            "name": "graph",
            "children": [
             {"name": "BetweennessCentrality", "value": 3534},
             {"name": "LinkDistance", "value": 5731},
             {"name": "MaxFlowMinCut", "value": 7840},
             {"name": "ShortestPaths", "value": 5914},
             {"name": "SpanningTree", "value": 3416}
            ]
           },
           {
            "name": "optimization",
            "children": [
             {"name": "AspectRatioBanker", "value": 7074}
            ],'value' : 1234
           }
          ]
         },
         {
          "name": "animate",
          "children": [
           {"name": "Easing", "value": 17010},
           {"name": "FunctionSequence", "value": 5842},
           {
            "name": "interpolate",
            "children": [
             {"name": "ArrayInterpolator", "value": 1983},
             {"name": "ColorInterpolator", "value": 2047},
             {"name": "DateInterpolator", "value": 1375},
             {"name": "Interpolator", "value": 8746},
             {"name": "MatrixInterpolator", "value": 2202},
             {"name": "NumberInterpolator", "value": 1382},
             {"name": "ObjectInterpolator", "value": 1629},
             {"name": "PointInterpolator", "value": 1675},
             {"name": "RectangleInterpolator", "value": 2042}
            ]
           },
           {"name": "ISchedulable", "value": 1041},
           {"name": "Parallel", "value": 5176},
           {"name": "Pause", "value": 449},
           {"name": "Scheduler", "value": 5593},
           {"name": "Sequence", "value": 5534},
           {"name": "Transition", "value": 9201},
           {"name": "Transitioner", "value": 19975},
           {"name": "TransitionEvent", "value": 1116},
           {"name": "Tween", "value": 6006}
          ]
         },
         {
          "name": "data",
          "children": [
           {
            "name": "converters",
            "children": [
             {"name": "Converters", "value": 721},
             {"name": "DelimitedTextConverter", "value": 4294},
             {"name": "GraphMLConverter", "value": 9800},
             {"name": "IDataConverter", "value": 1314},
             {"name": "JSONConverter", "value": 2220}
            ]
           },
           {"name": "DataField", "value": 1759},
           {"name": "DataSchema", "value": 2165},
           {"name": "DataSet", "value": 586},
           {"name": "DataSource", "value": 3331},
           {"name": "DataTable", "value": 772},
           {"name": "DataUtil", "value": 3322}
          ]
         },
         {
          "name": "display",
          "children": [
           {"name": "DirtySprite", "value": 8833},
           {"name": "LineSprite", "value": 1732},
           {"name": "RectSprite", "value": 3623},
           {"name": "TextSprite", "value": 10066}
          ]
         },
         {
          "name": "flex",
          "children": [
           {"name": "FlareVis", "value": 4116}
          ]
         },
         {
          "name": "physics",
          "children": [
           {"name": "DragForce", "value": 1082},
           {"name": "GravityForce", "value": 1336},
           {"name": "IForce", "value": 319},
           {"name": "NBodyForce", "value": 10498},
           {"name": "Particle", "value": 2822},
           {"name": "Simulation", "value": 9983},
           {"name": "Spring", "value": 2213},
           {"name": "SpringForce", "value": 1681}
          ]
         },
         {
          "name": "query",
          "children": [
           {"name": "AggregateExpression", "value": 1616},
           {"name": "And", "value": 1027},
           {"name": "Arithmetic", "value": 3891},
           {"name": "Average", "value": 891},
           {"name": "BinaryExpression", "value": 2893},
           {"name": "Comparison", "value": 5103},
           {"name": "CompositeExpression", "value": 3677},
           {"name": "Count", "value": 781},
           {"name": "DateUtil", "value": 4141},
           {"name": "Distinct", "value": 933},
           {"name": "Expression", "value": 5130},
           {"name": "ExpressionIterator", "value": 3617},
           {"name": "Fn", "value": 3240},
           {"name": "If", "value": 2732},
           {"name": "IsA", "value": 2039},
           {"name": "Literal", "value": 1214},
           {"name": "Match", "value": 3748},
           {"name": "Maximum", "value": 843},
           {
            "name": "methods",
            "children": [
             {"name": "add", "value": 593},
             {"name": "and", "value": 330},
             {"name": "average", "value": 287},
             {"name": "count", "value": 277},
             {"name": "distinct", "value": 292},
             {"name": "div", "value": 595},
             {"name": "eq", "value": 594},
             {"name": "fn", "value": 460},
             {"name": "gt", "value": 603},
             {"name": "gte", "value": 625},
             {"name": "iff", "value": 748},
             {"name": "isa", "value": 461},
             {"name": "lt", "value": 597},
             {"name": "lte", "value": 619},
             {"name": "max", "value": 283},
             {"name": "min", "value": 283},
             {"name": "mod", "value": 591},
             {"name": "mul", "value": 603},
             {"name": "neq", "value": 599},
             {"name": "not", "value": 386},
             {"name": "or", "value": 323},
             {"name": "orderby", "value": 307},
             {"name": "range", "value": 772},
             {"name": "select", "value": 296},
             {"name": "stddev", "value": 363},
             {"name": "sub", "value": 600},
             {"name": "sum", "value": 280},
             {"name": "update", "value": 307},
             {"name": "variance", "value": 335},
             {"name": "where", "value": 299},
             {"name": "xor", "value": 354},
             {"name": "_", "value": 264}
            ]
           },
           {"name": "Minimum", "value": 843},
           {"name": "Not", "value": 1554},
           {"name": "Or", "value": 970},
           {"name": "Query", "value": 13896},
           {"name": "Range", "value": 1594},
           {"name": "StringUtil", "value": 4130},
           {"name": "Sum", "value": 791},
           {"name": "Variable", "value": 1124},
           {"name": "Variance", "value": 1876},
           {"name": "Xor", "value": 1101}
          ]
         },
         {
          "name": "scale",
          "children": [
           {"name": "IScaleMap", "value": 2105},
           {"name": "LinearScale", "value": 1316},
           {"name": "LogScale", "value": 3151},
           {"name": "OrdinalScale", "value": 3770},
           {"name": "QuantileScale", "value": 2435},
           {"name": "QuantitativeScale", "value": 4839},
           {"name": "RootScale", "value": 1756},
           {"name": "Scale", "value": 4268},
           {"name": "ScaleType", "value": 1821},
           {"name": "TimeScale", "value": 5833}
          ]
         },
         {
          "name": "util",
          "children": [
           {"name": "Arrays", "value": 8258},
           {"name": "Colors", "value": 10001},
           {"name": "Dates", "value": 8217},
           {"name": "Displays", "value": 12555},
           {"name": "Filter", "value": 2324},
           {"name": "Geometry", "value": 10993},
           {
            "name": "heap",
            "children": [
             {"name": "FibonacciHeap", "value": 9354},
             {"name": "HeapNode", "value": 1233}
            ]
           },
           {"name": "IEvaluable", "value": 335},
           {"name": "IPredicate", "value": 383},
           {"name": "IValueProxy", "value": 874},
           {
            "name": "math",
            "children": [
             {"name": "DenseMatrix", "value": 3165},
             {"name": "IMatrix", "value": 2815},
             {"name": "SparseMatrix", "value": 3366}
            ]
           },
           {"name": "Maths", "value": 17705},
           {"name": "Orientation", "value": 1486},
           {
            "name": "palette",
            "children": [
             {"name": "ColorPalette", "value": 6367},
             {"name": "Palette", "value": 1229},
             {"name": "ShapePalette", "value": 2059},
             {"name": "SizePalette", "value": 2291}
            ]
           },
           {"name": "Property", "value": 5559},
           {"name": "Shapes", "value": 19118},
           {"name": "Sort", "value": 6887},
           {"name": "Stats", "value": 6557},
           {"name": "Strings", "value": 22026}
          ]
         },
         {
          "name": "vis",
          "children": [
           {
            "name": "axis",
            "children": [
             {"name": "Axes", "value": 1302},
             {"name": "Axis", "value": 24593},
             {"name": "AxisGridLine", "value": 652},
             {"name": "AxisLabel", "value": 636},
             {"name": "CartesianAxes", "value": 6703}
            ]
           },
           {
            "name": "controls",
            "children": [
             {"name": "AnchorControl", "value": 2138},
             {"name": "ClickControl", "value": 3824},
             {"name": "Control", "value": 1353},
             {"name": "ControlList", "value": 4665},
             {"name": "DragControl", "value": 2649},
             {"name": "ExpandControl", "value": 2832},
             {"name": "HoverControl", "value": 4896},
             {"name": "IControl", "value": 763},
             {"name": "PanZoomControl", "value": 5222},
             {"name": "SelectionControl", "value": 7862},
             {"name": "TooltipControl", "value": 8435}
            ]
           },
           {
            "name": "data",
            "children": [
             {"name": "Data", "value": 20544},
             {"name": "DataList", "value": 19788},
             {"name": "DataSprite", "value": 10349},
             {"name": "EdgeSprite", "value": 3301},
             {"name": "NodeSprite", "value": 19382},
             {
              "name": "render",
              "children": [
               {"name": "ArrowType", "value": 698},
               {"name": "EdgeRenderer", "value": 5569},
               {"name": "IRenderer", "value": 353},
               {"name": "ShapeRenderer", "value": 2247}
              ]
             },
             {"name": "ScaleBinding", "value": 11275},
             {"name": "Tree", "value": 7147},
             {"name": "TreeBuilder", "value": 9930}
            ]
           },
           {
            "name": "events",
            "children": [
             {"name": "DataEvent", "value": 2313},
             {"name": "SelectionEvent", "value": 1880},
             {"name": "TooltipEvent", "value": 1701},
             {"name": "VisualizationEvent", "value": 1117}
            ]
           },
           {
            "name": "legend",
            "children": [
             {"name": "Legend", "value": 20859},
             {"name": "LegendItem", "value": 4614},
             {"name": "LegendRange", "value": 10530}
            ]
           },
           {
            "name": "operator",
            "children": [
             {
              "name": "distortion",
              "children": [
               {"name": "BifocalDistortion", "value": 4461},
               {"name": "Distortion", "value": 6314},
               {"name": "FisheyeDistortion", "value": 3444}
              ]
             },
             {
              "name": "encoder",
              "children": [
               {"name": "ColorEncoder", "value": 3179},
               {"name": "Encoder", "value": 4060},
               {"name": "PropertyEncoder", "value": 4138},
               {"name": "ShapeEncoder", "value": 1690},
               {"name": "SizeEncoder", "value": 1830}
              ]
             },
             {
              "name": "filter",
              "children": [
               {"name": "FisheyeTreeFilter", "value": 5219},
               {"name": "GraphDistanceFilter", "value": 3165},
               {"name": "VisibilityFilter", "value": 3509}
              ]
             },
             {"name": "IOperator", "value": 1286},
             {
              "name": "label",
              "children": [
               {"name": "Labeler", "value": 9956},
               {"name": "RadialLabeler", "value": 3899},
               {"name": "StackedAreaLabeler", "value": 3202}
              ]
             },
             {
              "name": "layout",
              "children": [
               {"name": "AxisLayout", "value": 6725},
               {"name": "BundledEdgeRouter", "value": 3727},
               {"name": "CircleLayout", "value": 9317},
               {"name": "CirclePackingLayout", "value": 12003},
               {"name": "DendrogramLayout", "value": 4853},
               {"name": "ForceDirectedLayout", "value": 8411},
               {"name": "IcicleTreeLayout", "value": 4864},
               {"name": "IndentedTreeLayout", "value": 3174},
               {"name": "Layout", "value": 7881},
               {"name": "NodeLinkTreeLayout", "value": 12870},
               {"name": "PieLayout", "value": 2728},
               {"name": "RadialTreeLayout", "value": 12348},
               {"name": "RandomLayout", "value": 870},
               {"name": "StackedAreaLayout", "value": 9121},
               {"name": "TreeMapLayout", "value": 9191}
              ]
             },
             {"name": "Operator", "value": 2490},
             {"name": "OperatorList", "value": 5248},
             {"name": "OperatorSequence", "value": 4190},
             {"name": "OperatorSwitch", "value": 2581},
             {"name": "SortOperator", "value": 2023}
            ]
           },
           {"name": "Visualization", "value": 16540}
          ]
         }
        ]
       }
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
    setTitle(title){
        // write a function or  str to config title
        // function must have a 'd' in parameter 
        // {d} d is a node and d.data is a json in that path
        // {d} d can get a d's parent and d's value by d.parent  and d.value
        // {d} d can get depth and height in Sunburst by d.depth and d.heigth 
        if(typeof title == 'string' || typeof title =='function'){
            this.title = title
        }
    }
    getTitle(){
        return this.title
    }
    setlabel(label){
        // write a function or  str to config title
        // function must have a 'd' in parameter
        // {d} d is a node and d.data is a json in that path
        // {d} d can get a d's parent and d's value by d.parent  and d.value
        // {d} d can get depth and height in Sunburst by d.depth and d.heigth 
        if(typeof label == 'string' || typeof label =='function'){
            this.label = label
        }
    }
    getLabel(){
        return this.label
    }
    genJson(mode,path='',json={},jconfig={}){
        if (typeof path == 'string' && typeof mode == 'string'){   
            var curr = this.json
            var parent = this.json

            // must config with specific key
            // example jconfig ={'name':"name2",'children':'children2','value':'value2'} 
            // {'name2': 123} = > {'name': 123}
            if(jconfig !== {}){
                json = changeJsonKey(json,jconfig)
            }
            if (path !== ''){
                var pathLists = path.split('/');
                for(var i =0 ;i< pathLists.length;i++){
                        if(Object.keys(curr).includes('children')){
                            curr['children'].forEach(child => {
                                if(child['name'] == pathLists[i]){
                                    parent = curr
                                    curr = child
                                    return
                                }
                            })
                        }
                        else {
                            throw 'err'
                        }
                }
            }
            if(mode == 'addChild'){
                var keys = Object.keys(curr)
                if (!Array.isArray(json)){
                    json = [json]
                }
                if (keys.includes('children')){
                    if (Array.isArray(curr['children'])){
                        curr['children'].concat(json)
                    }
                    else{
                        json.concat(curr['children'])
                }}
                else{
                    curr['children'] = json
                }
            }
            else if(mode == 'addValue'){
                curr['value'] =json.value
            }
            else if (mode == 'del'){
                if (path !== ''){
                var index = parent.children.indexOf(curr)
                parent.children.pop(index)
                }
                else
                { throw 'Can`t delete a root'}
            }
            else if(mode == 'set'){
                this.json = json
            }
            else if(mode == 'clear'){
                this.json= {'name': 'root'}
            }
        }
        else{
            throw 'err';
        }
    }
    getJson(){
        return this.json
    }
    generateHTML(singleValue = false){
        this.json = checkJsonconfig(this.json)
        if(singleValue == true){
        this.json = jsonSingleValue(this.json)
        }
        if (typeof this.title == 'string'){
            this.title = `'`+this.title+`'`
        }
        if (typeof this.label == 'string'){
            this.label = `'`+this.label+`'`
        }
        var dom = new JSDOM(`<head>
        <script src="https://d3js.org/d3.v5.js"></script>
        </head>
        <body>
        <svg width ='`+String(this.width)+`' height='`+ String(this.height)+`'></svg>
        <script>
        var data =`+JSON.stringify(this.json)+`
        var format = d3.format(",d")
        `+ zsunburst.zoomableSunburst.toString()+`
        zoomableSunburst(data,`+this.title.toString()+`,`+this.label.toString()+`)
        </script> 
        </body>
        `);
        return dom.serialize();
    }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
    setJsontoJsonDataset(jsonList,provinceColumn,datsetsLabelColumn,dataColumn){
        jsonList.forEach(ajson =>{
            var province =  ajson[provinceColumn]
            //console.log(province)
            if (Object.keys(this.json).includes(province)){
                var haveDataset = false;
                this.json[province].forEach(ele =>{
                    if (ele['label'] == ajson[datsetsLabelColumn]){
                        ele['data'].push(ajson[dataColumn])
                        haveDataset =true
                        return
                    }
                })
                if(haveDataset == false){
                    this.json[province].push({'label':ajson[datsetsLabelColumn] ,'data':[ajson[dataColumn]]})
                }
            }
            else{
                this.json[province] = [{'label':ajson[datsetsLabelColumn] ,'data':[ajson[dataColumn]]}]
            }
        })
    }
    getJson(){
        return this.json
    }
    getLabel(){
        return this.label 
    }
    setLabel(label){
        if(Array.isArray(label)){
            this.label=label
        }
        throw 'Labels is not Array'
    }
    generateHTML(){
        this.json = checkColorSetting(this.json)
        for (let i =0;i<this.label.length;i++){
            this.label[i]= `'`+this.label[i]+`'`
        }
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
                `+thai.thaiPolygon.toString()+`
                thaiPolygon([`+ this.label+`],`+ JSON.stringify(this.json)+`,`+this.width+`,`+this.height+`)
                </script>
                </body>
                </html>
        `)
        return dom.serialize()
    }
}
////////////////////////////////////////////////////////////////////////////////////////
var  linepie = require('./linepie.js');
var d3 = require('d3');
function checkColorSetting2(json){
    var defaultColor = ['#ff9f40','#ffcd56','#4bc0c0','#36a2eb','#9966ff','#ff6384']
    json.forEach(ajson=>{
        var keys = Object.keys(ajson)
        if(!keys.includes('backgroundColor') || !keys.includes('borderColor')){
            var color =  defaultColor.pop()
            var bgcolor = d3.rgb(color)
            bgcolor.opacity = 0.7
            ajson['borderColor'] = color
            ajson['backgroundColor'] = `rgba(${bgcolor.r},${bgcolor.g},${bgcolor.b}, ${bgcolor.opacity})`
        }
        
    })
    return json
}
function updatePieJson(json){
    var pieJson = {};
    json.forEach(ajson=>{
        pieJson[ajson['label']] = ajson['data'].reduce((a, b) => a + b, 0)
    })
    return pieJson
}
class LinePie{
    constructor(){
        this.width = 800;
        this.height = 800;
        this.label = ['a','b','c','d']
        this.lineJson =  []
        this.pieJson = {}
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
    setJsontoJsonDataset(jsonList,datsetsLabelColumn,dataColumn){
        jsonList.forEach(ajson =>{
            var label =  ajson[datsetsLabelColumn]
            var haveDataset = false;
            this.lineJson.forEach(ljson =>{
                if (ljson.label == label){
                    ljson.data.push(ajson[dataColumn])
                    haveDataset =true
                    return
                }
            })
            if(haveDataset == false){
                this.lineJson.push({'label':ajson[datsetsLabelColumn] ,'data':[ajson[dataColumn]]})
            }
        })
        this.pieJson = updatePieJson(this.lineJson)

    }
    generateHTML(percenMode = false){
        this.lineJson = checkColorSetting2(this.lineJson)
        var label =[]
        for (let i =0;i<this.label.length;i++){
            label.push(`'`+this.label[i]+`'`)
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
            `+linepie.linepie.toString()+`
            linepie([`+label+`],`+JSON.stringify(this.lineJson)+`,`+ JSON.stringify(this.pieJson)+`,`+this.width+`,`+this.height+`,`+percenMode+`)
        </script>
        </body>
        
        `
        return dom
    }
}
module.exports = {Vgen}
