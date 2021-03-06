﻿﻿const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('../helper/validate-request');
const authorize = require('../helper/authorize')
const authService = require('../services/authService');
const logService = require('../services/logService')
const Role = require('../helper/role');

module.exports = function () {
    router.post('/authenticate', authenticateSchema, authenticate);
    router.post('/register', registerSchema, register);
    router.post('/forgot', forgotPassword);
    router.post('/reset/:token', resetPassword);
    router.get('/', authorize([Role.superadmin, Role.admin]), getAll);
    router.get('/current',  authorize(), getCurrent);
    router.get('/:id',  authorize([Role.superadmin, Role.admin]), getById);
    router.get('/log/all', authorize([Role.superadmin, Role.admin]), getAllLogs)
    router.get('/log/:id', authorize([Role.superadmin, Role.admin]), getLogById)
    router.get('/log/role/:role', authorize([Role.superadmin, Role.admin]), getLogByRole)
    router.put('/:id',  authorize([Role.superadmin, Role.admin]), updateSchema, update);
    router.delete('/:id',  authorize([Role.superadmin, Role.admin]), _delete);

    return router;
};

function authenticateSchema(req, res, next) {
    const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function authenticate(req, res, next) {
    authService.authenticate(req.body)
        .then(user => res.json(user))
        .catch(next);
}

function registerSchema(req, res, next) {
    const schema = Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        username: Joi.string().required().alphanum().min(3).max(30),
        password: Joi.string().min(6).required(),
        email: Joi.string().email().required()
    });
    validateRequest(req, next, schema);
}

function register(req, res, next) {
    authService.create(req.body)
        .then(() => res.json({ message: 'Registration successful' }))
        .catch(next);
}

function getAll(req, res, next) {
    authService.getAll()
        .then(users => res.json(users))
        .catch(next);
}

function getCurrent(req, res, next) {
    //res.json(req.user);
    authService.getById(req.user.sub)
        .then(user => res.json(user))
        .catch(next);
}

function getById(req, res, next) {
    authService.getById(req.params.id)
        .then(user => res.json(user))
        .catch(next);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        firstName: Joi.string().empty(''),
        lastName: Joi.string().empty(''),
        username: Joi.string().empty(''),
        password: Joi.string().min(6).empty(''),
        email: Joi.string().email().empty(''),
        role: Joi.string().valid('user','admin','designer')
    });
    validateRequest(req, next, schema);
}

function update(req, res, next) {
    authService.update(req.params.id, req.body, req.user.role)
        .then(user => {
            createLog(req.user.role, req.user.sub, req.params.id, 'UPDATE', user.role);
            res.json(user)
        })
        .catch(next);
}

function _delete(req, res, next) {
    authService.delete(req.params.id)
        .then((role) => {
            createLog(req.user.role, req.user.sub, req.params.id, 'DELETE', role);
            res.json({ message: 'User deleted successfully' })
        })
        .catch(next);
}

function forgotPassword(req, res, next){
    authService.forgotPassword(req.body.email).then((user) => {
        createLog(user.role, user.id, user.id, 'FORGOT_PASSWORD', user.role)
        res.status(200).json({ message: "An e-mail has been sent to " + user.email + " with further instructions." });
    }).catch(next);
}

function resetPassword(req, res, next){
    authService.resetPassword(req.params.token, req.body.password).then((user) => {
        createLog(user.role, user.id, user.id, 'RESET_PASSWORD', user.role)
        res.status(200).json(user)
    }).catch(next);
}

function getAllLogs(req, res, next) {
    logService.getAll().then((result) => {
        res.status(200).json(result);
    })
}

function getLogByRole(req, res, next){
    let role = req.params.role;
    logService.getByRole(role).then((result) => {
        res.json(result);
    }).catch(next);
}

function getLogById(req, res, next){
    let uid = req.params.id;
    logService.getById(uid).then((result) => {
        res.json(result);
    }).catch(next);
}

function createLog(role,uid,target_id,method,target) {
    logService.create(role, uid, target_id, method, target)
        .then((result) => console.log(result));
}

