const fs = require('fs');
const templatedb = require("../models/template/template.db");
const template = templatedb.template;

module.exports = {
    deleteTemplate,
    updateTemplate,
    addTemplate,
    getAll
}

async function deleteTemplate(templateName){
    const template_tmp = await template.findOne({ where : {TemplateName : templateName}})
    let template_id = template_tmp.dataValues.id;
    await template.destroy({
        where : {
            'TemplateName' : templateName
        }
    })
    return template_id;
}

async function updateTemplate(templateName,fileNameList,fileTextList){
    for(var i = 0 ; i<fileNameList.length;i++){
        fs.writeFileSync('charts/'+templateName+'/'+fileNameList[i], fileTextList[i]);
    }
    const template = await template.findOne({where : {'TemplateName' : templateName}})
    let template_id = template.dataValues.id;
    return template_id;
}

async function addTemplate(uid,templateName,classFileName,fileNameList,fileTextList){
    //console.log(check)
    if (!await template.findOne({where : {'TemplateName' : templateName}})){
        console.log("not find one")
        var template_id;
        await template.create({
            'uid': uid,
            'TemplateName': templateName,
            'Path': '../charts/'+templateName+'/'+classFileName,
            'status': 'active'
        }).then((template) => {
            template_id = template.dataValues.id
        })
        if (!fs.existsSync('charts/'+templateName)){
            fs.mkdirSync('charts/'+templateName)
        }
        for(let i = 0 ; i<fileNameList.length;i++){
            fs.writeFileSync('charts/'+templateName+'/'+fileNameList[i], fileTextList[i]);
        }
        return template_id;
    }
    else{
        console.log("find one")
        throw "Already have this Template"
    }
}

async function getAll(){
    const result = await template.findAll({
        attributes : ['TemplateName','status'],
    })
    return result;
  }
  
// var data = fs.readFileSync('test/path.json','utf8')
// var ajson =JSON.parse(data)
// var graphobject= {}
// Object.keys(ajson).forEach(graph=>{
//     this.graphobject[graph] = require(ajson[graph]).classobject()
// })
// deleteTemplate('linepie')
// console.log(ajson)


