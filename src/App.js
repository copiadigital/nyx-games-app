import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Games from './components/Games';
import {
    BrowserRouter as Router,
    Route,
} from 'react-router-dom'

class App extends Component {
  render() {
    return (
        <Router>
          <div className="app">
            <div className="app-header">
              <img src={logo} className="app-logo" alt="NYX logo" />
              <h2>We love games</h2>
            </div>
            <div class="app-body">
                <Route path="/" component={Games} />
                <Route path="/games" component={Games} />
            </div>
            <div className="app-footer">
              <p>&copy; 2017</p>
            </div>
          </div>
        </Router>
    );
  }
}

export default App;
