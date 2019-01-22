import React, { Component } from 'react';
import ApiClient from '../../ApiClient';
import './ChannelList.css';

const DEFAULT_CHANNELS = [
  { name: 'All Feed', _id: 'all' },
  { name: 'My Posts', _id: 'myPosts' },
  { name: 'My Subscriptions', _id: 'subs' },
];

class Channel extends Component {

  constructor(props) {
    super(props);
    this.state = {
      subscribedChannels: props.user.subscribedChannels,
      loading: true,
      channels: []
    }
  }

  async componentWillMount() {
    await this.loadData();
  }

  loadData = async () => {

    this.setState({ loading: true });

    ApiClient.get('/channels', {authorized: true})
      .then(response => {
        this.setState({ channels: response, loading: false });
      })
      .catch(err => console.error(err));
  }

  onClickChannel = (channel) => {
    if (this.props.onClickChannel) this.props.onClickChannel(channel);
  }

  updateSubscription = (id, index) => {
    if (['all', 'subs', 'myPosts'].includes(id)) return;

    if (index === -1) {
      this.setState({
        subscribedChannels: [...this.state.subscribedChannels, id]
      }, this.updateUserRequest);
    }
    else {
      let subs = this.state.subscribedChannels;
      subs.splice(index, 1);
      this.setState({
        subscribedChannels: subs,
      }, this.updateUserRequest);
    }
  }

  updateUserRequest = () => {
    let {
      user
    } = this.props;

    user.subscribedChannels = this.state.subscribedChannels;
    ApiClient.put(
      `/users/${user._id}`,
      user,
      { authorized: true}
    ).catch(err => console.error(err));
  }

  getChannelCardJSX(channels) {
    const { selectedChannel } = this.props;
    const subs = this.state.subscribedChannels;

    let sortedChannels = channels.sort((c1, c2) => {
      if (c1._id === 'all') return -1;
      if (c2._id === 'all') return 1;
      if (c1._id === 'myPosts') return -1;
      if (c2._id === 'myPosts') return 1;
      if (c1._id === 'subs') return -1;
      if (c2._id === 'subs') return 1;

      if (subs.includes(c1._id) && !subs.includes(c2._id)) return -1;
      if (!subs.includes(c1._id) && subs.includes(c2._id)) return 1;

      if (c1.name < c2.name) return -1;
      return 1;
    });

    return (
      sortedChannels.map((channel, key) => {

        var isSelected = channel._id === selectedChannel._id;
        var channelClassnames = "ChannelItem";
        if (isSelected) {
          channelClassnames += " ActiveChannel";
        }

        let icon = require('../../assets/bell-OFF.png');
        let hide = false;

        const subIndex = subs.indexOf(channel._id);
        if (channel._id === 'subs') {
          icon = require('../../assets/my-subs-bell-Icon.png');
        }
        else if (['all', 'myPosts'].includes(channel._id)) {
          //TODO: Give myPosts an icon
          hide = true;
        }
        else if (subIndex !== -1) {
          icon = require('../../assets/Bell-ON.png');
        }

        return (
          <div className={channelClassnames}>
            <button className="IconButton" onClick={() => { this.updateSubscription(channel._id, subIndex) }}>
              {hide ? <div style={{ width: '50px' }} /> : <img src={icon} className="BellIcon" />}
            </button>
            <div className="ChannelDisplay" onClick={() => { this.onClickChannel(channel) }}>
              {/* <button className="ChannelButton" onClick={() => { this.onClickChannel(channel) }}> */}
                <h3 className="ChannelTitle">
                  {channel.name}
                </h3>
                <div className="ArrowContainer">
                  <img src={require('../../assets/arrowright.png')} className="ArrowIcon" />
                </div>
              {/* </button> */}
            </div>
          </div>
        )
      })
    )
  }

  render() {
    let { channels } = this.state;

    let channelList = DEFAULT_CHANNELS.concat(channels);

    let channelCards = this.getChannelCardJSX(channelList);

    return (
      <div className="ChannelListContainer">
        {channelCards}
      </div>
    );
  }
}

export default Channel;
