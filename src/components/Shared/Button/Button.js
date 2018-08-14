import React, { Component } from 'react';
import classNames from 'classnames';
import './Button.css';

class Button extends Component {
  render() {
    return (
  		<button className={classNames('Button', {ButtonLarge: this.props.large})}>
        {this.props.children}
      </button>
    );
  }
}

export default Button;
