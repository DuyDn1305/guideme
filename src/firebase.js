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
const list = {uid: [], data:{}}
let myInfo = null

db.ref('user').on('value', snap => {
  list.uid = []; list.data = {}
  snap = snap.val()
  for (let k in snap) {
    list.uid.push(k);
    list.data[k] = snap[k];
  }
  ready() 
});

function ready () {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      myInfo = user
      updateUserInfo(user)
      updateListCard(list)
      /*
      loadScript('./src/googleapi.js', () => {
        // load map
        let script = document.createElement('script')
        script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyCxmtSpYlPsOcoFz9knDyQwCbtanPjtwkU&callback=initMap"
        script.async = 'defer'
        document.body.children[1].children[1].removeChild(document.body.children[1].children[1].lastChild)
        document.body.children[1].children[1].append(script)
        focusMe()
      })
      */
      //renderMap()
    } else {
      console.log('faild to log')
      window.location = './mainpage'
    }
  })
  //loadScript(['./card.js', './chat.js', './googleapi.js'])
}