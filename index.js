require('dotenv').config();
const express = require('express');
const app = express();

// Basic Auth middleware
function basicAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    res.setHeader('WWW-Authenticate', 'Basic');
    return res.status(401).send('Authentication required');
  }

  const base64Credentials = authHeader.split(' ')[1];
  const [username, password] = Buffer.from(base64Credentials, 'base64')
    .toString()
    .split(':');

  if (username === process.env.USERNAME && password === process.env.PASSWORD) {
    return next();
  } else {
    return res.status(403).send('Invalid credentials');
  }
}

// Routes
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.get('/secret', basicAuth, (req, res) => {
  res.send(process.env.SECRET_MESSAGE);
});

// Bind to all interfaces
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
