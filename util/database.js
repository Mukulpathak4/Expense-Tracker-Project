const Sequelize = require('sequelize');
const sequelize = new Sequelize('expensemanager','root','spsushila',{
  dialect :'mysql',
  host:'localhost'
});

module.exports=sequelize;