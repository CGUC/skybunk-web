import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import Header from '../Shared/Header/Header';
import ChannelList from '../ChannelList/ChannelList';
import Feed from '../Feed/Feed';
import api from '../../ApiClient';
import './Home.css';

class Home extends Component {
<<<<<<< HEAD

	state = {
		loading: true,
		selectedChannelId: 'all'
	}

	async componentDidMount() {
		await this.getUser();
	}

	async getUser() {
		var token = localStorage.getItem('skybunkToken');

		this.setState({ loading: true });

		try {
			var response = await api.get('/users/loggedInUser', { 'Authorization': 'Bearer ' + token });
			this.setState({ user: response, loading: false });
		} catch (err) {
			console.log(err);
			this.props.history.push('/login');
		}
	}

	onClickChannel = (id) => {
		this.setState({ selectedChannelId: id });
	}

=======
	constructor(props) {
		super(props);
		// This binding is necessary to make `this` work in the callback
		this.toggleMobileMenu = this.toggleMobileMenu.bind(this);
	  }

	  toggleMobileMenu() {
		  var elem = document.getElementsByClassName("ChannelListTable")[0];
		  if (elem.classList) { 
			elem.classList.toggle("hideMobile");
		} else {
			// For IE9
			var classes = elem.className.split(" ");
			var i = classes.indexOf("hideMobile");
		
			if (i >= 0) 
				classes.splice(i, 1);
			else 
				classes.push("hideMobile");
				elem.className = classes.join(" ");
		  return;
	  };
	}
	
>>>>>>> Added mobile styling to home page and channels
	render() {

		const {
			loading,
			channels,
			user,
			selectedChannelId
		} = this.state;

		let content = loading ? (
			<div>
				Loading...
			</div>
		) : (
				<div className="Body">
					<div className="ChannelList">
<<<<<<< HEAD
						<ChannelList
							channels={channels}
							user={user}
							onClickChannel={this.onClickChannel}
						/>
=======
						<div>
							<button className="mobileMenuBtn" onClick={this.toggleMobileMenu}>Menu</button>
						</div>
						<table className="ChannelListTable hideMobile">
							<tbody>
								<Channel>
									Dummy Channel 1
								</Channel>
								<Channel>
									Dummy Channel 2
								</Channel>
								<Channel>
									Dummy Channel 3
								</Channel>
								<Channel>
									Dummy Channel 4
								</Channel>
								<Channel>
									Dummy Channel 5
								</Channel>
							</tbody>
						</table>
>>>>>>> Added mobile styling to home page and channels
					</div>

					<div className="Feed">
						<Feed
							channelId={selectedChannelId}
							user={user}
						/>
					</div>
				</div>
			);

		return (
			<div className="Home">
				<Header />
				{content}
			</div>
		);
	}
}

export default withRouter(Home);
