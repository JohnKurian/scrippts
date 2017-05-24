import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';



// import Textarea from 'react-textarea-autosize';

import { Input } from 'antd/lib/input';

import { Layout } from 'antd';
const { Header, Footer, Sider, Content } = Layout;


// https://www.npmjs.com/package/babel-plugin-import




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
                                    {/*<Textarea/>*/}
                                    {/*<Input*/}
                                        {/*type="textarea"*/}
                                        {/*autosize={true}*/}
                                        {/*onFocus={function(node) {*/}
                                            {/*console.log('yey:', this.refs)*/}
                                            {/*}.bind(this)*/}
                                        {/*}*/}
                                        {/*onChange={this.onchange.bind(node.data, this)}*/}
                                    {/*/>*/}
                                    {node.data}
                                    {<Node data={node.children} ref={Math.random()}/>}
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

        <Layout>
            <Sider>Sider</Sider>
            <Layout>
                <Header>Header</Header>
                <Content>

                    <div className="App">
                        <div className="tree">
                            <Node data={this.state.tree} ref={Math.random()}/>
                        </div>
                    </div>


                </Content>
                <Footer>Footer</Footer>
            </Layout>
        </Layout>


        );
    }
}

export default App;
