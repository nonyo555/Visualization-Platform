const filedb = require("../models/file/file.db");
const templatedb = require("../models/template/template.db");
const template = templatedb.template
const fs = require("fs");

module.exports = { 
    create,
    Vgen, 
    generateRefId, 
    csvtojson,
    getFiles,
    getAllRefId,
    delete: _delete
};
    
async function isRefIdUnique(refId) {
  if(await filedb.file.findOne({where: { refId: refId }})){
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

async function create(refId, uid){
  try {
      const filename = refId + ".html";
      const path = __basedir + "\\generated\\" + filename;
      console.log(path);
      //var text = await fs.readFileSync(__basedir + "\\generated\\" + filename)
      //console.log (text.toString('hex'))

      if (fs.existsSync(path)) {
          console.log("file exist");
          filedb.file.create({
              refId: refId,
              data: fs.readFileSync(path),
              user_id: uid,
              status: 'active'
          }).then((file) => {
              fs.writeFileSync(
                  __basedir + "\\resource\\tmp\\" + file.refId + ".html",
                  file.data
              )
          });
      }
  } catch (error) {
      console.log(error);
  }
};


async function getFiles(refId, uid){
  const result = await filedb.file.findOne({
      where : {
          refId : refId,
          user_id : uid
      }
  })
  return result;
}

async function getAllRefId(uid){
  const result = await filedb.file.findAll({
      attributes : ['refId','status'],
      where : {
          user_id : uid
      }
  })
  return result;
}

async function _delete(id,uid) {
  const file = await getFile(id);
  if(file.user_id == uid)
    await file.destroy();
  else
    throw 'Unauthorized : Cannot delete other user\'s file'
}

async function getFile(id) {
  const file = await filedb.file.findByPk(id);
  if (!file) throw 'File not found';
  return file;
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

