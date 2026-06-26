const { Sequelize } = require('sequelize');
require('dotenv').config();

// const sequelize = new Sequelize(
//  process.env.MYSQLDATABASE || process.env.DB_NAME,
//   process.env.MYSQLUSER     || process.env.DB_USER,
//   process.env.MYSQLPASSWORD || process.env.DB_PASSWORD,
//   {
//     host: process.env.DB_HOST || 'localhost',
//     port: parseInt(process.env.DB_PORT) || 3306,
//     dialect: 'mysql',
//     logging: process.env.NODE_ENV === 'development' ? console.log : false,
//     pool: {
//       max: 10,
//       min: 0,
//       acquire: 30000,
//       idle: 10000,
//     },
//     define: {
//       timestamps: true,
//       paranoid: true, // soft delete via deletedAt
//       underscored: false,
//     },
//   }
// );

const sequelize = new Sequelize(
  process.env.MYSQLDATABASE || process.env.DB_NAME,
  process.env.MYSQLUSER     || process.env.DB_USER,
  process.env.MYSQLPASSWORD || process.env.DB_PASSWORD,
  {
    host:    process.env.MYSQLHOST || process.env.DB_HOST,
    port:    process.env.MYSQLPORT || process.env.DB_PORT || 3306,
    dialect: 'mysql',
     logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
    define: { timestamps: true, paranoid: true },
  }
);

module.exports = sequelize;
