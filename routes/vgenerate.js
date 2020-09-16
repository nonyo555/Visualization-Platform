const express = require('express');
const router = express.Router();
const uploadController = require("../controller/upload");
const downloadController = require("../controller/download");
const vgenService = require('../services/vgenService');
const scatter = require('../charts/scatter');
var fs = require('fs');

module.exports = function () {
    router.get('/', (req, res) => {
        res.status(200).send({
            message: 'vgenerate routes'
        })
    })

    router.post('/:vname', (req, res) => {
        const vnameList = ['scatter', 'thaipolygon', 'zoomablesunburst']; //add vname list here
        //if vname in vnameList : continue
        //else : return (400) bad request
        var vname = req.params.vname;
        var config = JSON.parse(req.body.config);
        var data = JSON.parse(req.body.data);
        console.log('vname : ', vname);
        console.log('config : ', config);
        console.log('data : ', data);
        if (vnameList.indexOf(vname) >= 0) {
            var visualization = vgenService.Vgen.createThaiPolygon();
            visualization.setJsontoJsonDataset(data, 'pro', 'label', 'data');
            var html = visualization.generateHTML();
            vgenService.generateRefId().then((refId) => {
                fs.writeFileSync('generated/' + refId + '.html', html, (error) => { console.log(error) });
                console.log("refId : " + refId);
                try {
                    uploadController.uploadFiles(refId).then(() => {
                        res.send(refId);
                    })
                } catch (err) {
                    console.log(err);
                }
            })
        }
        else {
            res.status(400).send('Error : Bad Request')
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
                      {pro:'Nan',label:'Hello',data:123},
                      {pro:'Nan',label:'Hello',data:153},
                      {pro:'Nan',label:'Hello',data:143},
                      {pro:'Bueng Kan',label:'Hello',data:233},
                      {pro:'Bueng Kan',label:'Hello',data:523},
                      {pro:'Bueng Kan',label:'Hello',data:323},
                      {pro:'Bangkok',label:'Hello',data:173},
                      {pro:'Bangkok',label:'Hello',data:193},
                      {pro:'Bangkok',label:'Hello',data:133}
                    ];
                    thaipoly.setJsontoJsonDataset(JsonList,'pro','label','data')
                    res.send(thaipoly.generateHTML())
                  })
                  
        */

        //generate d3 html file here, store in DB and return refId
    })

    router.get('/d3/:refId', (req, res) => {
        var refId = req.params.refId;
        console.log(refId);
        //check refId in db
        //if there is a refId : get d3 html file
        downloadController.downloadFiles(refId).then((resfile) => {
            console.log(resfile.data)
            res.send(resfile.data.toString('utf8'))
        }).catch((err) => {
            console.log(err);
            res.status(404).send("Error : There is no requested refId in database");
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