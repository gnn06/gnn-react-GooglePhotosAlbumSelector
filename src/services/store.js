export function getAlbums() {
    var result = JSON.parse(localStorage.getItem('albums'));
    if (result == null) {
        result = [];
    }
    return result;
}