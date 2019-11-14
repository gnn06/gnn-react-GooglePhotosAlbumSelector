export function getAlbums() {
    return JSON.parse(localStorage.getItem('albums'));
}

export function setAlbums(albums) {
    localStorage.setItem('albums', JSON.stringify(albums));
}