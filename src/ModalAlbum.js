import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root')

export default class Album extends React.Component {

  constructor(props) {
    super(props);
    this.handleChoose = this.handleChoose.bind(this);
  }

  handleChoose(event) {
    const id = event.target.getAttribute('albumId');
    this.props.handleChoose(id);
    this.props.close();
  }

  render() {
    return <Modal isOpen={this.props.isOpen}>
      <h2 ref={subtitle => this.subtitle = subtitle}>Choose an album</h2>
      <button onClick={this.props.close}>close</button>
        {this.props.albums.map(album => 
          <div albumId={album.id} onClick={this.handleChoose}>{album.title}</div>)}
      
    </Modal>
  }
}