/*global gapi */

export default class GooglePhotos {
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
    }, function(error) {
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
};
