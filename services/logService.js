const user_logdb = require('../models/user_log/user_log.db');
const admin_logdb = require('../models/admin_log/admin_log.db');
const designer_logdb = require('../models/designer_log/designer_log.db');

module.exports = {
    create
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