import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import ChannelList from '../ChannelList/ChannelList';
import Feed from '../Feed/Feed';
import ApiClient from '../../ApiClient';


import './Home.css';

class Home extends Component {

	state = {
		loading: true,
		selectedChannel: { _id: 'all', name: 'All Feed' }
	}

	async componentDidMount() {
		await this.getUser();
	}

	async getUser() {

		this.setState({ loading: true });

		try {
			var response = await ApiClient.get('/users/loggedInUser', { authorized: true });
			this.setState({ user: response, loading: false });
			var getProfilePic = await ApiClient.get(`/users/${response._id}/profilePicture`, { authorized: true })
			.then(pic => {
		      this.setState({
		        profilePicture: pic,
		      });
		    });
		} catch (err) {
			console.log(err);
			this.props.history.push('/login');
		}
		
	}

	onClickChannel = (channel) => {
		this.setState({ selectedChannel: channel });
	}

	constructor(props) {
		super(props);
		// This binding is necessary to make `this` work in the callback
		this.toggleMobileMenu = this.toggleMobileMenu.bind(this);
	}

	toggleMobileMenu() {
		var elem = document.getElementsByClassName("ChannelList")[0];
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

	logout() {
		localStorage.removeItem('skybunkToken');
		this.props.history.push('/login');
	}

	render() {

		const {
			loading,
			channels,
			user,
			selectedChannel
		} = this.state;

		let content = loading ? (
			<div>
				Loading...
			</div>
		) : (
				<div className="Body">
					<div className="mobileMenuBtnRow">
						<button className="mobileMenuBtn" onClick={this.toggleMobileMenu}>Menu</button>
					</div>
					<div className="ChannelList hideMobile">
						<ChannelList
							channels={channels}
							user={user}
							onClickChannel={this.onClickChannel}
							selectedChannel={selectedChannel}
						/>
					</div>

					<div className="spaceForMenu hideMobile">
					</div>

					<div className="Feed">
						<Feed
							channel={selectedChannel}
							user={user}
						/>
					</div>
					<div className="HoverProfilePlaceholder" />
				</div>
			);

		return (
			<div className="Home">
				
				{content}
			</div>
		);
	}
}

export default withRouter(Home);
