import React, { Component } from 'react';
import TextInput from '../Shared/TextInput/TextInput';
import Button from '../Shared/Button/Button';
import Header from '../Shared/Header/Header';
import { withRouter } from 'react-router-dom';
import ApiClient from '../../ApiClient';
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

    async componentDidMount() {
        const user = await ApiClient.get(
            '/users/loggedInUser', 
            { authorized: true }
        );
        this.setState({
            currentUser:user 
        });
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

        if (this.state.currentUser._id !== this.props.match.params.id) {
            this.setState({error: 'Not authorized'});
            return;
        }
        const response = await ApiClient.post(
            `/users/${this.props.match.params.id}/password`,
            {password: this.state.newPassword},
            { authorized: true }
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
        const { success, error, currentUser } = this.state;
        return (
            <div className="Main">
                <Header 
                    isLoggedIn
                    userId = {currentUser ? currentUser._id : null}
                    homeClick = {this.goHome.bind(this)}
                    activePage="settings"
                />
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
