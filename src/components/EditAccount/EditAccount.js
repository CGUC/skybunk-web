import React, { Component } from 'react';
import TextInput from '../Shared/TextInput/TextInput';
import Button from '../Shared/Button/Button';
import Header from '../Shared/Header/Header';
import { withRouter } from 'react-router-dom';
import api from '../../ApiClient';
import '../Login/Login.css';
import './EditAccount.css';

class EditAccount extends Component {

    constructor(props) {
        super(props);
        this.state = {
            curPassword: null,
            newPassword: null,
            confPassword: null,
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

    goHome() {
        this.props.history.push('/home');
    }

    async changePassword() {
        this.setState({loading: true});

        if (this.state.newPassword !== this.state.confPassword) {
            this.setState({ error: 'Passwords do not match!' });
            return;
        }

        const currentUser = await api.get(
            '/users/loggedInUser', 
            { Authorization: `Bearer ${localStorage.getItem('skybunkToken')}`},
            {}
        );

        if (currentUser._id !== this.props.match.params.id) {
            this.setState({error: 'Not authorized'});
            return;
        }
        const response = await api.post(
            `/users/${this.props.match.params.id}/password`,
            { Authorization: `Bearer ${localStorage.getItem('skybunkToken')}`},
            {
                password: this.state.newPassword
            }
        );

        if (response.message) {
            this.setState({
                error: response.message,
                loading: false,
            });
        }
        else {
            this.setState({success: 'Password Updated'});
        }
    }

    render() {
        const { success, error } = this.state;
        return (
            <div className="Main">
                <Header>
                    <p className="header-item" onClick={this.goHome.bind(this)}>
                        Home
                    </p>
                </Header>
                <div className="Register">
                    <div className="Card">
                        <h2>Change Password</h2>
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

export default withRouter(EditAccount);
