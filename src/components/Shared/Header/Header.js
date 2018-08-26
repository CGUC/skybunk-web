import React, { Component } from 'react';
import './Header.css';

class Header extends Component {
  render() {
    return (
    	<div className="Header">
        <div className="HeaderLeft">
      	  <h1>Skybunk</h1>
        </div>
      	<div className="HeaderRight">
      		{this.props.children}
      	</div>
      </div>
    );
  }
}

export default Header;
