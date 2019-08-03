import React from 'react';

import './PostComponent.css';
import Button from '../Shared/Button/Button';
import './CreatePost.css';
import ImageUploader from 'react-images-upload';
import MaterialIcon from 'material-icons-react'

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
          image: picture[0],
        });
    }
  }

  showUploadInterface = () => {
    this.setState({uploadInterface: !this.state.uploadInterface});
    if(this.state.image) {
      this.setState({image: null});
    }
  }

  addPost = () => {
    let { postContent, image, ref } = this.state;
    const { onAddPost } = this.props;
    if (!postContent) return;

    ref.value = '';
    if (onAddPost) onAddPost({
      content: postContent,
      image: image
    });
    if(this.state.image) {
      this.setState({
        image: null,
        uploadInterface: false
      });
    }
  }

  render() {
    const { channel } = this.props;
    return (
      <div className="card creationCard">
        {/* <div className="headerContent">
          {`Post to ${channel.name}`}
        </div> */}
        <div className="postAddons">
          <div style={{cursor: 'pointer'}}>
            <MaterialIcon
              icon="image"
              color='#000000'
              size={30}
              onClick={this.showUploadInterface}
            />
          </div>
          {this.state.uploadInterface &&
            <div>
              <ImageUploader
                withPreview
                withIcon={false}
                withLabel={false}
                singleImage={true}
                buttonText='Choose an image'
                buttonStyles={{
                  display: this.state.image ? 'none' : 'inline',
                  height: '30px',
                  fontSize: '15px',
                  backgroundColor: '#71d3d1',
                  color: 'white',
                  borderWidth: '0px',
                  borderRadius: '2px',
                }}
                fileContainerStyle={{
                  boxShadow: 'none',
                  webkitBoxShadow: 'none',
                  padding: '0',
                  transition: 'none',
                }}              
                onChange={this.onDrop}
                imgExtension={['.jpg', '.gif', '.png']}
                maxFileSize={5242880}
              />
            </div>
          }
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