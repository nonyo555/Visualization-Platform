const config = require('../../config/db.user.config.json');
const Sequelize = require('sequelize');

// create db if it doesn't already exist
const { host, port, user, password, database } = config.database;
//const connection = await mysql.createConnection({ host, port, user, password });
//await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

// connect to db
const sequelize = new Sequelize(database, user, password, { dialect: 'mysql' });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// init models and add them to the exported db object
db.designer_log = require('./designer_log.model.js')(sequelize, Sequelize);
// sync all models with database
//await sequelize.sync();


module.exports = db;