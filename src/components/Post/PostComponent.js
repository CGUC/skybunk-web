import React from 'react';
import date from 'date-fns';

import './PostComponent.css';

export default class Post extends React.Component {
  render() {
    const {
      data
    } = this.props;

    var {
      author,
      content,
      likes,
      isLiked,
      comments,
      createdAt,
      isLiked,
      tags,
    } = data;

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
          {/* Comments */}
        </div>
      </div>
    )
  }
}