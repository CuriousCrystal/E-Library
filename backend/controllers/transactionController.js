const { Book, BorrowRecord } = require('../models');

exports.borrowBook = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user.id;

    const book = await Book.findByPk(bookId);
    if (!book || !book.available) {
      return res.status(400).json({ error: 'Book not available' });
    }

    await BorrowRecord.create({ UserId: userId, BookId: bookId });
    await book.update({ available: false });

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
    const existingBook = await Book.findOne({ where: { title, author } });

    if (existingBook) {
      const alreadyBorrowed = await BorrowRecord.findOne({
        where: { UserId: userId, BookId: existingBook.id, returnDate: null }
      });
      if (alreadyBorrowed) {
        return res.status(400).json({ error: 'You already have this book borrowed' });
      }

      if (!existingBook.available) {
        return res.status(400).json({ error: 'This book is currently borrowed by someone else' });
      }

      const record = await BorrowRecord.create({ UserId: userId, BookId: existingBook.id });
      await existingBook.update({ available: false });
      return res.json({ message: 'Book borrowed successfully', recordId: record.id, bookId: existingBook.id });
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

    const record = await BorrowRecord.create({ UserId: userId, BookId: newBook.id });
    res.status(201).json({ message: 'Book imported and borrowed successfully', recordId: record.id, bookId: newBook.id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to borrow book' });
  }
};

exports.returnBook = async (req, res) => {
  try {
    const { recordId } = req.body;
    const userId = req.user.id;

    const record = await BorrowRecord.findOne({ where: { id: recordId, UserId: userId, returnDate: null } });
    if (!record) {
      return res.status(400).json({ error: 'Invalid record or already returned' });
    }

    await record.update({ returnDate: new Date() });
    const book = await Book.findByPk(record.BookId);
    await book.update({ available: true });

    res.json({ message: 'Book returned successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to return book' });
  }
};
