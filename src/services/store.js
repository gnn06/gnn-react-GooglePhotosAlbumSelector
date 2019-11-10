export function getAlbums() {
    return JSON.parse(localStorage.getItem('albums'));
}