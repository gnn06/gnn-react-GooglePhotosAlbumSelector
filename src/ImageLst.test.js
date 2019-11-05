import React from 'react';
import { shallow, mount, render } from 'enzyme';
import ImageLst from './ImageLst.js';
import expectExport from 'expect';

it.only('ImageLst', () => {
    // GIVEN
    const albums = [];
    const photos = [
        {
            id: "photoid1",
            mediaMetadata: {
                creationTime: "2019-01-01T00:00:00Z"
            },
            baseUrl: "http://gorsini/photo1.jpg  "
        }];
    const nextPageToken = undefined;
    const hasMoreItems = false;
    const hideAlbums = null;
    const dateFilter = {
        start: new Date("2019-01-01T00:00:00Z"),
        end: new Date("2019-01-02T00:00:00Z")
    };
    const getPhotosHandle = null;

    // WHEN
    const wrapper = shallow(<ImageLst
        albums={albums}
        photos={photos}
        nextPageToken={nextPageToken}
        hasMoreItems={hasMoreItems}
        hideAlbum={hideAlbums}
        dateFilter={dateFilter}
        getPhotosHandler={getPhotosHandle}/>);

    // THEN
    expect(wrapper.find("Image")).toHaveLength(1);
});
