import React from 'react';

import * as AlbumUtil from './album-utils.js';

export default class Image extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        isSelected: false
      };
  
      this.handleSelect = this.handleSelect.bind(this);
    }
  
    handleSelect(event) {
      const target = event.target;
      const selected = target.checked ;
      this.setState({ isSelected: selected });
      if (selected) {
        this.props.addAlbum(this.props.id);
      } else {
        this.props.removeAlbum(this.props.id);
      }   
    }
  
    render() {
      return <div className="image-with-flag">
                  <a href={this.props.productUrl}><img src={this.props.baseUrl} alt=""/></a>
                  <div className="flag" >
                    { this.props.albums 
                      && this.props.albums
                        .map((item, index) => 
                          <div className={AlbumUtil.getAlbumFlagClass(item.id, this.props.allAlbums)} 
                            key={index}>{item.title}</div>)}    
                  </div>
                </div>; 
    }
  }