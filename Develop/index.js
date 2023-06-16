// import required modules and packages
const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { getNotesFromFile, writeNotesToFile } = require('./helpers/utils');

// setup express.js server
const app = express();
const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// define routes

// get route for home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// get route for notes page
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

// get route to retrieve all saved notes
app.get('/api/notes', (req, res) => {
  const notes = getNotesFromFile();

  res.json(notes);
});

// post route to add new saved notes
app.post('/api/notes', (req, res) => {
  const notes = getNotesFromFile();
  const newNote = req.body;

  newNote.id = uuidv4();
  notes.push(newNote);

  writeNotesToFile(notes);

  res.json(newNote);
});

// delete route to remove a saved note based on id
app.delete('/api/notes/:id', (req, res) => {
  const notes = getNotesFromFile();
  const noteId = req.params.id;

  const updatedNotes = notes.filter((note) => note.id !== noteId);

  writeNotesToFile(updatedNotes);

  res.sendStatus(204);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
