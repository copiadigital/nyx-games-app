import React, { Component } from 'react';
import ReactGA from 'react-ga';
import queryString from 'query-string';

class DemoIFrame extends Component {
    constructor(props){
        super(props);

        this.state = {
        };
    }
    componentDidMount(){
        ReactGA.event({
            category: 'Game',
            action: 'Play demo ' + this.getClientType(this.props.channel),
            label: 'ID:' + this.props.game.id
        });
    }
    getClientType(channel){
        var clientType = 'flash';

        switch(channel){
            case 'html5':
            case 'mobile':
                clientType = 'html5';
                break;
            case 'desktop':
            case 'flash':
            default:
                clientType = 'flash';
                break;
        }

        return clientType;
    }
    buildDemoUrl() {
        const game = this.props.game;
        const channel = this.props.channel;

        var clientType = this.getClientType(channel);

        return 'https://nogs-gl-stage.nyxmalta.com/game/?' + queryString.stringify({
                nogsoperatorid: 241,
                nogsgameid: game.id,
                nogsmode: 'demo',
                nogslang: 'en_us',
                nogscurrency: 'USD',
                clienttype: clientType
            });
    }
    // componentDidMount() {
    //
    //     var windowResizer = function(){
    //         console.log("function called");
    //         var gameIframe = document.getElementsByClassName("gameContent");
    //         if (gameIframe[0] != null) {
    //             var containerFullScreen = document.getElementsByClassName("container-fullscreen");
    //             if (containerFullScreen[0] == null) {
    //                 var width = '100%';
    //                 var height = '100%';
    //             } else {
    //                 var width = document.documentElement.clientWidth;
    //                 var height = document.documentElement.clientHeight;
    //             }
    //
    //             gameIframe[0]
    //                 .contentWindow
    //                 .postMessage(JSON.stringify({"msgId": "windowSizeChanged", "width": width, "height": height}), "*");
    //             document.getElementsByClassName("gameContent")[0].width = width;
    //             document.getElementsByClassName("gameContent")[0].height = height;
    //         }
    //     }
    //
    //     window.addEventListener("message", function(event)
    //     {
    //         var objMessage  = JSON.parse(event.data);
    //
    //         switch (objMessage.msgId)
    //         {
    //             case "gameLoaderReady":
    //                 windowResizer();
    //                 break;
    //         }
    //     });
    //
    //
    //     //when the modal is opened add the event listener to resize game on window resize
    //     window.addEventListener("resize", windowResizer);
    //     //when the modal is opened call the windowResizer Method to set the correct width and height of the game
    //     windowResizer();
    // }

    setIframeSize() {
        
        var containerFullScreen = document.getElementsByClassName("container-fullscreen");
        if (containerFullScreen[0] == null) {
            var width = '100%';
            var height = '100%';
        } else {
            var width = document.documentElement.clientWidth;
            var height = document.documentElement.clientHeight;
        }

        if (this.ifr) {
            this.ifr.contentWindow.postMessage(JSON.stringify({
                "msgId": "windowSizeChanged",
                "width": width,
                "height": height
            }), "*");
            this.ifr.width = width;
            this.ifr.height = height;
            console.log("set iframe size");
        }
    }

    handleFrameResize = (event) => {
        var objMessage  = JSON.parse(event.data);

        switch (objMessage.msgId)
        {
            case "gameLoaderReady":
                this.setIframeSize();
                break;
        }
    }

    componentWillUnmount() {
        window.removeEventListener('message', this.handleFrameResize);
    }

    componentDidMount() {

        this.ifr.onload = () => {
            this.setIframeSize();
        };

        window.addEventListener("message", this.handleFrameResize);
        window.addEventListener("resize", this.setIframeSize);
    }


    render() {
        const game = this.props.game;
        const channel = this.props.channel;

        //return <iframe className="gameContent" src={this.buildDemoUrl()} width="100%" height="100%" title={`${game.name} ${channel} demo`}></iframe>

        return <iframe className="gameContent" ref={(f) => { this.ifr = f; }} src={this.buildDemoUrl()} width="100%" height="100%" title={`${game.name} ${channel} demo`}></iframe>
    }
}

export default DemoIFrame;
