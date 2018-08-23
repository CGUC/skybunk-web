import React, { Component } from 'react';
import './Channel.css';

class Channel extends Component {
  render() {
    return (
  		<button className="ChannelItem">
        <p className="BellIcon">BELL</p>
        <h1 className="ChannelTitle">
          {this.props.children}
        </h1>
      </button>
    );
  }
}

export default Channel;
