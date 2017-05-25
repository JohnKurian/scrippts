import React, { Component } from 'react';
import './App.css';
import './Node.css';
import './Layout.css';


var firebase = require('firebase');



var config = {
    apiKey: " AIzaSyD-YSGgW0aQIiiaeFuKCdTTONi-ViN5xzQ",
    authDomain: "argument-staging.firebaseapp.com",
    databaseURL: "https://argument-staging.firebaseio.com",
    storageBucket: "argument-staging.appspot.com",
};
firebase.initializeApp(config);




class Node extends Component {


    onchange = (data, value) => {
       console.log(value.target.style.height)
        console.log(value.target.style.width)
        console.log(data, value)
    }


    render() {

        if(this.props.data==undefined) {
            return null;
        }


        return (
            <ul>
                {
                    this.props.data.map(
                        function(node) {
                            return (
                                <li>
                                    <textarea></textarea>
                                    {node.data}
                                    {<Node data={node.children}/>}
                                </li>
                            )

                        }.bind(this)

                    )}
            </ul>
        )

    }
}



var Parent = React.createClass({
    getInitialState: function(){
        return {sidebarOpen: false};
    },
    handleViewSidebar: function(){
        this.setState({sidebarOpen: !this.state.sidebarOpen});
    },
    render: function() {
        return (
            <div>
                <Header onClick={this.handleViewSidebar} />
                <SideBar isOpen={this.state.sidebarOpen} />
                <Content isOpen={this.state.sidebarOpen} data={this.props.data}/>
            </div>
        );
    }
});

var Header = React.createClass({
    render: function() {
        return (
            <header>
                <a href="javascript:;" onClick={this.props.onClick}>Click Me!</a>
            </header>
        );
    }
});
var SideBar = React.createClass({
    render: function() {
        var sidebarClass = this.props.isOpen ? 'sidebar open' : 'sidebar';
        return (
            <div className={sidebarClass}>
                <div>I slide into view</div>
                <div>Me too!</div>
                <div>Meee Threeeee!</div>
            </div>
        );
    }
});

var Content = React.createClass({
    render: function() {
        var contentClass = this.props.isOpen ? 'content open' : 'content';
        return (
            <div className={contentClass}>

                <div className="App">
                    <div className="tree">
                        <Node data={this.props.data}/>
                    </div>
                </div>


            </div>
        );
    }
});


class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tree: []
        };
    }


    componentWillMount() {

        firebase.database().ref().child('test').on('value', function(snap) {
            this.setState({tree: snap.val()})
        }.bind(this));

    }



    render() {

        return (

            <Parent data={this.state.tree}/>


        );
    }
}






export default App;
