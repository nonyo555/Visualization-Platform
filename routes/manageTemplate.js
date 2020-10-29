const authorize = require('../helper/authorize')
const express = require('express');
const router = express.Router();
const templateService = require('../services/templateService')
module.exports = function () {
    router.get('/', (req, res) => {
        res.status(200).send({
            message: 'Manage Template routes'
        })
    router.post('/',authorize(),async (req, res) => {
        let keys = Object.keys(req.files)
        let fileNameList =[]
        let fileTextList = []
        keys.forEach(key=>{
            fileNameList.push(req.files[key].name)
            fileTextList.push(req.files[key].data.toString())
        })
        console.log( fileNameList)
        let templateName = req.body.templateName
        let classFileName = req.body.classFileName
        try{
        await templateService.addTemplate(templateName,classFileName,fileNameList,fileTextList)
        res.status(200).send({
            message: 'Added'
        })
        }
        catch(err){
            res.status(400).json({ message : 'Error : Bad Request =>'+err})
        }
    }
    )
    router.put('/',authorize(),(req, res) => {
        let keys = Object.keys(req.files)
        let fileNameList =[]
        let fileTextList = []
        keys.forEach(key=>{
            fileNameList.push(req.files[key].name)
            fileTextList.push(req.files[key].data.toString())
        })
        console.log( fileNameList)
        let templateName = req.body.templateName
        templateService.updateTemplate(templateName,fileNameList,fileTextList)
        res.status(200).send({
            message: 'Updated'
        })
    })
    router.delete('/',authorize(),(req, res) => {
        let templateName = req.body.templateName
        templateService.deleteTemplate(templateName)
        res.status(200).send({
            message: 'Deleted'
        })
    })   
    })
    return router
}