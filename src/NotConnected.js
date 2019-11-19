import React from 'react';
import './not-connected.css';


export default class NotConnected extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div className="text-center signin">
                <button className="btn btn-lg btn-primary btn-block" onClick={this.props.signInHandle}>Login with Google</button>
            </div>;
    }
};