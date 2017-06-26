import React from "react";
import { mount } from "enzyme";
import SideBar from "../components/SideBar";

const titleList = [
  ['100', 'one fish', 'js'],
  ['200', 'two fish', 'js'],
  ['300', 'red fish', 'js'],
  ['400', 'blue fish', 'js']
];
const selectNote = jest.fn();
const createNote = jest.fn();

test("display the note titles", () => {
  const component = mount(
    <SideBar
      titles={titleList}
      selectNote={selectNote}
      createNote={createNote}
    />);

    expect(component.find('.sidebar__title').length).toBe(4);
    expect(component.find('.sidebar__groupHeading').length).toBe(1);
    expect(component.find('.sidebar__submenu').length).toBe(1);
});

test("select a note", () => {
  const component = mount(
    <SideBar
      titles={titleList}
      selectNote={selectNote}
      createNote={createNote}
    />);

    component.instance().selectNote({target: {id: '100'}});
    expect(selectNote).toBeCalled();
    expect(selectNote.mock.calls[0][0]).toEqual('100');
});

test("create a note", () =>{
  const component = mount(
    <SideBar
      titles={titleList}
      selectNote={selectNote}
      createNote={createNote}
    />
  );

  component.instance().props.createNote();
  expect(createNote).toBeCalled();
});
