// const express = require('express');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const apiRoutes = require('./routes/api');
// const admin = require('./config/firebase-config');

// dotenv.config();

// const app = express();
// const port = process.env.PORT || 3001;

// app.use(cors());
// app.use(express.json());

// app.use('/api', apiRoutes);

// app.get('/', (req, res) => {
//   res.json({ message: 'Welcome to Math Tutor API' });
// });

// // Обработчик ошибок
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send('Something broke!');
// });

// app.listen(port, () => {
//   console.log(`Server running on http://localhost:${port}`);
//   console.log('Firebase Admin initialized');
// });

// // Обработка необработанных исключений
// process.on('uncaughtException', (error) => {
//   console.error('Uncaught Exception:', error);
//   process.exit(1);
// });

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const apiRoutes = require('./routes/api');
const llmRoutes = require('./routes/llm');
const admin = require('./config/firebase-config');

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ extended: true, limit: '1mb', encoding: 'utf-8' }));
app.use(express.urlencoded({ extended: true, limit: '1mb', encoding: 'utf-8' }));

app.use('/api', apiRoutes);
app.use('/api/llm', llmRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Math Tutor API' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log('Firebase Admin initialized');
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});
