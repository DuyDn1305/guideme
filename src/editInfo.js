function guideme_editInfo() {
    if (firstLoad) return

    function getValue(element, value) {
        if (!element.val()) element.val(value);
    }

    let btnSubmit = $(".btn-primary")[0]
    let btnReset = $(".btn-secondary")[0]

    let tmp = $("#editModal")
    window.loadData = () => {
        getValue(tmp.find('[placeholder="Full Name"]'), user.displayName)
        getValue(tmp.find('[placeholder="quote" ]'), user.quote)
        getValue(tmp.find('[placeholder="dob"]'), user.moreinfo.dob)
        getValue(tmp.find('[placeholder="cmnd"]'), user.moreinfo.cmnd)
        getValue(tmp.find('[placeholder="fb name"]'), user.moreinfo.fbName)
        getValue(tmp.find('[placeholder="fb URL"]'), user.moreinfo.fbURL)
        getValue(tmp.find('[placeholder="tw name"]'), user.moreinfo.twName)
        getValue(tmp.find('[placeholder="tw URL"]'), user.moreinfo.twURL)
        getValue(tmp.find('[placeholder="ig name"]'), user.moreinfo.igName)
        getValue(tmp.find('[placeholder="ig URL"]'), user.moreinfo.igURL)
        getValue(tmp.find('[placeholder="email"]'), user.email)
        getValue(tmp.find('[placeholder="workplace"]'), user.moreinfo.workplace)
        getValue(tmp.find('[placeholder="job"]'), user.moreinfo.job)
    }

    let form = $('.was-validated')[0];
    btnSubmit.onclick = () => {
        if (form.checkValidity()) {
            profilePane.style.opacity = '0.5';
            db.ref("user/"+user.uid).update({
                displayName: tmp.find('[placeholder="Full Name"]').val(),
                quote: tmp.find('[placeholder="quote" ]').val(),
                email: tmp.find('[placeholder="email"]').val(),
                moreinfo: {
                    dob: tmp.find('[placeholder="dob"]').val(),
                    cmnd: tmp.find('[placeholder="cmnd"]').val(),
                    fbName: tmp.find('[placeholder="fb name"]').val(),
                    fbURL: tmp.find('[placeholder="fb URL"]').val(),
                    twName: tmp.find('[placeholder="tw name"]').val(),
                    twURL: tmp.find('[placeholder="tw URL"]').val(),
                    igName: tmp.find('[placeholder="ig name"]').val(),
                    tgURL: tmp.find('[placeholder="ig URL"]').val(),
                    workplace: tmp.find('[placeholder="workplace"]').val(),
                    job: tmp.find('[placeholder="job"]').val(),
                    type: user.moreinfo.type
                }
            }, error => {
                if (!error) {
                    profilePane.style.opacity = '1';
                    tmp.find('.close').click();
                }
            });
        } else {
            form.reportValidity();
        }
    }

    btnReset.onclick = () => {
        tmp.find('[placeholder="Full Name"]').val(user.displayName)
        tmp.find('[placeholder="quote" ]').val(user.quote)
        tmp.find('[placeholder="dob"]').val(user.moreinfo.dob)
        tmp.find('[placeholder="cmnd"]').val(user.moreinfo.cmnd)
        tmp.find('[placeholder="fb name"]').val(user.moreinfo.fbName)
        tmp.find('[placeholder="fb URL"]').val(user.moreinfo.fbURL)
        tmp.find('[placeholder="tw name"]').val(user.moreinfo.twName)
        tmp.find('[placeholder="tw URL"]').val(user.moreinfo.twURL)
        tmp.find('[placeholder="ig name"]').val(user.moreinfo.igName)
        tmp.find('[placeholder="ig URL"]').val(user.moreinfo.igURL)
        tmp.find('[placeholder="email"]').val(user.email)
        tmp.find('[placeholder="workplace"]').val(user.moreinfo.workplace)
        tmp.find('[placeholder="job"]').val(user.moreinfo.job)
    }

    incProBar()
    console.log('editInfo.js loadded')
}