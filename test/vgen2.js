var filedb = require("../models/template.db");
var  template = filedb.template;
async function Vgen(templateName){
    var result = await template.findOne({
        where : {
            'templateName' : templateName
        }
    })
    if (result != null){
    var objectClass = require(result.Path).object
    return objectClass
    }
    else{
        throw 'Not know this templateName'
    }
}
//console.log(new )