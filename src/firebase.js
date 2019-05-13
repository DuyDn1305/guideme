console.log('firebase.js loaded')
loadScript('./src/index.js')

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

db.ref('user').on('value', snap => {
  const list = {
    uid: [],
    data: {}
  }
  snap = snap.val()
  for (let k in snap) {
    list.uid.push(k);
    list.data[k] = snap[k];
  }
  //setTimeout(() => {
  ready(list)
  //}, 3000); 
});

function ready (list) {
  //console.log(list)
  firebase.auth().onAuthStateChanged(function(user) {
    //console.log(firebase.auth());
    var name, email, photoUrl, uid, emailVerified;
    if (user) {
      console.log(user.displayName)
      updateUserInfo(user)
      updateListCard(list)
      /*
      name = user.displayName;
      email = user.email;
      photoUrl = user.photoUrl;
      emailVerified = user.emailVerified;
      uid = user.uid;
      */
      /*
      loadScript('./src/index.js', () => {
        loadScript('./src/myInfo.js', () => {
          loadScript('./src/card.js', () => {
            //updateUserInfo(myinfo)
            //updateListCard(list)
          })
        })
      })*/
    }
    else console.log('faild to log')
  })
  //loadScript(['./card.js', './chat.js', './googleapi.js'])
}