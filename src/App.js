import React, { Component } from 'react';
import { Route, Redirect, Switch} from 'react-router-dom';
import { withRouter } from "react-router";
import Login from './components/Login/Login';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import Home from './components/Home/Home';
import Header from './components/Shared/Header/Header';
import EditAccount from './components/EditAccount/EditAccount'
import ResetPassword from './components/ResetPassword/ResetPassword'
import './App.css';

class App extends Component {
  
	getRedirect() {
		if(this.props.location.pathname == '/forgot' || this.props.location.pathname.includes('users/reset')){
			//accept password reset links
		}else if (localStorage.getItem('skybunkToken')) {
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
					<Route path="/forgot" component={ForgotPassword}/>
					<Route path="/home" component={Home}/>
					<Route path="/users/:id/edit" component={EditAccount}/>
					<Route path="/users/reset/:id/:token" component={ResetPassword}/>
				</Switch>
			</div>
		);
	}
}

export default withRouter(App);