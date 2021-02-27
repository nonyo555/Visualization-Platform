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

async function updateTemplate(uid,templateName, description, img, classFile, embeddedFile, data, config ) {
    const result = await template.findOne({ where: { 'TemplateName': templateName } })
    if (result.uid == uid) {
        if (img) {
            await template.update({
                'description': description,
                'img': img.name,
                'class_path': '../charts/' + templateName + '/' + classFile.name,
                'embedded_path': '../charts/' + templateName + '/' + embeddedFile.name,
                'data': data.name,
                'config': config.name
            },
                {
                    where: { TemplateName: templateName }
                });
            fs.writeFileSync('public/' + img.name, img.data);    
        }
        else {
            await template.update({
                'description': description,
                'class_path': '../charts/' + templateName + '/' + classFile.name,
                'embedded_path': '../charts/' + templateName + '/' + embeddedFile.name,
                'data': data.name,
                'config': config.name
            },
                {
                    where: { TemplateName: templateName }
                });
        }
        fs.writeFileSync('charts/' + templateName + '/' + classFile.name, classFile.data);
        fs.writeFileSync('charts/' + templateName + '/' + embeddedFile.name, embeddedFile.data);
        fs.writeFileSync('public/example-files/' + data.name, data.data);
        fs.writeFileSync('public/example-files/' + config.name, config.data);
    } else throw "Unauthorized"

    return result.id;
}

async function addTemplate(uid, templateName, description, img, classFile, embeddedFile, data, config) {
    if (!await template.findOne({ where: { TemplateName: templateName } })) {
        console.log("not find one")
        var template_id;
        await template.create({
            'uid': uid,
            'TemplateName': templateName,
            'description': description,
            'img': img.name,
            'class_path': '../charts/' + templateName + '/' + classFile.name,
            'embedded_path': '../charts/' + templateName + '/' + embeddedFile.name,
            'data': data.name,
            'config': config.name,
            'status': 'active'
        }).then((template) => {
            template_id = template.dataValues.id
        })

        if (!fs.existsSync('charts/' + templateName)) {
            fs.mkdirSync('charts/' + templateName)
        }

        fs.writeFileSync('charts/' + templateName + '/' + classFile.name, classFile.data);
        fs.writeFileSync('charts/' + templateName + '/' + embeddedFile.name, embeddedFile.data);
        fs.writeFileSync('public/' + img.name, img.data);
        fs.writeFileSync('public/example-files/' + data.name, data.data);
        fs.writeFileSync('public/example-files/' + config.name, config.data);

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


