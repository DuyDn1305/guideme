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
      console.log(user.displayName)
    }
    else console.log('faild to log')
  })
}, 3000)

function getData() {
  var curUID = "";
  var uidlist = "";
  var list = [];
  firebase.database().ref('uidList').once('value').then(function(snapshot) {
    uidlist = snapshot.val();
    for(var i = 1; i < uidlist.length; ++i){
      if(uidlist[i] != '&'){
        curUID += uidlist[i];
      } else {
        list.push(curUID);
        curUID = "";
      }
    }
    list.push(curUID);
  });
  return list
}