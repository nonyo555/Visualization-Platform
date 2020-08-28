const express = require('express');
const router = express.Router();
const scatter = require('../charts/scatter')

module.exports = function () {
    router.get('/',(req, res) => {
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

        var refId = scatter.generate(config);
        console.log("id : " + refId);
        res.send(JSON.stringify(config));

        //generate d3 html file here, store in DB and return refId
    })

    router.get('/d3/:refId',(req, res) => {
        var refId = req.params.refId;
        console.log(refId);
        //check refId in db
        //if there is a refId : get d3 html file
        console.log(__dirname);
        const file = '/chart_example.html';
        res.sendFile(__dirname + file, (err) => {
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