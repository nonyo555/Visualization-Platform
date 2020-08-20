const express = require('express');
const router = express.Router();

module.exports = function () {
    router.get('/',(req, res) => {
        res.status(200).send({
            message: 'account manager routes'
        })
    })

    return router;
}