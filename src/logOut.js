function guideme_logout() {
  if (firstLoad) return;
  logOut.onclick = () => {
    firebase.auth().signOut();
    window.location = './mainpage'
  }

  incProBar();
}