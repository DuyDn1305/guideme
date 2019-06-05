class Profile {
  constructor(newUser = user, newProfile = profilePane) {
    this.user = newUser,
    this.profile = newProfile
  }
  getInfo() {
    let user = this.user // avatar
    let avatar = this.profile.children[0].children[0]
      avatar.src = user.photoURL
    let about = this.profile.children[1] // about
      about.children[0].innerHTML = user.displayName // name
      about.children[2].children[0].innerHTML = user.quote || 'NICE TO MEET YOU' //quote
      about.children[3].children[0].children[0].innerHTML = 23 // comments
      about.children[3].children[1].children[0].innerHTML = 23 // stars
    let link = this.profile.children[2] // links
      let moreinfo = user.moreinfo
      let data = [moreinfo.fb, moreinfo.twitter, moreinfo.ig, user.email] 
      data.forEach((value, k) => {
        if (value) {
          link.children[k].style.display = 'block'
          link.children[k].children[1].attributes.href = value
          link.children[k].children[2].innerHTML = value
          link.children[k].onhover = () => {
            link.children[k].children[2].style.display = 'block'
          }
        }
      })
    let info = this.profile.children[3] // info
      let year = moreinfo.dob.slice(0, 4)
      let thisYear = new Date().getFullYear()
      data = [thisYear-year, moreinfo.cmnd, moreinfo.dob, moreinfo.workplace, moreinfo.telephone, moreinfo.type]
      data.forEach((e, k) => {
        if (e) info.children[k].children[1].innerHTML = e
        else info.children[k].style.display = 'none'
      })
  }
}

function guideme_showInfo () {
  if (firstLoad) return;
  profilePane = new Profile()
  profilePane.getInfo()
  incProBar();
  console.log('myInfo.js loaded')
}