import React, { Component } from 'react';
import { render } from 'react-dom';
import keyboardJS from 'keyboardjs';

// import firebaseui from 'firebaseui';
// 'semantic-ui-react'

import SideBar from './components/SideBar';
import Title from './components/Title';
import DateDisplay from './components/Date';
import Tags from './components/Tags';
import CodeMirror from './components/CodeMirror';
import Hamburger from './svg/hamburger';
import API from '../server/db';

import firebase from 'firebase';
import { FirebaseAuth } from 'react-firebaseui';

import 'firebaseui/dist/firebaseui.css';
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
      sidebar: false,
      signedIn: false,
      userName: 'User'
    };

    this.updatedContent = '';
    this.auth = API.fb.auth();

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
    this.logout = this.logout.bind(this);
    this.displayAuth = this.displayAuth.bind(this);

    this.uiConfig = {
      signInFlow: 'popup',
      signInOptions: [
        // firebase.auth.EmailAuthProvider.PROVIDER_ID,
        firebase.auth.GoogleAuthProvider.PROVIDER_ID
      ],
      callbacks: {
        signInSuccess: currentUser => {
          this.setState({
            signedIn: true,
            userId: currentUser.uid,
            userName: currentUser.displayName,
            photo: currentUser.photoURL
          });

          this.loadNotes();
          return false;
        }
      }
    };
  }

  componentWillMount() {
    // this.loadNotes();
  }

  componentDidMount() {
    // const ui = new firebaseui.auth.AuthUI(API.fb.auth());
    // var uiConfig = {
    //   callbacks: {
    //     signInSuccess(currentUser, credential, redirectUrl) {
    //       // User successfully signed in.
    //       // Return type determines whether we continue the redirect automatically
    //       // or whether we leave that to developer to handle.
    //       return true;
    //     },
    //     uiShown() {
    //       // The widget is rendered.
    //       // Hide the loader.
    //       document.getElementById('loader').style.display = 'none';
    //     }
    //   },
    //   // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    //   signInFlow: 'popup',
    //   signInSuccessUrl: 'localhost:3000',
    //   signInOptions: [
    //     // Leave the lines as is for the providers you want to offer your users.
    //     API.fb.auth.EmailAuthProvider.PROVIDER_ID
    //   ],
    //   // Terms of service url.
    //   tosUrl: 'localhost:3000'
    // };
    // ui.start('#firebaseui-auth-container', uiConfig);
  }

  loadNotes() {
    const _this = this;
    const titleArray = [];

    API.getTitles(this.state.userId).then(titles => {
      titles.forEach(item => {
        titleArray.push([item._id, item.title, item.mode]);
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
      title: this.state.title,
      mode: this.state.mode,
      tags: this.state.tags,
      content: this.updatedContent,
      owner_id: this.state.userId,
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
        this.updatedContent = note.content;
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
    console.log('you got it', title);
    this.setState({
      title
    });
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

  logout() {
    this.auth
      .signOut()
      .then(() => {
        console.log('all signedout', this.auth.getUid());

        this.setState({
          content: '',
          currentNote: '0',
          date: '',
          mode: 'text',
          photo: '',
          signedIn: false,
          tags: [],
          title: '',
          titles: [],
          userId: '',
          userName: 'User'
        });
      })
      .catch(error => {
        console.log('something went wrong with the signout', error);
      });
  }

  displayAuth() {
    if (!this.state.signedIn) {
      return <FirebaseAuth uiConfig={this.uiConfig} firebaseAuth={this.auth} />;
    }

    return <div>You are signed in already.</div>;
  }

  render() {
    return (
      <div>
        <div className={this.state.signedIn ? 'login' : 'login active'}>
          <section className="login__content">
            <h1 className="login__heading">Login</h1>
            {this.displayAuth()}
          </section>
        </div>
        <header>
          <button className="sidebar__toggle" onClick={this.toggleSidebar}>
            <Hamburger fill="white" />
          </button>
          <h1 className="app__title">NoteCode</h1>
        </header>
        <div className="wrapper">
          <SideBar
            expanded={this.state.sidebar}
            titles={this.state.titles}
            selectNote={this.selectNote}
            createNote={this.createNote}
            userName={this.state.userName}
            picture={this.state.photo}
            logout={this.logout}
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
