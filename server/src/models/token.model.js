const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db'); // Adjust path to your Sequelize instance
const { tokenTypes } = require('../config/tokens'); // Adjust path to your token types

const Token = sequelize.define(
  'Token',
  {
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    // id: {type: DataTypes.UUID}
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users', // Matches the actual User model name in your database
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    type: {
      type: DataTypes.ENUM(tokenTypes.REFRESH, tokenTypes.RESET_PASSWORD, tokenTypes.VERIFY_EMAIL),
      allowNull: false,
    },
    expires: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    blacklisted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
    tableName: 'tokens', // Name of the table in the database
  }
);

module.exports = Token;
