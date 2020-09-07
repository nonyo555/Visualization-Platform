const fs = require("fs");

const db = require("../models");
const file = db.file;

const uploadFiles = async (refId) => {
    try {
        const filename = refId + ".html";
        const path = __basedir + "\\generated\\" + filename;
        console.log(path);

        var text = await fs.readFileSync(__basedir + "\\generated\\" + filename)
        console.log (text.toString('hex'))

        if (fs.existsSync(path)) {
            console.log("file exist");
            file.create({
                refId: refId,
                data: fs.readFileSync(
                    path
                ),
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