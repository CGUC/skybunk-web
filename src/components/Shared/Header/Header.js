import React, { Component } from 'react';
import SkybunkLogo from '../../../assets/skybunk-logo-no-words.png'
import './Header.css';

class Header extends Component {
  render() {
    return (
    	<div className="Header">
        <div className="HeaderLeft">
          <img className="HeaderLogo" src={SkybunkLogo}/>
      	  <div className="HeaderTitle">Skybunk</div>
        </div>
      	<div className="HeaderRight">
      		{this.props.children}
      	</div>
      </div>
    );
  }
}

export default Header;
