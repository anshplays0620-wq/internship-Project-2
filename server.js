const express = require('express');
const jwt = require('jsonwebtoken'); // for JWT authentication
const app = express();

app.use(express.json());

let users = []; // simple in-memory store
const SECRET = 'mysecretkey'; // use env variable in real projects

// -------------------- ROOT ROUTE --------------------
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to DecodeLabs Backend API Project 2 🚀' });
});

// -------------------- CRUD ROUTES --------------------

// GET all users
app.get('/users', (req, res) => {
  res.status(200).json(users);
});

// POST new user
app.post('/users', (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email required' });
  }
  const newUser = { id: users.length + 1, name, email };
  users.push(newUser);
  res.status(201).json(newUser);
});

// PUT update user
app.put('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find(u => u.id === id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  res.status(200).json(user);
});

// DELETE user
app.delete('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  users = users.filter(u => u.id !== id);
  res.status(204).send();
});

// -------------------- AUTHENTICATION --------------------

// Middleware to protect routes
function authenticate(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Forbidden' });
    req.user = decoded;
    next();
  });
}

// Login route to issue token
app.post('/login', (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name required' });

  const token = jwt.sign({ name }, SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// Protected route
app.get('/profile', authenticate, (req, res) => {
  res.json({ message: `Welcome ${req.user.name}` });
});

// -------------------- ERROR HANDLING --------------------
app.use((err, req, res, next) => {
  console.error(err.stack); // log error
  res.status(500).json({ error: 'Internal Server Error' });
});

// -------------------- SERVER --------------------
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
