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
  // read db.json to get all data already saved
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.log(err);
    }
    else {
      const parsedNotesArr = JSON.parse(data);

      // push the newNote to the parsed read data
      parsedNotesArr.push(newNote);

      // then write the updated parsedNotesArr to db.json
      fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(parsedNotesArr, null, 2)
      )
      return;
    }
  });
};


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
  addNewNote(newNote);

  // return the response for the newNote to print on page
  res.json(notes);
})

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});