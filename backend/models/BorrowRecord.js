const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const BorrowRecord = sequelize.define('BorrowRecord', {
  borrowDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  returnDate: { type: DataTypes.DATE, allowNull: true }
});

module.exports = BorrowRecord;
