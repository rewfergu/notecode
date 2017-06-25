import React from 'react';
import {mount} from 'enzyme';
import Title from '../components/Title';

const titleText = "One Fish";
const updateTitle = jest.fn();

test('display the title', () => {
  const title = mount(
    <Title text={titleText} updateTitle={updateTitle} />
  );

  const input = title.find('input');
  expect(input.get(0).value).toBe(titleText);
});

test('update the title', () => {
  const title = mount(
    <Title text={titleText} updateTitle={updateTitle} />
  );

  const input = title.find('input');
  input.simulate('change');
  expect(updateTitle).toBeCalled();
});