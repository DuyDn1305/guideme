function guideme_logout(flag) {
  if (flag) return;
  logOut.onclick = () => {
    firebase.auth().signOut();
    window.location = './mainpage'
    console.log('ok')
  }

  incProBar();
  console.log('logOut.js loaded')
}