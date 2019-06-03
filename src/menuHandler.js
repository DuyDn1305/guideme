function guideme_menuHandler() {
  if (firstLoad) return;
  let mesBox = document.getElementsByClassName('mes-box')[0]
  let notiBox = document.getElementsByClassName('noti-box')[0]
  let reqBox = document.getElementsByClassName('req-box')[0]
  let box = [mesBox, notiBox, reqBox]

  box.forEach((e, k) => {
    menu.children[k].children[0].onclick = function () {
      if (e.style.display == 'none') {
        e.style.display = 'block'
        menu.children[k].children[0].style.color = 'white'
      }
      else {
        e.style.display = 'none'
        menu.children[k].children[0].style.color = '#bdc3c7'
      }
    }
  })

  window.addEventListener('click', event => {
    if (event.target != messageContainer.children[0] && event.target != mesBox && mesBox.style.display != 'none') {
      console.log(event.target)
      mesBox.style.display = 'none'
      menu.children[0].children[0].style.color = '#bdc3c7'
    }
    if (event.target != notiContainer.children[0] && event.target != notiBox && notiBox.style.display != 'none') {
      notiBox.style.display = 'none'
      menu.children[1].children[0].style.color = '#bdc3c7'
    }
    if (event.target != reqContainer.children[0] && event.target != reqBox && reqBox.style.display != 'none') {
      reqBox.style.display = 'none'
      menu.children[2].children[0].style.color = '#bdc3c7'
    }
  })

  console.log('menuHandler loaded')
  incProBar()
}