const express = require('express');
const router = express.Router();
const uploadController = require("../controller/upload");
const downloadController = require("../controller/download");
const vgenService = require('../services/vgenService');
const authorize = require('../helper/authorize')
var fs = require('fs');

function csvtojson(csvText){
    let data = []
    let rows = csvText.split('\n');
    let col = rows[0].split('\r')[0].split(',')
    for(let i=1 ; i<rows.length;i++){
        var  r =  rows[i].split('\r')[0]
        r =     r.split(',')
        var json = {}
        for(let j = 0; j<col.length;j++){
            if (r[j]!= "" && r[j] != undefined){
                json[col[j]] = r[j]
            }
        }
        // {} == {} => false wtf
        if(Object.keys(json).length != 0){
        data.push(json)
        }
    }
    return data
}
module.exports = function () {
    router.get('/', (req, res) => {
        res.status(200).send({
            message: 'vgenerate routes'
        })
    })
    router.post('/:vname', authorize(), async (req, res) => {
        var vname = req.params.vname;
        var config = JSON.parse(req.body.config);
        //console.log(Object.keys(req.files).name)
        if(req.files != undefined){
            var data  = []
            Object.keys(req.files).forEach(key=>{
                if (req.files[key].mimetype == 'text/csv' ){
                    data= csvtojson(req.files[key].data.toString())
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
                var visualization = await vgenService.Vgen(vname.toLowerCase());
                await visualization.setAttr(data,config)
                var html = visualization.generateHTML();
                vgenService.generateRefId().then((refId) => {
                    fs.writeFileSync('generated/' + refId + '.html', html, (error) => { console.log(error) });
                    console.log("refId : " + refId);
                    try {
                        uploadController.uploadFiles(refId,req.user.username).then(() => {
                            res.send(refId);
                        })
                    } catch (err) {
                        console.log(err);
                    }
                })
        }
        catch(err) {
            //console.log(err)
            res.status(400).json({ message : 'Error : Bad Request'+err})
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
    })

    router.get('/d3/:refId', authorize(), (req, res) => {
        var refId = req.params.refId;
        const username = req.user.username;

        console.log(refId);
        console.log(username);
        
        downloadController.downloadFiles(refId, username).then((resfile) => {
            if(resfile)
                res.send(resfile.data.toString('utf8'))
            else res.status(401).json({ message: 'Unauthorized' });
        }).catch((err) => {
            console.log(err);
            res.status(404).json({ message: 'Not Found'});
        })
    })

    return router;
}

/*
1.client use web application to insert data and config
2.when submit -> web application call POST api to Vgen to generate d3 file
3.Vgen generate refId then return to api and store d3 file in DB
4.the called POST return refId
5.web application automatically redirect to visualization page and call GET api to get d3 html file
6.web application display the page with d3 visualization
7.user can also call GET api with refId to get d3 file to attach anywhere in their external web page
*/