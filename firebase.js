const {initializeApp} = require('firebase/app')
const {getFirestore, collection, getDocs, getDoc,
    addDoc, deleteDoc, doc, query, where, onSnapshot} =
    require('firebase/firestore')

const {getAuth, signInWithEmailAndPassword, signOut} = require('firebase/auth')
const dotenv = require('dotenv');
const {del} = require("express/lib/application");
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
    const auth = getAuth()

    try {
        const userCredential = await signInWithEmailAndPassword(auth, process.env.EMAIL, process.env.PASSWORD)
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

async function registerDiscordUser(discordAccessToken, discordRefreshToken, discordUsername, discordId){
    const colref = collection(db, 'storage');
    const documentDataDocumentReference = await addDoc(colref, {
        'discordAccessToken': discordAccessToken,
        'discordRefreshToken': discordRefreshToken,
        'discordUsername': discordUsername,
        'discordId': discordId
    });
    console.log('added document with id: ' + documentDataDocumentReference.id)
}


async function findRefreshToken(discordId){
    //todo: remove hardcoded values here




    return refreshToken;
}

async function findToken(discordId){
    const colref = collection(db, 'storage');
    const q = query(colref, where("discordId", "==", "969232481045856326"))
    let idToDelete;

    return new Promise((resolve, reject)=>{
        onSnapshot(q, (snapshot)=>{
            if(!snapshot.empty){
                resolve(snapshot.docs[0].id)
            } else {
                resolve(null)
            }
            }, (error)=>{
            reject(error)
        })
        })
    }





async function deleteIf(idToDelete){
    console.log('id to delete: ' + idToDelete)
    const docRef = doc(db, 'storage', idToDelete);
    await deleteDoc(docRef)
    return 1;

}





exports.signIn=signIn;
exports.realTimeUsernames=realTimeUsernames;
exports.realTimeStorage=realTimeStorage;
exports.registerDiscordUser=registerDiscordUser;
exports.findRefreshToken=findRefreshToken;
exports.findToken = findToken
exports.deleteIf=deleteIf;


