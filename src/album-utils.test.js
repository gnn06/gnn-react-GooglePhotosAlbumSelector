import { hideAlbum } from './album-utils.js';
import expectExport from 'expect';

it('not filtered', () => {
    const filtered = hideAlbum([{ id: "id1", title: "title1"}]);
    expect(filtered).toEqual(false);
});

it('filtered', () => {
    const filtered = hideAlbum([{ id: "ADoMfeS3RTKABAvAAeyCoQGYc4pjVmp-eTCYa7eSPEyCsIRFBhx8SCFH-xO1LWMJMl_96Dh6R52q", title: "title1"}]);
    expect(filtered).toEqual(true);
});

it('empty', () => {
    const filtered = hideAlbum([]);
    expect(filtered).toEqual(false);
});


it('twice', () => {
    const filtered = hideAlbum([
        { id: "ADoMfeS3RTKABAvAAeyCoQGYc4pjVmp-eTCYa7eSPEyCsIRFBhx8SCFH-xO1LWMJMl_96Dh6R52q", title: "title1"},
        { id: "id2", title: "title2"}
    ]);
    expect(filtered).toEqual(false);
});
