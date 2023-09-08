const Sequelize = require('sequelize');
const sequelize = new Sequelize('totalexpense','root','spsushila',{
  dialect :'mysql',
  host:'localhost'
});

module.exports=sequelize;