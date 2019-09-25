/* eslint no-undef: "off"*/
import React from 'react';
import GooglePhotos from './google.js';
import Album from './Album.js';

const service = new GooglePhotos();

export default class AlbumLst extends React.Component {

  constructor() {
    super();
    this.state = {
      albumToHide: []
    }
    this.request_albums = this.request_albums.bind(this);
    this.store_albums = this.store_albums.bind(this);
    this.restore_albums = this.restore_albums.bind(this);
    this.request_allAlbumPhotos = this.request_allAlbumPhotos.bind(this);
    this.hideAlbumHandle = this.hideAlbumHandle.bind(this);
  }

  request_albums() {
    var component = this;
    service.getAlbums(null, albums => {
      component.props.parent.setState({ albums: component.props.parent.state.albums.concat(albums) });
    });
  }

  request_albumPhotos(album, nextPageToken) {
    let component = this;
    // if album is already loaded, then abort
    if (album.photos !== undefined && 
        album.photos.length === album.mediaItemsCount)
    {
      return;
    }
    // reset photos array when starting to load photos
    // usefull if an exception occured préviously
    if (nextPageToken === undefined) {
      let albums = this.props.parent.state.albums;
      album.photos = [];
      this.props.parent.setState({ albums : albums });
    }
    let params = { albumId: album.id };
    if (nextPageToken !== undefined) {
      params.pageToken = nextPageToken;
    }
    let request = gapi.client.request({
      'method': 'POST',
      'path': 'https://photoslibrary.googleapis.com/v1/mediaItems:search',
      params: params
    });
    request.execute(function (response) {
      
      let albums = component.props.parent.state.albums;
      if (Array.isArray(response.mediaItems)) {
          let photos = response.mediaItems.map(photo => { return photo.id ; });
          if (album.photos) {        
            album.photos = album.photos.concat(photos);
          } else {
            album.photos = photos;
          }
        }
      component.props.parent.setState({ albums: albums });
      if (response.nextPageToken) {
        component.request_albumPhotos(album, response.nextPageToken);
      }
    });
  }

  request_allAlbumPhotos() {
    const albums = this.props.parent.state.albums;
    albums.forEach(album => {
      this.request_albumPhotos(album);
    });

  }

  store_albums() {
    localStorage.setItem('albums', JSON.stringify(this.props.parent.state.albums));
  }

  restore_albums() {
    var albums = JSON.parse(localStorage.getItem('albums'));
    this.props.parent.setState({ albums: albums });
  }

  hideAlbumHandle(albumId, selected) {
    this.props.hideAlbumHandle(albumId, selected);
  }

  render() {
    return <div>
      <button onClick={this.request_albums}>request albums</button>
      <button onClick={this.request_allAlbumPhotos}>request album phptos</button>
      <button onClick={this.store_albums}>store albums</button>
      <button onClick={this.restore_albums}>restore albums</button>
      <button onClick={this.hideAlbum}>hide album</button>
      <div>{this.props.parent.state.albums.map((item) => 
        <Album item={item} hideAlbumHandle={this.hideAlbumHandle}/>
        )}
      </div>
    </div>;
  }
}