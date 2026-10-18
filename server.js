require('dotenv').config();

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Message = require('./models/Message');

const app = express();
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGODB_URI;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const sampleMessages = [
  { name: 'Ava Morgan', text: 'The project is ready for its first deployment.' },
  { name: 'Noah Patel', text: 'MongoDB can be connected by setting MONGODB_URI.' }
];

function databaseReady() {
  return mongoose.connection.readyState === 1;
}

async function getMessages() {
  if (!databaseReady()) return sampleMessages;
  return Message.find().sort({ createdAt: -1 }).lean();
}

app.get('/', (req, res) => {
  res.render('home', { title: 'Home' });
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});

app.get('/messages', async (req, res, next) => {
  try {
    res.render('messages', {
      title: 'Messages',
      messages: await getMessages(),
      databaseConnected: databaseReady()
    });
  } catch (error) {
    next(error);
  }
});

app.post('/messages', async (req, res, next) => {
  try {
    const name = String(req.body.name || '').trim();
    const text = String(req.body.text || '').trim();

    if (!name || !text) return res.status(400).render('error', {
      title: 'Invalid message',
      message: 'Name and message are required.'
    });

    if (!databaseReady()) return res.status(503).render('error', {
      title: 'Database unavailable',
      message: 'MongoDB is not connected, so this message was not saved.'
    });

    await Message.create({ name, text });
    res.redirect('/messages');
  } catch (error) {
    next(error);
  }
});

app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    service: 'deployment-learning',
    database: databaseReady() ? 'connected' : 'not connected'
  });
});

app.get('/api/messages', async (req, res, next) => {
  try {
    res.json(await getMessages());
  } catch (error) {
    next(error);
  }
});

app.use((req, res) => {
  res.status(404).render('error', { title: 'Not found', message: 'That page does not exist.' });
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).render('error', { title: 'Server error', message: 'Something went wrong.' });
});

async function start() {
  if (mongoUri) {
    try {
      await mongoose.connect(mongoUri);
      console.log('MongoDB connected');
    } catch (error) {
      console.error(`MongoDB connection failed: ${error.message}`);
      console.log('Starting with sample data. Check MONGODB_URI and MongoDB availability.');
    }
  } else {
    console.log('MONGODB_URI is not set; starting with sample data.');
  }

  app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
}

start();
