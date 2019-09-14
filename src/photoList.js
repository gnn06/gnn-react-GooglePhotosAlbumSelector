/* eslint no-undef: "off"*/
import React from 'react';

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
    let params = {
      pageSize: 100
    };
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
      <div class="grille">{this.state.photos.map((item) => <Image baseUrl={item.baseUrl} albums={getAlbumsPhoto(item.id, this.props.albums)}/>)}</div>
      <button onClick={this.request_photos}>request photo</button>
      
    </div>;
  }
}

function Image(props) {
  return <div class="image-with-flag">
    <img src={props.baseUrl} />
    <div class="flag">
      { props.albums.map(item => <div class="flag">{item}</div>)}    
    </div>
  </div>;
}


function getAlbumsPhoto(id, albums) {
  const albumsFounded = albums.filter(al => al.photos.indexOf(id) > -1);
  return albumsFounded.map(item => item.title);
}
