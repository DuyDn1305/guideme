class Profile {
  constructor(newUser = user, newProfile = profilePane) {
    this.user = newUser,
    this.profile = newProfile
  }
  getInfo() {
    let user = this.user
    let avatar = this.profile.children[0].children[0]
      avatar.src = user.photoURL
    let about = this.profile.children[1]
      about.children[0].innerHTML = user.displayName
      about.children[1].innerHTML = user.quote || 'NICE TO MEET YOU'
      about.children[2].children[0].children[0].innerHTML = 23 // comments
      about.children[2].children[1].children[0].innerHTML = 23 // rates
      about.children[2].children[2].children[0].innerHTML = 23 // stars
    let link = this.profile.children[2]
      let moreinfo = user.moreinfo
      let linkInfo = [moreinfo.fb, moreinfo.twitter, moreinfo.ig, user.email]
      for (let k in [0, 1, 2, 3]) {
        if (linkInfo[k] != null) {
          link.children[k].style.display = 'block'
          link.children[k].children[1].attributes.href = linkInfo[k]
          link.children[k].children[2].innerHTML = linkInfo[k]
          link.children[k].onhover = () => {
            link.children[k].children[2].style.display = 'block'
          }
        }
      }
    let info = this.profile.children[3]
      let year = new Date(user.moreinfo.dob).getFullYear()
      let thisYear = new Date()
      info.children[0].children[1].innerHTML = thisYear-year // age
      info.children[1].children[1].innerHTML = moreinfo.cmnd // chung minh nhan dan
      info.children[2].children[1].innerHTML = moreinfo.cmnd // dob
      info.children[3].children[1].innerHTML = moreinfo.workplace // workplace
      info.children[4].children[1].innerHTML = moreinfo.telephone // telephone
      info.children[5].innerHTML = moreinfo.type // status
  }
}

function guideme_showInfo (flag) {
  if (flag) return;
  profilePane = new Profile()
  profilePane.getInfo()
  incProBar();
  console.log('myInfo.js loadded')
}