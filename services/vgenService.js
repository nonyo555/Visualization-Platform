const filedb = require("../models/file/file.db");
const user_usagedb = require('../models/user_usage/user_usage.db')
const preconfigdb = require("../models/preconfig/preconfig.db")
const templatedb = require("../models/template/template.db");
const template = templatedb.template
const fs = require("fs");
const { type } = require("os");

//limit number of visualization generated / 1 user
const limit = 20;

module.exports = { 
    checkLimit,
    create,
    Vgen, 
    generateRefId, 
    csvtojson,
    savePreconfig,
    getPreconfig,
    getFiles,
    getAllRefId,
    delete: _delete,
    csvConfig,
    update,
    updateActivate
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

function csvConfig(csvText){
  let data ={}
  let color = {}  
  let rows = csvText.split('\n');
  rows.forEach(row=>{
    let col = row.split('\r')[0].split(',')
    if (col[0].toLowerCase()== 'column'){
      data[col[1]] = col[2]
    }
    else if(col[0].toLowerCase()== 'color'){
      color[col[1]] = col[2]
    }
  })
  data['color'] = color
  return data
}

async function checkLimit(uid){
  //check visualization number limit before create
  let user_usage =  await user_usagedb.user_usage.findOne({attributes : ['is_reachlimit'] ,  where : { uid : uid }})
  let is_reachlimit = user_usage.dataValues.is_reachlimit

  return is_reachlimit;
}

async function create(refId, uid, vname){
  try {
      var file_id;
      const filename = refId + ".html";
      const path = __basedir + "\\generated\\" + filename;
      console.log(path);
      //var text = await fs.readFileSync(__basedir + "\\generated\\" + filename)
      //console.log (text.toString('hex'))

      if (fs.existsSync(path)) {
          console.log("file exist");
          await filedb.file.create({
              refId: refId,
              data: fs.readFileSync(path),
              template: vname,
              user_id: uid,
              status: 'active'
          }).then((file) => {
              console.log(file);
              file_id = file.dataValues.id;
              updateUsage(uid)
          });
        return file_id;  
      }
      
  } catch (error) {
      console.log(error);
  }
};

async function update(refId, uid, vname){
  try {
      const filename = refId + ".html";
      const path = __basedir + "\\generated\\" + filename;
      console.log(path);
      //var text = await fs.readFileSync(__basedir + "\\generated\\" + filename)
      //console.log (text.toString('hex'))

      if (fs.existsSync(path)) {
          console.log("file exist");
          await filedb.file.update({
              data: fs.readFileSync(path),
              template: vname,
          },
          {
            where: {
              refId : refId,
              user_id : uid
            }
          })

          var file = await filedb.file.findOne({attributes : ['id']},{ where : {refId : refId}})
          console.log(file.id);
        return file.id;  
      }
  } catch (error) {
      console.log(error);
  }
};

async function updateActivate(refId,status,uid){
  var newStatus = status == "active" ? "inactive" : "active";
  await filedb.file.update({
    status: newStatus
  },{
    where : {
      refId : refId,
      user_id : uid
    }
  })

  var file = await filedb.file.findOne({
    where : {
      refId : refId,
      user_id : uid
    }
  })

  return file;
}

async function updateUsage(uid) {
  var files_count = await filedb.file.count({ where : { user_id : uid , status : 'active'}})

    await user_usagedb.user_usage.update({
      count : files_count,
      is_reachlimit : files_count>=limit ? true : false
    },
    {
      where : {
        uid : uid
      }
    })
}

async function savePreconfig(file_id,vname,data,config,dataFileName,configFileName){
  console.log(dataFileName, typeof(dataFileName));
  try{
    const preconfig = await preconfigdb.preconfig.findOne({where : {file_id : file_id}})

    //already have a preconfig for this file
    if(preconfig){
      let params = {
        file_id : file_id, 
        vname: vname, 
        data: data, 
        config: config, 
        dataFileName: dataFileName, 
        configFileName: configFileName
      }
      Object.assign(preconfig, params);
      await preconfig.save();
    } //new preconfig
    else{
      preconfigdb.preconfig.create({
        file_id: file_id,
        vname: vname,
        data: data,
        config: config,
        dataFileName : dataFileName,
        configFileName: configFileName
      }).then((result) => {
        console.log("result :" , result);
      })
    }
  } catch(error){
      console.log(error);
  }
}

async function getPreconfig(refId,uid){
  const file_id = await filedb.file.findOne({
    attributes : ['id'],
    where : {
      user_id : uid,
      refId : refId
    }
  })

  if(file_id){
    const result = await preconfigdb.preconfig.findOne({
      where : {
        file_id : file_id.dataValues.id, 
      }
    })
    return result
  }
}

async function getFiles(refId, uid){
  const result = await filedb.file.findOne({
      where : {
          refId : refId,
          user_id : uid,
          status: "active"
      }
  })
  return result;
}

async function getAllRefId(uid){
  const result = await filedb.file.findAll({
      attributes : ['id','refId','template','status'],
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

  updateUsage(uid);
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

