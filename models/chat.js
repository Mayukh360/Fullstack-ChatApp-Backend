const Sequelize=require("sequelize")
const sequelize= require("../database/database")

const Chat= sequelize.define('chat',{
    message: {
        type: Sequelize.STRING,
        allowNull: false,
      },
   
})

module.exports= Chat;