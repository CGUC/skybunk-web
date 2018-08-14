import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import Login from './components/Login/Login';
import './App.css';

class App extends Component {
  render() {
    return (
      <div>
        <Redirect to='/login' />

        <Route path="/login" component={Login}/>
      </div>
    );
  }
}

export default App;
