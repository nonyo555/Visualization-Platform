const announcementdb = require("../models/announcement/announcement.db");
const announcement = announcementdb.announcement;

module.exports = {
    getAll,
    getById,
    getLatest,
    create,
    update,
    delete: _delete,
}

async function create(uid, title, message) {
    var result = null;
    if (!await announcement.findOne({ where: { title: title} })) {
        await announcement.create({
            'uid': uid,
            'title': title,
            'message': message,
        }).then((ann) => {
            result = ann;
        })
    }
    else {
        throw "Duplicated announcement title, Please use other title."
    }
    return result;
}

async function update(id, uid, title, message) {
    await announcement.update({
        title: title,
        message: message
    }, {
        where: {
            id: id,
            uid: uid
        }
    })

    var result = await announcement.findOne({
        where: {
            id: id,
            uid: uid
        }
    })

    return result;
}

async function _delete(id, uid) {
    const result = await getById(id)
    if (result.uid == uid)
        await result.destroy();
    else throw "Unauthorized";

    return id;
}


async function getAll() {
    const result = await announcement.findAll();
    return result;
}

async function getById(id) {
    const result = await announcement.findByPk(id);
    if (!result) throw 'not found';
    return result;
}

async function getLatest() {
    const result = await announcement.findAll({
        limit: 5,
        order: [['createdAt','DESC']]
    });
    return result;
}