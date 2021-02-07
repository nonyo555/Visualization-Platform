const express = require('express');
const router = express.Router();
const vgenService = require('../services/vgenService');
const logService = require('../services/logService')
const authorize = require('../helper/authorize')
var fs = require('fs');
const Role = require('../helper/role');
const authorizeFromQueryStr = require('../helper/authorizeFromQueryStr');

module.exports = function () {
    router.get('/', (req, res) => {
        res.status(200).send({
            message: 'vgenerate routes'
        })
    });

    router.post('/:vname', authorize([Role.user, Role.designer]), async (req, res) => {
        var vname = req.params.vname;
        var data = [];
        var config;
        var dataFile;
        var configFile;

        try{
            //data and config as req.body
            if (req.body.dataset && req.body.config ) { 
                config = JSON.parse(req.body.config);
                data = JSON.parse(req.body.dataset);
            }
            //data and config as req.files
            else if (req.files) {
                Object.keys(req.files).forEach(key => {
                    if (req.files[key].mimetype == 'text/csv' || req.files[key].mimetype == 'application/vnd.ms-excel') { //csv file
                        if (key == 'dataset') {
                            data = vgenService.csvtojson(req.files[key].data.toString());
                            dataFile = req.files[key];
                        }
                        else if (key == 'config') {
                            config = vgenService.csvConfig(req.files[key].data.toString());
                            configFile = req.files[key];
                        }
                    }
                    else if (req.files[key].mimetype == 'application/json') { //json file
                        if (key == "dataset") {
                            data = JSON.parse(req.files[key].data);
                            dataFile = req.files[key];
                        }
                        else if (key == "config") {
                            config = JSON.parse(req.files[key].data);
                            configFile = req.files[key];
                        }
                    }
                        console.log("data : ",data);
                        console.log("config : ",config);
                        console.log("dataFile : ",dataFile);
                        console.log("configFile : ",configFile);
                })
            }
        } catch (err){
            res.status(400).json({message : 'Error : Data format is Incorrect\n'+err})
        }
        
        //console.log(req.user)
        // var data = [{pro:'Nan',label:'Hello',data:123},{pro:'Nan',label:'Hello',data:153},
        // {pro:'Nan',label:'Hello',data:143},{pro:'Bueng Kan',label:'Hello',data:233},{pro:'Bueng Kan',label:'Hello',data:523},{pro:'Bueng Kan',label:'Hello',data:323},
        // {pro:'Bangkok',label:'Hello',data:173},{pro:'Bangkok',label:'Hello',data:193},
        // {pro:'Bangkok',label:'Hello',data:133}];
        // console.log('vname : ', vname);
        try {
            let visualization = await vgenService.Vgen(vname.toLowerCase());
            await visualization.setAttr(data, config)
            let html = visualization.generateHTML();
            vgenService.generateRefId().then((refId) => {
                fs.writeFileSync('generated/' + refId + '.html', html, (error) => { console.log(error) });
                //check file limit before create
                vgenService.checkLimit(req.user.sub).then((is_reachlimit) => {
                    if (!is_reachlimit) {
                        //create record in db
                        vgenService.create(refId, req.user.sub, vname).then(file_id => {
                            if(file_id){
                                //create log
                                createLog(req.user.role, req.user.sub, file_id, 'create');
                                //save pre-generate config
                                vgenService.savePreconfig(file_id, vname, dataFile.data, configFile.data, dataFile.name.toString(), configFile.name.toString()).then(() => {
                                    res.status(200).json({ refId: refId, visualization_name: vname })
                                })
                            }
                        })
                    }
                    else res.json({ message: 'Maximum number of visualization generated reached, Please delete some before generate new visualization' })
                })
            })
        }
        catch (err) {
            res.status(400).json({ message: 'Error : ' + err })
        }
        /*
                scatter.generate(config).then((refId) => {
                    console.log("id : " + refId);
                    try {
                        uploadController.uploadFiles(refId).then(() => {
                            res.send(refId);
                        })
                    } catch (err) {
                        console.log(err);
                    }
                })
        
                app.get('/thaiPolygon', (req, res) => {
                    var thaipoly = Vgen.Vgen.createThaiPolygon()
                    var JsonList=[
                      {"pro":"Nan","label":'Hello',"data":123},
                      {"pro":"Nan","label":'Hello',"data":153},
                      {"pro":"Nan","label":'Hello',"data":143},
                      {"pro":"Bueng Kan","label":'Hello',"data":233},
                      {"pro":"Bueng Kan","label":'Hello',"data":523},
                      {"pro":"Bueng Kan","label":'Hello',"data":323},
                      {"pro":"Bangkok","label":'Hello',"data":173},
                      {"pro":"Bangkok","label":'Hello',"data":193},
                      {"pro":"Bangkok","label":'Hello',"data":133}
                    ];
                    thaipoly.setJsontoJsonDataset(JsonList,'pro','label','data')
                    res.send(thaipoly.generateHTML())
                  })
                  
        */
    });

    router.get('/d3', authorize([Role.user, Role.designer]), (req, res) => {
        let uid = req.user.sub;

        vgenService.getAllRefId(uid).then((result) => {
            if (result){
                res.status(200).json(result);
            } 
            else
                res.status(400).json({ message: "error" });
        })
    });

    router.get('/d3/:refId', authorize([Role.user, Role.designer]), (req, res) => {
        let refId = req.params.refId;
        let uid = req.user.sub;

        vgenService.getFiles(refId, uid).then((resfile) => {
            if (resfile) {
                logService.create(req.user.role, req.user.sub, resfile.dataValues.id, 'get')
                res.status(200).send(resfile.data.toString('utf8'))
            }
            else res.status(401).json({ message: 'Unauthorized' });
        }).catch((err) => {
            console.log(err);
            res.status(404).json({ message: 'Not Found' });
        })
    });

    router.get('/d3/ppt/:token', authorizeFromQueryStr([Role.user, Role.designer]), (req, res) => {
        let refId = req.query.refId;
        let uid = req.user.sub;

        vgenService.getFiles(refId, uid).then((resfile) => {
            if (resfile) {
                logService.create(req.user.role, req.user.sub, resfile.dataValues.id, 'get')
                res.send(resfile.data.toString('utf8'))
            }
            else res.status(401).json({ message: 'Unauthorized' });
        }).catch((err) => {
            console.log(err);
            res.status(404).json({ message: 'Not Found' });
        })
    })

    router.put('/:refId',authorize([Role.user,Role.admin]), async (req,res) => {
        var refId = req.params.refId;
        var vname = req.body.vname;
        var data = [];
        var config;
        var dataFile;
        var configFile;

        console.log("body : ",req.body);
        console.log("files : ",req.files);

        try{
            //data and config as req.body
            if (req.body.dataset && req.body.config ) { 
                config = JSON.parse(req.body.config);
                data = JSON.parse(req.body.dataset);
            }
            //data and config as req.files
            else if (req.files) {
                Object.keys(req.files).forEach(key => {
                    if (req.files[key].mimetype == 'text/csv' || req.files[key].mimetype == 'application/vnd.ms-excel') { //csv file
                        if (key == 'dataset') {
                            data = vgenService.csvtojson(req.files[key].data.toString());
                            dataFile = req.files[key];
                        }
                        else if (key == 'config') {
                            config = vgenService.csvConfig(req.files[key].data.toString());
                            configFile = req.files[key];
                        }
                    }
                    else if (req.files[key].mimetype == 'application/json') { //json file
                        if (key == "dataset") {
                            data = JSON.parse(req.files[key].data);
                            dataFile = req.files[key];
                        }
                        else if (key == "config") {
                            config = JSON.parse(req.files[key].data);
                            configFile = req.files[key];
                        }
                    }
                        console.log("data : ",data);
                        console.log("config : ",config);
                        console.log("dataFile : ",dataFile);
                        console.log("configFile : ",configFile);
                })
            }
        } catch (err){
            res.status(400).json({message : 'Error : Data format is Incorrect\n'+err})
        }
        
        try {
            let visualization = await vgenService.Vgen(vname.toLowerCase());
            await visualization.setAttr(data, config)
            let html = visualization.generateHTML();
                fs.writeFileSync('generated/' + refId + '.html', html, (error) => { console.log(error) });
                //check file limit before update
                vgenService.checkLimit(req.user.sub).then((is_reachlimit) => {
                    if (!is_reachlimit) {
                        //update record in db
                        vgenService.update(refId, req.user.sub, vname).then(file_id => {
                            if(file_id){
                                //create log
                                createLog(req.user.role, req.user.sub, file_id, 'update');
                                //save pre-generate config
                                vgenService.savePreconfig(file_id, vname, dataFile.data, configFile.data, dataFile.name.toString(), configFile.name.toString()).then(() => {
                                    res.status(200).json({ refId: refId, visualization_name: vname })
                                })
                            }
                        })
                    }
                    else res.status(400).json({ message: 'Maximum number of visualization generated reached, Please delete some before generate new visualization' })
                })
        }
        catch (err) {
            res.status(400).json({ message: 'Error : ' + err })
        }
    })

    router.put('/activate/:refId', authorize([Role.user,Role.admin]), (req,res) => {
        var status = req.body.status;
        var refId = req.params.refId;
        var uid = req.user.sub;

        vgenService.updateActivate(refId,status,uid).then((result)=>{
            console.log(result);
            createLog(req.user.role, req.user.sub, result.id, 'update');
            res.status(200).json({ message : 'File Update successfully'});
        })
    })

    router.delete('/:id', authorize([Role.user, Role.designer]), (req, res, next) => {
        let file_id = req.params.id;
        let uid = req.user.sub;
        vgenService.delete(file_id, uid).then(() => {
            createLog(req.user.role, req.user.sub, file_id, 'delete');
            res.status(200).json({ message: 'File deleted successfully' })
        }).catch(next)
    })

    router.get('/preconfig/:refId', authorize([Role.user, Role.designer]), (req, res) => {
        let refId = req.params.refId;
        let uid = req.user.sub;

        vgenService.getPreconfig(refId,uid).then((result) => {
            res.status(200).json({
                vname : result.vname,
                data : result.data.toString(),
                config: result.config.toString(),
                dataFileName : result.dataFileName,
                configFileName : result.configFileName,
                status: result.status
            });
        })
    })

    return router;
}

function createLog(role, uid, target, method) {
    logService.create(role, uid, target, method)
        .then((result) => console.log(result));
}