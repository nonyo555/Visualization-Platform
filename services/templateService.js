const fs = require('fs');
const templatedb = require("../models/template/template.db");
const template = templatedb.template;
const filedb = require("../models/file/file.db");
const rimraf = require("rimraf");

module.exports = {
    deleteTemplate,
    updateTemplate,
    updateActivate,
    addTemplate,
    getAll,
    getById,
    getOwn
}

async function deleteTemplate(id, uid) {
    const result = await getById(id)
    if (result.uid == uid){
        const dir = 'charts/' + result.TemplateName;
        const img_dir = 'public/' + result.TemplateName;
        const file_dir = 'public/example-files/'+ result.TemplateName;

        try {
            if(fs.existsSync(dir))
                rimraf.sync(dir);
            if(fs.existsSync(img_dir))
                rimraf.sync(img_dir);
            if(fs.existsSync(file_dir))
                rimraf.sync(file_dir);
        } catch(err) {
            console.error(err);
            throw err;
        }

        await result.destroy();
    }
        
    else throw "Unauthorized";

    return id;
}

async function updateTemplate(uid, templateName, description, img, classFile, embeddedFile, data, config) {
    const result = await template.findOne({ where: { 'TemplateName': templateName } })
    const old_img = result.img;
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
                    where: { 
                        TemplateName: templateName ,
                    }
                });
            fs.writeFileSync('public/'+ templateName + '/' + img.name, img.data);

            await filedb.file.update({ 
                'img': img.name 
            },
                {
                   where: {
                        img: old_img
                    } 
                })
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
        fs.writeFileSync('public/example-files/' + templateName + '/' + data.name, data.data);
        fs.writeFileSync('public/example-files/' + templateName + '/' + config.name, config.data);
    } else throw "Unauthorized"

    return result.id;
}

async function updateActivate(id, status, uid) {
    var newStatus = status == "active" ? "inactive" : "active";
    await template.update({
        status: newStatus
    }, {
        where: {
            id: id,
            uid: uid
        }
    })

    var result = await template.findOne({
        where: {
            id: id,
            uid: uid
        }
    })

    return result;
}

async function addTemplate(uid, templateName, description, img, classFile, embeddedFile, data, config) {
    if (!await template.findOne({ where: { TemplateName: templateName } })) {
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
        if (!fs.existsSync('public/' + templateName)) {
            fs.mkdirSync('public/' + templateName)
        }
        if (!fs.existsSync('public/example-files/' + templateName)) {
            fs.mkdirSync('public/example-files/' + templateName)
        }

        fs.writeFileSync('charts/' + templateName + '/' + classFile.name, classFile.data);
        fs.writeFileSync('charts/' + templateName + '/' + embeddedFile.name, embeddedFile.data);
        fs.writeFileSync('public/' + templateName + '/' +  img.name, img.data);
        fs.writeFileSync('public/example-files/' + templateName + '/' + data.name, data.data);
        fs.writeFileSync('public/example-files/' + templateName + '/' + config.name, config.data);

        return template_id;
    }
    else {
        throw "Already have this Template"
    }
}

async function getAll() {
    const result = await template.findAll({
        where: {
            status: 'active'
        }
    })
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


