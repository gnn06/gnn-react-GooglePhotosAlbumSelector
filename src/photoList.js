/* eslint no-undef: "off"*/
import React from 'react';
import ModalAlbum from './ModalAlbum.js';
import Image from './Image.js';
import GooglePhotos from './google.js';
import * as AlbumUtil from "./album-utils.js";

const service = new GooglePhotos();

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
    
    service.getPhotos(nextPageToken)
    .then(function(response) {
      const statePhotoList = component.state.photos;
      const newPhotoList = statePhotoList.concat(response.result.mediaItems.map(
        photo => {
          photo.albums = AlbumUtil.getAlbumsPhoto(photo.id, component.props.albums); 
          return photo;
        }
      ));
      component.setState({
        photos: newPhotoList,
        nextPageToken : response.result.nextPageToken
      });
    }, function(error) {
      console.error(error);
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
    const selectedArray = Array.from(this.state.selected);
    service.addPhotoToAlbum(selectedArray, albumId);
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
    return <div className="photo-panel">
      {this.state.selected.size}
      <button onClick={this.openModal} disabled={this.state.selected.size === 0}>add to album</button>

      <ModalAlbum 
        isOpen={this.state.modalIsOpen}
        close={this.closeModal}
        albums={this.props.albums}
        handleChoose={this.handleChooseAlbum}/>

      <div className="grille">
        { AlbumUtil.filterOneAlbum(this.state.photos, this.props.hideAlbum) 
        .map((item) => 
        <Image baseUrl={item.baseUrl} productUrl={item.productUrl}
          id={item.id} key={item.id}
          albums={item.albums}
          addAlbum={this.addAlbum} removeAlbum={this.removeAlbum}/>)}
      </div>
      <button onClick={this.request_photos}>request photo</button>
    </div>;
  }
}
