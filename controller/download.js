const fs = require("fs");

const filedb = require("../models/file.db");
const file = filedb.file;

const downloadFiles = async (refId) => {
    const result = await file.findOne({
        where : {
            refId : refId
        }
    })
    return result;
}

exports.downloadFiles = downloadFiles;