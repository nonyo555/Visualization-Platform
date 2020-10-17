const fs = require("fs");

const filedb = require("../models/file.db");
const file = filedb.file;

const downloadFiles = async (refId, username) => {
    const result = await file.findOne({
        where : {
            refId : refId,
        }
    })
    if(result.username != username)
        return null;
    return result;
}

exports.downloadFiles = downloadFiles;