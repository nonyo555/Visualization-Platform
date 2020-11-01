const fs = require("fs");
const filedb = require("../models/file.db");
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

exports.downloadFiles = downloadFiles;