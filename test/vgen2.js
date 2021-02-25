var filedb = require("../models/template/template.db");
var  template = filedb.template;
async function Vgen(templateName){
    var result = await template.findOne({
        where : {
            'templateName' : templateName
        }
    })
    if (result != null){
    var objectClass = require(result.class_path).object
    return objectClass
    }
    else{
        throw 'Not know this templateName'
    }
}
//console.log(new )