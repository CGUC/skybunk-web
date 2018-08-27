import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import Header from '../Shared/Header/Header';
import ChannelList from '../ChannelList/ChannelList';
import Feed from '../Feed/Feed';
import api from '../../ApiClient';
import './Home.css';

class Home extends Component {

	state = {
		loading: true,
		selectedChannelId: 'all',
		token: localStorage.getItem('skybunkToken')
	}

	async componentDidMount() {
		await this.getUser();
	}

	async getUser() {
		const token = this.state.token;

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

	render() {

		const {
			loading,
			channels,
			user,
			selectedChannelId,
			token
		} = this.state;

		let content = loading ? (
			<div>
				Loading...
			</div>
		) : (
				<div className="Body">
					<div className="ChannelList">
						<ChannelList
							channels={channels}
							user={user}
							token={token}
							onClickChannel={this.onClickChannel}
						/>
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
