const {initializeApp} = require('firebase/app')
const {getFirestore, collection, getDocs, getDoc,
    addDoc, deleteDoc, doc, query, where, onSnapshot} =
    require('firebase/firestore')

const {getAuth, signInWithEmailAndPassword, signOut} = require('firebase/auth')
const dotenv = require('dotenv');
dotenv.config();


const firebaseConfig = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId,
    measurementId: process.env.measurementId
};

//init firebase app
initializeApp(firebaseConfig)

//init services
const db = getFirestore()

async function signIn(){
    console.log(process.env.apiKey);
    console.log(process.env.EMAIL);
    console.log(process.env.PASSWORD)
    const auth = getAuth()

    try {
        const userCredential = await signInWithEmailAndPassword(auth, process.env.EMAIL, process.env.PASSWORD)
        console.log(userCredential.user.uid)
        return userCredential.user.uid
    }catch(error){
        console.log(error)
        throw error
    }
}

async function realTimeUsernames(){
    const arr = [];
    const colRef = collection(db, 'usernames')
    onSnapshot(colRef, (snapshot)=>{
        snapshot.docs.forEach((doc)=>{
            console.log(doc.data())
            arr.push(doc.data())
        })
        console.log('length: ' + arr.length)
    })
    return arr;
}

async function realTimeStorage(){
    console.log('lmfaouhm2')
    const colref = collection(db, 'storage');
    onSnapshot(colref, (snapshot)=>{
        snapshot.docs.forEach((doc)=>{
            console.log('lmfao')
            /*console.log(doc.data())*/
        })
    })
}

async function registerDiscordUser(accessToken, refreshToken, username, id){
    const colref = collection(db, 'storage');
    const documentDataDocumentReference = await addDoc(colref, {
        'accessToken': accessToken,
        'refreshToken': refreshToken,
        'username': username,
        'id': id
    });
    console.log(documentDataDocumentReference.id)
}





exports.signIn=signIn;
exports.realTimeUsernames=realTimeUsernames;
exports.realTimeStorage=realTimeStorage;
exports.registerDiscordUser=registerDiscordUser;


