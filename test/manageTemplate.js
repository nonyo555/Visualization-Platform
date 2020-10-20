const fs = require('fs');
//const Vgen = require('../services/vgenTest.js')
const templatedb = require("../models/template.db");
const template = templatedb.template;
async function deleteTemplate(templateName){
    await template.destroy({
        where : {
            'TemplateName' : templateName
        }
    })
}
function updateTemplate(directoryPath,fileNameList,fileTextList){
    for(var i = 0 ; i<fileNameList.length.length;i++){
        fs.writeFileSync(directoryPath+fileNameList[i], JSON.stringify(fileTextList[i]));
    }
}
async function addTemplate(templateName,classPath,directoryPath,fileNameList,fileTextList){
    var check = await template.findOne({
        where : {
            'TemplateName' : templateName
        }
    })
    console.log(check)
    if (check == null){
    await template.create({
        'TemplateName': templateName,
        'Path': classPath
      }, );
    if (!fs.existsSync(directoryPath)){
        fs.mkdirSync(directoryPath)
    }
    for(let i = 0 ; i<fileNameList.length;i++){
        fs.writeFileSync(directoryPath+fileNameList[i], JSON.stringify(fileTextList[i]));
    }
    }
    else{
        throw "Already have this Template"
    }
}
module.exports = {deleteTemplate,updateTemplate,addTemplate}
// var data = fs.readFileSync('test/path.json','utf8')
// var ajson =JSON.parse(data)
// var graphobject= {}
// Object.keys(ajson).forEach(graph=>{
//     this.graphobject[graph] = require(ajson[graph]).classobject()
// })
// deleteTemplate('linepie')
// console.log(ajson)


