const express = require('express');
const router = express.Router();
const vgenService = require('../services/vgenService');
const authorize = require('../helper/authorize')
var fs = require('fs');
const Role = require('../helper/role');

module.exports = function () {
    router.get('/', (req, res) => {
        res.status(200).send({
            message: 'vgenerate routes'
        })
    });

    router.post('/:vname', authorize([Role.user,Role.designer]), async (req, res) => {
        var vname = req.params.vname;
        var config = JSON.parse(req.body.config);
        //console.log(Object.keys(req.files).name)
        
        if(req.files != undefined){
            var data  = []
            Object.keys(req.files).forEach(key=>{
                if (req.files[key].mimetype == 'text/csv' || req.files[key].mimetype == 'application/vnd.ms-excel'){
                    data= vgenService.csvtojson(req.files[key].data.toString())
                    console.log(data)
                }
            })
        }
        else {
           try{ 
                var data =JSON.parse(req.body.data)
           }
           catch{
            res.status(400).json({ message : 'Error : Data format (JSON) is incorrect'})
            return
           }
        }
        //console.log(req.user)
        // var data = [{pro:'Nan',label:'Hello',data:123},{pro:'Nan',label:'Hello',data:153},
        // {pro:'Nan',label:'Hello',data:143},{pro:'Bueng Kan',label:'Hello',data:233},{pro:'Bueng Kan',label:'Hello',data:523},{pro:'Bueng Kan',label:'Hello',data:323},
        // {pro:'Bangkok',label:'Hello',data:173},{pro:'Bangkok',label:'Hello',data:193},
        // {pro:'Bangkok',label:'Hello',data:133}];
        // console.log('vname : ', vname);
        try{    
                let visualization = await vgenService.Vgen(vname.toLowerCase());
                await visualization.setAttr(data,config)
                let html = visualization.generateHTML();
                vgenService.generateRefId().then((refId) => {
                    fs.writeFileSync('generated/' + refId + '.html', html, (error) => { console.log(error) });
                    console.log("refId : " + refId);
                    console.log(req.user)
                    try {
                        vgenService.create(refId,req.user.sub).then((file_id) => {
                            vgenService.savePreconfig(file_id,vname,JSON.stringify(data),JSON.stringify(config)).then(() => {
                                res.status(200).json({refId : refId, visualization_name : vname})
                            })
                        })
                    } catch (err) {
                        console.log(err);
                    }
                })
        }
        catch(err) {
            //console.log(err)
            res.status(400).json({ message : 'Error : Bad Request '+err})
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

    router.get('/d3/:refId', authorize([Role.user,Role.designer]), (req, res) => {
        let refId = req.params.refId;
        let uid = req.user.sub;
        
        vgenService.getFiles(refId, uid).then((resfile) => {
            if(resfile)
                res.send(resfile.data.toString('utf8'))
            else res.status(401).json({ message: 'Unauthorized' });
        }).catch((err) => {
            console.log(err);
            res.status(404).json({ message: 'Not Found'});
        })
    });

    router.get('/d3', authorize([Role.user,Role.designer]), (req, res) => {
        let uid = req.user.sub;

        vgenService.getAllRefId(uid).then((result) => {
            if(result)
                res.status(200).json({files : result});
            else
                res.json({ message : "error"});
        })
    });

    router.delete('/:id', authorize([Role.user,Role.designer]), (req, res, next) => {
        let file_id = req.params.id;
        let uid = req.user.sub
        vgenService.delete(file_id,uid).then(() => {
            res.json({ message: 'File deleted successfully' })
        }).catch(next)
    })

    return router;
}