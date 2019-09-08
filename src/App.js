/* eslint no-undef: "off"*/
import React from 'react';
import logo from './logo.svg';
import './App.css';
//import { photos } from './photos.js';
//import { albums } from './albums.js';

var GoogleAuth; // Google Auth object.
var isAuthorized;
var currentApiRequest;

function photoInPhotos(photoId, photos) {
  if (photos != null) {
    return photos.some(item => item.id == photoId);
  } else
    return false;
}

function findAlbums(photoId) {
  //return albums.filter(item => photoInPhotos(photoId, item.photos));
}

function Image(props) {
  console.log(props.item);
  return <div class="image-with-flag"><img src={props.item.baseUrl} /></div>;
}

class ImageList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: []
    };
    this.request_photos = this.request_photos.bind(this);
    this.updateSigninStatus = this.updateSigninStatus.bind(this);
    gapi.load('client', this.start);
  }

  signin() {
    console.log('sign in start');
    GoogleAuth.signIn();
    console.log('signin end');
  }

  signout() {
    console.log('sign out');
    GoogleAuth.signOut();
  }

  start() {
    console.log('start');
    var component = this;
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
      GoogleAuth.isSignedIn.listen(this.updateSigninStatus);
      component.setSigninStatus();
    }, function (reason) {
      console.log('Error: ' + reason.result.error.message);
    });
  };

  request_photos() {
    console.log('rquest photos');
    var component = this;
    var request = gapi.client.request({
      'method': 'POST',
      'path': 'https://photoslibrary.googleapis.com/v1/mediaItems:search',
      'params': { "albumId": "ADoMfeTjMuoeBlhVO6malM99rD746uYMCZ71zYLVwmkZUP3hvlPod7jk0DyrzoPFtnI70-5JPLT4" }
    });
    // Execute the API request.
    request.execute(function (response) {
      console.log(response);
      component.setState({
        photos: [{ baseUrl: response.mediaItems[0].baseUrl, albums: ["goi"] },
        { baseUrl: response.mediaItems[1].baseUrl, albums: ["goi"] }]
      });
    });
  }

  updateSigninStatus(isSignedIn) {
    console.log('updateListener');
    if (isSignedIn) {
      isAuthorized = true;
      if (currentApiRequest) {
        sendAuthorizedApiRequest(currentApiRequest);
      }
    } else {
      isAuthorized = false;
    }
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

  setSigninStatus() {
    var user = GoogleAuth.currentUser.get();
    console.log(user);
    var isAuthorized = user.hasGrantedScopes('https://www.googleapis.com/auth/photoslibrary.readonly');
    if (isAuthorized) {
      console.log('authorized');
      const profile = user.getBasicProfile();
      const email = profile.getEmail();
      //$("#auth-status").html(email + " authorized");
    } else {
      console.log('unauthorized');
      //$("#auth-status").html("not authorized");
    }
  }

  render() {
    //console.log(photos.slice(0, 2));
    //console.log(albums);
    //console.log(findAlbums(photos[0].id));
    //return <div class="grille">{photos.slice(0,2).map((item) => <Image item={item}/>)}</div>;
    return <div>
      <button onClick={this.signin}>sign in</button>
      <button onClick={this.signout}>sign out</button>
      <User/>
      <Album/>
      <button onClick={this.request_photos}>request photo</button>
      <div class="grille">{this.state.photos.slice(0, 5).map((item) => <Image item={item} />)}</div>
    </div>;
  }
}

class Album extends React.Component {

  constructor () {
    super();
    this.state = {
      albums : []
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
      component.setState({ albums: response.albums});
    });
  }

  request_albumPhotos(album, nextPageToken) {
    let component = this;
    let params = { albumId : album.id };
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
      component.setState({albums : albums});
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
    this.setState({albums: albums});
  }
  
  render () {
    return <div>
      <button onClick={this.request_albums}>request albums</button>
      <button onClick={this.request_allAlbumPhotos}>request album phptos</button>
      <button onClick={this.store_albums}>store albums</button>
      <button onClick={this.restore_albums}>restore albums</button>
      <div>{this.state.albums.map((item) => <span>{item.title} ({item.photos != undefined ? item.photos.length : 0} / {item.mediaItemsCount})</span>)}</div>
      </div>;
  }
}

function User() {
  return <span>user</span>;
}

function App() {
  return (
    <div className="App">
      <ImageList />
    </div>
  );
}

export default App;
