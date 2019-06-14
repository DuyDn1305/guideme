function guideme_editInfo() {
    if (firstLoad) return

    function getValue(element, value) {
        if (!element.val()) element.val(value);
    }

    
    let tmp = $("#editModal");
    let btnSubmit = tmp.find(".btn-primary")
    let btnReset = tmp.find(".btn-secondary")
    let name = tmp.find('[placeholder="Tên của bạn"]');
    let quote = tmp.find('[placeholder="Lời chào"]');
    let dob = tmp.find('[placeholder="dob"]');
    let cmnd = tmp.find('[placeholder="Số CMND"]');
    let fbName = tmp.find('[placeholder="Tên facebook"]');
    let fbUrl = tmp.find('[placeholder="Địa chỉ FB"]');
    let twName = tmp.find('[placeholder="Tên twitter"]');
    let twUrl = tmp.find('[placeholder="Địa chỉ TW"]');
    let igName = tmp.find('[placeholder="Tên instaram"]');
    let igUrl = tmp.find('[placeholder="Địa chỉ IG"]');
    let email = tmp.find('[placeholder="email"]');
    let workplace = tmp.find('[placeholder="Nơi làm việc"]');
    let job = tmp.find('[placeholder="Công việc"]');

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

    let form = tmp.find('.was-validated')[0];
    $(btnSubmit).click(function() {
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
    })

    $(btnReset).click(function() {
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
    })

    incProBar()
    console.log('editInfo.js loadded')
}