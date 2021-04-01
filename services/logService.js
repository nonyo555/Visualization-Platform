const userdb = require('../models/user/user.db')
const user_logdb = require('../models/user_log/user_log.db');
const admin_logdb = require('../models/admin_log/admin_log.db');
const designer_logdb = require('../models/designer_log/designer_log.db');

module.exports = {
    getAll,
    getByRole,
    getById,
    create
}

async function getAll(){
    let result;

    let user_log = await user_logdb.user_log.findAll();
    let admin_log = await admin_logdb.admin_log.findAll();
    let designer_log = await designer_logdb.designer_log.findAll();

    result = [...admin_log, ...user_log,  ...designer_log];
    result.sort(function(a,b){
        return new Date(b.createdAt) - new Date(a.createdAt);
      })

    return result;
}

async function getByRole(role){
    let result;

    if(role == "admin"){
        result = await admin_logdb.admin_log.findAll();
    }
    else if(role == "designer"){
        result = await designer_logdb.designer_log.findAll();
    }
    else
        result = await user_logdb.user_log.findAll();

    return result;
}

async function getById(id) {
    const user = await getUser(id)

    let result;
    switch(user.role){
        case 'user' : result = await user_logdb.user_log.findAll({where : { uid : id }})
            break;
        case 'admin' : result = await admin_logdb.admin_log.findAll({where : { uid : id }})
            break;
        case 'designer' : result = await designer_logdb.designer_log.findAll({where : { uid : id }})
            break;
        case 'superadmin' : result = await admin_logdb.admin_log.findAll({where : { uid : id }})
            break;
    }
    return result;
}

async function getUser(id){
    const user = await userdb.User.findByPk(id)
    if (!user) throw 'User not found';
    return user;
}

async function create(role, uid, target_id, method, target){
    switch(role){
        case 'user' : await user_logdb.user_log.create({
            uid : uid,
            role: role,
            method : method,
            target_id : target_id,
            target: target
        })
        break;
        case 'admin' : await admin_logdb.admin_log.create({
            uid : uid,
            role: role,
            method : method,
            target_id : target_id,
            target: target
        })
        break;
        case 'designer' : 
        await designer_logdb.designer_log.create({
            uid : uid,
            role: role,
            method : method,
            target_id : target_id,
            target : target
        })
        break;
        case 'superadmin' : 
            await admin_logdb.admin_log.create({
            uid : uid,
            role: role,
            method : method,
            target_id : target_id,
            target: target
        })
        break;
    }
    return role + ': ' + uid + ' has ' + method + ' ' + target + ': ' + target_id;
}