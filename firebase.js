const {initializeApp} = require('firebase/app')
const {getFirestore, collection, getDocs, getDoc,
    addDoc, deleteDoc, doc, query, where, onSnapshot} =
    require('firebase/firestore')

const {getAuth, signInWithEmailAndPassword, signOut} = require('firebase/auth')

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
    const auth = getAuth()

        signInWithEmailAndPassword(auth, process.env.EMAIL, process.env.PASSWORD).then((cred)=>{
        /*  console.log(cred.user.uid)*/
        const uid = auth.currentUser.uid
        /*    console.log('uid: ' + uid)*/
    })
        .catch((error)=>{
            console.log(error)
        })
}

async function realTimeUsernames(){
    const colRef = collection(db, 'usernames')
    onSnapshot(colRef, (snapshot)=>{
        snapshot.docs.forEach((doc)=>{
            console.log('data changed!')
            console.log(doc.data())
        })
    })

}

async function realTimeStorage(){
    console.log('lmfaouhm2')
    const colref = collection(db, 'storage');
    onSnapshot(colref, (snapshot)=>{
        snapshot.docs.forEach((doc)=>{
            console.log('lmfao')
            console.log(doc.data())
        })
    })
}


function wait(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function test(){
    await signIn();
    await wait(4000)
    await realTimeUsernames()
}

exports.test=test;


