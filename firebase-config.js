import {
    initializeApp
}
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getFirestore
}
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

import {
    getStorage
}
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-storage.js";

import {
    getAuth
}
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const firebaseConfig = {

    apiKey: "AIzaSyA4abXmCYN7b3FYU8juccXHZ5J1MOerVFk",

    authDomain: "site-lip-c15cb.firebaseapp.com",

    projectId: "site-lip-c15cb",

    storageBucket: "site-lip-c15cb.firebasestorage.app",

    messagingSenderId: "942311211182",

    appId: "1:942311211182:web:f517a03f1ca0d1fefced3f",

    measurementId: "G-Y18R4FRLWG"

};

const app =
    initializeApp(firebaseConfig);

const db =
    getFirestore(app);

const storage =
    getStorage(app);

const auth =
    getAuth(app);

export {

    db,

    storage,

    auth

};