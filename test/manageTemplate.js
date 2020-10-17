const fs = require('fs');
const Vgen = require('./vgenTest.js')
function deleteTemplate(templateName){
    var data = fs.readFileSync('test/path.json','utf8')
    var ajson =JSON.parse(data)
    delete ajson[templateName]
    fs.writeFileSync('test/path.json', JSON.stringify(ajson));
}
function changeConfigTemplate(path,fileNameList,fileTextList){
    for(var i = 0 ; i<Object.keys(ajson).length;i++){
        fs.writeFileSync(path+fileNameList[i], JSON.stringify(fileTextList[i]));
    }
}
function addTemplate(templateName,path,fileNameList,fileTextList){
    var data = fs.readFileSync('test/path.json','utf8')
    var ajson =JSON.parse(data)
    ajson[templateName] = path
    for(var i = 0 ; i<Object.keys(ajson).length;i++){
        fs.writeFileSync(path+fileNameList[i], JSON.stringify(fileTextList[i]));
    }
}
var data = fs.readFileSync('test/path.json','utf8')
var ajson =JSON.parse(data)
var graphobject= {}
Object.keys(ajson).forEach(graph=>{
    this.graphobject[graph] = require(ajson[graph]).classobject()
})
// deleteTemplate('linepie')
// console.log(ajson)


