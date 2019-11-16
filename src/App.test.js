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

test('request albums and details', () => {
  Google.getAlbums = jest.fn().mockResolvedValue([{id:"albumid1"}]);
  Google.getAllAlbumDetail = jest.fn().mockResolvedValue([{id:"photoid1"}]);
  const wrapper = shallow(<App/>);
  const instance = wrapper.instance();
  instance.requestAlbumsDetailsHandle();
});

describe('requestAlbumsAndDetails, check reset albums list', () => {
  test('error => no reset', () => {
    const wrapper = shallow(<App/>);
    const instance = wrapper.instance();
    wrapper.setState({albums: [{id:"albumid1"}], error: true});
    instance.requestAlbumsHandle = jest.fn().mockResolvedValue();
    instance.requestAlbumsPhotosHandle = jest.fn().mockResolvedValue();
    instance.store_albums = jest.fn();
    instance.requestAlbumsDetailsHandle();
    // THEN
    expect(instance.requestAlbumsHandle).not.toHaveBeenCalled();
  });
  
  test('no error => reset', () => {
    const wrapper = shallow(<App/>);
    const instance = wrapper.instance();
    wrapper.setState({albums: [{id:"albumid1"}], error: false});
    instance.requestAlbumsHandle = jest.fn().mockResolvedValue();
    instance.requestAlbumsPhotosHandle = jest.fn();
    instance.store_albums = jest.fn();
    return instance.requestAlbumsDetailsHandle()
      .then(() => {
        // THEN
        expect(instance.requestAlbumsHandle).toHaveBeenCalled();
        expect(instance.store_albums).toHaveBeenCalled();
      });
  });

  test('if error then don"t store', () => {
    const wrapper = shallow(<App/>);
    const instance = wrapper.instance();
    wrapper.setState({albums: [{id:"albumid1"}], error: false});
    instance.requestAlbumsHandle = jest.fn().mockResolvedValue();
    instance.requestAlbumsPhotosHandle = jest.fn().mockImplementationOnce(() => { wrapper.setState({error: true}); return Promise.resolve()});
    instance.store_albums = jest.fn();
    return instance.requestAlbumsDetailsHandle()
      .then(() => {
        // THEN
        expect(instance.store_albums).not.toHaveBeenCalled();
      });
  });
  
});

test('requestPhotosHandle, setting hasMore, finally false', () => {
  // necessary to avoid let 'Loading....'
  const wrapper = shallow(<App/>);
  const instance = wrapper.instance();
  
  // GIVEN
  Google.getPhotos = jest.fn().mockResolvedValue({
    result: {
      mediaItems: null,
      nextPageToken: undefined
    }
  });

  // WHEN
  return instance.requestPhotosHandle()
  .then(() => {
    // THEN
    expect(wrapper.state().hasMoreItems).toEqual(false);
  });
});

test('requestPhotosHandle, setting hasMore, true during process', () => {
  // necessary to avoid let 'Loading....'
  const wrapper = shallow(<App/>);
  const instance = wrapper.instance();
  
  // GIVEN
  Google.getPhotos = jest.fn().mockResolvedValue({
    result: {
      mediaItems: [{id:"photoid1"}],
      nextPageToken: "aze"
    }
  });

  // WHEN
  return instance.requestPhotosHandle()
  .then(() => {
    // THEN
    expect(wrapper.state().hasMoreItems).toEqual(true);
  });
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