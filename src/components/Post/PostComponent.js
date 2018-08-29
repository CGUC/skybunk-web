import React from 'react';
import date from 'date-fns';
import _ from 'lodash';

import Button from '../Shared/Button/Button';
import api from '../../ApiClient';

import './PostComponent.css';

export default class Post extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showComments: false,
      comments: props.data.comments,
      commentContent: null,
      profilePicture: null,
      image: null,
      commentProfilePictures: null,
    };
  }

  async componentDidMount() {
    this.fetchProfilePicture();
    this.fetchImage();
  }

  async fetchProfilePicture() {
    await api.get(`/users/${this.props.data.author._id}/profilePicture`, {}).then(pic => {
      this.setState({
        profilePicture: pic,
      });
    }).catch(error => {
      console.log(error);
    });
  }

  async fetchCommentProfilePictures() {
    var comments = this.props.data.comments;

    var pics = await Promise.all(_.map(comments, async comment => {
      var pic = await api.get(`/users/${comment.author._id}/profilePicture`, {});
      return { id: comment._id, val: pic };
    }));

    var commentProfilePictures = _.transform(pics, (result, pic) => {
      result[pic.id] = pic.val;
    }, {});

    this.setState({ commentProfilePictures });

  }

  async fetchImage() {
    if (this.props.data.image) {
      await api.get(`/posts/${this.props.data._id}/image`, {}).then(pic => {
        this.setState({
          image: pic
        });
      }).catch(error => {
        console.log(error);
      });
    } else {
      this.setState({
        image: null
      });
    }
  }

  componentDidUpdate(prevProps) {
    const {
      data,
    } = this.props;

    if (data.comments !== prevProps.data.comments) {
      this.setState({
        comments: data.comments
      })
    }
    if (data.author._id !== prevProps.data.author._id) {
      this.fetchProfilePicture();
      this.fetchImage();
    }
  }

  showComments() {
    if (!this.state.commentProfilePictures && !this.state.showComments) {
      this.fetchCommentProfilePictures();
    }
    this.setState({ showComments: !this.state.showComments })
  }

  updateComment(event) {
    this.setState({
      commentRef: event.target,
      commentContent: event.target.value,
    });
  }

  addComment() {
    const { data } = this.props;
    let { commentContent, commentRef } = this.state;

    if (!commentContent) return;

    commentRef.value = '';

    const token = localStorage.getItem('skybunkToken');

    api.get('/users/loggedInUser', { 'Authorization': 'Bearer ' + token }, {})
      .then(user => {
        const content = {
          author: user._id,
          content: commentContent,
        }
        api.post(`/posts/${data._id}/comment`, { 'Authorization': 'Bearer ' + token }, content)
          .then(comments => {
            comments[comments.length - 1].author = { firstName: user.firstName, lastName: user.lastName }
            this.setState({
              comments
            })
          })
          .catch(err => {
            alert("Error adding comment. Sorry about that!")
          });
      })
      .catch(err => {
        alert("Error adding comment. Sorry about that!")
      });
  }

  toggleLike = () => {
    const { data, update, user } = this.props;
    const token = localStorage.getItem('skybunkToken');

    var updatedContent = data;

    if (this.isLiked()) {
      updatedContent.likes--;
      updatedContent.usersLiked = _.filter(updatedContent.usersLiked, u => u !== user._id);
    } else {
      updatedContent.likes++;
      updatedContent.usersLiked.push(user._id);
    }
    if (updatedContent.likes < 0) updatedContent.likes = 0;

    api.put(`/posts/${data._id}`, { 'Authorization': 'Bearer ' + token }, updatedContent)
      .then(() => {
        update && update();
      })
      .catch(err => {
        console.warn(err)
      });
  }

  isLiked() {
    const { data, user } = this.props;
    return data.usersLiked.includes(user._id);
  }

  render() {
    const { profilePicture, commentProfilePictures, image } = this.state;

    var {
      author,
      content,
      likes,
      createdAt,
      tags,
    } = this.props.data;

    var likeIcon = this.isLiked() ? require('../../assets/liked-cookie.png') : require('../../assets/cookie-icon.png')

    const comments = this.state.comments;

    var authorName = `${author.firstName} ${author.lastName}`;
    var channel = `${tags[0]}`
    createdAt = date.format(createdAt, 'ddd MMM Do [at] h:mma');

    return (
      <div className="card">
        <div className="headerContainer">
          <div className="headerLeft">

            {profilePicture && <img
              className="profilePic"
              src={`data:image/png;base64,${profilePicture}`}
            />}

            <div className="headerBody">
              <div className="authorDetails">
                <div>
                  {authorName} ➤ {channel}
                </div>
                {/*<div className="channel">
                  {channel}
                </div>*/}
              </div>
              <p className="timestamp">{createdAt}</p>
            </div>
          </div>

          <div className="headerRight">
            {/* Edit button */}
          </div>
        </div>
        <div className="content">
          <p>{content}</p>
          {image && <img className="postImage" src={`data:image/png;base64,${image}`}/>}
        </div>
        <div className="footers">
          <div className="likesContainer">
            <button className="likeButton" onClick={this.toggleLike}>
              <img src={likeIcon} className="likeIcon" />
            </button>
            {`${likes} ${likes === 1 ? 'like' : 'likes'}`}
          </div>
          <a className="ShowComments" onClick={this.showComments.bind(this)}>
            {this.state.showComments ? 'Hide' : 'Show'} {comments.length} comments
          </a>

        </div>
        {
          this.state.showComments ? <div className="commentsContainer">
            <div className="line" />
            {comments.map(comment => {
              return (
                <div className="commentContainer">
                  {commentProfilePictures && commentProfilePictures[comment._id] && <img
                  className="commentProfilePic"
                  src={`data:image/png;base64,${commentProfilePictures[comment._id]}`}
                  />}
                  <div key={comment._id} className="comment">
                    <div className="commentHeader">
                      <b>{comment.author.firstName} {comment.author.lastName}</b>
                    </div>
                    <p>{comment.content}</p>
                  </div>
                </div>)
            })}
          </div> : null
        }
        <div className="addCommentContainer">
          <textarea className="textArea" placeholder="Add Comment" rows={1} onChange={this.updateComment.bind(this)} />
          <Button large onClick={this.addComment.bind(this)}>Comment</Button>
        </div>
      </div >
    )
  }
}