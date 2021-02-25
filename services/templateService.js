const fs = require('fs');
const templatedb = require("../models/template/template.db");
const template = templatedb.template;

module.exports = {
    deleteTemplate,
    updateTemplate,
    addTemplate,
    getAll,
    getById,
    getOwn
}

async function deleteTemplate(id, uid) {
    const result = await getById(id)
    if (result.uid == uid)
        await result.destroy();
    else throw "Unauthorized";

    return id;
}

async function updateTemplate(templateName, description, classFileName, embeddedFileName, fileNameList, fileTextList, img, uid) {
    const result = await template.findOne({ where: { 'TemplateName': templateName } })
    if (result.uid == uid) {
        for (var i = 0; i < 2; i++) {
            fs.writeFileSync('charts/' + templateName + '/' + fileNameList[i], fileTextList[i]);
        }
        if (img) {
            fs.writeFileSync('public/' + img.name, img.data);
            await template.update({
                'description': description,
                'img': img.name,
                'class_path': '../charts/' + templateName + '/' + classFileName,
                'embedded_path': '../charts/' + templateName + '/' + embeddedFileName,
            },
                {
                    where: { TemplateName: templateName }
                });
        }
        else {
            await template.update({
                'description': description,
                'class_path': '../charts/' + templateName + '/' + classFileName,
                'embedded_path': '../charts/' + templateName + '/' + embeddedFileName,
            },
                {
                    where: { TemplateName: templateName }
                });
        }

    } else throw "Unauthorized"

    return result.id;
}

async function addTemplate(uid, templateName, description, img, classFileName, embeddedFileName, fileNameList, fileTextList) {
    //console.log(check)
    if (!await template.findOne({ where: { TemplateName: templateName } })) {
        console.log("not find one")
        var template_id;
        await template.create({
            'uid': uid,
            'TemplateName': templateName,
            'description': description,
            'img': img.name,
            'class_path': '../charts/' + templateName + '/' + classFileName,
            'embedded_path': '../charts/' + templateName + '/' + embeddedFileName,
            'status': 'active'
        }).then((template) => {
            template_id = template.dataValues.id
        })
        if (!fs.existsSync('charts/' + templateName)) {
            fs.mkdirSync('charts/' + templateName)
        }
        for (let i = 0; i < fileNameList.length; i++) {
            fs.writeFileSync('charts/' + templateName + '/' + fileNameList[i], fileTextList[i]);
        }

        fs.writeFileSync('public/' + img.name, img.data);
        return template_id;
    }
    else {
        console.log("find one")
        throw "Already have this Template"
    }
}

async function getAll() {
    const result = await template.findAll()
    return result;
}

async function getById(id) {
    const result = await template.findByPk(id);
    if (!result) throw 'Template not found';
    return result;
}

async function getOwn(uid) {
    const result = await template.findAll({ where: { uid: uid } });
    return result;
}

// var data = fs.readFileSync('test/path.json','utf8')
// var ajson =JSON.parse(data)
// var graphobject= {}
// Object.keys(ajson).forEach(graph=>{
//     this.graphobject[graph] = require(ajson[graph]).classobject()
// })
// deleteTemplate('linepie')
// console.log(ajson)


