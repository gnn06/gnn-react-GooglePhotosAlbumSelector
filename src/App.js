/* eslint no-undef: "off"*/
import React from 'react';
import logo from './logo.svg';
import './App.css';
import Album from './album.js';
import ImageList from './photoList.js';

var GoogleAuth; // Google Auth object.
var isAuthorized;
var currentApiRequest;

function User() {
  return <span>user</span>;
}

class App extends React.Component {

  constructor(props) {
    super(props);
    this.updateSigninStatus = this.updateSigninStatus.bind(this);
    gapi.load('client', this.start);
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

  signin() {
    console.log('sign in start');
    GoogleAuth.signIn();
    console.log('signin end');
  }

  signout() {
    console.log('sign out');
    GoogleAuth.signOut();
  }

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

  render () {
    return (
      <div className="App">
        <button onClick={this.signin}>sign in</button>
        <button onClick={this.signout}>sign out</button>
        <User />
        <Album />
        <ImageList />
      </div>
    );
  }
}

export default App;
