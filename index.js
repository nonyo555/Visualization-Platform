const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const accountManager = require('./routes/accountManager')(io);
const vgenerate = require('./routes/vgenerate')(io);

app.use(fileUpload({
    createParentPath: true
}));
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/api/accountManager', accountManager);
app.use('/api/vgenerate', vgenerate);

app.get('/', (req, res) => {
    res.status(200).send({
        message: 'Visualization Platform routes'
      })
})

server.listen(3000);