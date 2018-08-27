import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import Login from './components/Login/Login';
import Home from './components/Home/Home';
import './App.css';

class App extends Component {
  
	getRedirect() {
		if (localStorage.getItem('skybunkToken')) {
			return <Redirect to='/home' />
		}
		else {
			return <Redirect to='/login' />
		}
	}

	render() {
		return (
			<div>
				{this.getRedirect()}

				<Switch>
					<Route path="/login" component={Login}/>
					<Route path="/home" component={Home}/>
				</Switch>
			</div>
		);
	}
}

export default App;
