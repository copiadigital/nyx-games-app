import React, {Component} from 'react';
import logo from './assets/images/logo.svg';
import Games from './components/games/Games';
import Portfolio from './components/portfolio/Portfolio';
import Service from './components/service/Service';
import HamburgerResponsive from "./components/utilities/HamburgerResponsive";
import {
    BrowserRouter,
    Link,
    Redirect,
    Route,
    Switch
} from 'react-router-dom';
import './assets/sass/App.css';
import GoogleAnalytics from "./components/utilities/GoogleAnalytics";
import CheckAge from "./components/agegate/CheckAge";
import cookie from 'js-cookie';

class App extends Component {

    constructor()
    {
        super();
        this.state = {
            redirect: false
        }
    }

    componentDidMount(){
        if(cookie.get("ageGateConfirmation") && cookie.get("ageGateConfirmation") === "true"){
            console.log("Cool to go!");
        }else{
            this.setState({redirect: true});
        }
    }

    render() {
        return (
            <BrowserRouter>
                <div className="app">
                    {
                        this.state.redirect ?
                             <Redirect to="/checkage"/>
                            :
                        ''
                    }
                    <div className="app-header">
                        <div className="wrapper wrapper--thin">
                            <img src={logo} className="app-logo" alt="SG Digital logo"/>
                            <h2 className="app-title">Game Portal</h2>
                            <HamburgerResponsive
                                maxWidth="1150"
                                toggleComponent={<button type="button" className="nav__toggle">
                                    <span className="icon-bar"></span>
                                    <span className="icon-bar"></span>
                                    <span className="icon-bar"></span>
                                </button>}
                            >
                                <ul className="nav">
                                    <li><Link to="/games">Games</Link></li>
                                    <li><Link to="/portfolio">Portfolio</Link></li>
                                    <li><Link to="/service">Self service</Link></li>
                                    <li><a href="https://www.sgdigital.com/news" target="_blank">News</a></li>
                                    <li><a href="https://www.sgdigital.com/contact" target="_blank">Contact</a></li>
                                </ul>
                            </HamburgerResponsive>
                        </div>
                    </div>
                    <div className="banner">
                        {/* <a className="btn banner-button" href="#findOutMore">Find out now</a> */}
                    </div>
                    <div className="wrapper">
                        <div className="app-body">
                            <Switch>
                                <Route path="/" exact={true} render={() => <Redirect to="/games"/>}/>
                                <Route path="/checkage" component={CheckAge} />
                                <Route path="/games" component={Games}/>
                                <Route exact path="/portfolio/all"
                                       render={(props) => <Portfolio {...props} featured={false}
                                                                     explicitFeatured={false}/>}/>
                                <Route exact path="/portfolio/featured"
                                       render={(props) => <Portfolio {...props} featured={true}
                                                                     explicitFeatured={true}/>}/>
                                <Route exact path="/portfolio" render={(props) => <Portfolio {...props} featured={true}
                                                                                             explicitFeatured={false}/>}/>
                                <Route path="/service" component={Service}/>

                            </Switch>
                        </div>
                    </div>
                    <div className="app-footer">
                        <div className="app-footer__slope"></div>
                        <div className="wrapper">
                            <div className="app-footer__social">
                                <a href="https://www.facebook.com/nyxgg/" title="NYX Gaming on Facebook" target="_blank"
                                   rel="noopener noreferrer">
                                    <span className="footer__social-icon icon icon--facebook">Facebook</span>
                                </a>
                                <a href="https://www.twitter.com/NYXGG" title="NYX Gaming on Twitter" target="_blank"
                                   rel="noopener noreferrer">
                                    <span className="footer__social-icon icon icon--twitter">Twitter</span>
                                </a>
                                <a href="https://www.linkedin.com/company/3136237" title="NYX Gaming on LinkedIn"
                                   target="_blank" rel="noopener noreferrer">
                                    <span className="footer__social-icon icon icon--linkedin">LinkedIn</span>
                                </a>
                            </div>
                            <div className="app-footer__contact">
                                <p>Contact us: <a href="mailto:sales@nyxgg.com">sales@nyxgg.com</a></p>
                            </div>
                        </div>
                    </div>
                    <div className="app-legal">
                        <p>
                            <a href="https://secure.gamblingcommission.gov.uk/PublicRegister/Search/Detail/41115"
                               target="_blank" rel="noopener noreferrer">SG Digital is licensed and regulated by
                                the United Kingdom Gambling Commission. Our license status can be viewed by clicking
                                this phrase.</a><br />
                            © 2018 Scientific Games - All Rights Reserved
                        </p>
                    </div>
                    <GoogleAnalytics />
                </div>
            </BrowserRouter>
        );
    }
}

export default App;
