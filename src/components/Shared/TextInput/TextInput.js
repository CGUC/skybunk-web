import React, { Component } from 'react';
import classNames from 'classnames';
import './TextInput.css';

class TextInput extends Component {
  render() {
    const {
      type,
      large,
      name,
      value,
      placeholder,
      size,
      onChange
    } = this.props;
    return (
  		<input 
            type={type || "text"}
            name={name}
            value={value}
            placeholder={placeholder}
            size={size}
            className={classNames('TextInput', {TextInputLarge: large})}
            onChange={onChange}
        />
    );
  }
}

export default TextInput;
