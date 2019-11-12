jest.mock('./google.js');

import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, mount, render } from 'enzyme';

import App from './App';
import * as Store from './services/store.js';
import Google  from './google.js';

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

test('App functions', () => {
  Google.getAlbums = jest.fn().mockResolvedValue([{id:"albumid1"}]);
  Google.getAllAlbumDetail = jest.fn().mockResolvedValue([{id:"photoid1"}]);
  const wrapper = shallow(<App/>);
  const instance = wrapper.instance();
  instance.requestAlbumsDetailsHandle();
});

/*it('AlbumLst, check running div', async () => {
  // GIVEN
  const albums = [{
      title:"title album1",
      id:"albumid1",
      mediaItemsCount: 1
  }];
  const mockParent = {
      state: {
          albums: albums
      },
      setState: jest.fn()
  };
  const mockSetAlbums = jest.fn();

  GooglePhotos.getAllAlbumDetail = jest.fn(() => {
          expect(wrapper.find("div#running")).toHaveLength(1);
          return Promise.resolve();
      });
  const wrapper = shallow(<App
      parent={mockParent}
      albums={albums}
      setAlbums={mockSetAlbums}/>);
  const instance = wrapper.instance();
  
  expect(wrapper.find("div#running")).toHaveLength(0);
  
  //WHEN
  instance.requestAlbumsDetailsHandle();
  
  // necessary to wait the finally that change state
  await Promise.resolve();
  // THEN
  expect(wrapper.find("div#running")).toHaveLength(0);
});*/