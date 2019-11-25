/* eslint no-undef: "off"*/
import React from 'react';

// services

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
    let content;
    if (this.props.albums.length === 0) {
      content = <div className="">Cliquez sur Récupérer albums ou créer un album dans Google Photos</div>;
    } else {
      content = <div>
      <div className="album-list">{this.props.albums.map((item) => 
      <Album item={item} key={item.id} selectAlbumHandle={this.selectAlbumHandle}/>
      )}
      </div>
      </div>;
    }
    return <div>
    <button className="btn btn-primary" onClick={this.requestAlbumsDetailsClick}>Récupère albums</button>
      <div>
        <button className="btn btn-primary" onClick={this.hideAlbum}>hide album</button>
        <button className="btn btn-primary" onClick={this.showOnlyAlbum}>show only album</button>
      </div>
      {content}
    </div>;
  }
}