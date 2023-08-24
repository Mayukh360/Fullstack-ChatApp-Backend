const Sequelize = require('sequelize').Sequelize;
const sequelize = new Sequelize("chat-app", "root", "W@2915djkq#", {
  dialect: "mysql",
  host: "localhost",
  logging:false,

});

module.exports = sequelize;