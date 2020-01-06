import React, { Component } from 'react';
import TextInput from '../Shared/TextInput/TextInput';
import Button from '../Shared/Button/Button';
import { withRouter } from 'react-router-dom';
import ApiClient from '../../ApiClient';

import './ForgotPassword.css';

class ForgotPassword extends Component {

    constructor(props) {
        super(props);
        this.state = {
            forgotFirstName: null,
            forgotLastName: null,
            forgotEmail: null,
            forgotUsername: null,
            forgotError: null,
            loginError: null,
            registerError: null,
            loading: false,
            selectedServer: null,
            servers: []
        };
    }

    async componentDidMount(){
        ApiClient.getAllServers().then((servers) =>{
            console.log(servers);
            this.setState({servers, selectedServer: servers[0].url});
        })
    }

    updateFormStateFunc(key) {
        return (event) => {
            this.setState({
                [key]: event.target.value,
            });
        };
    }

    getServerOptionsJSX() {
        return this.state.servers.map((server) => {
            return (
                <option value={server.url}>{server.name}</option>
              )
        });
    }

    submitResetPassword () {
        const userInfo = {
            firstName: this.state.forgotFirstName,
            lastName:  this.state.forgotLastName,
            username: this.state.forgotUsername,
            email:     this.state.forgotEmail,
            url: this.state.selectedServer,
        }

        ApiClient.post('/users/reset', userInfo, {}).then((response) =>{
            console.log(response)
            this.setState({forgotError: response.toString()});
        });
    }

    render() {
        const { forgotError } = this.state;
        return (
            <div className="Main">
                <div className="Forgot">
                    <div className="Card">
                        <h2>Forgot your username or password?</h2>
                        <div>
                            Organization:
                            <select class="TextInput" name="selectedServer" nChange={this.updateFormStateFunc('selectedServer')}>
                                {this.getServerOptionsJSX()}
                            </select>
                        </div>
                        
                        <div>
                            <TextInput large name="forgotFirstName" placeholder="First Name" size={15} onChange={this.updateFormStateFunc('forgotFirstName')}/>
                            <TextInput large name="forgotLastName" placeholder="Last Name" size={15} onChange={this.updateFormStateFunc('forgotLastName')}/>
                        </div>
                        or
                        <TextInput large name="forgotUsername" placeholder="Username" size={33} onChange={this.updateFormStateFunc('forgotUsername')}/>
                        <br/>
                        <TextInput large name="forgotEmail" placeholder="School Email" size={33} onChange={this.updateFormStateFunc('forgotEmail')}/>
                        {forgotError ? <p style={{color: 'red'}}>{forgotError}</p> : null}
                        <Button large onClick={this.submitResetPassword.bind(this)}>
                            Reset Password
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(ForgotPassword);
