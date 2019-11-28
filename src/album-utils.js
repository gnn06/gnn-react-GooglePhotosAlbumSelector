import randomcolor from 'randomcolor';
import moment from 'moment';

export function filterOneAlbum(list, albumsToHide) {
    const result = list.filter(photo => !(albumsToHide && hasAllAlbumToHide(photo.albums, albumsToHide)))
    return result;
}

export function getAlbumsPhoto(id, albums) {
    const albumsFounded = albums.filter(al => al.photos.indexOf(id) > -1);
    return albumsFounded.map(item => { return { id: item.id, title: item.title } });
}

export function hasAllAlbumToHide(photoAlbum, albumsToHide) {
    if (Array.isArray(photoAlbum) && photoAlbum.length > 0) {
        let hide = photoAlbum.every(album => albumsToHide.indexOf(album.id) >= 0);
        return hide;
    } else {
        return false;
    }
}

export function filterSameTail(albums, otherAlbums) {
    const commonTail = [];
    
    if (otherAlbums.length === 0) {
        return [albums, commonTail];
    }

    albums = albums.slice();
    otherAlbums = otherAlbums.slice();


    var stop = false;
    do {
        var last = albums.pop();
        var lastOther = otherAlbums.pop();
        if (last.id !== lastOther.id) {
            albums.push(last);
            stop = true;
        } else {
            commonTail.unshift(lastOther);
        }
    } while (!stop && albums.length > 0 && otherAlbums.length > 0);

    return [albums, commonTail];
}

export function filterDate(photos, dateFilter) {
    // "2019-10-27T15:15:31Z" = ISO 8601
    return photos.filter(photo => {
        const photoDate = new Date(photo.mediaMetadata.creationTime);
        return (dateFilter.end == null ? true : photoDate <= moment(dateFilter.end).add(1, "day")) 
        && (dateFilter.start == null ? true : photoDate >= dateFilter.start);
    });
}

var colors = new Map();

export function getAlbumFlagClass(albumId) {
    var color = colors.get(albumId);
    if (color === undefined) {
        color = randomcolor();
        colors.set(albumId, color);
    }
    return color;
}