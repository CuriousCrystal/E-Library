const { BorrowRecord, Book, Favorite, User } = require('../models');

exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const records = await BorrowRecord.find({ user: userId })
      .populate('book')
      .sort({ borrowDate: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
};

exports.toggleFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bookId } = req.body;

    const user = await User.findById(userId);
    const index = user.favorites.indexOf(bookId);

    if (index > -1) {
      user.favorites.splice(index, 1);
      await user.save();
      return res.json({ message: 'Removed from favorites', isFavorite: false });
    } else {
      user.favorites.push(bookId);
      await user.save();
      return res.json({ message: 'Added to favorites', isFavorite: true });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle favorite' });
  }
};

exports.getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate('favorites');
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
};
