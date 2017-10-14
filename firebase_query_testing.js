/**
 * Created by johnjoy on 15/10/17.
 */


var firebase = require("firebase");
require("firebase/firestore");


var config = {
    apiKey: "AIzaSyAg-UlKP9oonj4IMo5op6qEAOzFXHZloiY",
    authDomain: "argument-app.firebaseapp.com",
    databaseURL: "https://argument-app.firebaseio.com",
    projectId: "argument-app",
    storageBucket: "argument-app.appspot.com",
    messagingSenderId: "626987124454"
};

firebase.initializeApp(config);

var db = firebase.firestore();

//
// db.collection('users').doc('GgiVL4P1MBTcGpRLRwoEa3oXqQE3').collection('scripts').get()
//     .then(function(doc) {
//     if (doc.exists) {
//         console.log("Document data:", doc.data());
//     } else {
//         console.log("No such document!");
//     }
// }).catch(function(error) {
//     console.log("Error getting document:", error);
// });

//
// db.collection("users").get()
//     .then(function(querySnapshot) {
//     querySnapshot.forEach(function(doc) {
//         console.log(doc.id, " => ", doc.data());
//     });
//     })
//     .catch(function (error) {
//         console.log(error)
//     });


let nodes = {




    'sfsdf': {
        children: {
            'last': true,
            'second_last': true
        },
        text: 'seond'
    },

    'root_id': {
        children: {
            'sfsdf': true,
        },
        text: 'premise'
    },

    'temp_node': {
        text: 'temp node'
    },


    'last': {
        text: 'last node'
    },

    'second_last': {
        children: {
          'temp_node': true
        },
        text: 'second last node'
    }
}

let parent_id = 'root_id';


function convertToTree(nodes, parent_id) {
    let tree = nodes[parent_id];
    if(tree.children!==undefined||tree.children!==null) {
        Object.keys(tree.children).map(function (childNodeKey, index) {

            console.log(childNodeKey, index)


            //
            if (nodes[childNodeKey].children != undefined) {


                tree = convertToTree(nodes, childNodeKey)
            }


        });
    }

    return tree;
}




function convertFlatObjectToTree(flat) {
    var tree = {};
    Object.keys(flat).map(function (key, index) {
        var nodeKey = key;
        var node = flat[key];

        tree[key] = node;

        var children = node['children'];

        if(children!=undefined) {
            Object.keys(children).map(function (childNodeKey, index) {

                if (children[childNodeKey] != undefined) {
                    tree[nodeKey]['children'][childNodeKey] = flat[childNodeKey];
                }

            });
        }

    });
    return tree;
}

tree = {}
tree = convertFlatObjectToTree(nodes)
console.log(tree['root_id']['children'])

