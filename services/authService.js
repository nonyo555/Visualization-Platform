﻿const config = require('../config/db.user.config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../models/user/user.db');
const user_usagedb = require('../models/user_usage/user_usage.db')

module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function authenticate({ username, password }) {
    const user = await db.User.scope('withHash').findOne({ where: { username } });

    if (!user || !(await bcrypt.compare(password, user.hash)))
        throw 'Username or password is incorrect';

    // authentication successful
    const token = jwt.sign({ sub: user.id, role: user.role }, config.secret, { expiresIn: '7d' });
    return { ...omitHash(user.get()), token };
}

async function getAll() {
    return await db.User.findAll();
}

async function getById(id) {
    return await getUser(id);
}

async function create(params) {
    // validate
    if (await db.User.findOne({ where: { username: params.username } })) {
        throw 'Username "' + params.username + '" is already taken';
    }

    // hash password
    if (params.password) {
        params.hash = await bcrypt.hash(params.password, 10);
    }

    // save user
    let user = await db.User.create(params);

    //create user usage record
    let uid = user.dataValues.id
    createUser_usage(uid);
}

async function createUser_usage(uid){
    await user_usagedb.user_usage.create({
        uid : uid,
        count : 0,
        is_reachlimit : false
    })
}

async function deleteUser_usage(uid){
    await user_usagedb.user_usage.destroy({ where : { uid : uid }})
}

async function update(id, params, role) {
    const user = await getUser(id);

    //super admin can't be updated by other
    if(user.role == 'superadmin' && role != 'superadmin')
        throw 'Cannot update super admin role';

    // validate
    const usernameChanged = params.username && user.username !== params.username;
    if (usernameChanged && await db.User.findOne({ where: { username: params.username } })) {
        throw 'Username "' + params.username + '" is already taken';
    }

    // hash password if it was entered
    if (params.password) {
        params.hash = await bcrypt.hash(params.password, 10);
    }

    // copy params to user and save
    Object.assign(user, params);
    await user.save();

    return omitHash(user.get());
}

async function _delete(id) {
    const user = await getUser(id);

    //super admin can't be deleted
    if(user.role == "superadmin")
        throw 'Cannot delete superadmin';

    await user.destroy();
    
    deleteUser_usage(id)
}

// helper functions

async function getUser(id) {
    const user = await db.User.findByPk(id);
    if (!user) throw 'User not found';
    return user;
}

function omitHash(user) {
    const { hash, ...userWithoutHash } = user;
    return userWithoutHash;
}