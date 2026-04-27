const User = require('./User');
const Book = require('./Book');
const BorrowRecord = require('./BorrowRecord');
const Favorite = require('./Favorite');

// Associations
User.hasMany(BorrowRecord);
BorrowRecord.belongsTo(User);
Book.hasMany(BorrowRecord);
BorrowRecord.belongsTo(Book);

// Favorites Associations
User.belongsToMany(Book, { through: Favorite, as: 'FavoriteBooks' });
Book.belongsToMany(User, { through: Favorite, as: 'FavoritedBy' });

module.exports = {
  User,
  Book,
  BorrowRecord,
  Favorite
};
