const { Book, BorrowRecord } = require('../models');

exports.borrowBook = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user.id;

    const book = await Book.findById(bookId);
    if (!book || !book.available) {
      return res.status(400).json({ error: 'Book not available' });
    }

    await BorrowRecord.create({ user: userId, book: bookId });
    book.available = false;
    await book.save();

    res.json({ message: 'Book borrowed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to borrow book' });
  }
};

exports.borrowExternal = async (req, res) => {
  const { title, author, genre, description, coverImage, pdfUrl } = req.body;
  const userId = req.user.id;

  if (!title || !author) {
    return res.status(400).json({ error: 'Title and author are required' });
  }

  try {
    const existingBook = await Book.findOne({ title, author });

    if (existingBook) {
      const alreadyBorrowed = await BorrowRecord.findOne({
        user: userId, book: existingBook._id, returnDate: null
      });
      if (alreadyBorrowed) {
        return res.status(400).json({ error: 'You already have this book borrowed' });
      }

      if (!existingBook.available) {
        return res.status(400).json({ error: 'This book is currently borrowed by someone else' });
      }

      const record = await BorrowRecord.create({ user: userId, book: existingBook._id });
      existingBook.available = false;
      await existingBook.save();
      return res.json({ message: 'Book borrowed successfully', recordId: record._id, bookId: existingBook._id });
    }

    const newBook = await Book.create({
      title,
      author,
      genre: genre || '',
      description: (description || '').slice(0, 1000),
      coverImage: coverImage || '',
      pdfUrl: pdfUrl || '#',
      available: false
    });

    const record = await BorrowRecord.create({ user: userId, book: newBook._id });
    res.status(201).json({ message: 'Book imported and borrowed successfully', recordId: record._id, bookId: newBook._id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to borrow book' });
  }
};

exports.returnBook = async (req, res) => {
  try {
    const { recordId } = req.body;
    const userId = req.user.id;

    const record = await BorrowRecord.findOne({ _id: recordId, user: userId, returnDate: null });
    if (!record) {
      return res.status(400).json({ error: 'Invalid record or already returned' });
    }

    record.returnDate = new Date();
    await record.save();
    
    const book = await Book.findById(record.book);
    if (book) {
      book.available = true;
      await book.save();
    }

    res.json({ message: 'Book returned successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to return book' });
  }
};
