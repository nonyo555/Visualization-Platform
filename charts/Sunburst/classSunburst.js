const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const zsunburst = require('./embeded.js')

function changeJsonKey(jsons,jconfig){
    var jsonstr = {}
    var keys = Object.keys(jconfig)
    keys.forEach(key => {
        if(jsons[jconfig[key]] != undefined){
            jsonstr[key] = jsons[jconfig[key]]
        }
    });
    console.log(jsonstr)
    return jsonstr
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
async function findPath(json,parent){
    if(json.name == parent){
        return json.name
    }
    else{
        let  result = "" 
        if ( Object.keys(json).includes('children')){
            for (let i = 0 ; i<json.children.length;i++){
                let ele  = json.children[i]
                let j = await findPath(ele,parent)
                if (j != "" && i != undefined){
                    result =  json.name+"/"+j
                    break
                }
            }
        }   
        //console.log(json.name+":"+result)
        return result
    }
}
class Sunburst {
    constructor(){
    this.width = 800;
    this.height = 800;
    this.title = function title (d){return d.data.name+`   `+String(d.value)}
    this.label = function label (d){return d.data.name}
    this.json= {'name': 'root','children':[]}
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
    setTitle(config){
        // write a function or  str to config title
        // function must have a 'd' in parameter 
        // {d} d is a node and d.data is a json in that path
        // {d} d can get a d's parent and d's value by d.parent  and d.value
        // {d} d can get depth and height in Sunburst by d.depth and d.heigth 
        if(Object.keys(config).includes('title')){
        if(typeof config.title == 'string'){
            this.title = title
        }
        else{throw 'Title format is wrong'}
    s}
    }
    getTitle(){
        return this.title
    }
    setLabel(config){
        // write a function or  str to config title
        // function must have a 'd' in parameter
        // {d} d is a node and d.data is a json in that path
        // {d} d can get a d's parent and d's value by d.parent  and d.value
        // {d} d can get depth and height in Sunburst by d.depth and d.heigth 
        if(Object.keys(config).includes('label')){
        if(typeof config.label == 'string'){
            this.label = label
        }
        else{throw `Label format is wrong  (${typeof config.label})`}
    }
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
                if (keys.includes('children')){
                    curr['children'].push(json)    
                }
                else{
                    curr['children'] = [json]
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
    async setAttr(data,config){

        var keys = Object.keys(config)
        if (keys.includes('width') &&keys.includes('height') ){
            this.setWidth(config.width)
            this.setHeight(config.height)
        }
        this.setLabel(config)
        this.setTitle(config)
        await this.setJsontoJsonDataset(data,config);
    }
    async setJsontoJsonDataset(jsonList,config){
        let jsonConfig = {name:config.name,value:config.value,parent:config.parent}
        if(config.mode =='set'){
            this.genJson('set','',jsonList,jsonConfig)
        }
        else{
            var Errcount = jsonList.length*2; 
            while(jsonList.length != 0){
                let json = jsonList.shift()
               // console.log(json)
                let path=""
                let  haveParent =Object.keys(json).includes(jsonConfig.parent)
                if( haveParent ){
                    path = await findPath(this.json,json[jsonConfig.parent])
                }
                if (path!= "" || !haveParent ){
                    this.genJson('addChild',path,json,jsonConfig)
                }
                else{
                    jsonList.push(json)
                    Errcount-=1;
                    if (Errcount ==0){
                        break;
                    }
                }
            }
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
function object (){return   new Sunburst()}
module.exports = {object}