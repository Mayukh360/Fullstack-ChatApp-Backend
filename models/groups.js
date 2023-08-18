const Sequelize = require("sequelize");
const sequelize = require("../database/database");

const Groups = sequelize.define("groups", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  groupname: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  phonenumber: {
    type: Sequelize.DOUBLE,
    allowNull: false,
   
  },
});

module.exports = Groups;
