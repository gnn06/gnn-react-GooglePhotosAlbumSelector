class GoogleQueue {

    getAllAlbumDetail(albums, updateUI, updateErrorUI, getAlbumDetail) {
        const ALBUM_POOL_SIZE = 7;
        var that = this;
        var p = [];
        var i = 0;
        while (i < albums.length && i < ALBUM_POOL_SIZE) {
            p[i] = this.getAlbumDetailQueue(albums, updateUI, updateErrorUI, getAlbumDetail);
            i++;
        }
        return Promise.all(p);
    }

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