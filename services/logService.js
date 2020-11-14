const userdb = require('../models/user/user.db')
const user_logdb = require('../models/user_log/user_log.db');
const admin_logdb = require('../models/admin_log/admin_log.db');
const designer_logdb = require('../models/designer_log/designer_log.db');

module.exports = {
    getAll,
    create
}

async function getAll(id) {
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

async function create(role, user, target, method){
    var tmp = "";
    switch(role){
        case 'user' : await user_logdb.user_log.create({
            uid : user,
            file_id : target,
            method : method
        })
        tmp = "file";
        break;
        case 'admin' : await admin_logdb.admin_log.create({
            uid : user,
            user : target,
            method : method
        })
        tmp="user";
        break;
        case 'designer' : await designer_logdb.designer_log.create({
            uid : user,
            template_id : target,
            method : method
        })
        tmp = "template";
        break;
        case 'superadmin' : console.log("do here");
            await admin_logdb.admin_log.create({
            uid : user,
            user : target,
            method : method
        })
        tmp = "user/admin/designer"
        break;
    }
    return role + ': ' + user + ' has ' + method + ' ' + tmp + ': ' + target;
}