let database = firebase.database();
/*
var user = database.ref('user/6aSBkuIN5PUf8LWoYiurHCgP5BF2');
user.on('value', function(snapshot) {
  console.log(snapshot.val())
  listUsers = snapshot.val()  
});
*/

setTimeout(() => {
  //console.log(database)
  firebase.auth().onAuthStateChanged(function(user) {
    console.log(firebase.auth());
    var name, email, photoUrl, uid, emailVerified;
    if (user) {
      name = user.displayName;
      email = user.email;
      photoUrl = user.photoUrl;
      emailVerified = user.emailVerified;
      uid = user.uid;
      console.log(name + " " + email + " " + uid);
    }
    else console.log('faild to log')
  })
}, 3000)