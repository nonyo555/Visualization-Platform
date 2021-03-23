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
const user_log = require('./models/user_log/user_log.db')
const user_usage = require('./models/user_usage/user_usage.db')
const announcementdb = require('./models/announcement/announcement.db')

const authentication = require('./routes/authentication')(io);
const vgenerate = require('./routes/vgenerate')(io);
const manageTemplate = require('./routes/manageTemplate')(io);
const announcement = require('./routes/announcement')(io);

const errorHandler = require('./helper/error-handler');
const fs = require('fs');

global.__basedir = __dirname;

admin_logdb.sequelize.sync()
designer_logdb.sequelize.sync()
filedb.sequelize.sync()
preconfigdb .sequelize.sync()
templatedb.sequelize.sync()
userdb.sequelize.sync()
user_log.sequelize.sync()
user_usage.sequelize.sync()
announcementdb.sequelize.sync()

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
app.use('/node/api/authentication', authentication);
app.use('/node/api/vgenerate', vgenerate);
app.use('/node/api/manageTemplate', manageTemplate);
app.use('/node/api/announcement',announcement)

app.get('/node', (req, res) => {
    res.status(200).json({
        message: 'Visualization Platform routes'
      })
})
/*
app.post('/node', (req,res) => {
  let img = req.files["file"];
  fs.writeFileSync('public/image/' + img.name, img.data);
  res.status(200).json({ "src" : 'http://localhost:8080/node/static/image/'+img.name});
})
*/
var dir = path.join(__dirname, 'public');
app.use('/node/static',express.static(dir));

app.use(errorHandler);

server.listen(8080);