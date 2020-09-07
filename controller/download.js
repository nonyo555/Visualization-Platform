const fs = require("fs");

const db = require("../models");
const file = db.file;

const downloadFiles = async (refId) => {
    const result = await file.findOne({
        where : {
            refId : refId
        }
    })
    return result;
}

exports.downloadFiles = downloadFiles;