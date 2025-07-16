const express = require('express');
const app = express();
const cors = require('cors');
const sequelize = require('../config/database');
// const User = require('./user');
const Resume = require('../models/resume');
const User = require('../models/user');
require('dotenv').config();



const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,
  }
);


const corsOptions = {
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
// Use body-parser with increased limit
app.use(express.json({ limit: '10mb' })); 

// let resumes = [];
// let users = [];

app.post('/api/resumes', (req, res) => {
  console.log('Received POST request for /api/resumes:', req.body);
  const resume = { ...req.body, id: Date.now() };
  resumes.push(resume);
  res.status(201).json(resume);
});

app.get('/api/resumes', (req, res) => {
  const userId = req.query.userId ? parseInt(req.query.userId) : null;
  const userResumes = userId ? resumes.filter(r => r.userId === userId) : resumes;
  res.json(userResumes);
});

app.get('/api/resumes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const resume = resumes.find(r => r.id === id);
  if (resume) res.json(resume);
  else res.status(404).json({ error: 'Resume not found' });
});

app.put('/api/resumes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = resumes.findIndex(r => r.id === id);
  if (index !== -1) {
    resumes[index] = { ...resumes[index], ...req.body };
    res.json(resumes[index]);
  } else {
    res.status(404).json({ error: 'Resume not found' });
  }
});

app.delete('/api/resumes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = resumes.length;
  resumes = resumes.filter(r => r.id !== id);
  if (resumes.length < initialLength) res.status(204).send();
  else res.status(404).json({ error: 'Resume not found' });
});

app.get('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find(u => u.id === id) || { id, name: 'Default User' };
  res.json(user);
});

app.put('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex(u => u.id === id);
  if (index !== -1) {
    users[index] = { ...users[index], ...req.body };
    res.json(users[index]);
  } else {
    const newUser = { id, ...req.body };
    users.push(newUser);
    res.status(201).json(newUser);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));