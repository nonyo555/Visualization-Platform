require('rootpath')
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload');
const path = require('path');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const admin_logdb = require('./models/admin_log/admin_log.db')
const designer_logdb = require('./models/designer_log/designer_log.db')
const filedb = require('./models/file/file.db')
const preconfigdb = require('./models/preconfig/preconfig.db')
const templatedb = require('./models/template/template.db')
const userdb = require('./models/user/user.db')
const user_logdb = require('./models/user_log/user_log.db')
const user_usage = require('./models/user_usage/user_usage.db')
const announcementdb = require('./models/announcement/announcement.db')

const authentication = require('./routes/authentication')(io);
const vgenerate = require('./routes/vgenerate')(io);
const manageTemplate = require('./routes/manageTemplate')(io);
const announcement = require('./routes/announcement')(io);

const errorHandler = require('./helper/error-handler');

global.__basedir = __dirname;

userdb.User.hasMany(admin_logdb.admin_log, { foreignKey: {name: 'uid', allowNull: false }});
userdb.User.hasMany(designer_logdb.designer_log, { foreignKey: {name: 'uid', allowNull: false }});
userdb.User.hasMany(user_logdb.user_log, { foreignKey: {name: 'uid', allowNull: false }});
userdb.User.hasMany(announcementdb.announcement, { foreignKey: {name : 'uid', allowNull: false }});
userdb.User.hasMany(filedb.file, { foreignKey: {name: 'uid', allowNull: false }});
userdb.User.hasMany(templatedb.template, { foreignKey: {name: 'uid', allowNull: false }});
userdb.User.hasOne(user_usage.user_usage, { foreignKey: {name: 'uid', allowNull: false }});
filedb.file.hasOne(preconfigdb.preconfig, { foreignKey: {name : 'file_id', allowNull: false }});

async function sync_databases() {
  await userdb.sequelize.sync()
  await filedb.sequelize.sync()
  await templatedb.sequelize.sync()
  await preconfigdb .sequelize.sync()
  await announcementdb.sequelize.sync()
  await user_usage.sequelize.sync()
  await admin_logdb.sequelize.sync()
  await designer_logdb.sequelize.sync()
  await user_logdb.sequelize.sync()
}


//force drop and resync table
 /*db.sequelize.sync({ force: true }).then(() => {
   console.log("Drop and re-sync db.");
 });*/
sync_databases();

app.use(fileUpload({
    createParentPath: true
}));
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/node/api/authentication', authentication);
app.use('/node/api/vgenerate', vgenerate);
app.use('/node/api/manageTemplate', manageTemplate);
app.use('/node/api/announcement',announcement)

app.get('/node', (req, res) => {
    res.status(200).json({
        message: 'Visualization Platform routes'
      })
})
var dir = path.join(__dirname, 'public');
app.use('/node/static',express.static(dir));

app.use(errorHandler);

server.listen(8080);