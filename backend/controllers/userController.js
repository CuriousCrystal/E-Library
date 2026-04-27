const { BorrowRecord, Book, Favorite, User } = require('../models');

exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const records = await BorrowRecord.findAll({
      where: { UserId: userId },
      include: [Book]
    });
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
};

exports.toggleFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bookId } = req.body;

    const favorite = await Favorite.findOne({ where: { UserId: userId, BookId: bookId } });

    if (favorite) {
      await favorite.destroy();
      return res.json({ message: 'Removed from favorites', isFavorite: false });
    } else {
      await Favorite.create({ UserId: userId, BookId: bookId });
      return res.json({ message: 'Added to favorites', isFavorite: true });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle favorite' });
  }
};

exports.getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId, {
      include: [{ model: Book, as: 'FavoriteBooks' }]
    });
    res.json(user.FavoriteBooks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
};
