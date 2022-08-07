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

const filterById = (id, notesArr) => {
  const filteredNotes = notesArr.filter(notesId => notesId.id !== id);

  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.log(err);
      return res.sendStatus(505);
    }
    else {
      const newData = JSON.parse(data);

      // filter the read data to exclude the selected id
      const resultArr = newData.filter(notesId => notesId.id !== id);

      // write the results of filter to the db.json
      fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(resultArr, null, 2)
      )
    }
  });
  return filteredNotes;
};


// POST /api/notes - ADDS to the db.json, RETURNS updated db.json
app.post('/api/notes', (req, res) => {
  const { title, text } = req.body;
  
  const newNote = {
    title,
    text,
    // give each note a unique id when saved
    id: uuidv4()
  }

  // add to current copy of notes
  notes.push(newNote);
  
  // read and add to db.json file
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }
    else {
      const parsedNotesArr = JSON.parse(data);

      // push the newNote to the parsed read data in order to add newNote to the write to db
      parsedNotesArr.push(newNote);

      // then write the updated parsedNotesArr to db.json
      fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(parsedNotesArr, null, 2)
      )
    }
  });
  res.json(notes);
});

// GET /api/notes - READS db.json AND RETURNS all saved notes
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

app.delete('/api/notes/:id', (req, res) => {
  // send request parameter id to filterById function to read & write db.json
  const returnedArr = filterById(req.params.id, notes);

  res.status(200).json(returnedArr);
})

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});