const express = require('express');
const jwt = require('jsonwebtoken'); // Step 6: Security
const app = express();

app.use(express.json());

let users = []; // simple in-memory store
const SECRET = 'mysecretkey'; // use env variable in real projects

// -------------------- ROUTES --------------------

// GET endpoint
app.get('/users', (req, res) => {
  res.status(200).json(users); // Step 5: 200 OK
});

// POST endpoint with validation
app.post('/users', (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ error: 'Name is required' }); // Step 5: 400 Bad Request
  }
  const newUser = { id: users.length + 1, ...req.body };
  users.push(newUser);
  res.status(201).json(newUser); // Step 5: 201 Created
});

// PUT update user
app.put('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find(u => u.id === id);
  if (!user) return res.status(404).json({ error: 'User not found' }); // Step 5: 404 Not Found

  Object.assign(user, req.body);
  res.status(200).json(user); // Step 5: 200 OK
});

// DELETE user
app.delete('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  users = users.filter(u => u.id !== id);
  res.status(204).send(); // Step 5: 204 No Content
});

// -------------------- SECURITY --------------------
// Step 6: JWT Authentication

function authenticate(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: 'Unauthorized' }); // Step 5: 401 Unauthorized

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Forbidden' }); // Step 5: 403 Forbidden
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
// Step 4: Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // log error
  res.status(500).json({ error: 'Internal Server Error' }); // Step 5: 500
});

// -------------------- SERVER --------------------
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
