import React, { Component } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import _ from 'lodash';

import Post from '../Post/PostComponent';
import api from '../../ApiClient';

const PAGE_SIZE = 15;
const DEFAULT_POLL = 60 * 1000; // 1 minute


export default class Feed extends Component {

  state = {
    page: 1,
    posts: []
  };

  async componentDidUpdate(prevProps) {
    if (prevProps.channelId !== this.props.channelId) {
      this.setState({ page: 1 });
      await this.loadData({ wipe: true });
    }
  }

  getUri = () => {

    let { channelId, user } = this.props

    const userId = user._id;

    if (!channelId) channelId = 'all';

    if (channelId === 'all') return '/posts';
    else if ('subs' === channelId) {
      return `/users/${userId}/subscribedChannels/posts`;
    }
    else if ('myPosts' === channelId) {
      return `/posts/user/${userId}`;
    }
    return `/channels/${channelId}/posts`;
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

  /**
   * @param options.reload - updates existing posts and appends new
   * @param options.wipe - replace, and do not append, existing posts in feed with results
   */
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
        var posts = options.wipe ? response : this.state.posts.concat(response);

        this.setState({
          posts,
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
      <InfiniteScroll
        loadMore={this.loadNext.bind(this)}
        loader={<div key={0}>Loading ...</div>}
        hasMore={!loading && !loadedLastPage}
      >
        {posts}
      </InfiniteScroll>
    )
  }
}
