import React from 'react';
import date from 'date-fns';
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
      profilePicture: null
    };
  }

  async componentDidMount() {
    await api.get(`/users/${this.props.data.author._id}/profilePicture`, {}).then(pic => {
      this.setState({
        profilePicture: pic,
      });
    }).catch(error => {
      console.log(error);
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.data.comments !== prevProps.data.comments) {
      this.setState({
        comments: this.props.data.comments
      })
    }
  }

  showComments() {
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

  render() {
    const { profilePicture } = this.state;

    var {
      author,
      content,
      likes,
      isLiked,
      createdAt,
      tags,
    } = this.props.data;

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
                  {authorName}
                </div>
                <div className="channel">
                  {channel}
                </div>
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
        </div>
        <div className="footers">
          {/* Likes */}
          <a className="ShowComments" onClick={this.showComments.bind(this)}>
            {this.state.showComments ? 'Hide' : 'Show'} {comments.length} comments
          </a>
        </div>
        {
          this.state.showComments ? <div className="commentsContainer">
            <div className="line" />
            {comments.map(comment => {
              return (
                <div key={comment._id} className="comment">
                  <b>{comment.author.firstName} {comment.author.lastName}</b>
                  <p>{comment.content}</p>
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