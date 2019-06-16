function guideme_menuHandler() {
  if (firstLoad) return;
  mesBox = document.getElementsByClassName('mes-box')[0]
  notiBox = document.getElementsByClassName('noti-box')[0]
  reqBox = document.getElementsByClassName('req-box')[0]
  let box = [mesBox, notiBox, reqBox]

  box.forEach((e, k) => {
    menu.children[k].children[0].onclick = function () {
      if (e.style.display == 'none') {
        e.style.display = 'block'
        menu.children[k].children[0].style.color = 'white'
        menu.children[k].children[0].style.textShadow = '#ecf0f1 0 0 4px'
      }
      else {
        e.style.display = 'none'
        menu.children[k].children[0].style.color = '#bdc3c7'
        menu.children[k].children[0].style.textShadow = ''
      }
    }
  })

  window.addEventListener('click', event => {
    if (event.target != messageContainer.children[0] && event.target != mesBox && mesBox.style.display != 'none') {
      mesBox.style.display = 'none'
      menu.children[0].children[0].style.color = '#bdc3c7'
      menu.children[0].children[0].style.textShadow = ''
    }
    if (event.target != notiContainer.children[0] && event.target != notiBox && notiBox.style.display != 'none') {
      notiBox.style.display = 'none'
      menu.children[1].children[0].style.color = '#bdc3c7'
      menu.children[1].children[0].style.textShadow = ''
    }
    if (event.target != reqContainer.children[0] && event.target != reqBox && reqBox.style.display != 'none') {
      if (!reqBox.contains(event.target)) {
        reqBox.style.display = 'none'
        menu.children[2].children[0].style.color = '#bdc3c7'
        menu.children[2].children[0].style.textShadow = ''
      }
    }
  })

  incProBar()
}