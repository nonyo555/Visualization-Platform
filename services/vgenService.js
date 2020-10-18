const uploadController = require("../controller/upload");
const filedb = require("../models/file.db");
const file = filedb.file;
const templatedb = require("../models/template.db");
const template = templatedb.template;
//check refId if already in db
async function isRefIdUnique(refId) {
  if(await file.findOne({where: { refId: refId }})){
    return false;
  }
  return true;
}
async function generateRefId() {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < 10; i++) { //10 digit id
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  while (!(await isRefIdUnique(result))) {
    result = '';
    for (var i = 0; i < 10; i++) { //10 digit id
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
  }
  return result;
}

async function Vgen(templateName){
    var result = await template.findOne({
        where : {
            'TemplateName' : templateName
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
module.exports = { Vgen, generateRefId }
