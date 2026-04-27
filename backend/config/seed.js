const bcrypt = require('bcryptjs');
const { User, Book } = require('../models');

async function seedData() {
  const userCount = await User.count();
  if (userCount === 0) {
    console.log('Seeding dummy data...');
    
    // Create Dummy Admin
    const hashedAdminPassword = await bcrypt.hash('admin123', 10);
    await User.create({ username: 'admin', password: hashedAdminPassword, role: 'admin' });

    // Create Dummy User
    const hashedUserPassword = await bcrypt.hash('user123', 10);
    await User.create({ username: 'user', password: hashedUserPassword, role: 'user' });

    // Create Dummy Books
    await Book.bulkCreate([
      {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        genre: 'Classic',
        description: 'A story of the mysteriously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.',
        coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop',
        pdfUrl: '#'
      },
      {
        title: '1984',
        author: 'George Orwell',
        genre: 'Dystopian',
        description: 'Among the seminal texts of the 20th century, Nineteen Eighty-Four is a rare work that grows more haunting as its futuristic purgatory becomes more real.',
        coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=600&auto=format&fit=crop',
        pdfUrl: '#'
      },
      {
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        genre: 'Fiction',
        description: 'The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it.',
        coverImage: 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?q=80&w=600&auto=format&fit=crop',
        pdfUrl: '#'
      },
      {
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        genre: 'Romance',
        description: 'Since its immediate success in 1813, Pride and Prejudice has remained one of the most popular novels in the English language.',
        coverImage: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=600&auto=format&fit=crop',
        pdfUrl: '#'
      }
    ]);
    console.log('Dummy data inserted');
  }
}

module.exports = seedData;
