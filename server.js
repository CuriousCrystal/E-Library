const app = require('./backend/app');
const connectDB = require('./backend/config/db');

const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB().catch(err => {
  console.error('Failed to connect to database:', err);
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
