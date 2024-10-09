
const { Sequelize } = require('sequelize');


const sequelize = new Sequelize('astro_event_hub', 'root', 'Samipya@123', {
  host: 'localhost',
  port: 3306,   
  dialect: 'mysql',  
});

sequelize.authenticate()
  .then(() => console.log('MySQL connected'))
  .catch(err => console.error('Error connecting to MySQL:', err));

module.exports = sequelize;
