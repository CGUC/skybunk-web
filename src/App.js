import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import Login from './components/Login/Login';
import Home from './components/Home/Home';
import Header from './components/Shared/Header/Header';
import EditAccount from './components/EditAccount/EditAccount'
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
				<Header/>
				<Switch>
					<Route path="/login" component={Login}/>
					<Route path="/home" component={Home}/>
					<Route path="/users/:id/edit" component={EditAccount}/>
				</Switch>
			</div>
		);
	}
}



export default App;