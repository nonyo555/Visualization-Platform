const fs = require("fs");
const filedb = require("../models/file/file.db");
const file = filedb.file;
const downloadFiles = async (refId, username) => {
    const result = await file.findOne({
        where : {
            refId : refId,
            username : username
        }
    })
    return result;
}

const getAllRefId = async (uid) => {
    const result = await file.findAll({
        where : {
            id : uid
        }
    })
    return result;
}

module.exports = { downloadFiles,getAllRefId };