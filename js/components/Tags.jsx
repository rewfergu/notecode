import React, { Component } from "react";
import PropTypes from "prop-types";
import Cross from "../svg/cross";
import Plus from "../svg/plus";

class Tags extends Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.addTag = this.addTag.bind(this);
    // this.deleteTag = this.deleteTag.bind(this);
  }
  componentDidMount() {
    const tagWrapper = document.querySelector(".tags");
    const tagForm = document.querySelector("#tagForm");
    const tagField = document.querySelector("#tagField");

    tagField.addEventListener("keyup", e => {
      e.target.value.replace(/.*,/g, match => {
        let tag = match.trim();
        tag = tag.substr(0, tag.length - 1);

        this.addTag(tag);

        e.target.value = "";
        return "";
      });
    });

    tagForm.addEventListener("submit", e => {
      console.log("form submit");
      this.addTag(tagField.value);
      tagField.value = "";
      e.preventDefault();
    });
  }
  addTag(tag) {
    const newArray = this.props.tags;
    newArray.push(tag);
      this.props.addTag(newArray);
  }
  deleteTag(tag) {
    const newArray = this.props.tags;
    const index = newArray.indexOf(tag);

    newArray.splice(index, 1);
    this.props.deleteTag(newArray);
  }
  render() {
    return (
      <div className="note__tags">
        <form id="tagForm" className="note__tagForm">
          <input placeholder="Tags" type="text" id="tagField" />
          <button type="button" className="tag__add">
            <Plus />
          </button>
        </form>
        <div className="tags">
          {this.props.tags.map(tag =>
            <span className="tag" key={tag}>
              {tag}
              <button id={tag} onClick={()=>{this.deleteTag(tag)}} className="tag__delete">
                <Cross />
              </button>
            </span>
          )}
        </div>
      </div>
    );
  }
}
Tags.defaultProps = {
  tags: [],
  deleteTag() {},
  addTag() {}
};
Tags.propTypes = {
  addTag: PropTypes.func,
  deleteTag: PropTypes.func,
  tags: PropTypes.arrayOf(PropTypes.string)
};
export default Tags;
