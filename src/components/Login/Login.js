import React, { Component } from 'react';
import TextInput from '../Shared/TextInput/TextInput';
import Button from '../Shared/Button/Button';
import Header from '../Shared/Header/Header';
import './Login.css';

class Login extends Component {
  render() {
    return (
      <div className="Login">
        <Header>
        		<p className="LoginTitle">Login</p>
	        	<TextInput name="username" placeholder="Username"/>
	        	<TextInput name="passowrd" placeholder="Password"/>
	        	<Button>
        			Login
        		</Button>
        </Header>
        <div className="Main">
        	<div className="Card">
        		<h2>Register</h2>
        		<div>
        		<TextInput large name="firstName" placeholder="First Name" size={15}/>
        		<TextInput large name="lastName" placeholder="Last Name" size={15}/>
        		</div>
        		<TextInput large name="username" placeholder="Username" size={33}/>
        		<TextInput large name="passowrd" placeholder="Password" size={33}/>
        		<TextInput large name="passowrd" placeholder="Golden Ticket" size={33}/>
        		<Button large>
        			Register
        		</Button>
        	</div>
        </div>
      </div>
    );
  }
}

export default Login;
