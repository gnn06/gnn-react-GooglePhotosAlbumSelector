export function hideAlbum(albums) {
    if (Array.isArray(albums) && albums.length > 0) {
        let hide = albums.every(album => album.id === "ADoMfeS3RTKABAvAAeyCoQGYc4pjVmp-eTCYa7eSPEyCsIRFBhx8SCFH-xO1LWMJMl_96Dh6R52q");
        return hide;
    } else {
        return false;
    }
}
