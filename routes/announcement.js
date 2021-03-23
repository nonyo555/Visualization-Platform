const authorize = require('../helper/authorize')
const Role = require('../helper/role')
const express = require('express');
const router = express.Router();
const announcementService = require('../services/announcementService')

module.exports = function () {
    router.get('/', (req, res) => {
        res.status(200).json({
            message: 'Announcement routes'
        });
    })

    router.get('/getAll', authorize([Role.designer, Role.user]), (req, res ,next) => {
        announcementService.getAll().then((result) => {
            res.status(200).json(result);
        }).catch(next);
    })

    router.get('/id/:id', authorize([Role.designer,Role.user]), (req, res ,next) => {
        let id = req.params.id;
        announcementService.getById(id).then((result) => {
            res.status(200).json(result);
        }).catch(next);
    })

    router.get('/latest', authorize([Role.designer,Role.user]), (req, res ,next) => {
        announcementService.getLatest().then((result) => {
            res.status(200).json(result);
        }).catch(next);
    });

    router.post('/', authorize(Role.designer), (req, res ,next) => {
        let uid = req.user.sub;
        let title = req.body.title;
        let message = req.body.message
        if(title!="" && message!=""){
            announcementService.create(uid, title, message).then((result) => {
                res.status(200).json(result);
            }).catch(next);
        } else {
            res.status(400).json({ message : "title and message can't be empty."})
        }
        
    })

    router.put('/:id', authorize(Role.designer), (req, res, next) => {
        let id = req.params.id;
        let uid = req.user.sub;
        let title = req.body.title;
        let message = req.body.message

        if(title!="" && message!=""){
        announcementService.update(id, uid, title, message).then((result) => {
            res.status(200).json(result)
        }).catch(next);
        } else {
            res.status(400).json({ message : "title and message can't be empty."})
        }
    });

    router.delete('/:id', authorize(Role.designer), (req, res, next) => {
        let id = req.params.id;
        let uid = req.user.sub;
        announcementService.delete(id, uid).then((template_id) => {
            res.status(200).json({
                message: 'Deleted announcement successfully'
            })
        }).catch(next);
    });

    return router
}

