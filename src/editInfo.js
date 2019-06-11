function guideme_editInfo() {
    if (firstLoad) return

    let btnSubmit = $(".btn-primary")[0]
    let btnReset = $(".btn-primary")[0]

    window.addEventListener('click', event => {

        if (event.target == btnSubmit) {
            // update to fb
        }
        if (event.target == btnReset) {
            // re init
        }
    })

    incProBar()
    console.log('editInfo.js loadded')
}