/**
 * Created by john on 5/23/17.
 */

var firebase = require("firebase");

var config = {
    apiKey: " AIzaSyD-YSGgW0aQIiiaeFuKCdTTONi-ViN5xzQ",
    authDomain: "argument-staging.firebaseapp.com",
    databaseURL: "https://argument-staging.firebaseio.com",
    storageBucket: "argument-staging.appspot.com",
};
firebase.initializeApp(config);



var database = firebase.database();

tree = {0: {data: "parent", children: [{data: "child1", children: {0: {data: "grandchild2"}}}, {data: "child2", children: {0: {data: "grandchild2"}}}]}};

// firebase.database().ref('test/').update(tree);




var list = [];



// ref.set({'check': 'this'})

firebase.database().ref().child('test').once('value', function(snap) { console.log(snap.val()) });

