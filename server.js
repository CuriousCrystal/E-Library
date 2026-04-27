const app = require('./backend/app');
const sequelize = require('./backend/config/db');
const seedData = require('./backend/config/seed');

const PORT = process.env.PORT || 3000;

// Sync DB and seed dummy data
sequelize.sync().then(async () => {
  console.log('Database synced');
  await seedData();
}).catch(err => {
  console.error('Failed to sync database:', err);
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
