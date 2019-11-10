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
    const mockRestoreAlbumsHandle = jest.fn();

    GooglePhotos.getAllAlbumDetail = jest.fn(() => {
            expect(wrapper.find("div#running")).toHaveLength(1);
            return Promise.resolve();
        });
    const wrapper = shallow(<AlbumLst parent={mockParent}
        albums={albums}
        restoreAlbumsHandle={mockRestoreAlbumsHandle}/>);
    
    expect(wrapper.find("div#running")).toHaveLength(0);
    
    //WHEN
    wrapper.find("button#request-all-album-photos").simulate('click');    
    
    // necessary to wait the finally that change state
    await Promise.resolve();
    // THEN
    expect(wrapper.find("div#running")).toHaveLength(0);
});
