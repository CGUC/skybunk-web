import React, { Component } from 'react';
import ApiClient from '../../../ApiClient';
import TextInput from '../../Shared/TextInput/TextInput';
import { withRouter } from 'react-router-dom';
import SkybunkLogo from '../../../assets/skybunk-logo-no-words.png'
import settingsIcon from '../../../assets/settings-icon.png'
import channelIcon from '../../../assets/Channel-icon-nav.png'
import notifIcon from '../../../assets/header-bell-notification.png'
import './Header.css';

class Header extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loginError: null,
    }
  }

  async componentDidUpdate(prevProps) {
    if(prevProps.userId === null && this.props.userId !== null) {
      await this.getProfilePic();  
    }
  }

  async submitLogin() {
      this.setState({loading: true});

      const response = await ApiClient.post(
          '/users/login',
          {
              username: this.state.username,
              password: this.state.password
          }
      );

      if (response.err) {
          this.setState({
              password: null,
              loading: false,
              loginError: response.err.message
          });
      }
      else {
          ApiClient.setAuthToken(response.token);
          this.props.loginMethod();
      }
  }

  _pressLoginBtn = (event) => {
      if(event.charCode === 13){
        try{
          document.getElementsByClassName("LoginBtn")[0].click();
        }
        catch(e){

        }
      }
    }
    componentWillMount() {
      document.addEventListener("keypress", this._pressLoginBtn.bind(this));
    }
    componentWillUnmount() {
      document.removeEventListener("keypress", this._pressLoginBtn.bind(this));
    }

  updateFormStateFunc(key) {
      return (event) => {
          this.setState({
              [key]: event.target.value,
          });
      };
  }

  async getProfilePic() {
    var profilePic = await ApiClient.get(`/users/${this.props.userId}/profilePicture`, { authorized: true })
    .then(pic => {
        this.setState({
          profilePicture: pic,
        });
      });
  }

  notLoggedInHeader() {
    const { loginError} = this.state;
    return(
      <div className="HeaderRight">        
        <div className="Login hideMobile">
            <div className="LoginTitle">Login</div>
            <div className="LoginForms">
                <TextInput name="username" placeholder="Username" onChange={this.updateFormStateFunc('username')} onKeyPress={this.pressLoginBtn}/>
                <TextInput type="password" name="password" placeholder="Password" onChange={this.updateFormStateFunc('password')} onKeyPress={this.pressLoginBtn}/>
                <button onClick={this.submitLogin.bind(this)} className="Button LoginBtn">
                    Login
                </button>
            </div>
            {loginError ? <div className="LoginError">*{loginError}</div> : null}
        </div>
      </div>
    );  
  }

  loggedInHeader() {
    const {activePage, settingsClick, channelsClick } = this.props;
    return (
      <div className="HeaderRight">
        <div className={activePage == "home" ? "HeaderButtonActive" :"HeaderButton"} onClick={this.props.homeClick}>
            <img className="HeaderChannel" src={channelIcon}/>
            <div className="HeaderButtonText">Channels</div>
          </div>
          {/* Re-enable once Notifications page is created
        <div className="HeaderButton" onClick={this.notifications.bind(this)}>
          <img className="HeaderNotif" src={notifIcon}/>
          <div className="HeaderButtonText" >Notifications</div>
        </div>
        */} 
          { /*TODO: onClick() direct to Profile Page*/}
        <div className="HeaderButton" style ={{ cursor: 'default' }}>
              {this.state.profilePicture ? ( 
                <img 
                className="HeaderProfile" 
                style ={{ display: this.state.profilePicture ? 'inline' : 'none'}}
                src={`data:image/png;base64,${this.state.profilePicture}`}
                />
                ) : (
                <div className="HeaderProfile"/>
                )}
            </div>
        <div className={activePage == "settings" ? "HeaderButtonActive" :"HeaderButton"} onClick={this.props.settingsClick}>
              <img className="HeaderSettings" src={settingsIcon}/>
            </div>
      </div>  
    );
  } 

  render() {
    let headerContents = this.props.isLoggedIn ? this.loggedInHeader() : this.notLoggedInHeader();
    return (
    	<div className="Header">
        <div className="HeaderLeft">
          <img className="HeaderLogo" src={SkybunkLogo}/>
      	  <div className="HeaderTitle">Skybunk</div>
        </div>
      		{headerContents}
      </div>
    );
  }
}

export default Header;
