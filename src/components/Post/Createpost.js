import React from 'react';

import './PostComponent.css';
import Button from '../Shared/Button/Button';
import './CreatePost.css';
import CatIcon from '../../assets/catIcon.png';
import ImageUploader from 'react-images-upload';

export default class CreatePost extends React.Component {
  constructor(props) {
    super(props);
    this.state = { image: null, uploadInterface: false };
    this.onDrop = this.onDrop.bind(this);
  }

  updateContent = (event) => {
    this.setState({
      postContent: event.target.value,
      ref: event.target
    });
  }

 onDrop(picture) {
    if(picture.length === 0) {
      this.setState({
        image: null,
      });
    }
    else{
      this.setState({
          image: picture,
      });
    }
  }

  getImageIcon = () => {
    return CatIcon;
  }

  showUploadInterface = () => {
    this.setState({uploadInterface: !this.state.uploadInterface});
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
    const imageIcon = this.getImageIcon();
    return (
      <div className="card creationCard">
        {/* <div className="headerContent">
          {`Post to ${channel.name}`}
        </div> */}
        <div className="postAddons">
          {this.state.uploadInterface &&
            <ImageUploader
              withIcon={true}
              buttonText='Choose images'
              buttonStyles={{display: this.state.image ? 'none' : 'inline'}}
              onChange={this.onDrop}
              singleImage={true}
              withPreview
              imgExtension={['.jpg', '.gif', '.png']}
              maxFileSize={5242880}
            />
          }
          <img
            className="addPhoto"
            style={{maxHeight: '40px'}}
            src={imageIcon}
            onClick={this.showUploadInterface}
          />
        </div>
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