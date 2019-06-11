function guideme_editInfo() {
    if (firstLoad) return

    let modal = $(".modal")[2]
    let pen = $(".fa-pen")[0]
    let form = $(".form-group")[0]    
    let btnCancel = $(".btn-light")[0]
    let btnSubmit = $(".btn-primary")[0]
    let btnReset = $(".btn-primary")[0]

    function initForm () {

    }

    pen.onclick = () =>  {
        console.log('ok')
        $(modal).css('display','block')
    }
    window.addEventListener('click', event => {
        if (event.target == modal || event.target == btnCancel) {
            $(modal).css('display', 'none')
        } 
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