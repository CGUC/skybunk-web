import React, { Component } from 'react';

import api from '../../ApiClient';

const DEFAULT_POLL = 60 * 1000; // 1 minute


export default class Feed extends Component {

  state = {};

  getUri = () => {
    return '/posts';

    // TODO: multipurpose Feed
    // const userId = this.props.navigation.getParam('userId');

    // var channel = this.props.navigation.getParam('channel');
    // if (!channel) channel = { _id: 'all' };

    // if ('all' === channel._id) {
    //   return '/posts'
    // }
    // else if ('subs' === channel._id) {
    //   return `/users/${userId}/subscribedChannels/posts`;
    // }
    // else if ('myPosts' === channel._id) {
    //   return `/posts/user/${userId}`;
    // }
    // return `/channels/${channel._id}/posts`;
  }

  async componentWillMount() {

    this.setState({
      loading: true
    });

    await this.loadData();

    this.setState({
      loading: false
    });

    var pollInterval = setInterval(this.loadData, DEFAULT_POLL);

    this.setState({ loading: false, pollInterval });
  }

  loadData = async () => {
    await api.get(this.getUri())
      .then(response => {
        this.setState({
          posts: response,
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  render() {
    var { posts, loading } = this.state;

    if (loading) {
      return (<div>Loading...</div>)
    }

    return (
      <ul>
        {posts.map(post => {
          return (
            <li>
              <p>{post.content}</p>
            </li>
          )
        })}
      </ul>
    )
  }
}
