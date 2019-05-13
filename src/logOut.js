console.log('logOut.js loaded')
logOut.onclick = () => {
  firebase.auth().signOut();
  window.location = './mainpage'
  console.log('ok')
}