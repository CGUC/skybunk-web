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
      commentContent: null
    };
  }

  showComments() {
    this.setState({showComments: !this.state.showComments})
  }
  
  updateComment(event) {
    this.setState({
      commentContent: event.target.value,
    });
  }

  addComment() {
    const {
      data
    } = this.props;

    const token = localStorage.getItem('skybunkToken');

    api.get('/users/loggedInUser', {'Authorization': 'Bearer ' + token}, {})
    .then(user => {
      const commentContent = {
        author: user._id,
        content: this.state.commentContent,
      }
      api.post(`/posts/${data._id}/comment`, { 'Authorization': 'Bearer ' + token }, commentContent)
      .then(comments => {
        comments[comments.length - 1].author = {firstName: user.firstName, lastName: user.lastName}
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
    const {
      data
    } = this.props;
    var {
      author,
      content,
      likes,
      isLiked,
      createdAt,
      isLiked,
      tags,
    } = data;
    const comments = this.state.comments;

    var authorName = `${author.firstName} ${author.lastName}`;
    var channel = `${tags[0]}`
    createdAt = date.format(createdAt, 'ddd MMM Do [at] h:mma');

    return (
      <div className="card">
        <div className="header">
          <div className="headerLeft">
            {/* Profile pic */}
          </div>
          <div className="headerContent">
            <div className="authorContainer">
              <div>
                {authorName}
              </div>
              <div className="channel">
                {channel}
              </div>
            </div>
            <p className="timestamp">{createdAt}</p>
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
          <a href="#" onClick={this.showComments.bind(this)}>
            {this.state.showComments ? 'Hide' : 'Show'} {comments.length} comments
          </a>
        </div>
        {this.state.showComments ? <div className="commentsContainer">
          <div className="line"/>
          {comments.map(comment => {
            return (
            <div key={comment._id} className="comment">
              <b>{comment.author.firstName} {comment.author.lastName}</b>
              <p>{comment.content}</p>
            </div>)
          })}
        </div> : null }
        <div className="addCommentContainer">
          <textarea className="textArea" placeholder="Add Comment" rows={1} onChange={this.updateComment.bind(this)}/>
          <Button large onClick={this.addComment.bind(this)}>Comment</Button>
        </div>
      </div>
    )
  }
}