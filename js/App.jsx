import React, { Component } from 'react';
import { render } from 'react-dom';
import keyboardJS from 'keyboardjs';
// 'semantic-ui-react'

import SideBar from './components/SideBar';
import Title from './components/Title';
import DateDisplay from './components/Date';
import User from './components/User';
import Tags from './components/Tags';
import CodeMirror from './components/CodeMirror';
import Hamburger from './svg/hamburger';
import API from './API';
// import StitchClient from '../server/db.config';

import '../sass/style.scss';

keyboardJS.bind('ctrl + s', e => {
  console.log('we are trying to save');
});

keyboardJS.bind('s', () => {
  console.log('s key');
});

class NoteCode extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentNote: '0',
      title: '',
      titles: [],
      date: '',
      mode: 'text',
      tags: [],
      content: '',
      save: false,
      sidebar: false
    };

    this.updatedContent = '';

    this.authenticate = this.authenticate.bind(this);
    this.createNote = this.createNote.bind(this);
    this.deleteNote = this.deleteNote.bind(this);
    this.selectNote = this.selectNote.bind(this);
    this.saveNote = this.saveNote.bind(this);
    this.updateTitle = this.updateTitle.bind(this);
    this.addTag = this.addTag.bind(this);
    this.deleteTag = this.deleteTag.bind(this);
    this.updateContent = this.updateContent.bind(this);
    this.updateMode = this.updateMode.bind(this);
    this.toggleSidebar = this.toggleSidebar.bind(this);
  }

  componentDidMount() {
    const _this = this;
    const auth = API.authenticate();

    // this.authenticate().then(() => {
    //   console.log('all done authenticating. believe it!');
    //   _this.loadNotes();
    // });

    if (auth) {
      _this.setState({
        userId: auth
      });

      _this.loadNotes();
    }
  }

  authenticate() {
    const _this = this;
    const auth = API.authenticate();

    if (auth) {
      _this.setState({
        userId: auth
      });
    }
  }

  loadNotes() {
    const _this = this;
    const titleArray = [];

    API.getTitles(this.state.userId).then(titles => {
      titles.forEach(item => {
        titleArray.push([item._id.toString(), item.title, item.mode]);
      });
      _this.setState({
        titles: titleArray
      });
    });
  }

  createNote() {
    this.setState({
      currentNote: '0',
      title: '',
      date: '',
      mode: 'text',
      tags: [],
      content: '',
      save: false
    });

    this.updatedContent = '';
  }

  selectNote(id) {
    API.getNote(id).then(note => {
      console.log('select note', note);
      this.setState({
        currentNote: id,
        title: note.title,
        date: note.date,
        mode: note.mode,
        tags: note.tags,
        content: note.content,
        sidebar: false
      });
      this.saveBtn.classList.remove('alert');
      this.updatedContent = note.content;
    });
  }

  saveNote() {
    const data = {
      owner_id: this.state.userId,
      title: this.state.title,
      mode: this.state.mode,
      tags: this.state.tags,
      content: this.updatedContent,
      date: new Date()
    };

    if (this.state.currentNote === '0') {
      API.createNote(data).then(note => {
        console.log('note created', note);
        this.setState({
          currentNote: note._id,
          content: note.content,
          date: note.date
        });
        // this.updatedContent = note.content;
        this.saveBtn.classList.remove('alert');
        this.loadNotes();
      });
      return;
    }

    API.updateNote(this.state.currentNote, data).then(note => {
      console.log('note content', note.content);
      this.setState({
        date: note.date,
        content: note.content
      });
      this.updatedContent = note.content;
      this.loadNotes();
      this.saveBtn.classList.remove('alert');
    });
  }

  deleteNote() {
    if (this.state.currentNote !== 0) {
      API.deleteNote(this.state.currentNote).then(response => {
        console.log('response');
        this.loadNotes();
        this.setState({
          currentNote: '0',
          title: '',
          titles: [],
          date: '',
          mode: 'text',
          tags: [],
          content: ''
        });
        this.updatedContent = '';
      });
    }
  }

  updateTitle(title) {
    this.setState({ title });
    this.saveBtn.classList.add('alert');
  }

  addTag(tags) {
    this.setState({ tags });
    this.saveBtn.classList.add('alert');
  }

  deleteTag(tags) {
    this.setState({ tags });
    this.saveBtn.classList.add('alert');
  }

  updateContent(content) {
    this.updatedContent = content;
    this.saveBtn.classList.add('alert');
  }

  updateMode(mode) {
    this.setState({
      mode,
      content: this.updatedContent
    });
    this.saveBtn.classList.add('alert');
  }

  toggleSidebar() {
    this.setState({
      sidebar: !this.state.sidebar
    });
  }

  render() {
    return (
      <div>
        <header>
          <div className="appInfo">
            <button className="sidebar__toggle" onClick={this.toggleSidebar}>
              <Hamburger fill="white" />
            </button>
            <h1 className="app__title">NoteCode</h1>
          </div>

          <User user={this.state.userId} />
        </header>
        <div className="wrapper">
          <SideBar
            expanded={this.state.sidebar}
            titles={this.state.titles}
            selectNote={this.selectNote}
            createNote={this.createNote}
          />
          <main className={this.state.sidebar ? 'expanded' : ''}>
            <section className="note">
              <Title
                text={this.state.title}
                noteId={this.state.currentNote}
                updateTitle={this.updateTitle}
              />
              <DateDisplay lastSaved={this.state.date} />
              <Tags
                tags={this.state.tags}
                addTag={this.addTag}
                deleteTag={this.deleteTag}
              />
              <CodeMirror
                content={this.state.content}
                mode={this.state.mode}
                updateContent={this.updateContent}
                updateMode={this.updateMode}
              />
              <div className="note__actions">
                <button className="note__delete" onClick={this.deleteNote}>
                  Delete Note
                </button>
                <button
                  className="note__save"
                  ref={saveBtn => (this.saveBtn = saveBtn)}
                  onClick={this.saveNote}
                >
                  Save Note
                </button>
              </div>
            </section>
          </main>
        </div>
      </div>
    );
  }
}

render(<NoteCode />, document.getElementById('noteCode'));
