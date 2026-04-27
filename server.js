const app = require('./backend/app');
const connectDB = require('./backend/config/db');
const seedData = require('./backend/config/seed');

const PORT = process.env.PORT || 3000;

// Connect to MongoDB and seed data
connectDB().then(async () => {
  await seedData();
}).catch(err => {
  console.error('Failed to connect to database:', err);
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
