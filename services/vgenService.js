const uploadController = require("../controller/upload");
const filedb = require("../models/file/file.db");
const file = filedb.file;
const templatedb = require("../models/template/template.db");
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

function csvtojson(csvText){
  let data = []
  let rows = csvText.split('\n');
  let col = rows[0].split('\r')[0].split(',')
  for(let i=1 ; i<rows.length;i++){
      var  r =  rows[i].split('\r')[0]
      r =     r.split(',')
      var json = {}
      for(let j = 0; j<col.length;j++){
          if (r[j]!= "" && r[j] != undefined){
              json[col[j]] = r[j]
          }
      }
      // {} == {} => false wtf
      if(Object.keys(json).length != 0){
      data.push(json)
      }
  }
  return data
}

async function Vgen(templateName){
    var result = await template.findOne({
        where : {
            'TemplateName' : templateName
        }
    })
    if (result != null){
      var objectClass = require(result.Path).object()
      return objectClass
      }
      else{
          throw 'Not know this templateName'
      }
}
module.exports = { Vgen, generateRefId, csvtojson }
