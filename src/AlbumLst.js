/* eslint no-undef: "off"*/
import React from 'react';

// services
import GooglePhotos from './google.js';

import Album from './Album.js';

export default class AlbumLst extends React.Component {

  constructor() {
    super();
    this.state = {
      selectedAlbum: []
    }
    this.requestAlbumsDetailsClick = this.requestAlbumsDetailsClick.bind(this);
    this.selectAlbumHandle = this.selectAlbumHandle.bind(this);
    this.hideAlbum = this.hideAlbum.bind(this);
    this.showOnlyAlbum = this.showOnlyAlbum.bind(this);
  }

  requestAlbumsDetailsClick() {
    this.props.requestAlbumsDetailsHandle();
  }

  requestAlbumsPhotosClick() {
    this.props.requestAlbumsPhotosHandle();
  }

  selectAlbumHandle(albumId, selected) {
    const stateSelectedAlbum = this.state.selectedAlbum;
    if (selected) {
      stateSelectedAlbum.push(albumId);
    } else {
      stateSelectedAlbum.pop(albumId);
    }
    this.setState({selectedAlbum: stateSelectedAlbum});
  }

  getSelectedAlbum() {
    const stateSelectedAlbum = this.state.selectedAlbum;
    return stateSelectedAlbum;
  }

  hideAlbum() {
    this.props.hideAlbumHandle(this.state.selectedAlbum);
  }

  showOnlyAlbum() {
    this.props.showOnlyAlbumHandle(this.state.selectedAlbum);
  }

  render() {
    return <div>
      <button className="btn btn-primary" onClick={this.requestAlbumsDetailsClick}>request albums details</button>
      <button className="btn btn-primary" onClick={this.store_albums}>store albums</button>
      <button className="btn btn-primary" onClick={this.hideAlbum}>hide album</button>
      <button className="btn btn-primary" onClick={this.showOnlyAlbum}>show only album</button>
      <div className="album-list">{this.props.albums.map((item) => 
        <Album item={item} key={item.id} selectAlbumHandle={this.selectAlbumHandle}/>
        )}
      </div>
    </div>;
  }
}