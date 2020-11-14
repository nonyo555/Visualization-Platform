﻿const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('../helper/validate-request');
const authorize = require('../helper/authorize')
const authService = require('../services/authService');
const Role = require('../helper/role')

module.exports = function () {
    router.post('/authenticate', authenticateSchema, authenticate);
    router.post('/register', registerSchema, register);
    router.get('/', authorize([Role.superadmin, Role.admin]), getAll);
    router.get('/current',  authorize(), getCurrent);
    router.get('/:id',  authorize([Role.superadmin, Role.admin]), getById);
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
        role: Joi.string().valid('user','admin','designer')
    });
    validateRequest(req, next, schema);
}

function update(req, res, next) {
    authService.update(req.params.id, req.body, req.user.role)
        .then(user => res.json(user))
        .catch(next);
}

function _delete(req, res, next) {
    authService.delete(req.params.id)
        .then(() => res.json({ message: 'User deleted successfully' }))
        .catch(next);
}