import React, { Component } from "react";
import { render } from "react-dom";
import keyboardJS from "keyboardjs";
// 'semantic-ui-react'

import SideBar from "./components/SideBar";
import Title from "./components/Title";
import DateDisplay from "./components/Date";
import Tags from "./components/Tags";
import CodeMirror from "./components/CodeMirror";
import Hamburger from "./svg/hamburger";
import API from "./API";

import "../sass/style.scss";

keyboardJS.bind("ctrl + s", e => {
  console.log("we are trying to save");
});

keyboardJS.bind("s", () => {
  console.log("s key");
});

class NoteCode extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentNote: "0",
      title: "",
      titles: [],
      date: "",
      mode: "text",
      tags: [],
      content: "",
      save: false,
      sidebar: false
    };

    this.updatedContent = "";

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

  componentWillMount() {
    this.loadNotes();
  }

  loadNotes() {
    const _this = this;
    const titleArray = [];

    API.getTitles().then(titles => {
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
      currentNote: "0",
      title: "",
      date: "",
      mode: "text",
      tags: [],
      content: "",
      save: false
    });

    this.updatedContent = "";
  }

  selectNote(id) {
    API.getNote(id).then(note => {
      console.log("select note", note);
      this.setState({
        currentNote: id,
        title: note.title,
        date: note.date,
        mode: note.mode,
        tags: note.tags,
        content: note.content,
        sidebar: false
      });
      this.saveBtn.classList.remove("alert");
      this.updatedContent = note.content;
    });
  }

  saveNote() {
    const data = {
      title: this.state.title,
      mode: this.state.mode,
      tags: this.state.tags,
      content: this.updatedContent,
      date: new Date()
    };

    if (this.state.currentNote === "0") {
      API.createNote(data).then(note => {
        console.log("note created", note);
        this.setState({
          currentNote: note._id,
          content: note.content,
          date: note.date
        });
        this.updatedContent = note.content;
        this.saveBtn.classList.remove("alert");
        this.loadNotes();
      });
      return;
    }

    API.updateNote(this.state.currentNote, data).then(note => {
      console.log("note content", note.content);
      this.setState({
        date: note.date,
        content: note.content
      });
      this.updatedContent = note.content;
      this.loadNotes();
      this.saveBtn.classList.remove("alert");
    });
  }

  deleteNote() {
    if (this.state.currentNote !== 0) {
      API.deleteNote(this.state.currentNote).then(response => {
        console.log("response");
        this.loadNotes();
        this.setState({
          currentNote: "0",
          title: "",
          titles: [],
          date: "",
          mode: "text",
          tags: [],
          content: ""
        });
        this.updatedContent = "";
      });
    }
  }

  updateTitle(title) {
    console.log("you got it", title);
    this.setState({
      title
    });
    this.saveBtn.classList.add("alert");
  }

  addTag(tags) {
    this.setState({ tags });
    this.saveBtn.classList.add("alert");
  }

  deleteTag(tags) {
    this.setState({ tags });
    this.saveBtn.classList.add("alert");
  }

  updateContent(content) {
    this.updatedContent = content;
    this.saveBtn.classList.add("alert");
  }

  updateMode(mode) {
    this.setState({
      mode,
      content: this.updatedContent
    });
    this.saveBtn.classList.add("alert");
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

render(<NoteCode />, document.getElementById("noteCode"));
