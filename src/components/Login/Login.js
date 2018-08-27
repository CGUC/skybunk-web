import React, { Component } from 'react';
import TextInput from '../Shared/TextInput/TextInput';
import Button from '../Shared/Button/Button';
import Header from '../Shared/Header/Header';
import { withRouter } from 'react-router-dom';
import api from '../../ApiClient';
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
            errorMessage: null,
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

        const response = await api.post(
            '/users/login',
            {},
            {
                username: this.state.username,
                password: this.state.password
            }
        );

        if (response.err) {
            this.setState({
                password: null,
                loading: false,
            });
        }
        else {
            localStorage.setItem('skybunkToken', response.token);
            this.props.history.push('/home');
        }
    }

    async submitRegister() {
        this.setState({loading: true});

        const response = await api.post(
            '/users',
            {},
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
                errorMessage: response.message,
                loading: false,
            });
        }
        else {
            const response = await api.post(
                '/users/login',
                {},
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
                localStorage.setItem('skybunkToken', response.token);
                this.props.history.push('/home');
            }
        }
    }

    render() {
        return (
            <div className="Login">
                <Header>
                    <p className="LoginTitle">Login</p>
                    <TextInput name="username" placeholder="Username" onChange={this.updateFormStateFunc('username')}/>
                    <TextInput name="password" placeholder="Password" onChange={this.updateFormStateFunc('password')}/>
                    <Button onClick={this.submitLogin.bind(this)}>
                        Login
                    </Button>
                </Header>
                <div className="Main">
                    <div className="Card">
                        <h2>Register</h2>
                        <div>
                            <TextInput large name="firstName" placeholder="First Name" size={15} onChange={this.updateFormStateFunc('firstName')}/>
                            <TextInput large name="lastName" placeholder="Last Name" size={15} onChange={this.updateFormStateFunc('lastName')}/>
                        </div>
                        <TextInput large name="newUsername" placeholder="Username" size={33} onChange={this.updateFormStateFunc('newUsername')}/>
                        <TextInput large name="newPassword" placeholder="Password" size={33} onChange={this.updateFormStateFunc('newPassword')}/>
                        <TextInput large name="goldenTicket" placeholder="Golden Ticket" size={33} onChange={this.updateFormStateFunc('goldenTicket')}/>
                        {this.state.errorMessage ? <p style={{color: 'red'}}>*{this.state.errorMessage}</p> : null}
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
