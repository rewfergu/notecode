const mongoose = require('mongoose');

/*
 * Setup DB
 * We are using Mongoose to interface with MongoDB
 */

mongoose.connect('mongodb://user:password@mongodb-server');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('we are connected');
});

const noteSchema = mongoose.Schema({
  title: String,
  tags: [],
  mode: String,
  content: String,
  date: Date
});

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;