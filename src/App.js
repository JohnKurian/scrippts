import React, { Component } from 'react';
import './App.css';
import './Node.css';
import './Layout.css';


var firebase = require("firebase");

var config = {
    apiKey: "AIzaSyAg-UlKP9oonj4IMo5op6qEAOzFXHZloiY",
    authDomain: "argument-app.firebaseapp.com",
    databaseURL: "https://argument-app.firebaseio.com",
    projectId: "argument-app",
    storageBucket: "argument-app.appspot.com",
    messagingSenderId: "626987124454"
};

firebase.initializeApp(config);




class Node extends Component {


    onChange = (node, evt) => {
        console.log('value:', evt.target.value)
        console.log(node)

    }


    onTextAreaClick(node, evt) {
        console.log('text area clicked:', evt.target.style.height, evt.target.style.width)
    }

    onFocus(node, evt) {
        console.log('onFocus')
    }

    onBlur(node, evt) {
        console.log('onBlur')
    }

    onAddClick(node, evt) {
        console.log('node:', node);

        //create path string
        let pathStr = Object.keys(node.path).join('/children/')


        let tempRef = firebase.database().ref().child('test_1').child(pathStr).child('children').push();

        //create path obj for the new child node
        let pathObj = node.path;
        pathObj[tempRef.key] = Date.now();

        let obj = {
            uid: tempRef.key,
            text: '',
            path: pathObj
        };

        //add child to parent
        tempRef.set(obj);

    }


    render() {

        if(this.props.data==undefined) {
            return null;
        }


        return (
            <ul>
                {

                    Object.keys(this.props.data).map(function(key, index) {

                        let node = this.props.data[key]

                        return (
                            <li>
                                    <textarea
                                        onFocus={this.onFocus.bind(this, node)}
                                        onBlur={this.onBlur.bind(this, node)}
                                        onChange={this.onChange.bind(this, node)}
                                        onClick={this.onTextAreaClick.bind(this, node)}>

                                    </textarea>
                                <button onClick={this.onAddClick.bind(this, node)} type="button">Add node</button>
                                {<Node data={node.children}/>}
                            </li>
                        )
                    }.bind(this))

                }
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

        firebase.database().ref().child('test_1').on('value', function(snap) {
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
