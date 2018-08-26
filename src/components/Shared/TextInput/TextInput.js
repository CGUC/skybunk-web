import React, { Component } from 'react';
import classNames from 'classnames';
import './TextInput.css';

class TextInput extends Component {
  render() {
    return (
  		<input 
            type="text"
            name={this.props.name}
            value={this.props.value}
            placeholder={this.props.placeholder}
            size={this.props.size}
            className={classNames('TextInput', {TextInputLarge: this.props.large})}
            onChange={this.props.onChange}
        />
    );
  }
}

export default TextInput;
