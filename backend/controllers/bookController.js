const { Book } = require('../models');

exports.getAllBooks = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      const searchRegex = { $regex: search, $options: 'i' };
      query = {
        $or: [
          { title: searchRegex },
          { author: searchRegex },
          { genre: searchRegex }
        ]
      };
    }

    const books = await Book.find(query);
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch books' });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
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
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete book' });
  }
};
