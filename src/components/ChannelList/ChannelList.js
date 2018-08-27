import React, { Component } from 'react';
import api from '../../ApiClient';
import './ChannelList.css';

const DEFAULT_CHANNELS = [
  { name: 'All Feed', id: 'all' },
  { name: 'My Posts', id: 'myPosts' },
  { name: 'My Subscriptions', id: 'subs' },
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

    api.get('/channels')
      .then(response => {
        this.setState({ channels: response, loading: false });
      })
      .catch(err => console.error(err));
  }

  onClickChannel = (id) => {
    if (this.props.onClickChannel) this.props.onClickChannel(id);
  }

  getChannelCardJSX(channels) {
    const subs = this.state.subscribedChannels;
    let sortedChannels = channels.sort((c1, c2) => {
      if (c1.id === 'all') return -1;
      if (c2.id === 'all') return 1;
      if (c1.id === 'myPosts') return -1;
      if (c2.id === 'myPosts') return 1;
      if (c1.id === 'subs') return -1;
      if (c2.id === 'subs') return 1;

      if (subs.includes(c1.id) && !subs.includes(c2.id)) return -1;
      if (!subs.includes(c1.id) && subs.includes(c2.id)) return 1;

      if (c1.name < c2.name) return -1;
      return 1;
    });

    return (
      sortedChannels.map((channel, key) => {

        let icon = require('../../assets/bell-OFF.png');
        let hide = false;
 
        const subIndex = subs.indexOf(channel.id);
        if (channel.id === 'subs') {
          //icon = require('../../assets/my-subs-bell-Icon.png');
          hide = true;
        }
        else if (['all', 'myPosts'].includes(channel.id)) {
          //TODO: Give myPosts an icon
          hide = true;
        }
        else if (subIndex !== -1) {
          icon = require('../../assets/Bell-ON.png');
        }

        return (
          <tr>
            <td className="ChannelItem">
              <img src={icon} className="BellIcon" hidden={hide}/>
              <button className="ChannelButton" onClick={() => { this.onClickChannel(channel.id) }}>
                <h3 className="ChannelTitle">
                  {channel.name}
                </h3>
                <img src={require('../../assets/arrowright.png')} className="ArrowIcon" />
              </button>
            </td>
          </tr>
        )
      })
    )
  }

  render() {
    let { channels } = this.state;
    
    var channelList = channels.map(channel => {
      return {
        name: channel.name,
        id: channel._id
      }
    });

    channelList = DEFAULT_CHANNELS.concat(channelList);

    let channelCards = this.getChannelCardJSX(channelList);

    return (
      <table className="ChannelListTable">
        {channelCards}
      </table>
    );
  }
}

export default Channel;
