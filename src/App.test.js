import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, mount, render } from 'enzyme';

import App from './App';
import * as Store from './services/store.js';

describe('restore albums', () => {

  global.gapi = {
    client: {
        request: jest.fn()
    },
    load: jest.fn()
  };

  it('restore 1 album', () => {
      // GIVEN
      const restoredAlbums = [{id:"albumid1"}];
      Store.getAlbums = jest.fn().mockReturnValue(restoredAlbums);
      // WHEN
      const wrapper = shallow(<App/>);
      // THEN
      expect(wrapper.state().albums).toEqual(restoredAlbums);
      expect(wrapper.state().previousAlbums).toEqual(restoredAlbums);
  });
  
  it('restore 0 album', () => {
      // GIVEN
      Store.getAlbums = jest.fn().mockReturnValue(null);
      // WHEN
      const wrapper = shallow(<App/>);
      // THEN
      expect(wrapper.state().albums).toEqual([]);
  });
  
});