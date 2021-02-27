const authorize = require('../helper/authorize')
const Role = require('../helper/role')
const express = require('express');
const router = express.Router();
const templateService = require('../services/templateService');
const logService = require('../services/logService');
const vgenService = require('../services/vgenService');
const fs = require('fs');

module.exports = function () {
    router.get('/', (req, res) => {
        res.status(200).send({
            message: 'Manage Template routes'
        });
    })

    router.get('/getAll', authorize([Role.designer, Role.user]), (req, res) => {
        templateService.getAll().then((result) => {
            res.status(200).json(result);
        })
    })

    router.get('/id/:id', authorize(Role.designer), (req, res) => {
        let id = req.params.id;
        templateService.getById(id).then((result) => {
            let class_file = fs.readFileSync(result.class_path.substr(3));
            let embedded_file = fs.readFileSync(result.embedded_path.substr(3));
            let data_file = fs.readFileSync('public/example-files/' + result.data);
            let config_file = fs.readFileSync('public/example-files/' + result.config);
            console.log(data_file);
            res.status(200).json({
                id: result.id,
                uid: result.uid,
                TemplateName: result.TemplateName,
                description: result.description,
                img: result.img,
                status: result.status,
                class_file: class_file.toString(),
                embedded_file: embedded_file.toString(),
                class_name: result.class_path.split('/').pop(),
                embedded_name: result.embedded_path.split('/').pop(),
                data_file: data_file.toString(),
                config_file: config_file.toString(),
                data_name: result.data,
                config_name: result.config
            });
        })
    })

    router.get('/owner/me', authorize(Role.designer), (req, res) => {
        let uid = req.user.sub;
        console.log(uid);
        templateService.getOwn(uid).then((result) => {
            res.status(200).json(result);
        });
    })

    router.post('/', authorize(Role.designer), async (req, res) => {
        let keys = Object.keys(req.files)
        if (keys.includes("class")) {
            let templateName = req.body.templateName;
            let description = req.body.description;
            let img = req.files.image;
            let classFile = req.files.class;
            let embeddedFile = req.files.embedded;
            let data = req.files.data;
            let config = req.files.config;

            //check files type
            if ((img.name.split('.').pop() != "jpg" && img.name.split('.').pop() != "jpeg" && img.name.split('.').pop() != "png") ||
                (classFile.name.split('.').pop() != "js") ||
                (embeddedFile.name.split('.').pop() != "js") ||
                (data.name.split('.').pop() != "csv" && data.name.split('.').pop() != "json") ||
                (config.name.split('.').pop() != "csv" && config.name.split('.').pop() != "json")) {
                res.status(400).json({ message: 'Error : Invalid file type' });
            }

            let uid = req.user.sub

            try {
                templateService.addTemplate(uid, templateName, description, img, classFile, embeddedFile, data, config).then(async (template_id) => {
                    //generate example html file    
                    let parsed_data;
                    let parsed_config;

                    try {
                        if (data && config) {
                            if (data.mimetype == 'text/csv' || data.mimetype == 'application/vnd.ms-excel') {
                                parsed_data = vgenService.csvtojson(data.data.toString());
                            }
                            else if (data.mimetype == 'application/json') {
                                parsed_data = JSON.parse(data.data);
                            }
                            if (config.mimetype == 'text/csv' || config.mimetype == 'application/vnd.ms-excel') {
                                parsed_config = vgenService.csvConfig(config.data.toString());
                            }
                            else if (config.mimetype == 'application/json') {
                                parsed_config = JSON.parse(config.data);
                            }

                            console.log(parsed_data);
                            console.log(parsed_config);

                            let visualization = await vgenService.Vgen(templateName.toLowerCase());
                            await visualization.setAttr(parsed_data, parsed_config);
                            let html = await visualization.generateHTML();
                            fs.writeFileSync('public/example-' + templateName + '.html', html, (error) => { console.log(error) });

                            createLog(req.user.role, req.user.sub, template_id, 'create')

                            res.status(200).json({
                                status: 'success',
                                templateName: templateName,
                                image: img.name,
                                class: classFile.name,
                                embedded: embeddedFile.name,
                                data: data.name,
                                config: config.name
                            })
                        }
                    } catch (err) {
                        console.log(err);
                        throw err;
                    }
                })

            }
            catch (err) {
                res.status(400).json({ message: 'Error : Bad Request => ' + err })
            }
        }
    });

    router.put('/', authorize(Role.designer), (req, res) => {
        let uid = req.user.sub;

        let templateName = req.body.templateName;
        let description = req.body.description;
        let img = req.files.image == '' ? req.files.image : null;
        let classFile = req.files.class;
        let embeddedFile = req.files.embedded;
        let data = req.files.data;
        let config = req.files.config;

        //check files type
        if ((img && img.name.split('.').pop() != "jpg" && img.name.split('.').pop() != "jpeg" && img.name.split('.').pop() != "png") ||
            (classFile.name.split('.').pop() != "js") ||
            (embeddedFile.name.split('.').pop() != "js") ||
            (data.name.split('.').pop() != "csv" && data.name.split('.').pop() != "json") ||
            (config.name.split('.').pop() != "csv" && config.name.split('.').pop() != "json")) {
            res.status(400).json({ message: 'Error : Invalid file type' });
        }

        templateService.updateTemplate(uid, templateName, description, img, classFile, embeddedFile, data, config).then((template_id) => {
            createLog(req.user.role, req.user.sub, template_id, 'update');
            res.status(200).send({
                message: 'Updated template'
            })
        })
    });

    router.delete('/:id', authorize(Role.designer), (req, res) => {
        let id = req.params.id;
        let uid = req.user.sub;
        templateService.deleteTemplate(id, uid).then((template_id) => {
            createLog(req.user.role, req.user.sub, template_id, 'delete');
            res.status(200).send({
                message: 'Deleted template successfully'
            })
        })
    });

    return router
}

function createLog(role, uid, target, method) {
    logService.create(role, uid, target, method)
        .then((result) => console.log(result));
}