import React from 'react';

export default class Album extends React.Component {

    render() {
        return <span key={this.props.item.id}>
            {this.props.item.title}
            ({this.props.item.photos !== undefined ? this.props.item.photos.length : 0}
            / {this.props.item.mediaItemsCount}
            )</span>
    }
}