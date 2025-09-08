const express = require('express');
const app = express();
const port = 5000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from Vmetke Backend!');
});

app.listen(port, () => {
  console.log(`Backend is running at http://localhost:${port}`);
});
