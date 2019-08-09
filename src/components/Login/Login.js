import React, { Component } from 'react';
import TextInput from '../Shared/TextInput/TextInput';
import Button from '../Shared/Button/Button';
import Header from '../Shared/Header/Header';
import { withRouter } from 'react-router-dom';
import ApiClient from '../../ApiClient';
import './Login.css';

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: null,
            passowrd: null,
            newUsername: null,
            newPassword: null,
            firstName: null,
            lastName: null,
            goldenTicket: null,
            loginError: null,
            registerError: null,
            loading: false
        };
    }

    updateFormStateFunc(key) {
        return (event) => {
            this.setState({
                [key]: event.target.value,
            });
        };
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
            this.props.history.push('/home');
        }
    }

    async submitRegister() {
        this.setState({loading: true});

        const response = await ApiClient.post(
            '/users',
            {
                username: this.state.newUsername,
                password: this.state.newPassword,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                goldenTicket: this.state.goldenTicket
            }
        );

        if (response.message) {
            this.setState({
                newPassword: null,
                registerError: response.message,
                loading: false,
            });
        }
        else {
            const response = await ApiClient.post(
                '/users/login',
                {
                    username: this.state.newUsername,
                    password: this.state.newPassword
                }
            );

            if (response.err) {
                this.setState({
                    errorMessage: `Account created, but error logging in. ${response.err.message}`,
                    loading: false,
                });
            }
            else {
                ApiClient.setAuthToken(response.token);
                this.props.history.push('/home');
            }
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

    render() {
        const { loginError, resgisterError } = this.state;
        return (
            <div className="Main">
                <Header>
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
                </Header>
                <div className="mobileLogin">
                    <div className="Card">
                        <h2>Login</h2>
                        <TextInput name="username" placeholder="Username" onChange={this.updateFormStateFunc('username')} onKeyPress={this.pressLoginBtn}/>
                        <TextInput type="password" name="password" placeholder="Password" onChange={this.updateFormStateFunc('password')} onKeyPress={this.pressLoginBtn}/>
                        <button onClick={this.submitLogin.bind(this)} className="Button LoginBtn ButtonLarge">
                            Login
                        </button>
                        {loginError ? <div className="LoginError">*{loginError}</div> : null}
                    </div>
                </div>
                <div className="Register">
                    <div className="Card">
                        <h2>Register</h2>
                        <div>
                            <TextInput large name="firstName" placeholder="First Name" size={15} onChange={this.updateFormStateFunc('firstName')}/>
                            <TextInput large name="lastName" placeholder="Last Name" size={15} onChange={this.updateFormStateFunc('lastName')}/>
                        </div>
                        <TextInput large name="newUsername" placeholder="Username" size={33} onChange={this.updateFormStateFunc('newUsername')}/>
                        <TextInput large type="password" name="newPassword" placeholder="Password" size={33} onChange={this.updateFormStateFunc('newPassword')}/>
                        <TextInput large name="goldenTicket" placeholder="Golden Ticket" size={33} onChange={this.updateFormStateFunc('goldenTicket')}/>
                        {resgisterError ? <p style={{color: 'red'}}>*{resgisterError}</p> : null}
                        <Button large onClick={this.submitRegister.bind(this)}>
                            Register
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Login);
