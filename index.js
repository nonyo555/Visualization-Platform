require('rootpath')
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const admin_logdb = require('./models/admin_log/admin_log.db')
const designer_logdb = require('./models/designer_log/designer_log.db')
const filedb = require('./models/file/file.db')
const preconfigdb = require('./models/preconfig/preconfig.db')
const templatedb = require('./models/template/template.db')
const userdb = require('./models/user/user.db')
const user_log = require('./models/user_log/user_log.db')
const user_usage = require('./models/user_usage/user_usage.db')

const authentication = require('./routes/authentication')(io);
const vgenerate = require('./routes/vgenerate')(io);
const manageTemplate = require('./routes/manageTemplate')(io);

global.__basedir = __dirname;

admin_logdb.sequelize.sync()
designer_logdb.sequelize.sync()
filedb.sequelize.sync()
preconfigdb .sequelize.sync()
templatedb.sequelize.sync()
userdb.sequelize.sync()
user_log.sequelize.sync()
user_usage.sequelize.sync()

//force drop and resync table
 /*db.sequelize.sync({ force: true }).then(() => {
   console.log("Drop and re-sync db.");
 });*/

app.use(fileUpload({
    createParentPath: true
}));
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/api/authentication', authentication);
app.use('/api/vgenerate', vgenerate);
app.use('/api/manageTemplate', manageTemplate);

app.get('/', (req, res) => {
    res.status(200).send({
        message: 'Visualization Platform routes'
      })
})

server.listen(80);