import React from 'react';
import {mount} from 'enzyme';
import Tags from '../components/Tags';

const event = {
  preventDefault: jest.fn()
};
const addTag = jest.fn();
const deleteTag = jest.fn();

test('display existing tags', () => {
  const tags = mount(
    <Tags tags={['one fish','two fish','red fish']} addTag={addTag} deleteTag={deleteTag} />
  );

  expect(tags.find('.tag').length).toBe(3);
});

test('add tag on form submit', () => {
  const tags = mount(
    <Tags tags={['one fish','two fish','red fish']} addTag={addTag} deleteTag={deleteTag} />
  );

  const inputField = tags.find('input');
  inputField.node.value = 'blue fish';
  tags.instance().submitForm(event);

  expect(event.preventDefault).toBeCalled();
  expect(addTag).toBeCalled();
  expect(addTag.mock.calls[0][0]).toEqual(['one fish', 'two fish', 'red fish', 'blue fish']);
});

test('add tag on comma separator', () => {
  const tags = mount(
    <Tags tags={['one fish','two fish','red fish']} addTag={addTag} deleteTag={deleteTag} />
  );

  tags.instance().handleKeyUp({target: {value: 'blue fish, '}});
  expect(addTag).toBeCalled();
  expect(addTag.mock.calls[0][0]).toEqual(['one fish', 'two fish', 'red fish', 'blue fish']);
});
