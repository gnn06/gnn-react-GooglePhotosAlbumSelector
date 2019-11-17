import * as AlbumUtil from './album-utils.js';
import expectExport from 'expect';

describe('1', () => {
    it('filtered', () => {
        const filtered = AlbumUtil.hasAllAlbumToHide([{ id: "album1", title: "title1" }], ["album1"]);
        expect(filtered).toEqual(true);
    });

    it('not filtered, other hidden album', () => {
        const filtered = AlbumUtil.hasAllAlbumToHide([{ id: "album1", title: "title1" }], ["album2"]);
        expect(filtered).toEqual(false);
    });

    it('hasAllAlbumToHide, not filtered, no album', () => {
        const filtered = AlbumUtil.hasAllAlbumToHide([], ["album1"]);
        expect(filtered).toEqual(false);
    });

    it('hasAllAlbumToHide, not filtered, no hidden album', () => {
        const filtered = AlbumUtil.hasAllAlbumToHide([{ id: "album1", title: "title1" }], []);
        expect(filtered).toEqual(false);
    });

    it('hasAllAlbumToHide, not filterd two empty album list', () => {
        const filtered = AlbumUtil.hasAllAlbumToHide([], []);
        expect(filtered).toEqual(false);
    });

    it('hasAllAlbumToHide, not filtered because other album', () => {
        const filtered = AlbumUtil.hasAllAlbumToHide([{ id: "album1", title: "title1" }, { id: "album2", title: "title2" }], ["album1"]);
        expect(filtered).toEqual(false);
    });

    it('hasAllAlbumToHide, not filtered because other album bis', () => {
        const filtered = AlbumUtil.hasAllAlbumToHide([{ id: "album1", title: "title1" }, { id: "album2", title: "title2" }], ["album2"]);
        expect(filtered).toEqual(false);
    });

    it('hasAllAlbumToHide, filtered because of 2 hidden albums', () => {
        const filtered = AlbumUtil.hasAllAlbumToHide([{ id: "album1", title: "title1" }, { id: "album2", title: "title2" }], ["album1", "album2"]);
        expect(filtered).toEqual(true);
    });


    it('filterOneAlbum, filtered', () => {
        const filtered = AlbumUtil.filterOneAlbum([{ id: "photo1", albums: [{ id: "album1" }] }], ["album1"]);
        expect(filtered).toEqual([]);
    });

    it('filterOneAlbum, not filtered', () => {
        const filtered = AlbumUtil.filterOneAlbum([{ id: "photo1", albums: [{ id: "album1" }] }], ["album2"]);
        expect(filtered).toEqual([{ id: "photo1", albums: [{ id: "album1" }] }]);
    });

    it('filterOneAlbum, nothing to filter', () => {
        const filtered = AlbumUtil.filterOneAlbum([{ id: "photo1", albums: [{ id: "album1" }] }], []);
        expect(filtered).toEqual([{ id: "photo1", albums: [{ id: "album1" }] }]);
    });

});

describe('filterSameTail', () => {
    test('same lists', () => {
        const albums = [{id:"albmid1"}, {id:"albmid2"}, {id:"albmid3"}];
        const otherAlbums = [{id:"albmid1"}, {id:"albmid2"}, {id:"albmid3"}];
        const [result, tail] = AlbumUtil.filterSameTail(albums, otherAlbums);
        expect(result).toEqual([]);
        expect(tail).toEqual(otherAlbums);
    });
    
    test('maching tail', () => {
        const albums = [{id:"albmid1"}, {id:"albmid2"}, {id:"albmid3"}];
        const otherAlbums = [{id:"albmid2"}, {id:"albmid1"}, {id:"albmid3"}];
        const [result, tail] = AlbumUtil.filterSameTail(albums, otherAlbums);
        expect(result).toEqual([{id:"albmid1"}, {id:"albmid2"}]);
        expect(tail).toEqual(otherAlbums.slice(2, 3));
    });

    test('no maching tail', () => {
        const albums = [{id:"albmid1"}, {id:"albmid2"}, {id:"albmid3"}];
        const otherAlbums = [{id:"albmid3"}, {id:"albmid2"}, {id:"albmid1"}];
        const [result, tail] = AlbumUtil.filterSameTail(albums, otherAlbums);
        expect(result).toEqual([{id:"albmid1"}, {id:"albmid2"}, {id:"albmid3"}]);
        expect(tail).toEqual([]);
    });

    test('empty other argument', () => {
        const albums = [{id:"albmid1"}, {id:"albmid2"}, {id:"albmid3"}];
        const otherAlbums = [];
        const [result, tail] = AlbumUtil.filterSameTail(albums, otherAlbums);
        expect(result).toEqual([{id:"albmid1"}, {id:"albmid2"}, {id:"albmid3"}]);
        expect(otherAlbums).toEqual([]);
    })

    test('don\'alter argument', () => {
        const albums = [{id:"albmid1"}, {id:"albmid2"}, {id:"albmid3"}];
        const otherAlbums = [{id:"albmid1"}, {id:"albmid2"}, {id:"albmid3", photos:["photoid1"]}];
        const saved_albums = albums.slice();
        const saved_otherAlbums = otherAlbums.slice();
        const result = AlbumUtil.filterSameTail(albums, otherAlbums);
        expect(albums).toEqual(saved_albums);
        expect(otherAlbums).toEqual(saved_otherAlbums);
    });
});

describe('filterDate', () => {

    const photos = [
        {
            mediaMetadata: {
                creationTime: "2019-01-01T12:00:00Z"
            }
        },
        {
            mediaMetadata: {
                creationTime: "2019-01-02T12:00:00Z"
            }
        },
        {
            mediaMetadata: {
                creationTime: "2019-01-03T12:00:00Z"
            }
        }

    ];

    test('filter', () => {
        // GIVEN
        const dateFilter = {
            start: new Date("2019-01-02T00:00:00Z"),
            end: new Date("2019-01-02T23:59:59Z")
        };
        // WHEN
        const result = AlbumUtil.filterDate(photos, dateFilter);
        // THEN
        expect(result).toEqual(photos.slice(1, 2));
    });

    test('filter nothing', () => {
        // GIVEN        
        const dateFilter = {
            start: new Date("2019-01-01T00:00:00Z"),
            end: new Date("2019-01-04T23:59:59Z")
        };
        // WHEN
        const result = AlbumUtil.filterDate(photos, dateFilter);
        // THEN
        expect(result).toEqual(photos);
    });

    test('filter all', () => {
        // GIVEN        
        const dateFilter = {
            start: new Date("2019-01-02T08:00:00Z"),
            end: new Date("2019-01-02T09:00:00Z")
        };
        // WHEN
        const result = AlbumUtil.filterDate(photos, dateFilter);
        // THEN
        expect(result).toEqual([]);
    });

    test('null filter', () => {
        // GIVEN        
        const dateFilter = {
            start: null,
            end: null
        };
        // WHEN
        const result = AlbumUtil.filterDate(photos, dateFilter);
        // THEN
        expect(result).toEqual(photos);
    });
});

test('getAlbumFlagClass', () => {
    const result1 = AlbumUtil.getAlbumFlagClass('albumid1');
    expect(result1).not.toEqual("");
    const result2 = AlbumUtil.getAlbumFlagClass('albumid2');
    expect(result2).not.toEqual("");
    expect(result1).not.toEqual(result2);
    const result3 = AlbumUtil.getAlbumFlagClass('albumid2');
    expect(result3).toEqual(result2);
    
});