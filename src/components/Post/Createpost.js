import React from 'react';

import './PostComponent.css';
import Button from '../Shared/Button/Button';

export default class CreatePost extends React.Component {

  state = {}

  updateContent = (event) => {
    this.setState({
      postContent: event.target.value,
      ref: event.target
    });
  }

  addPost = () => {
    let { postContent, ref } = this.state;
    const { onAddPost } = this.props;

    if (!postContent) return;

    ref.value = '';

    if (onAddPost) onAddPost({
      content: postContent
      // TODO: Add image support
    });
  }

  render() {
    const { channel } = this.props;
    return (
      <div className="card creationCard">
        {/* <div className="headerContent">
          {`Post to ${channel.name}`}
        </div> */}
        <div className="content">
          <textarea
            className="creationField"
            placeholder="What's on your mind?"
            onChange={this.updateContent}
            rows={8}
          />
        </div>
        <div className="PostButton">
          <Button 
            large
            onClick={this.addPost}
          >
            {`Post to ${channel.name}`}
          </Button>
        </div>
      </div>
    )
  }
}