function guideme_showReqList() {
  db.ref('request/'+user.uid).on('value', snap => {
    reqList = snap.val()
    while (reqBox.children[0] != null) reqBox.children[0].remove()
    
    for (let k in reqList) {
      let req = reqList[k]
      let target = userList[req.target]
      renderReq({displayName: target.displayName, photoURL: target.photoURL}, req.type)
    }
  })
  if (firstLoad) return
  incProBar()
  console.log('showReq.js loaded')
}