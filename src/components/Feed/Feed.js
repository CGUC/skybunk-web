import React, { Component } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import _ from 'lodash';

import Post from '../Post/PostComponent';
import api from '../../ApiClient';

import './Feed.css';

const PAGE_SIZE = 15;
const DEFAULT_POLL = 10 * 1000; // 1 minute


export default class Feed extends Component {

  state = {
    page: 1,
    posts: []
  };

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

    await this.loadData();

    // keep this in case we want to clear it
    var pollIntervalId = setInterval(() => {
      console.warn("reloading")
      this.loadData({ reload: true });
    }, DEFAULT_POLL);
    
    this.setState({ pollIntervalId });
  }

  loadData = async (options = {}) => {
    var isReload = options.reload;

    var page;
    if (!isReload) page = this.state.page;
    else page = 1;

    this.setState({
      loading: true
    });
    await api.get(this.getUri(), { page })
      .then(response => {
        if (isReload) return this.updateRecent(response);
        this.setState({
          posts: this.state.posts.concat(response),
          loadedLastPage: response.length < PAGE_SIZE,
          loading: false
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  /**
   * Will take PAGE_SIZE most recent posts and either update or add them to the feed.
   */
  updateRecent(freshData) {
    const { posts } = this.state;

    // Triage new and pre-existing posts
    var newPosts = [];
    var oldPosts = [];
    _.each(freshData, item => {
      var existing = _.find(posts, post => post._id === item._id);
      if (existing) oldPosts.push(item);
      else newPosts.push(item);
    });

    var numNew = newPosts.length;
    var updated = newPosts.concat(oldPosts);
    var numUpdated = updated.length;

    // with 15 fresh posts coming in with 3 new, we'd want to replace the first 12
    var toReturn = posts.slice(numUpdated - numNew);

    toReturn.unshift(...updated);

    this.setState({
      posts: toReturn,
      loading: false
    })

  }

  loadNext = () => {
    if (this.state.loading) return;
    this.setState({ page: this.state.page + 1, loading: true });
    this.loadData();
  }

  render() {
    var {
      posts,
      loadedLastPage,
      loading
    } = this.state;

    if (!posts) {
      return (<div>Loading ...</div>)
    }

    var posts = posts.map((post, i) => <Post key={`post-${i}`} data={post} />)

    return (
      <div className="Feed">
        <InfiniteScroll
          loadMore={this.loadNext.bind(this)}
          loader={<div key={0}>Loading ...</div>}
          hasMore={!loading && !loadedLastPage}
        >
          {posts}
        </InfiniteScroll>
      </div>
    )
  }
}
