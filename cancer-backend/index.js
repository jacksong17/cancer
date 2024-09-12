const express = require('express');
const cors = require('cors');  // Import cors middleware
const app = express();
const port = 5000;

app.use(cors());  // Use cors to allow cross-origin requests

app.get('/', (req, res) => {
  res.send('Hello from Cancer backend!');
});

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${5000}`);
});

