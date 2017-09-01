import React, { Component } from 'react';
import logo from './assets/images/logo.svg';
import './App.css';
import Game from './components/game/Game';
import Games from './components/games/Games';
import Service from './components/service/Service';
import {
    BrowserRouter,
    Redirect,
    Route,
} from 'react-router-dom'

class App extends Component {
  render() {
    return (
        <BrowserRouter>
          <div className="app">
            <div className="app-header">
                <div className="wrapper wrapper--thin">
                    <img src={logo} className="app-logo" alt="NYX logo" />
                    <h2 className="app-title">Game Portal</h2>
                    <ul className="nav">
                        <li><a href="/games">Games</a></li>
                        <li><a href="/news">News</a></li>
                        <li><a href="/contact">Contact</a></li>
                        <li><a href="/service">Self service</a></li>
                    </ul>
                </div>
            </div>
            <div className="banner">
                <a className="banner-button">Find out now</a>
            </div>
            <div className="wrapper">
                <div className="app-body">
                    <Route path="/" exact={true} render={() => <Redirect to="/games" />} />
                    <Route path="/games" component={Games} />
                    <Route path="/game/:gameId/:gameSlug" component={Game} />
                    <Route path="/service" component={Service} />
                </div>
            </div>
            <div className="app-footer">
              <div className="app-footer__slope"></div>
              <p>&copy; 2017</p>
            </div>
          </div>
        </BrowserRouter>
    );
  }
}

export default App;
