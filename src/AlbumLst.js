/* eslint no-undef: "off"*/
import React from 'react';

// services
import GooglePhotos from './google.js';
import * as Store from './services/store.js';

import Album from './Album.js';

export default class AlbumLst extends React.Component {

  constructor() {
    super();
    this.state = {
      selectedAlbum: [],
      error: false,
      running: false,
      previousAlbums: []
    }
    this.request_albums = this.request_albums.bind(this);
    this.store_albums = this.store_albums.bind(this);
    this.restore_albums = this.restore_albums.bind(this);
    this.request_allAlbumPhotos = this.request_allAlbumPhotos.bind(this);
    this.selectAlbumHandle = this.selectAlbumHandle.bind(this);
    this.hideAlbum = this.hideAlbum.bind(this);
    this.showOnlyAlbum = this.showOnlyAlbum.bind(this);
  }

  componentDidMount() {
    this.restore_albums();
  }

  request_albums() {
    var component = this;
    this.props.setAlbums([]);
    GooglePhotos.getAlbums(null, albums => {
      component.props.setAlbums(this.props.albums.concat(albums));
    });
  }

  request_allAlbumPhotos() {
    const albums = this.props.albums;
    const previousAlbums = this.state.previousAlbums;
    var component = this;
    component.setState({error: false, running: true});
    GooglePhotos.getAllAlbumDetail(albums, (album) => {
      let albums = component.props.albums;
      const index = albums.findIndex(al => al.id === album.id);
      if (index > -1) {
        albums[index] = album;
      }
      component.props.setAlbums(albums);
    }, error => {
      component.setState({error: true});
    }, previousAlbums).finally(function() {
      component.setState({ running: false });
    });
  }

  store_albums() {
    localStorage.setItem('albums', JSON.stringify(this.props.albums));
  }

  restore_albums() {
    var albums = Store.getAlbums();
    if (albums == null) {
      albums= [];
    }
    this.props.setAlbums(albums);
    this.setState({previousAlbums: albums});
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
      <button className="btn btn-primary" onClick={this.request_albums}>request albums</button>
      <button className="btn btn-primary" id="request-all-album-photos" onClick={this.request_allAlbumPhotos}>request album phptos</button>
      <button className="btn btn-primary" onClick={this.store_albums}>store albums</button>
      <button className="btn btn-primary" onClick={this.restore_albums}>restore albums</button>
      <button className="btn btn-primary" onClick={this.hideAlbum}>hide album</button>
      <button className="btn btn-primary" onClick={this.showOnlyAlbum}>show only album</button>
      { this.state.error ? (<div className="rounded bg-danger m-1 p-1">Error</div>) : null }
      { this.state.running ? (<div id="running" className="rounded bg-warning m-1 p-1">Running</div>) : null }
      <div className="album-list">{this.props.albums.map((item) => 
        <Album item={item} key={item.id} selectAlbumHandle={this.selectAlbumHandle}/>
        )}
      </div>
    </div>;
  }
}