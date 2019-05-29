ready.push(flag => {
  if (flag) return;
  logOut.onclick = () => {
    firebase.auth().signOut();
    window.location = './mainpage'
    console.log('ok')
  }
  console.log('logOut.js loaded')
})