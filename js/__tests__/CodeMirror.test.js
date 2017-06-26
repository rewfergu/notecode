import React from "react";
import { mount } from "enzyme";
import renderer from 'react-test-renderer';
import CodeMirror from "../components/CodeMirror";

const content = 'this is a test';
const mode = 'js';
const updateContent = jest.fn();
const updateMode = jest.fn();

test("displays existing content", () => {
  // document.body.createTextRange = jest.fn();
  // document.body.getBoundingClientRect = jest.fn();
  const cp = mount(
    <CodeMirror
      content={content}
      mode={mode}
      updateContent={updateContent}
      updateMode={updateMode}
    />
  );

  expect(cp.instance().codeContainer.getValue()).toBe(content);
});

test("display existing mode", () => {
  const cp = mount(
    <CodeMirror
      content={content}
      mode={mode}
      updateContent={updateContent}
      updateMode={updateMode}
    />
  );

  expect(cp.instance().codeContainer.getOption('mode')).toBe(mode);
});

test.skip("update Content", () => {});

test.skip("update mode", () => {});
