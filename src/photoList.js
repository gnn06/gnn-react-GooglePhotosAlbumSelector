/* eslint no-undef: "off"*/
import React from 'react';

export default class ImageList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: [],
      selected: new Set()
    };
    this.request_photos = this.request_photos.bind(this);
    this.addAlbum       = this.addAlbum.bind(this);
    this.removeAlbum    = this.removeAlbum.bind(this);
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

  addAlbum(photoId) {
    this.state.selected.add(photoId);
    this.setState({ selected: this.state.selected });
    ;
  }

  removeAlbum(photoId) {
    this.state.selected.delete(photoId);
    this.setState({ selected: this.state.selected });
    ;
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
      {this.state.selected.size} <button onClick={this.addAlbum}>add to album</button>
      <div class="grille">{this.state.photos.map((item) => 
        <Image baseUrl={item.baseUrl} productUrl={item.productUrl}
          id={item.id}
          albums={getAlbumsPhoto(item.id, this.props.albums)}
          addAlbum={this.addAlbum} removeAlbum={this.removeAlbum}/>)}
      </div>
      <button onClick={this.request_photos}>request photo</button>
    </div>;
  }
}

class Image extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isSelected: false
    };

    this.handleSelect = this.handleSelect.bind(this);
  }

  handleSelect(event) {
    const target = event.target;
    const selected = target.checked ;
    this.setState({ isSelected: selected });
    if (selected) {
      this.props.addAlbum(this.props.id);
    } else {
      this.props.removeAlbum(this.props.id);
    }   
  }

  render() {
    return <div class="image-with-flag">
                <a href={this.props.productUrl}><img src={this.props.baseUrl} /></a>
                <div class="flag">
                  { this.props.albums.map(item => <div class="flag">{item}</div>)}    
                </div>
                <input type="checkbox" checked={this.state.isSelected} onChange={this.handleSelect}/>
              </div>; 
  }
}

function getAlbumsPhoto(id, albums) {
  const albumsFounded = albums.filter(al => al.photos.indexOf(id) > -1);
  return albumsFounded.map(item => item.title);
}
