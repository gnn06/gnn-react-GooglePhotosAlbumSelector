import * as AlbumUtil from './album-utils.js';
import expectExport from 'expect';

it('filtered', () => {
    const filtered = AlbumUtil.hasAllAlbumToHide([{id:"album1", title:"title1"}], ["album1"]);
    expect(filtered).toEqual(true);
});

it('not filtered, other hidden album', () => {
    const filtered = AlbumUtil.hasAllAlbumToHide([{id:"album1", title:"title1"}], ["album2"]);
    expect(filtered).toEqual(false);
});

it('hasAllAlbumToHide, not filtered, no album', () => {
    const filtered = AlbumUtil.hasAllAlbumToHide([], ["album1"]);
    expect(filtered).toEqual(false);
});

it('hasAllAlbumToHide, not filtered, no hidden album', () => {
    const filtered = AlbumUtil.hasAllAlbumToHide([{id:"album1", title:"title1"}], []);
    expect(filtered).toEqual(false);
});

it('hasAllAlbumToHide, not filterd two empty album list', () => {
    const filtered = AlbumUtil.hasAllAlbumToHide([], []);
    expect(filtered).toEqual(false);
});

it('hasAllAlbumToHide, not filtered because other album', () => {
    const filtered = AlbumUtil.hasAllAlbumToHide([{id:"album1", title:"title1"}, {id:"album2", title:"title2"}], ["album1"]);
    expect(filtered).toEqual(false);
});

it('hasAllAlbumToHide, not filtered because other album bis', () => {
    const filtered = AlbumUtil.hasAllAlbumToHide([{id:"album1", title:"title1"}, {id:"album2", title:"title2"}], ["album2"]);
    expect(filtered).toEqual(false);
});

it('hasAllAlbumToHide, filtered because of 2 hidden albums', () => {
    const filtered = AlbumUtil.hasAllAlbumToHide([{id:"album1", title:"title1"}, {id:"album2", title:"title2"}], ["album1", "album2"]);
    expect(filtered).toEqual(true);
});


it('filterOneAlbum, filtered', () => {
    const filtered = AlbumUtil.filterOneAlbum([{id:"photo1", albums:[{id:"album1"}]}], ["album1"]);
    expect(filtered).toEqual([]);
});

it('filterOneAlbum, not filtered', () => {
    const filtered = AlbumUtil.filterOneAlbum([{id:"photo1", albums:[{id:"album1"}]}], ["album2"]);
    expect(filtered).toEqual([{id:"photo1", albums:[{id:"album1"}]}]);
});

