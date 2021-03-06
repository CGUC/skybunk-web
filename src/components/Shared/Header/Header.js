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
      activePage : 'home',
      loginError: null,
      profilePicture: null,
    }
  }

  async componentDidMount(){
    this.updateIsLoggedIn();
    if(this.state.isLoggedIn) {
      this.getUser();
    }
  }

  async componentDidUpdate(prevProps, prevState) {
    if(prevProps.location.pathname !== this.props.location.pathname) {
      this.updateIsLoggedIn();
    }
    if(this.state.isLoggedIn === true && prevState.isLoggedIn !== this.state.isLoggedIn) {
      this.getUser();
    }
  }

  updateIsLoggedIn(){
      this.setState({isLoggedIn: !this.props.location.pathname.includes('/reset') && this.props.location.pathname !== '/login' && this.props.location.pathname !== '/forgot'});
  }

  async getUser(){
    ApiClient.get('/users/loggedInUser', { authorized: true }).then((currentUser) =>{
      if(currentUser) {
        this.setState({user: currentUser})
        this.getProfilePic();
      }
    }).catch((err) => {
      console.error(err);
    });
    
  }

  goToFeed(){
    if(this.props.location.pathname !== '/home') {
      this.props.history.push('/home');
      this.setState({activePage: 'home'})
    }
  }

  goToAccountSettings(){
    let userId = this.state.user._id;
    if (userId && this.props.location.pathname !== `/users/${userId}/edit`) {
      this.props.history.push(`/users/${userId}/edit`);
      this.setState({activePage: 'settings'})
    }
  }

  goToForgotPassword(){
    if(this.props.location.pathname !== '/forgot') {
      this.props.history.push('/forgot');
      this.setState({activePage: 'forgot', isLoggedIn: false, user:null})
    }
  }

  logout(){
    if(this.props.location.pathname !== '/login') {
      localStorage.removeItem('skybunkToken');
       this.props.history.push('/login');
       this.setState({isLoggedIn: false, activePage: null, user:null});
     }
  }

  async submitLogin() {
      this.setState({loading: true});

      const response = await ApiClient.login(this.state.username, this.state.password);

      if (response.err) {
          this.setState({
              password: null,
              loading: false,
              loginError: response.err.message
          });
      }
      else {
        if(response[0] == null){ //reverse compatibility
          ApiClient.setAuthToken(response.token);
        }else{
          ApiClient.setAuthToken(response[0].token);
        }
          
          ApiClient.setServers(response);
          this.setState({isLoggedIn: true, activePage: 'home'})
          this.goToFeed();
          const currentUser = await ApiClient.get(
              '/users/loggedInUser',
              { authorized: true }
          );
          this.setState({user: currentUser})
          this.getProfilePic();
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
    if(this.state.profilePicture === null){
      var profilePic = await ApiClient.get(`/users/${this.state.user._id}/profilePicture`, { authorized: true })
      .then(pic => {
          this.setState({
            profilePicture: pic,
          });
        });
    }
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
                <button onClick={this.goToForgotPassword.bind(this)} className="Button LoginBtn">
                    Forgot
                </button>
            </div>
            {loginError ? <div className="LoginError">*{loginError}</div> : null}
        </div>
      </div>
    );  
  }

  loggedInHeader() {
    const {settingsClick, channelsClick } = this.props;
    const {activePage} = this.state;
    return (
      <div className="HeaderRight">
        <div className={activePage == "home" ? "HeaderButtonActive" :"HeaderButton"} onClick={this.goToFeed.bind(this)}>
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
                  style={{ display: this.state.profilePicture ? 'inline' : 'none'}}
                  src={`data:image/png;base64,${this.state.profilePicture}`}
                />
                ) : (
                <div className="HeaderProfile"/>
                )}
            </div>
        <div className={activePage == "settings" ? "HeaderButtonActive" :"HeaderButton"} onClick={this.goToAccountSettings.bind(this)}>
              <img className="HeaderSettings" src={settingsIcon}/>
            </div>
        <div className="HeaderButton" onClick={this.logout.bind(this)}>
          <div>Log Out</div>
        </div>
      </div>  
    );
  } 

  render() {
    let headerContents = this.state.isLoggedIn ? this.loggedInHeader() : this.notLoggedInHeader();
    return (
    	<div className="Header">
        <div onClick={this.goToFeed.bind(this)} className="HeaderLeft">
          <img className="HeaderLogo" src={SkybunkLogo}/>
      	  <div className="HeaderTitle">Skybunk</div>
        </div>
      		{headerContents}
      </div>
    );
  }
}

export default withRouter(Header);
