/* eslint no-undef: "off"*/
import React from 'react';
import ModalAlbum from './ModalAlbum.js';
import { tsImportEqualsDeclaration } from '@babel/types';

export default class ImageList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: [],
      selected: new Set(),
      modalIsOpen: false
    };
    this.request_photos = this.request_photos.bind(this);
    this.addAlbum       = this.addAlbum.bind(this);
    this.removeAlbum    = this.removeAlbum.bind(this);
    this.openModal      = this.openModal.bind(this);
    this.closeModal     = this.closeModal.bind(this);
    this.handleChooseAlbum = this.handleChooseAlbum.bind(this);
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

  openModal() {
    this.setState({modalIsOpen: true});
  }

  handleChooseAlbum(albumId) {
    console.log("album choosen  : " + albumId);
  }

  closeModal() {
    this.setState({modalIsOpen: false});
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
      {this.state.selected.size}
      <button onClick={this.openModal} disabled={this.state.selected.size == 0}>add to album</button>

      <ModalAlbum 
        isOpen={this.state.modalIsOpen}
        close={this.closeModal}
        albums={this.props.albums}
        handleChoose={this.handleChooseAlbum}/>

      <div className="grille">{this.state.photos.map((item) => 
        <Image baseUrl={item.baseUrl} productUrl={item.productUrl}
          id={item.id} key={item.id}
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
    return <div className="image-with-flag">
                <a href={this.props.productUrl}><img src={this.props.baseUrl} /></a>
                <div className="flag" >
                  { this.props.albums.map((item, index) => <div className="flag" key={index}>{item}</div>)}    
                </div>
                <input type="checkbox" checked={this.state.isSelected} onChange={this.handleSelect}/>
              </div>; 
  }
}

function getAlbumsPhoto(id, albums) {
  const albumsFounded = albums.filter(al => al.photos.indexOf(id) > -1);
  return albumsFounded.map(item => item.title);
}
