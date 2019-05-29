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
let user, chat, ready = [];

firebase.auth().onAuthStateChanged(currentUser => {
  if (currentUser) {
    user = currentUser
    db.ref('user').on('value', snap => {
      list.uid = []; list.data = {}
      snap = snap.val()
      for (let k in snap) {
        list.uid.push(k);
        list.data[k] = snap[k];
      }
      ready.forEach(e => e());
    });
  } else {
    console.log('faild to log')
    window.location = './mainpage'
  }
})

function newElement (type, classname = '', context = '') {
  let newEle = document.createElement(type)
  newEle.setAttribute('class', classname)
  newEle.innerHTML = context
  return newEle
}

let header, menu, mesBtn, notiBtn, chatContainer, mesOnMesBox, containerSearch, cardContainer, toolbarCard, logOut, profilePane, xMap, map, infoWindow;

ready.push(() =>  {
  chat = new WebChat(user.uid);
  header = document.getElementsByClassName('header')[0]
  menu = header.children[1]
  // messager button
  mesBtn = menu.children[0]
  // noti button
  notiBtn = menu.children[1]
  // chat container including 2 chat
  chatContainer = document.body.getElementsByClassName('chat-container')[0]
  // chat
  mesOnMesBox = []
  // right pane
  containerSearch = document.body.children[1].children[2].children[1]
  cardContainer = containerSearch.children[0]
  // mes click (card)
  toolbarCard
  logOut = menu.lastElementChild
  //left pane
  profilePane = document.getElementsByClassName('profile')[0]
  xMap = document.getElementsByClassName('map')[0];
  console.log('index');
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
})

console.log('index.js');