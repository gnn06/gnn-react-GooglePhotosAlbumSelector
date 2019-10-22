class GoogleQueue {

    getAlbumDetailQueue(albums, updateUI, updateErrorUI, getAlbumDetail) {
        var that = this;
        if (albums.length > 0) {
            const album = albums.pop();
            return getAlbumDetail(album, updateUI, updateErrorUI)
                .then(function (value) {
                    if (albums.length > 0) {
                        return that.getAlbumDetailQueue(albums, updateUI, updateErrorUI, getAlbumDetail);
                    } else
                        return;
                });
        } else {
            return;
        }
    }
}

const GoogleQueueInst = new GoogleQueue();

export default GoogleQueueInst;