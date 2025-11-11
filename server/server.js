// server.js - safe temporary version that runs without MongoDB
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ensure body parsing
app.use(express.json());

// mount contact route
const contactRouter = require('./routes/contact');
app.use('/api/contact', contactRouter);

// simple health route (optional)
app.get('/api/health', (req, res) => res.json({ ok: true }));

// global error handler (place after routes)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err && (err.stack || err.message || err));
  res.status(err?.status || 500).json({ error: err?.message || 'Internal Server Error' });
});

// Simple in-memory projects store (used until MongoDB is configured)
let projectsStore = [
  { title: "TextWord Counter", description: "Counts words & chars", techStack: ["HTML","CSS","JS"], link: "https://github.com/SaiGopaLLL/textword-counter" }
];

// If MONGO_URI present, try to connect to MongoDB (optional)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/yourdb';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log(`Server running on port ${port}`));
}).catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Routes
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// GET projects — uses DB if present, otherwise in-memory
app.get('/api/projects', async (req, res) => {
  try {
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      // if MongoDB connected, try to use Project model
      try {
        const Project = require('./src/models/Project');
        const docs = await Project.find().sort({ createdAt: -1 });
        return res.json(docs);
      } catch (e) {
        // fall back to in-memory
        return res.json(projectsStore);
      }
    } else {
      return res.json(projectsStore);
    }
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST contact (if Mongo DB is connected will save, otherwise returns success)
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name || !email || !message) return res.status(400).json({ error: 'Missing fields' });

  if (mongoose.connection && mongoose.connection.readyState === 1) {
    try {
      const Contact = require('./src/models/Contact');
      const c = new Contact({ name, email, message });
      await c.save();
      return res.status(201).json({ message: 'Contact saved to DB' });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: 'DB save error' });
    }
  } else {
    // not connected to DB — accept but store nowhere (or you can log)
    console.log('Contact received (not saved to DB):', { name, email, message });
    return res.status(201).json({ message: 'Contact received (local only)' });
  }
});

// POST projects (for seeding) — writes to DB if connected, otherwise adds to in-memory store
app.post('/api/projects', async (req, res) => {
  const body = req.body || {};
  if (!body.title) return res.status(400).json({ error: 'Missing title' });
  if (mongoose.connection && mongoose.connection.readyState === 1) {
    try {
      const Project = require('./src/models/Project');
      const p = new Project(body);
      await p.save();
      return res.status(201).json(p);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: 'DB save error' });
    }
  } else {
    projectsStore.unshift(body);
    return res.status(201).json(body);
  }
});
