/* eslint no-undef: "off"*/
import React from 'react';

function findAlbums(photoId) {
  //return albums.filter(item => photoInPhotos(photoId, item.photos));
}

function photoInPhotos(photoId, photos) {
  if (photos != null) {
    return photos.some(item => item.id == photoId);
  } else
    return false;
}

function flagPhotoWithAlbum(photoList, albums) {
  photoList.forEach(element => {
    element.albums = [ 'goi' ];
  });
}

export default class ImageList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: []
    };
    this.request_photos = this.request_photos.bind(this);
  }

  request_photos() {
    var component = this;
    const nextPageToken = this.state.nextPageToken;
    let params = {};
    if (nextPageToken != undefined) {
      params.pageToken = nextPageToken;
    }
    var request = gapi.client.request({
      'method': 'GET',
      'path': 'https://photoslibrary.googleapis.com/v1/mediaItems',
      params: params
    });
    // Execute the API request.
    request.execute(function (response) {
      const statePhotoList = component.state.photos;
      flagPhotoWithAlbum(statePhotoList, []);
      const newPhotoList = statePhotoList.concat(response.mediaItems);
      component.setState({
        photos: newPhotoList,
        nextPageToken : response.nextPageToken
      });
    });
  }

  /*sendAuthorizedApiRequest(requestDetails) {
    currentApiRequest = requestDetails;
    if (isAuthorized) {
      // Make API request
      gapi.client.request(requestDetails)
  
      // Reset currentApiRequest variable.
      currentApiRequest = {};
    } else {
      GoogleAuth.signIn();
    }
  }*/

  render() {
    return <div>
      <div class="grille">{this.state.photos.map((item) => <Image item={item} />)}</div>
      <button onClick={this.request_photos}>request photo</button>
      
    </div>;
  }
}

function Image(props) {
  return <div class="image-with-flag"><img src={props.item.baseUrl} /></div>;
}

