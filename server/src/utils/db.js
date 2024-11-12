const { Sequelize } = require('sequelize');

// Option 1: Passing a connection URI
const sequelize = new Sequelize('postgresql://postgres:password@localhost:5432/realEstate?schema=public'); // Example for postgres

module.exports = sequelize;
