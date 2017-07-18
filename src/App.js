import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Games from './components/Games';
import Game from './components/Game';
import {
    BrowserRouter as Router,
    Redirect,
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
            <div className="app-body">
                <Route path="/" exact={true} render={() => <Redirect to="/games/featured" />} />
                <Route path="/games" component={Games} />
                <Route path="/game/:gameId/:gameSlug" component={Game} />

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
