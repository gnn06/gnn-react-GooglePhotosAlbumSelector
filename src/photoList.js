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
      let photoList = component.state.photos;
      photoList = photoList.concat(response.mediaItems);
      component.setState({
        photos: photoList,
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
    //console.log(photos.slice(0, 2));
    //console.log(albums);
    //console.log(findAlbums(photos[0].id));
    //return <div class="grille">{photos.slice(0,2).map((item) => <Image item={item}/>)}</div>;
    return <div>
      <div class="grille">{this.state.photos.map((item) => <Image item={item} />)}</div>
      <button onClick={this.request_photos}>request photo</button>
      
    </div>;
  }
}

function Image(props) {
  return <div class="image-with-flag"><img src={props.item.baseUrl} /></div>;
}

