const authorize = require('../helper/authorize')
const Role = require('../helper/role')
const express = require('express');
const router = express.Router();
const templateService = require('../services/templateService');
const logService = require('../services/logService');
const fs = require('fs');

module.exports = function () {
    router.get('/', (req, res) => {
        res.status(200).send({
            message: 'Manage Template routes'
        });
    })

    router.get('/getAll',authorize([Role.designer,Role.user]), (req,res)=>{
        templateService.getAll().then((result) => {
            res.status(200).json(result);
        })
    })

    router.get('/id/:id',authorize(Role.designer), (req,res)=>{
        let id = req.params.id;
        templateService.getById(id).then((result) => {
            let class_file = fs.readFileSync(result.class_path.substr(3));
            let embedded_file = fs.readFileSync(result.embedded_path.substr(3));
            res.status(200).json({
                id : result.id,
                uid : result.uid,
                TemplateName : result.TemplateName,
                description : result.description,
                img : result.img,
                status : result.status,
                class_file : class_file.toString(),
                embedded_file : embedded_file.toString(),
                class_name : result.class_path.split('/').pop(),
                embedded_name : result.embedded_path.split('/').pop(),
            });
        })
    })

    router.get('/owner/me',authorize(Role.designer), (req,res) => {
        let uid = req.user.sub;
        console.log(uid);
        templateService.getOwn(uid).then((result) => {
            res.status(200).json(result);
        });
    })

    router.post('/',authorize(Role.designer), async (req, res) => {
        let keys = Object.keys(req.files)
        let fileNameList =[]
        let fileTextList = []
        if (keys.includes("class")){
            keys.forEach(key=>{
                console.log("keys : ",key)
                if(key != "image"){
                    fileNameList.push(req.files[key].name)
                    fileTextList.push(req.files[key].data.toString())
                }  
            })
            let templateName = req.body.templateName;
            let description = req.body.description;
            let img = req.files.image;
            let classFileName = req.files.class.name;
            let embeddedFileName = req.files.embedded.name;
            let uid = req.user.sub
            console.log(img);
            try{
               await templateService.addTemplate(uid, templateName, description, img, classFileName, embeddedFileName, fileNameList, fileTextList).then((template_id) => {
                    createLog(req.user.role, req.user.sub, template_id, 'create')
                    res.status(200).json({
                        status: 'success',
                        templateName: templateName,
                        files: fileNameList
                    })
                })
            }
            catch(err){
                res.status(400).json({ message : 'Error : Bad Request => '+err})
            }
        }
        else {
            res.status(400).json({ message : 'Error : Bad Request => Request a class file'})
        }
    });
    
    router.put('/',authorize(Role.designer),(req, res) => {
        let uid = req.user.sub;
        let keys = Object.keys(req.files);
        let fileNameList =[];
        let fileTextList = [];
        let img = null;
        keys.forEach(key=>{
            if(key != "image"){
                fileNameList.push(req.files[key].name)
                fileTextList.push(req.files[key].data.toString())
            }
        })

        if(req.files["image"] != ''){
            img = req.files["image"];
            console.log(img);
        }
        console.log( fileNameList)
        let templateName = req.body.templateName;
        let description = req.body.description;
        let classFileName = req.files.class.name;
        let embeddedFileName = req.files.embedded.name;
        templateService.updateTemplate(templateName, description, classFileName, embeddedFileName, fileNameList, fileTextList, img, uid).then((template_id) => {
            createLog(req.user.role, req.user.sub, template_id, 'update');
        })
        res.status(200).send({
            message: 'Updated template'
        })
    });

    router.delete('/:id',authorize(Role.designer),(req, res) => {
        let id = req.params.id;
        let uid = req.user.sub;
        templateService.deleteTemplate(id,uid).then((template_id) => {
            createLog(req.user.role, req.user.sub, template_id, 'delete');
            res.status(200).send({
                message: 'Deleted template successfully'
            })
        })
    });   

    return router
}

function createLog(role,uid,target,method) {
    logService.create(role, uid, target, method)
        .then((result) => console.log(result));
}