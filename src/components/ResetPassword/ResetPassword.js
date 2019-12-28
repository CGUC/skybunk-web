import React, { Component } from 'react';
import TextInput from '../Shared/TextInput/TextInput';
import Button from '../Shared/Button/Button';
import { withRouter } from 'react-router-dom';
import ApiClient from '../../ApiClient';
import '../Login/Login.css';
import './ResetPassword.css';

class ResetPassword extends Component {

    constructor(props) {
        super(props);
        this.state = {
            newPassword: null,
            confPassword: null,
            username: null,
            error: null,
            success: null,
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

    async changePassword() {
        this.setState({loading: true});

        if (this.state.newPassword !== this.state.confPassword) {
            this.setState({ error: 'Passwords do not match!' });
            return;
        }

        const response = await ApiClient.resetPassword(this.props.match.params.id, this.state.username, this.state.newPassword, this.props.match.params.token)

        if (response.message) {
            this.setState({
                error: response.message,
                loading: false,
            });
        }
        else {
            this.setState({success: 'Password Updated'});
            this.props.history.push('/login');
        }
    }

    render() {
        const { success, error} = this.state;
        return (
            <div className="EditAccountMain">
                <div className="Register">
                    <div className="Card">
                        <h2>Change Password</h2>
                        <TextInput large name="username" placeholder="Username" size={33} onChange={this.updateFormStateFunc('username')}/>
                        <TextInput large type="password" name="newPassword" placeholder="New Password" size={33} onChange={this.updateFormStateFunc('newPassword')}/>
                        <TextInput large type="password" name="confirmPassword" placeholder="Confirm Password" size={33} onChange={this.updateFormStateFunc('confPassword')}/>
                        {error ? <p style={{color: 'red'}}>*{error}</p> : null}
                        {success ? <p style={{color: 'green'}}>{success}</p> : null}
                        <Button large onClick={this.changePassword.bind(this)}>
                            Save
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(ResetPassword);
