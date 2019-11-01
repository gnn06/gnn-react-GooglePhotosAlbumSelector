/* eslint no-undef: "off"*/
import React from 'react';
import './App.css';
import AlbumLst from './AlbumLst.js';
import ImageList from './ImageLst.js';
import DateFilter from './DateFilter.js';
import moment from 'moment';

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
        end: new Date()
      },
      nextPageToken: undefined,
      hasMoreItems: false
    };

    this.updateSigninStatus = this.updateSigninStatus.bind(this);
    this.start = this.start.bind(this);
    this.signout = this.signout.bind(this);
    this.hideAlbumHandle = this.hideAlbumHandle.bind(this);
    this.showOnlyAlbumHandle = this.showOnlyAlbumHandle.bind(this);
    this.dateFilterHandle = this.dateFilterHandle.bind(this);
    this.getPhotosHandle = this.getPhotosHandle.bind(this);

    gapi.load('client', this.start);
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

  signin() {
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
    var isAuthorized = user.hasGrantedScopes('https://www.googleapis.com/auth/photoslibrary');
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
    this.setState({photos: photos, nextPageToken: nextPageToken, hasMoreItems: nextPageToken != undefined});
  }

  render () {
    return (
      <div className="App">
        { this.state.email }
        <div className="album-panel">
          <button onClick={this.signin}>sign in</button>
          <button onClick={this.signout}>sign out</button>
          <DateFilter dateFilter={this.state.dateFilter} dateFilterHandle={this.dateFilterHandle}/>
          <AlbumLst parent={this} 
            hideAlbumHandle={this.hideAlbumHandle}
            showOnlyAlbumHandle={this.showOnlyAlbumHandle}/>
        </div>
        <ImageList albums={this.state.albums} photos={this.state.photos}
          hideAlbum={this.state.hideAlbums}
          dateFilter={this.state.dateFilter}
          nextPageToken={this.state.nextPageToken}
          getPhotosHandler={this.getPhotosHandle}
          hasMoreItems={this.state.hasMoreItems}/>
      </div>
    );
  }
}

export default App;
