﻿const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../models/user/user.db');
const user_usagedb = require('../models/user_usage/user_usage.db');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const mailconfig = require('../config/mail.server.config.json');
const config = require('../config/db.user.config.json')
const { Op } = require("sequelize");

module.exports = {
    authenticate,
    getAll,
    getById,
    getByEmail,
    create,
    update,
    delete: _delete,
    forgotPassword,
    resetPassword
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

    if (await db.User.findOne({ where: { email: params.email } })) {
        throw 'Email "' + params.email + '" is already in use';
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

async function createUser_usage(uid) {
    await user_usagedb.user_usage.create({
        uid: uid,
        count: 0,
        is_reachlimit: false
    })
}

async function deleteUser_usage(uid) {
    await user_usagedb.user_usage.destroy({ where: { uid: uid } })
}

async function update(id, params, role) {
    const user = await getUser(id);

    //super admin can't be updated by other
    if (user.role == 'superadmin' && role != 'superadmin')
        throw 'Cannot update super admin role';

    // validate
    const emailChanged = params.email && user.email !== params.email;
    if (emailChanged && await db.User.findOne({ where: { email: params.email } })) {
        throw 'Email "' + params.email + '" is already in use';
    }
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
    let role = user.role;
    //super admin can't be deleted
    if (user.role == "superadmin")
        throw 'Cannot delete superadmin';

    await user.destroy();

    deleteUser_usage(id)
    return role;
}

// helper functions

async function getUser(id) {
    const user = await db.User.findByPk(id);
    if (!user) throw 'User not found';
    return user;
}

async function getByEmail(email) {
    const user = db.User.findOne({
        where: {
            email: email
        }
    })
    return user;
}

async function forgotPassword(email) {
    const user = await getByEmail(email);
    if (!user) {
        throw "No account with that email address exits.";
    }

    try{
        var token = await createResetToken();
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000;

        update(user.id, user, user.role).then(user => {
            var transport = nodemailer.createTransport({
                service: 'gmail',
                secure: false,
                auth: {
                    user: mailconfig.EMAIL_USER,
                    pass: mailconfig.EMAIL_PASS
                },
                tls: {
                    rejectUnauthorized: false
                }
            });
            var mailOptions = {
                to: user.email,
                from: mailconfig.EMAIL_USER,
                subject: 'Visualization Platform password reset',
                text: 'Hi ' + user.firstName + ', \n\n' +
                    'We receive a request to reset your Visualization Platform account password through your email address.\n\n' +
                    'username : ' + user.username + '\n\n' +
                    'Please click the following link to complete the process. \n\n' +
                    'http://localhost:4200/account/resetpassword/' + token + '\n\n\n' +
                    'If you did not request this code, it is possible that someone else is trying to access your Visualization Platform account. Do not forward or give this link to anyone.\n\n\n' +
                    'Sincerely yours,\n\n' +
                    'The Visualization Platform team'
            };
            transport.sendMail(mailOptions, err => {
                if(err) console.log(err);
            });
        });
    } catch(err) {
        throw err
    }
    return user;
}

async function resetPassword(token, password){
    const user = await db.User.findOne({
        where : {
            resetPasswordToken: token,
            resetPasswordExpires : { [Op.gt] : Date.now() }
        }
    });

    if(!user){
        throw "Password reset token is invalid or has expired.";
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    console.log(user.id, user , user.role);
    update(user.id, user , user.role).then(user => {
        console.log("---------updated" , user);
    })
    return user;
}

async function createResetToken() {
    return crypto.randomBytes(20).toString("hex");
  }

function omitHash(user) {
    const { hash, ...userWithoutHash } = user;
    return userWithoutHash;
}