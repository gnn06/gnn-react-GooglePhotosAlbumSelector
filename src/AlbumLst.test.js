jest.mock('./google.js');

import React from 'react';
import { shallow, mount, render } from 'enzyme';
import { JestEnvironment } from '@jest/environment';
import expectExport from 'expect';

import GooglePhotos from './google.js';
import * as Store from './services/store.js';

import AlbumLst from './AlbumLst.js';

it('AlbumLst, check running div', async () => {
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
    const wrapper = shallow(<AlbumLst parent={mockParent}
        albums={albums}
        setAlbums={mockSetAlbums}/>);
    
    expect(wrapper.find("div#running")).toHaveLength(0);
    
    //WHEN
    wrapper.find("button#request-all-album-photos").simulate('click');    
    
    // necessary to wait the finally that change state
    await Promise.resolve();
    // THEN
    expect(wrapper.find("div#running")).toHaveLength(0);
});

describe('restore albums', () => {

    it('restore 1 album', () => {
        // GIVEN
        var albums = [];
        const restoredAlbums = [{id:"albumid1"}];
        const mockSetAlbums = jest.fn();
        Store.getAlbums = jest.fn().mockReturnValue(restoredAlbums);
        // WHEN
        const wrapper = shallow(<AlbumLst 
            albums={albums}
            setAlbums={mockSetAlbums}/>);
        // THEN
        expect(mockSetAlbums).toHaveBeenCalledWith(restoredAlbums);
    });
    
    it('restore 0 album', () => {
        // GIVEN
        var albums = [];
        const mockSetAlbums = jest.fn();
        Store.getAlbums = jest.fn().mockReturnValue(null);
        // WHEN
        const wrapper = shallow(<AlbumLst 
            albums={albums}
            setAlbums={mockSetAlbums}/>);
        // THEN
        expect(mockSetAlbums).toHaveBeenCalledWith([]);
    });
    
});