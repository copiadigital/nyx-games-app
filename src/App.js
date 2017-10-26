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
                        <li><a href="/portfolio">Portfolio</a></li>
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
                <div className="app-footer__social">
                    <a href="https://www.facebook.com/nyxgg/" title="NYX Gaming on Facebook" target="_blank">
                        <span class="footer__social-icon icon icon--facebook">Facebook</span>
                    </a>
                    <a href="https://www.twitter.com/NYXGG" title="NYX Gaming on Twitter" target="_blank">
                        <span class="footer__social-icon icon icon--twitter">Twitter</span>
                    </a>
                    <a href="https://www.linkedin.com/company/3136237" title="NYX Gaming on LinkedIn" target="_blank">
                        <span class="footer__social-icon icon icon--linkedin">LinkedIn</span>
                    </a>
                </div>
                <div className="app-footer__contact">
                    <p>Contact us: <a href="mailto:sales@nyxgg.com">sales@nyxgg.com</a></p>
                </div>
            </div>
              <div className="app-legal">
                  <p>
                      <a href="https://secure.gamblingcommission.gov.uk/PublicRegister/Search/Detail/40129" target="_blank">NYX Gaming Group is licensed and regulated by the United Kingdom Gambling Commission. Our license status can be viewed by clicking this phrase.</a><br />
                      Copyright 2017 NYX Gaming Group - All Rights Reserved
                  </p>
              </div>
          </div>
        </BrowserRouter>
    );
  }
}

export default App;
