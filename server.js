const express = require('express');
const app = express();

const { notes } = require('./db/db.json');

const PORT = process.env.PORT || 3001;

app.get('/api/db', (req, res) => {
  res.send('Hello');
  // res.sendFile(__dirname + '/index.html');
})

// app.get('')

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});