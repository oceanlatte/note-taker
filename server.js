const express = require('express');
const { notes } = require('./db/db.json'); // require JSON file

const PORT = process.env.PORT || 3001;
const app = express(); // instantiate express
const fs = require('fs'); // write file
const path = require('path'); // works with file paths
// api route?
// html route?


// ADD APP.USE middleware functions here??? 


// get database, explicitly do I need this? 
app.get('/api/db', (req, res) => {
  res.json(notes);
})

// get the homepage for the server to display INDEX.HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
})

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});