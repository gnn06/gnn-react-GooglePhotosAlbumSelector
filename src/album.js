/* eslint no-undef: "off"*/
import React from 'react';

export default class Album extends React.Component {

    constructor() {
        super();
        this.state = {
            albums: []
        };
        this.request_albums = this.request_albums.bind(this);
        this.store_albums = this.store_albums.bind(this);
        this.restore_albums = this.restore_albums.bind(this);
        this.request_allAlbumPhotos = this.request_allAlbumPhotos.bind(this);
    }

    request_albums() {
        var request = gapi.client.request({
            'method': 'GET',
            'path': 'https://photoslibrary.googleapis.com/v1/albums'
        });
        var component = this;
        // Execute the API request.
        request.execute(function (response) {
            console.log(response);
            component.setState({ albums: response.albums });
        });
    }

    request_albumPhotos(album, nextPageToken) {
        let component = this;
        let params = { albumId: album.id };
        if (nextPageToken != undefined) {
            params.pageToken = nextPageToken;
        }
        let request = gapi.client.request({
            'method': 'POST',
            'path': 'https://photoslibrary.googleapis.com/v1/mediaItems:search',
            params: params
        });
        request.execute(function (response) {
            let albums = component.state.albums;
            if (album.photos) {
                album.photos = album.photos.concat(response.mediaItems);
            } else {
                album.photos = response.mediaItems;
            }
            component.setState({ albums: albums });
            if (response.nextPageToken) {
                component.request_albumPhotos(album, response.nextPageToken);
            }
        });
    }

    request_allAlbumPhotos() {
        var component = this;
        const albums = this.state.albums;
        albums.forEach(album => {
            this.request_albumPhotos(album);
        });

    }

    store_albums() {
        localStorage.setItem('albums', JSON.stringify(this.state.albums));
    }

    restore_albums() {
        var albums = JSON.parse(localStorage.getItem('albums'));
        this.setState({ albums: albums });
    }

    render() {
        return <div>
            <button onClick={this.request_albums}>request albums</button>
            <button onClick={this.request_allAlbumPhotos}>request album phptos</button>
            <button onClick={this.store_albums}>store albums</button>
            <button onClick={this.restore_albums}>restore albums</button>
            <div>{this.state.albums.map((item) => <span>{item.title} ({item.photos != undefined ? item.photos.length : 0} / {item.mediaItemsCount})</span>)}</div>
        </div>;
    }
}