import React from 'react';

export default class Album extends React.Component {

    constructor(props) {
        super(props);
        this.handleSelect = this.handleSelect.bind(this);
    }

    handleSelect(event) {
        const target = event.target;
        const selected = target.checked;
        const albumId = this.props.item.id;
        this.props.selectAlbumHandle(albumId, selected);
    }

    render() {
        return <div id={this.props.item.id} key={this.props.item.id}>
            <input type="checkbox" onChange={this.handleSelect} />
            {this.props.item.title}
            ({this.props.item.photos !== undefined ? this.props.item.photos.length : 0}
            / {this.props.item.mediaItemsCount}
            )</div>
    }
}