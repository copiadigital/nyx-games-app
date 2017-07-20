import React, { Component } from 'react';
import logo from './assets/images/logo.svg';
import './App.css';
import Game from './components/games/Game';
import Games from './components/game/Games';
import PromoBanner from './components/framework/PromoBanner';
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
                <div>
                    <img src={logo} className="app-logo" alt="NYX logo" />
                    <h2>Game Portal</h2>
                </div>
                <Route path="/games" component={PromoBanner} />
            </div>
            <div className="app-body">
                <Route path="/" exact={true} render={() => <Redirect to="/games" />} />
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
