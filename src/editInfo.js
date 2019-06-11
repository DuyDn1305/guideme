function guideme_editInfo() {
    if (firstLoad) return

    let btnSubmit = $(".btn-primary")[0]
    let btnReset = $(".btn-primary")[0]

    let tmp = $("#editModal")
    window.loadData = () => {
        $(tmp).find('[placeholder="Full Name"]').val(user.displayName)
        $(tmp).find('[placeholder="quote" ]').val(user.quote)
        $(tmp).find('[placeholder="dob"]').val(user.moreinfo.dob)
        $(tmp).find('[placeholder="cmnd"]').val(user.moreinfo.cmnd)
        $(tmp).find('[placeholder="fb name"]').val(user.moreinfo.fbName)
        $(tmp).find('[placeholder="fb URL"]').val(user.moreinfo.fbURL)
        $(tmp).find('[placeholder="tw name"]').val(user.moreinfo.twName)
        $(tmp).find('[placeholder="tw URL"]').val(user.moreinfo.twURL)
        $(tmp).find('[placeholder="ig name"]').val(user.moreinfo.igName)
        $(tmp).find('[placeholder="ig URL"]').val(user.moreinfo.igURL)
        $(tmp).find('[placeholder="email"]').val(user.email)
        $(tmp).find('[placeholder="workplace"]').val(user.moreinfo.workplace)
        $(tmp).find('[placeholder="job"]').val(user.moreinfo.job)
    }

    window.addEventListener('click', event => {
        if (event.target == btnSubmit) {
            // update to fb
        }
        if (event.target == btnReset) {
            loadData()
        }
    })

    incProBar()
    console.log('editInfo.js loadded')
}