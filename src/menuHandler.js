function guideme_menuHandler() {
  if (firstLoad) return;
  let mesBox = document.getElementsByClassName('mes-box')[0]
  let notiBox = document.getElementsByClassName('noti-box')[0]
  let reqBox = document.getElementsByClassName('req-box')[0]
  let box = [mesBox, notiBox, reqBox]

  box.forEach((e, k) => {
    menu.children[k].onclick = function () {
      e.style.display = (e.style.display[0] == 'n') ? 'block' : 'none';
    }
  })

  window.addEventListener('click', event => {
    if (event.target != messageContainer.children[0] && event.target != mesBox && mesBox.style.display != 'none') mesBox.style.display = 'none';
    if (event.target != notiContainer.children[0] && event.target != notiBox && notiBox.style.display != 'none') notiBox.style.display = 'none';
    if (event.target != reqContainer.children[0] && event.target != reqBox && reqBox.style.display != 'none') reqBox.style.display = 'none';
  })

  console.log('menuHandler loaded')
  incProBar()
}