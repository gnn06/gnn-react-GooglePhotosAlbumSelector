/* eslint no-undef: "off"*/
import React from 'react';
import Image from './Image.js';
import GooglePhotos from './google.js';
import * as AlbumUtil from "./album-utils.js";
import InfiniteScroll from 'react-infinite-scroller';

export default class ImageList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tracks: [],
      nextHref: null,
      selected: new Set(),
      modalIsOpen: false
    };
    this.addAlbum           = this.addAlbum.bind(this);
    this.removeAlbum        = this.removeAlbum.bind(this);
    this.openModal          = this.openModal.bind(this);
    this.closeModal         = this.closeModal.bind(this);
    this.handleChooseAlbum  = this.handleChooseAlbum.bind(this);
  }

  loadItems(page) {
    if (gapi.client !== undefined) {
      this.props.requestPhotosHandle();
    };
  }

  addAlbum(photoId) {
    this.state.selected.add(photoId);
    this.setState({ selected: this.state.selected });
    ;
  }

  removeAlbum(photoId) {
    this.state.selected.delete(photoId);
    this.setState({ selected: this.state.selected });
    ;
  }

  openModal() {
    this.setState({modalIsOpen: true});
  }

  handleChooseAlbum(albumId) {
    console.log("album choosen  : " + albumId);
    const selectedArray = Array.from(this.state.selected);
    GooglePhotos.addPhotoToAlbum(selectedArray, albumId);
  }

  closeModal() {
    this.setState({modalIsOpen: false});
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

  getFilteredPhoto(photos, hideAlbum, dateFilter) {
    return AlbumUtil.filterDate(AlbumUtil.filterOneAlbum(photos, hideAlbum), dateFilter);
  }

  render() {
    const loader = <div className="loader">Loading ...</div>;
    return <div className="photo-panel ">
      <InfiniteScroll className="grille" pageStart={0} loadMore={this.loadItems.bind(this)}
        hasMore={this.props.hasMoreItems}
        loader={loader}>
        {this.getFilteredPhoto(this.props.photos, this.props.hideAlbum, this.props.dateFilter).map(item =>
          <Image baseUrl={item.baseUrl} productUrl={item.productUrl}
            id={item.id} key={item.id}
            albums={item.albums} allAlbums={this.props.albums}
            addAlbum={this.addAlbum} removeAlbum={this.removeAlbum} />)}
      </InfiniteScroll>
    </div>;
  }
}
