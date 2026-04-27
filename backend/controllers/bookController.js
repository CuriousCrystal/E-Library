const { Book } = require('../models');
const { Sequelize } = require('sequelize');

exports.getAllBooks = async (req, res) => {
  try {
    const { search } = req.query;
    let whereClause = {};

    if (search) {
      whereClause = {
        [Sequelize.Op.or]: [
          { title: { [Sequelize.Op.like]: `%${search}%` } },
          { author: { [Sequelize.Op.like]: `%${search}%` } },
          { genre: { [Sequelize.Op.like]: `%${search}%` } }
        ]
      };
    }

    const books = await Book.findAll({ where: whereClause });
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch books' });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (book) res.json(book);
    else res.status(404).json({ error: 'Book not found' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.addBook = async (req, res) => {
  try {
    const { title, author, genre, description, coverImage, pdfUrl } = req.body;
    if (!title || !author) {
      return res.status(400).json({ error: 'Title and author are required' });
    }
    const book = await Book.create({
      title,
      author,
      genre: genre || '',
      description: description || '',
      coverImage: coverImage || '',
      pdfUrl: pdfUrl || '#',
      available: true
    });
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add book' });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    await book.destroy();
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete book' });
  }
};
