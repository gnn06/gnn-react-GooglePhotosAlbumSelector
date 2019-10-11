/* eslint no-undef: "off"*/
import React from 'react';
import GooglePhotos from './google.js';
import Album from './Album.js';

export default class AlbumLst extends React.Component {

  constructor() {
    super();
    this.state = {
      selectedAlbum: []
    }
    this.request_albums = this.request_albums.bind(this);
    this.store_albums = this.store_albums.bind(this);
    this.restore_albums = this.restore_albums.bind(this);
    this.request_allAlbumPhotos = this.request_allAlbumPhotos.bind(this);
    this.selectAlbumHandle = this.selectAlbumHandle.bind(this);
    this.hideAlbum = this.hideAlbum.bind(this);
    this.showOnlyAlbum = this.showOnlyAlbum.bind(this);
  }

  request_albums() {
    var component = this;
    GooglePhotos.getAlbums(null, albums => {
      component.props.parent.setState({ albums: component.props.parent.state.albums.concat(albums) });
    });
  }

  request_allAlbumPhotos() {
    const albums = this.props.parent.state.albums;
    var component = this;
    GooglePhotos.getAllAlbumDetail(albums, (album) => {
      let albums = component.props.parent.state.albums;
      const index = albums.findIndex(al => al.id === album.id);
      if (index > -1) {
        albums[index] = album;
      }
      component.props.parent.setState({ albums: albums });
    });
  }

  store_albums() {
    localStorage.setItem('albums', JSON.stringify(this.props.parent.state.albums));
  }

  restore_albums() {
    var albums = JSON.parse(localStorage.getItem('albums'));
    this.props.parent.setState({ albums: albums });
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
      <button onClick={this.request_albums}>request albums</button>
      <button onClick={this.request_allAlbumPhotos}>request album phptos</button>
      <button onClick={this.store_albums}>store albums</button>
      <button onClick={this.restore_albums}>restore albums</button>
      <button onClick={this.hideAlbum}>hide album</button>
      <button onClick={this.showOnlyAlbum}>show only album</button>
      <div>{this.props.parent.state.albums.map((item) => 
        <Album item={item} key={item.id} selectAlbumHandle={this.selectAlbumHandle}/>
        )}
      </div>
    </div>;
  }
}