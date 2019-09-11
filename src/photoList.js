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

export default class ImageList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: []
    };
    this.request_photos = this.request_photos.bind(this);
  }

  request_photos() {
    console.log('rquest photos');
    var component = this;
    var request = gapi.client.request({
      'method': 'POST',
      'path': 'https://photoslibrary.googleapis.com/v1/mediaItems:search',
      'params': { "albumId": "ADoMfeTjMuoeBlhVO6malM99rD746uYMCZ71zYLVwmkZUP3hvlPod7jk0DyrzoPFtnI70-5JPLT4" }
    });
    // Execute the API request.
    request.execute(function (response) {
      console.log(response);
      component.setState({
        photos: [{ baseUrl: response.mediaItems[0].baseUrl, albums: ["goi"] },
        { baseUrl: response.mediaItems[1].baseUrl, albums: ["goi"] }]
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
    //console.log(photos.slice(0, 2));
    //console.log(albums);
    //console.log(findAlbums(photos[0].id));
    //return <div class="grille">{photos.slice(0,2).map((item) => <Image item={item}/>)}</div>;
    return <div>
      <button onClick={this.request_photos}>request photo</button>
      <div class="grille">{this.state.photos.slice(0, 5).map((item) => <Image item={item} />)}</div>
    </div>;
  }
}

function Image(props) {
  console.log(props.item);
  return <div class="image-with-flag"><img src={props.item.baseUrl} /></div>;
}

