ready.push(() => {
  let myAvatar = profilePane.children[0].children[0]
  let myTable = profilePane.children[1].children[0]
  let link = profilePane.children[2]
  let info = profilePane.children[3]
  myAvatar.setAttribute('src', user.photoURL)
  // name
  myTable.children[0].innerHTML = user.displayName
  
  window.getInfo = (target = user) => {
    let profile
    
    return profile
  }

  console.log('myInfo.js loadded')
})