import React, { Component } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import _ from 'lodash';

import Post from '../Post/PostComponent';
import CreatePost from '../Post/Createpost';
import api from '../../ApiClient';

import './Feed.css';

const PAGE_SIZE = 15;
const DEFAULT_POLL = 10 * 1000; // 10 seconds


export default class Feed extends Component {

  state = {
    page: 1,
    posts: []
  };

  async componentDidUpdate(prevProps) {
    if (prevProps.channel._id !== this.props.channel._id) {
      this.setState({ page: 1 });
      await this.loadData({ wipe: true });
    }
  }

  getUri = () => {

    let { channel, user } = this.props

    if (!channel) channel = { _id: 'all' };

    const userId = user._id;
    const channelId = channel._id;

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
    var isWipe = options.wipe;

    var page;
    if (isWipe || isReload) {
      page = 1;
    }
    else page = this.state.page;

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
      var existing = _.find(posts, { _id: item._id });
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

  addPost = (data) => {
    const token = localStorage.getItem('skybunkToken');
    const { channel, user } = this.props;

    if (!channel.tags) return alert("Cannot add post to this channel");

    const postContent = {
      author: user._id,
      tags: channel.tags,
      content: data.content,
    }

    api.post(`/posts/`, { 'Authorization': 'Bearer ' + token }, postContent)
      .then(() => {
        this.loadData({ reload: true });
      })
      .catch(err => {
        alert("Error adding post. Sorry about that!")
      });
  }

  render() {
    var {
      posts,
      loadedLastPage,
      loading
    } = this.state;

    var { channel, user } = this.props;

    var enableCreation = true;

    if (['all', 'subs', 'myPosts'].includes(channel._id)) {
      enableCreation = false;
    }

    if (!posts) {
      return (<div>Loading ...</div>)
    }

    var posts = posts.map((post, i) => {
      return (
        <Post
          key={`post-${i}`}
          data={post}
          user={user}
          update={() => this.loadData({ reload: true })}
        />
      )
    })

    return (
      <div>
        {enableCreation && <CreatePost
          onAddPost={this.addPost}
          channel={channel}
        />}
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
