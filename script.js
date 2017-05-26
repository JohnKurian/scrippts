/**
 * Created by john on 5/23/17.
 */

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




tree = {0: {data: "parent", children: [{data: "child1", children: {0: {data: "grandchild2"}}}, {data: "child2", children: {0: {data: "grandchild2"}}}]}};

// firebase.database().ref('test/').update(tree);







firebase.database().ref().child('test').set(tree)

// firebase.database().ref().child('test').once('value', function(snap) { console.log(snap.val()) });

