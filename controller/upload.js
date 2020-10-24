const fs = require("fs");

const filedb = require("../models/file.db");
const file = filedb.file;

const uploadFiles = async (refId, username) => {
    try {
        const filename = refId + ".html";
        const path = __basedir + "\\generated\\" + filename;
        console.log(path);
        //var text = await fs.readFileSync(__basedir + "\\generated\\" + filename)
        //console.log (text.toString('hex'))

        if (fs.existsSync(path)) {
            console.log("file exist");
            file.create({
                refId: refId,
                data: fs.readFileSync(path),
                username: username
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

exports.uploadFiles = uploadFiles;