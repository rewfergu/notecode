const StitchClient = require('mongodb-stitch').StitchClient;
const ObjectId = require('bson-objectid');

const appId = 'notecode-onyba';
// let options = {};
const stitchClient = new StitchClient(appId);
const db = stitchClient.service('mongodb', 'mongodb-atlas').db('notecode');
const notes = db.collection('notes');
const users = db.collection('users');

module.exports.authenticate = function() {
  // return fetch('http://localhost:3000/authenticate').then(response => {
  //   console.log('authenticate', response);
  // });

  const auth = stitchClient.authedId();

  if (auth) {
    console.log('already logged in', auth);
    return auth;
  }

  return null;
};

module.exports.getUserInfo = function() {
  return stitchClient.userProfile();
};

module.exports.login = function() {
  return stitchClient
    .authenticate('google')
    .then(() => stitchClient.userProfile());
};

module.exports.logout = function() {
  return stitchClient.logout();
};

module.exports.getTitles = function(user) {
  return notes
    .find({}, { _id: 1, title: 1, mode: 1 })
    .sort({
      mode: 1
    })
    .execute();

  // return fetch('http://localhost:3000/titles')
  //   .then(response =>
  //     // console.log('fetch titles', response.json());
  //     response.json()
  //   )
  //   .then(data => data);
};

module.exports.getNote = function(id) {
  // return fetch(`http://localhost:3000/note/${id}`)
  //   .then(response => response.json())
  //   .then(data => data[0]);

  return notes.find({ _id: ObjectId(id) }).execute().then(data => data[0]);
};

module.exports.updateNote = function(id, note) {
  console.log('updating note...');
  return notes
    .updateOne({ _id: ObjectId(id) }, { $set: note })
    .then(data => note);
  // const headers = new Headers({
  //   'Content-Type': 'application/json'
  // });
  // const options = {
  //   method: 'PUT',
  //   headers,
  //   body: JSON.stringify(note)
  // };
  // return fetch(`http://localhost:3000/note/${id}`, options)
  //   .then(response => response.json())
  //   .then(data => data);
};

module.exports.createNote = function(note) {
  // const headers = new Headers({
  //   'Content-Type': 'application/json'
  // });
  // const options = {
  //   method: 'POST',
  //   headers,
  //   body: JSON.stringify(note)
  // };
  // return fetch('http://localhost:3000/note', options)
  //   .then(response => response.json())
  //   .then(data => data);

  return notes.insertOne(note).then(data => note);
};

module.exports.deleteNote = function(id) {
  console.log('deleting note...');
  return notes.deleteOne({ _id: ObjectId(id) });
};

module.exports.search = function(term) {
  // const query = { content: { $in: [new RegExp(term)] } };
  const query = { title: { $in: [new RegExp('Car', 'i')] } };

  console.log('search query', query);
  const rx = new RegExp('Car');
  return notes
    .find({ title: /home/i }, { _id: 1, title: 1, mode: 1 })
    .sort({
      mode: 1
    })
    .execute();
};
