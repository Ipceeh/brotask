import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import Cell from './index.js';
import Table from './index.js';


  it('renders 16 <Cell /> components', () => {
    const wrapper = shallow(<Table />);
    expect(wrapper.find(Cell)).to.have.length(16);
  });

  it('renders 6 <Cell /> components', () => {
    const wrapper = shallow(<Table initialWidth="2" initialHeight="3" />);
    expect(wrapper.find(Cell)).to.have.length(6);
  });

  it('renders 2 <Cell /> components', () => {
    const wrapper = shallow(<Table initialWidth="1" initialHeight="2" />);
    expect(wrapper.find(Cell)).to.have.length(2);
  });
  it('renders 340 <Cell /> components', () => {
    const wrapper = shallow(<Table initialWidth="20" initialHeight="17" />);
    expect(wrapper.find(Cell)).to.have.length(340);
  });
