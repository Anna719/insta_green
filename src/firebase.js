// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from "firebase";
const firebaseApp=firebase.initializeApp({
    apiKey: "AIzaSyAGDHWfniNpjDFRSnfE8Cw0m-T8meo3SP4",
    authDomain: "instagram-clone-challenge.firebaseapp.com",
    projectId: "instagram-clone-challenge",
    storageBucket: "instagram-clone-challenge.appspot.com",
    messagingSenderId: "471312802904",
    appId: "1:471312802904:web:662e06af7c0c99d624162d",
    measurementId: "G-M9R39LKLF6"
});

const db=firebaseApp.firestore();
const auth=firebase.auth();
const storage = firebase.storage();

export {db,auth,storage};