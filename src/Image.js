import React from 'react';

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
                    { this.props.albums.map((item, index) => <div className="flag" key={index}>{item.title}</div>)}    
                  </div>
                  <input type="checkbox" checked={this.state.isSelected} onChange={this.handleSelect}/>
                </div>; 
    }
  }