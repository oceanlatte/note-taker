const express = require('express');
const { notes } = require('./db/db.json'); // require JSON file

const PORT = process.env.PORT || 3001;
const app = express(); // instantiate express
const fs = require('fs'); // write file
const path = require('path'); // works with file paths

// ---APP.USE middleware functions here ---
app.use(express.static('public'));
// url encoded takes incoming POST data and converts to key/value pairings
// extended: true lets express know there may be subarrays w/in the data so it looks deeper into the POST data
app.use(express.urlencoded({ extended: true })); 
// express.json takes incoming POST data and parses into req.body JS obj
app.use(express.json()); 

app.post('/api/notes', (req, res) => {
  // POST /api/notes - ADDS to the db.json, RETURN new note
  // give each note a unique id when saved 
  // fs read file
})

// GET /api/notes - should READ db.json AND RETURN all saved notes
app.get('/api/notes', (req, res) => {
  res.json(notes);
});

app.get('/notes', (req, res) => {
  // __dirname is a variable that always returns the directory that the server is running in
  res.sendFile(path.join(__dirname, './public/notes.html'));
});

// get the homepage for the server to display INDEX.HTML
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});