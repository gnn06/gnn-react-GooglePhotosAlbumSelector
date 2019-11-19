/* eslint no-undef: "off"*/
import React from 'react';
import './App.css';
import moment from 'moment';

// services
import GooglePhotos from './google.js';

// utils
import * as Store from './services/store.js';
import * as AlbumUtil from "./album-utils.js";

import AlbumLst from './AlbumLst.js';
import ImageList from './ImageLst.js';
import DateFilter from './DateFilter.js';
import NotConnected from './NotConnected.js';

var GoogleAuth; // Google Auth object.

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      albums: [],
      photos: [],
      hideAlbums: [],
      showOnlyAlbums: [],
      dateFilter: {
        start: moment().startOf('month').toDate(),
        end: moment().endOf('month').toDate()
      },
      nextPageToken: undefined,
      hasMoreItems: true, // need to be true to made initial load even if gapi is not loaded
      previousAlbums: [],
      error: false,
      running: false
    };

    this.updateSigninStatus = this.updateSigninStatus.bind(this);
    this.start = this.start.bind(this);
    this.signInHandle = this.signInHandle.bind(this);
    this.signout = this.signout.bind(this);
    this.hideAlbumHandle = this.hideAlbumHandle.bind(this);
    this.showOnlyAlbumHandle = this.showOnlyAlbumHandle.bind(this);
    this.dateFilterHandle = this.dateFilterHandle.bind(this);
    this.setAlbums = this.setAlbums.bind(this);
    this.requestAlbumsDetailsHandle = this.requestAlbumsDetailsHandle.bind(this);
    this.requestPhotosHandle = this.requestPhotosHandle.bind(this);

    gapi.load('client', this.start);
  }

  componentDidMount() {
    this.restore_albums();
  }

  start() {
    console.log('start');
    let component = this;
    // 2. Initialize the JavaScript client library.
    gapi.client.init({
      'apiKey': 'AIzaSyDGs41Ht7xoF-IRKXwMBzhrKLEtCAj3kyA',
      // Your API key will be automatically added to the Discovery Document URLs.
      'discoveryDocs': ['https://photoslibrary.googleapis.com/$discovery/rest?version=v1'],
      // clientId and scope are optional if auth is not required.
      'clientId': '545424844434-muou9nmhps6i8c2j7bm2bqdpbp3u811e.apps.googleusercontent.com',
      'scope': 'https://www.googleapis.com/auth/photoslibrary.readonly',
    }).then(function () {
      // 3. Initialize and make the API request.
      GoogleAuth = gapi.auth2.getAuthInstance();
      GoogleAuth.isSignedIn.listen(component.updateSigninStatus);
      component.setSigninStatus();
    }, function (reason) {
      console.log('Error: ' + reason.result.error.message);
    });
  };

  signInHandle() {
    console.log('sign in start');
    GoogleAuth.signIn();
    console.log('signin end');
  }

  signout() {
    console.log('sign out');
    GoogleAuth.signOut();
    this.setState({email:""});
  }

  setSigninStatus() {
    var user = GoogleAuth.currentUser.get();
    var isAuthorized = user.hasGrantedScopes('https://www.googleapis.com/auth/photoslibrary.readonly');
    if (isAuthorized) {
      console.log('authorized');
      const profile = user.getBasicProfile();
      const email = profile.getEmail();
      this.setState({email: email});
      //$("#auth-status").html(email + " authorized");
    } else {
      console.log('unauthorized');
      //$("#auth-status").html("not authorized");
    }
  }

  updateSigninStatus(isSignedIn) {
    console.log('updateListener');
    if (isSignedIn) {
      this.setSigninStatus();
    }
  }

  hideAlbumHandle(albums) {
    this.setState({hideAlbums: albums})
  }

  showOnlyAlbumHandle(albums) {
    this.setState({showOnlyAlbums: albums})
  }

  dateFilterHandle(dateFilter) {
    this.setState({dateFilter: dateFilter, nextPageToken: undefined, photos: [], hasMoreItems: true});
  }

  getPhotosHandle(photos, nextPageToken) {
    this.setState({photos: photos, nextPageToken: nextPageToken, hasMoreItems: nextPageToken !== undefined});
  }

  setAlbums(albums) {
    this.setState({albums: albums});
  }

  store_albums() {
    Store.setAlbums(this.state.albums);
  }

  restore_albums() {
    var albums = Store.getAlbums();
    if (albums == null) {
      albums= [];
    }
    this.setState({albums: albums, previousAlbums: albums});
  }

  requestAlbumsDetailsHandle() {
    var p;
    if (this.state.error) {
      p = this.requestAlbumsPhotosHandle();
    } else {
      p = this.requestAlbumsHandle()
      .then(() => {
        return this.requestAlbumsPhotosHandle();
      });
    }
    p.then(() => {
      if (!this.state.error) {
        this.store_albums();
      }
    });
    return p;
  }

  requestAlbumsHandle() {
    var component = this;
    this.setState({albums: []});
    return GooglePhotos.getAlbums(null, albums => {
        component.setState({albums: this.state.albums.concat(albums)});
      });
  }

  requestAlbumsPhotosHandle() {
    const albums = this.state.albums;
    const previousAlbums = this.state.previousAlbums;
    var component = this;
    this.setState({error: false, running: true});
    return GooglePhotos.getAllAlbumDetail(albums, (album) => {
      let albums = component.state.albums;
      const index = albums.findIndex(al => al.id === album.id);
      if (index > -1) {
        albums[index] = album;
      }
      component.setState({albums: albums});
    }, error => {
      component.setState({error: true});
    }, previousAlbums).finally(function() {
      component.setState({ running: false });
    });
  }

  requestPhotosHandle() {
    var component = this;
    const nextPageToken = this.state.nextPageToken;

    return GooglePhotos.getPhotos(this.state.dateFilter, nextPageToken)
    .then(function(response) {
      const statePhotoList = component.state.photos;
      var newPhotoList = statePhotoList;
      var newNextPageToken = undefined;
      if (response.result.mediaItems) {
        newPhotoList = statePhotoList.concat(response.result.mediaItems.map(
          photo => {
            photo.albums = AlbumUtil.getAlbumsPhoto(photo.id, component.state.albums);
            return photo;
          }
        ));
        newNextPageToken = response.result.nextPageToken;
      }
      component.getPhotosHandle(newPhotoList, newNextPageToken);
    }, function(error) {
      console.error(error);
    });
  }

  render () {
    return this.state.email ?
      <div className="App container-fluid" >
        <div className="row">
          <div className="album-panel col-3">
            <div>{ this.state.email }</div>
            <button className="btn btn-primary" onClick={this.signout}>sign out</button>
            <DateFilter dateFilter={this.state.dateFilter} dateFilterHandle={this.dateFilterHandle}/>
            { this.state.error ? (<div className="rounded bg-danger m-1 p-1">Error</div>) : null }
            { this.state.running ? (<div id="running" className="rounded bg-warning m-1 p-1">Running</div>) : null }
            <AlbumLst
              albums={this.state.albums}
              previousAlbums={this.state.previousAlbums}
              setAlbums={this.setAlbums}
              hideAlbumHandle={this.hideAlbumHandle}
              showOnlyAlbumHandle={this.showOnlyAlbumHandle}
              requestAlbumsDetailsHandle={this.requestAlbumsDetailsHandle}/>
          </div>
          <div className="col-9">
            <ImageList 
              albums={this.state.albums}
              photos={this.state.photos}
              nextPageToken={this.state.nextPageToken}
              hasMoreItems={this.state.hasMoreItems}
              hideAlbum={this.state.hideAlbums}
              dateFilter={this.state.dateFilter}
              requestPhotosHandle={this.requestPhotosHandle}
              />
          </div>
        </div>
      </div>
      : <NotConnected signInHandle={this.signInHandle}/>;
  }
}

export default App;
