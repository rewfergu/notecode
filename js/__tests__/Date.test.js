import React from 'react';
import {mount} from 'enzyme';
import DateDisplay from '../components/Date';

test('display the date', () => {
  const today = new Date().toISOString();

  const date = mount(
    <DateDisplay lastSaved={today} />
  );

  const dateText = date.text();
  expect(dateText).toBeDefined();
});