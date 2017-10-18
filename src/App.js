import React, { Component } from 'react';
import logo from './assets/images/logo.svg';
import Games from './components/games/Games';
import Service from './components/service/Service';
import {
    BrowserRouter,
    Redirect,
    Route,
} from 'react-router-dom';
import './assets/sass/App.css';

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
                        <li><a href="/technical-documentation">Tech docs</a></li>
                        <li><a href="/service">Self service</a></li>
                        <li><a href="http://www.nyxgaminggroup.com/news">News</a></li>
                        <li><a href="http://www.nyxgaminggroup.com/contact">Contact</a></li>
                    </ul>
                </div>
            </div>
            <div className="banner">
                {/* <a className="btn banner-button" href="#findOutMore">Find out now</a> */}
            </div>
            <div className="wrapper">
                <div className="app-body">
                    <Route path="/" exact={true} render={() => <Redirect to="/games" />} />
                    <Route path="/games" component={Games} />
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
