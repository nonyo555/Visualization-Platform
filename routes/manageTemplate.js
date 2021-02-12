const authorize = require('../helper/authorize')
const Role = require('../helper/role')
const express = require('express');
const router = express.Router();
const templateService = require('../services/templateService');
const logService = require('../services/logService');
const { template } = require('../models/template/template.db');

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

    router.get('/:id',authorize(Role.designer), (req,res)=>{
        let id = req.params.id;
        templateService.getById(id).then((result) => {
            res.status(200).json(result);
        })
    })

    router.post('/',authorize(Role.designer), async (req, res) => {
        let keys = Object.keys(req.files)
        let fileNameList =[]
        let fileTextList = []
        if (keys.includes("class")){
            keys.forEach(key=>{
                console.log("keys : ",key)
                fileNameList.push(req.files[key].name)
                fileTextList.push(req.files[key].data.toString())
            })
            let templateName = req.body.templateName
            let classFileName = req.files.class.name
            let uid = req.user.sub
            try{
               await templateService.addTemplate(uid,templateName,classFileName,fileNameList,fileTextList).then((template_id) => {
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
        let keys = Object.keys(req.files)
        let fileNameList =[]
        let fileTextList = []
        keys.forEach(key=>{
            fileNameList.push(req.files[key].name)
            fileTextList.push(req.files[key].data.toString())
        })
        console.log( fileNameList)
        let templateName = req.body.templateName
        templateService.updateTemplate(templateName,fileNameList,fileTextList).then((template_id) => {
            createLog(req.user.role, req.user.sub, template_id, 'update');
        })
        res.status(200).send({
            message: 'Updated template'
        })
    });

    router.delete('/:id',authorize(Role.designer),(req, res) => {
        let id = req.params.id;
        templateService.deleteTemplate(id).then((template_id) => {
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