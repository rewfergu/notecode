module.exports.getTitles = function() {
  return fetch('http://localhost:3000/titles').then(response => {
    // console.log('fetch titles', response.json());
    return response.json();
  }).then(data => data);
}

module.exports.getNote = function(id) {
  return fetch(`http://localhost:3000/note/${id}`).then(response => {
    return response.json();
  }).then(data => data[0]);
}

module.exports.updateNote = function(id, note) {
  console.log('updating note...');
  const headers = new Headers({
    "Content-Type": "application/json"
  });
  const options = {
    method: 'PUT',
    headers,
    body: JSON.stringify(note)
  }
  return fetch(`http://localhost:3000/note/${id}`, options).then(response => {
    return response.json();
  }).then(data => data);
}

module.exports.createNote = function(note) {
  const headers = new Headers({
    "Content-Type": "application/json"
  });
  const options = {
    method: 'POST',
    headers,
    body: JSON.stringify(note)
  }
  return fetch('http://localhost:3000/note', options).then(response => {
    return response.json();
  }).then(data => data);
}

module.exports.deleteNote = function(id) {
  const options = {
    method: 'DELETE'
  }
  return fetch(`http://localhost:3000/note/${id}`, options).then(response => {
    return response;
  });
}