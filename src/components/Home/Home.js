import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import Header from '../Shared/Header/Header';
import ChannelList from '../ChannelList/ChannelList';
import Feed from '../Feed/Feed';
import ApiClient from '../../ApiClient';

import settingsIcon from '../../assets/settings-icon.png'
import channelIcon from '../../assets/Channel-icon-nav.png'
import notifIcon from '../../assets/header-bell-notification.png'


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
			console.log(response);
			var getProfilePic = await ApiClient.get(`/users/${response._id}/profilePicture`, { authorized: true })
			.then(pic => {
		      this.setState({
		        profilePicture: pic,
		      });
		    });
		    console.log(getProfilePic);
		} catch (err) {
			console.log(err);
			this.props.history.push('/login');
		}
		
	}

	componentDidUpdate(prevProps, prevState){
		if(prevState.profilePicture !== this.state.profilePicture){
			console.log("hi");
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

	async account() {
		const currentUser = await ApiClient.get(
		    '/users/loggedInUser',
		    { authorized: true }
		);
		if (currentUser._id)
			this.props.history.push(`/users/${currentUser._id}/edit`);
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
				</div>
			);

		return (
			<div className="Home">
				<Header>
					<div className="HeaderButton" onClick={this.account.bind(this)}>
			        <img className="HeaderChannel" src={channelIcon}/>
			        <div>Channels</div>
			      </div>
			      <div className="HeaderButton" onClick={this.account.bind(this)}>
			        <img className="HeaderNotif" src={notifIcon}/>
			        <div>Notifications</div>
			      </div>
					<div className="HeaderButton" onClick={this.account.bind(this)}>
				        <img 
				        	className="HeaderProfile" 
				        	src={`data:image/png;base64,${this.state.profilePicture}`}
				        />
				      </div>
					<div className="HeaderButton" onClick={this.account.bind(this)}>
				        <img className="HeaderSettings" src={settingsIcon}/>
				      </div>
					{/*
					<p className="logout" onClick={this.logout.bind(this)}>Logout</p>
					<HeaderButton
						onClick={this.account.bind(this)}
						hasImg={true}
						Img={settingsIcon}
						hasText={true}
						text="butt"
					/>
					
				*/}
				</Header>
				{content}
			</div>
		);
	}
}

export default withRouter(Home);
