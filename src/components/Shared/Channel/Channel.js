import React, { Component } from 'react';
import './Channel.css';

class Channel extends Component {
  render() {
    return (
      <tr>
        <td className="ChannelItem">
          <img src={require('../../../assets/bell-OFF.png')} className="BellIcon"/>
          <img src={require('../../../assets/Bell-ON.png')} className="BellIcon hidden"/>
          <button className="ChannelButton">
            <h2 className="ChannelTitle">
              {this.props.children}
            </h2>
            <img src={require('../../../assets/arrowright.png')} className="ArrowIcon" />
          </button>
        </td>
      </tr>
    );
  }
}

export default Channel;
