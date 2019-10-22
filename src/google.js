/*global gapi */
import GoogleQueue from './google-queue.js';

class GooglePhotos {
  addPhotoToAlbum(photoIdLst, albumId) {
    const path = "https://photoslibrary.googleapis.com/v1/albums/{albumId}:batchAddMediaItems"
      .replace("{albumId}", albumId);

    const body = {
      "mediaItems": photoIdLst
    };

    gapi.client.request({
      'method': 'POST',
      'path': path,
      'body': body
    }).then(function (response) {
      console.log(response);
    }, function (error) {
      console.error(error);
    });
  };

  getPhotos(nextPageToken) {
    let params = {
      pageSize: 100
    };
    if (nextPageToken !== undefined) {
      params.pageToken = nextPageToken;
    }
    const request = gapi.client.request({
      'method': 'GET',
      'path': 'https://photoslibrary.googleapis.com/v1/mediaItems',
      params: params
    });
    return request;
  }

  getAlbums(nextPageToken, handleGetAlbums) {
    let that = this;
    var params = {};
    if (nextPageToken !== undefined && typeof nextPageToken == "string") {
      params.pageToken = nextPageToken;
    }
    gapi.client.request({
      'method': 'GET',
      'path': 'https://photoslibrary.googleapis.com/v1/albums',
      params: params
    }).then(function (response) {
      response.result.albums.forEach(album => {
        album.photos = [];
      });
      handleGetAlbums(response.result.albums);
      if (response.result.nextPageToken !== undefined) {
        that.getAlbums(response.result.nextPageToken, handleGetAlbums);
      }
    }, function (error) {
      console.error(error);
    });
  }

  getAllAlbumDetail(albums, updateUI, updateErrorUI) {
    const ALBUM_POOL_SIZE = 7;
    const albumsToRetrieve = albums.filter(album => album.photos === undefined || album.photos.length < album.mediaItemsCount);
    var that = this;
    var p = [];
    var i = 0;
    while (i < albumsToRetrieve.length && i < ALBUM_POOL_SIZE) {
      p[i] = GoogleQueue.getAlbumDetailQueue(albumsToRetrieve, updateUI, updateErrorUI, this.getAlbumDetail);
      i++;
    }
    return Promise.all(p);
  }

    getAlbumDetail(album, updateUI, updateErrorUI, nextPageToken) {
    // to the callback
    let that = this;
    // if album is already loaded, then abort
    if (album.photos !== undefined &&
      album.photos.length === album.mediaItemsCount) {
      return;
    }
    // if start to load an album (no nextPageTokethere n) and 
    // there is no photos property or partially loaded then start by resetting photos to []
    if (nextPageToken === undefined
      && (album.photos === undefined
        || album.photos !== undefined && album.photos.length > 0)) {
      album.photos = [];
    }
    let params = { albumId: album.id };
    if (nextPageToken !== undefined) {
      params.pageToken = nextPageToken;
    }
    let request = gapi.client.request({
      'method': 'POST',
      'path': 'https://photoslibrary.googleapis.com/v1/mediaItems:search',
      params: params
    });
    return request.then(function (response) {
      if (Array.isArray(response.result.mediaItems)) {
        let photos = response.result.mediaItems.map(photo => { return photo.id; });
        if (album.photos) {
          album.photos = album.photos.concat(photos);
        } else {
          album.photos = photos;
        }
      }
      updateUI(album);
      return response.result.nextPageToken;
    }).then(function(nextPageToken) {
      if (nextPageToken) {
        return that.getAlbumDetail(album, updateUI, updateErrorUI, nextPageToken);
      } else return "";
    }).catch(function(error) {
      updateErrorUI(error.result.error);
      console.error(error);
    });
  }
};

const GoogleInst = new GooglePhotos();

export default GoogleInst;