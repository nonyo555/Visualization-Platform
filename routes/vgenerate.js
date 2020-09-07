const express = require('express');
const router = express.Router();
const uploadController = require("../controller/upload");
const downloadController = require("../controller/download");
const scatter = require('../charts/scatter')

module.exports = function () {
    router.get('/', (req, res) => {
        res.status(200).send({
            message: 'vgenerate routes'
        })
    })

    router.post('/:vname', (req, res) => {
        const vnameList = []; //add vname list here
        //if vname in vnameList : continue
        //else : return (400) bad request
        var vname = req.params.vname;
        console.log(vname);
        var config = req.body;
        console.log(config);

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