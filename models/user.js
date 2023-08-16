const Sequelize=require("sequelize")
const sequelize= require("../database/database")

const User= sequelize.define('user',{
    name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING, 
        allowNull: false,
      },
     
      phonenumber: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        unique: true,
      },
})

module.exports= User;