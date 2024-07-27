const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
//const { initializeApp } = require('firebase-admin/app');
//const firebaseConfig = require('./config/firebase-config');
const apiRoutes = require('./routes/api');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Initialize Firebase
//initializeApp(firebaseConfig);

// Middleware
app.use(cors());
app.use(express.json());


// const serviceAccount = require('../path/to/your/serviceAccountKey.json');
// firebaseAdmin.initializeApp({
//   credential: firebaseAdmin.credential.cert(serviceAccount)
// });

// API routes
app.use('/api', apiRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Math Tutor API' });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
