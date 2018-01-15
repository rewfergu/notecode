// import { read } from 'fs';
// const read = require('fs').read;

const express = require('express');
const bodyParser = require('body-parser');
const config = require('./db.config');

const Note = config.Note;
const Client = config.stitchClient;

const path = require('path');

/*
 * Setup Server
 * Express is used to serve the view to the client and handle API routes
 */

const app = express();

app.use('/', express.static(path.join(__dirname, '../client')));
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());

app.get('/authenticate', (req, res) => {
  Client.authenticate('google').then(data => {
    console.log('authentication', data);
    res.send(data);
  });
});

/*
 * Notes
 * 
 */

app.get('/notes', (req, res) => {
  Note.find((err, notes) => {
    if (err) {
      return err;
    }
    res.send(notes);
    return notes;
  });
});

app.get('/note/:id', (req, res) => {
  Note.find(
    {
      _id: req.params.id
    },
    (err, note) => {
      if (err) {
        return err;
      }
      res.send(note);
      return note;
    }
  );
});

app.put('/note/:id', (req, res) => {
  Note.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body
    },
    {
      new: true
    },
    (err, note) => {
      if (err) {
        return err;
      }
      res.send(note);
      return note;
    }
  );
});

app.delete('/note/:id', (req, res) => {
  Note.findByIdAndRemove(req.params.id, err => {
    if (err) {
      console.error(err);
      return err;
    }

    console.log('note deleted');
    res.send('note deleted');
    return null;
  });
});

app.post('/note', (req, res) => {
  // console.log('request', req.body);
  Note.create(
    {
      name: req.body.name,
      tags: req.body.tags,
      content: req.body.content,
      mode: req.body.mode,
      title: req.body.title,
      date: new Date()
    },
    (err, note) => {
      if (err) {
        console.error(err);
        res.send('no can do');
      }
      console.log('new note', note);
      res.send(note);
    }
  );
});

/*
 * tags
 * 
 */

app.get('/tags/:id/', (req, res) => {
  Note.find(
    {
      _id: req.params.id
    },
    'tags',
    (err, note) => {
      if (err) {
        return err;
      }
      console.log('we found the tags', note);
      res.send(note);
      return note;
    }
  );
});

app.get('/tags', (req, res) => {
  Note.distinct('tags', (err, tags) => {
    console.log('tags', tags);
    res.json(tags);
  });
});

/*
 * titles
 * 
 */

app.get('/titles', (req, res) => {
  Note.find({}, ['title', 'mode'])
    .sort({
      mode: 1
    })
    .exec((err, titles) => {
      res.json(titles);
    });
});

module.exports = app;
