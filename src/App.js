import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import Login from './components/Login/Login';
import Home from './components/Home/Home';
import './App.css';

class App extends Component {
  render() {
    return (
      <div>
        <Redirect to='/home' />

        <Route path="/home" component={Home}/>
      </div>
    );
  }
}

export default App;
