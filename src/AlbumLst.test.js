jest.mock('./google.js');

    import React from 'react';
import { shallow, mount, render } from 'enzyme';
import AlbumLst from './AlbumLst.js';
import GooglePhotos from './google.js';
import { JestEnvironment } from '@jest/environment';
import expectExport from 'expect';

it('AlbumLst, running', async () => {
    const mockParent = {
        state: {
            albums: [{
                title:"title album1",
                id:"albumid1",
                mediaItemsCount: 1
            }]
        }
    };
    GooglePhotos.getAllAlbumDetail = jest.fn(() => {
            expect(wrapper.find("div#running")).toHaveLength(1);
            return Promise.resolve();
        });
    const wrapper = shallow(<AlbumLst parent={mockParent}/>);
    
    expect(wrapper.find("div#running")).toHaveLength(0);
    
    wrapper.find("button#request-all-album-photos").simulate('click');    
    
    // necessary to wait the finally that change state
    await Promise.resolve();
    expect(wrapper.find("div#running")).toHaveLength(0);
});