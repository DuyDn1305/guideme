console.log('myInfo.js loadded')

function updateUserInfo(user) {
  // get element
  let myAvatar = profilePane.children[0].children[0]
  let myTable = profilePane.children[1].children[0]
  let link = profilePane.children[2]
  let info = profilePane.children[3]
  // change
  // avatar
  myAvatar.setAttribute('src', user.photoURL)
  // name
  myTable.children[0].innerHTML = user.displayName
  
}