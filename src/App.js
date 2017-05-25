import React, { Component } from 'react';
import './App.css';
import './Node.css'


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

            <div className="App">
                <div className="tree">
                    <Node data={this.state.tree}/>
                </div>
            </div>


        );
    }
}

export default App;
