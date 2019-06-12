function guideme_editInfo() {
    if (firstLoad) return

    function getValue(element, value) {
        if (!element.val()) element.val(value);
    }

    let btnSubmit = $(".btn-primary")[0]
    let btnReset = $(".btn-secondary")[0]

    let tmp = $("#editModal");
    let name = tmp.find('[placeholder="Full Name"]');
    let quote = tmp.find('[placeholder="quote"]');
    let dob = tmp.find('[placeholder="dob"]');
    let cmnd = tmp.find('[placeholder="cmnd"]');
    let fbName = tmp.find('[placeholder="fb name"]');
    let fbUrl = tmp.find('[placeholder="fb URL"]');
    let twName = tmp.find('[placeholder="tw name"]');
    let twUrl = tmp.find('[placeholder="tw URL"]');
    let igName = tmp.find('[placeholder="ig name"]');
    let igUrl = tmp.find('[placeholder="ig URL"]');
    let email = tmp.find('[placeholder="email"]');
    let workplace = tmp.find('[placeholder="workplace"]');
    let job = tmp.find('[placeholder="job"]');

    $('.fa-pen').on('click', () => {
        getValue(name, user.displayName)
        getValue(quote, user.quote)
        getValue(dob, user.moreinfo.dob)
        getValue(cmnd, user.moreinfo.cmnd)
        getValue(fbName, user.moreinfo.fbName)
        getValue(fbUrl, user.moreinfo.fbURL)
        getValue(twName, user.moreinfo.twName)
        getValue(twUrl, user.moreinfo.twURL)
        getValue(igName, user.moreinfo.igName)
        getValue(igUrl, user.moreinfo.igURL)
        getValue(email, user.email)
        getValue(workplace, user.moreinfo.workplace)
        getValue(job, user.moreinfo.job)
    });

    let form = $('.was-validated')[0];
    btnSubmit.onclick = () => {
        if (form.checkValidity()) {
            profilePane.style.opacity = '0.5';
            db.ref("user/"+user.uid).update({
                displayName: name.val(),
                quote: quote.val(),
                email: email.val(),
                moreinfo: {
                    dob: dob.val(),
                    cmnd: cmnd.val(),
                    fbName: fbName.val(),
                    fbURL: fbUrl.val(),
                    twName: twName.val(),
                    twURL: twUrl.val(),
                    igName: igName.val(),
                    tgURL: igUrl.val(),
                    workplace: workplace.val(),
                    job: job.val(),
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
        name.val(user.displayName)
        quote.val(user.quote)
        dob.val(user.moreinfo.dob)
        cmnd.val(user.moreinfo.cmnd)
        fbName.val(user.moreinfo.fbName)
        fbUrl.val(user.moreinfo.fbURL)
        twName.val(user.moreinfo.twName)
        twUrl.val(user.moreinfo.twURL)
        igName.val(user.moreinfo.igName)
        igUrl.val(user.moreinfo.igURL)
        email.val(user.email)
        workplace.val(user.moreinfo.workplace)
        job.val(user.moreinfo.job)
    }

    incProBar()
    console.log('editInfo.js loadded')
}