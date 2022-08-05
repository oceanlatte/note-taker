const express = require('express');
const notes = require('./db/db.json'); // require JSON file

const PORT = process.env.PORT || 3001;
const path = require('path'); // works with file paths
const fs = require('fs'); // write file
const { v4: uuidv4 } = require('uuid'); // npm for unique id
const app = express(); // instantiate express

// ---APP.USE middleware functions here ---
app.use(express.static('public'));
// url encoded takes incoming POST data and converts to key/value pairings
// extended: true lets express know there may be subarrays w/in the data so it looks deeper into the POST data
app.use(express.urlencoded({ extended: true })); 
// express.json takes incoming POST data and parses into req.body JS obj
app.use(express.json()); 


const addNewNote = newNote => {
  console.log(newNote, "body crossed over to NEW NOTE FUNC");

  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.log(err);
    }
    else {
      console.log(data, 'this is the data from FS READDD');
      const parsedNotesArr = JSON.parse(data);
      parsedNotesArr.push(newNote);

      console.log(parsedNotesArr, "NEW NOTE ADDED")
    }
  })
  
}


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


// POST /api/notes - ADDS to the db.json, RETURN new note
app.post('/api/notes', (req, res) => {
  const { title, text } = req.body;
  
  const newNote = {
    title,
    text,
    // give each note a unique id when saved
    id: uuidv4()
  }
  
  // send to new note function to read and add to db.json file
  const returnedNote = addNewNote(newNote);
  res.json(returnedNote);
})

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});