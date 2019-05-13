console.log('firebase.js loaded')
var config = {
  apiKey: "AIzaSyDejD_sOSrt_GSGjyxDJj40nGTYCaJ5MJI",
  authDomain: "guideme1.firebaseapp.com",
  databaseURL: "https://guideme1.firebaseio.com",
  projectId: "guideme1",
  storageBucket: "guideme1.appspot.com",
  messagingSenderId: "283911475239",
  appId: "1:283911475239:web:d08fa5d4aa81e905"
};
firebase.initializeApp(config);

let db = firebase.database();

const list = {
  uid: [],
  data: {}
}

db.ref('user').once('value').then(snap => {
  snap = snap.val()
  for (let k in snap) {
    list.uid.push(k);
    list.data[k] = snap[k];
  }
  //setTimeout(() => {
  ready()
  //}, 3000); 
});

function ready () {
  //console.log(list)
  firebase.auth().onAuthStateChanged(function(user) {
    //console.log(firebase.auth());
    var name, email, photoUrl, uid, emailVerified;
    if (user) {
      
      const myinfo = user
      /*
      name = user.displayName;
      email = user.email;
      photoUrl = user.photoUrl;
      emailVerified = user.emailVerified;
      uid = user.uid;
      */
      console.log(user.displayName)
      loadScript('./src/index.js', () => {
        loadScript('./src/myInfo.js', () => {
          updateUserInfo(myinfo)
          updateListCard(list)
        })
      })
    }
    else console.log('faild to log')
  })
  //loadScript(['./card.js', './chat.js', './googleapi.js'])
}