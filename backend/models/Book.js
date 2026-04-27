const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Book = sequelize.define('Book', {
  title: { type: DataTypes.STRING, allowNull: false },
  author: { type: DataTypes.STRING, allowNull: false },
  genre: { type: DataTypes.STRING },
  description: { type: DataTypes.TEXT },
  coverImage: { type: DataTypes.STRING },
  pdfUrl: { type: DataTypes.STRING },
  available: { type: DataTypes.BOOLEAN, defaultValue: true }
});

module.exports = Book;
