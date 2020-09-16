const db = require("../models");
const file = db.file;

//check refId if already in db
async function isRefIdUnique (refId) {
    try{
      return file.count({
        where : {refId : refId}
    }).then((count) => {
      console.log("count = " + count)
        if(count!=0){ 
            return false;
        }
        return true;
    })
    } catch (err){
      console.log(err);
    }
  }
  
  async function generateRefId() {
      var result           = '';
      var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      var charactersLength = characters.length;
      for ( var i = 0; i < 10; i++ ) { //10 digit id
         result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      
      while(! (await isRefIdUnique(result))){
        result = '';
        for ( var i = 0; i < 10; i++ ) { //10 digit id
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
       }
      }
      return result;
   }

exports.generateRefId = generateRefId;
  