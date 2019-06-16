function guideme_request () {
    if (firstLoad) return;

    // type = [req, waiting, accepted, complete, cancel]
    window.sendingRequest =  (req) => {
        let newReqRef = reqListRef.push()
        newReqRef.set({type: 'req', time: String(req.time), target: req.receiver, isNew: 1});
        db.ref('request/'+req.receiver+'/'+newReqRef.key).update({type: 'req', time: String(req.time), target: user.uid, isNew: 1})
    }

    function acceptingRequest (req) {
        db.ref('request/'+user.uid+'/'+req.key).update({type: 'accepted', time: String(req.time), target: req.receiver, isNew: 1})
        db.ref('request/'+req.receiver+'/'+req.key).update({type: 'accepted', time: String(req.time), target: user.uid, isNew: 1})
        db.ref('user/'+user.uid).update({isBusy: req.receiver})
        db.ref('user/'+req.receiver).update({isBusy: user.uid})
    }

    function cancelingRequest (req) {
        db.ref('request/'+user.uid+'/'+req.key).update({type: 'canceled', time: String(req.time), target: req.receiver, isNew: 1})
        db.ref('request/'+req.receiver+'/'+req.key).update({type: 'canceled', time: String(req.time), target: user.uid, isNew: 1})
    }

    window.completingRequest = (req) => {
        db.ref('request/'+user.uid+'/'+req.key).update({type: 'completed', time: String(req.time), target: req.receiver, isNew: 1, comment: req.comment, rate: req.rate})
        db.ref('request/'+req.receiver+'/'+req.key).update({type: 'completed', time: String(req.time), target: user.uid, isNew: 1, comment: req.comment, rate: req.rate})
        db.ref('user/'+user.uid).update({isBusy: 0})
        db.ref('user/'+req.receiver).update({isBusy: 0})
    }
    // data = {displayName, photoURL}
    function createRequest(target, data) {
        let req = newElement("DIV", "item")
            let content = newElement("DIV", "content")
                let avatarContainer = newElement("DIV", "avatar-container")
                    let avatar = newElement("IMG", "avatar")
                    avatar.src = target.photoURL
                avatarContainer.append(avatar)
            content.append(avatarContainer)
                let info = newElement("DIV", "info")
                    let name = newElement("SPAN", "name", target.displayName) 
                info.append(name)
                    let action = newElement("SPAN", 'action', ' đã gửi một yêu cầu')
                info.append(action)
            content.append(info)
        req.append(content)
            let btn = newElement("DIV",  "btnHolder")
                let btnAccept = newElement("DIV", "btnAccept", "Accept")
                btnAccept.onclick = () => {
                    acceptingRequest({type: 'accepted', receiver: target.uid, time: new Date(), key: data.key})
                    req.remove()
                }
                let btnDecline = newElement("DIV", "btnDecline", "Reject")
                btnDecline.onclick = () => {
                    cancelingRequest({type: 'canceled', receiver: target.uid, time: new Date(), key: data.key})
                    req.remove()
                }
            btn.append(btnAccept)
            btn.append(btnDecline)
            btn.children[1].style.marginLeft = '4px'
        req.append(btn)
        if (data.key) req.setAttribute('reqId', data.key)
        reqBox.prepend(req)
    }

    function createWaiting(target, data) {
        let req = newElement("DIV", "item")
            let content = newElement("DIV", "content")
                let avatarContainer = newElement("DIV", "avatar-container")
                    let avatar = newElement("IMG", "avatar")
                    avatar.src = target.photoURL
                avatarContainer.append(avatar)
            content.append(avatarContainer)
                let info = newElement("DIV", "info")
                    let name = newElement("SPAN", "name", target.displayName) 
                info.append(name)
                    let action = newElement("SPAN", 'action', ' đang phản hồi lời đề nghị')
                info.append(action)
                    let dotLoad = newElement("SPAN", "dotload")
                    for (let i = 0; i < 3; ++i) {
                        let dot = newElement("SPAN", 'dot', '.')
                        dotLoad.append(dot)
                    }
                    action.append(dotLoad)
            content.append(info)
        req.append(content)
        if (data.key) req.setAttribute('reqId', data.key)
        reqBox.prepend(req)
    }

    function createAccepted(target, data) {
        let req = newElement("DIV", "item accepted")
            let content = newElement("DIV", "content")
                let avatarContainer = newElement("DIV", "avatar-container")
                    let avatar = newElement("IMG", "avatar")
                    avatar.src = target.photoURL
                avatarContainer.append(avatar)
            content.append(avatarContainer)
                let info = newElement("DIV", "info")
                    let name = newElement("SPAN", "name", target.displayName) 
                info.append(name)
            content.append(info)
        req.append(content)
            let btn = newElement("DIV",  "btnHolder")
                btn.append(newElement("DIV", "btnAccept", "Chuyến đi bắt đầu <i class='fas fa-walking'></i>"))
        req.append(btn)
        profilePane.children[4].onclick = req.onclick = () => {
            showTripAccepted([user.uid, target.uid], data)
        }
        if (data.key) req.setAttribute('reqId', data.key)
        reqBox.prepend(req)
    }

    function createCompleted(target, data) {
        let req = newElement("DIV", "item complete")
            let content = newElement("DIV", "content")
                let avatarContainer = newElement("DIV", "avatar-container")
                    let avatar = newElement("IMG", "avatar")
                    avatar.src = target.photoURL
                avatarContainer.append(avatar)
            content.append(avatarContainer)
                let info = newElement("DIV", "info")
                    let name = newElement("SPAN", "name", target.displayName) 
                info.append(name)
            content.append(info)
        req.append(content)
            let btn = newElement("DIV",  "btnHolder")
                btn.append(newElement("DIV", "btnAccept", "Chuyến đi kết thúc <i class='fas fa-check'></i>"))
        req.append(btn)
        if (data.key) req.setAttribute('reqId', data.key)
        req.onclick = () => {showTripCompleted([user.uid, target.uid], data)}
        
        reqBox.prepend(req)
    }

    function createCanceled(target, data) {
        let req = newElement("DIV", "item cancel")
            let content = newElement("DIV", "content")
                let avatarContainer = newElement("DIV", "avatar-container")
                    let avatar = newElement("IMG", "avatar")
                    avatar.src = target.photoURL
                avatarContainer.append(avatar)
            content.append(avatarContainer)
                let info = newElement("DIV", "info")
                    let name = newElement("SPAN", "name", target.displayName) 
                info.append(name)
            content.append(info)
            req.append(content)
                let btn = newElement("DIV",  "btnHolder")
                    btn.append(newElement("DIV", "btnAccept", "Chuyến đi bị từ chối <i class='far fa-frown-open'></i>"))
            req.append(btn)
            if (data.key) req.setAttribute('reqId', data.key)
        reqBox.prepend(req)
    }
    // data = {type, key, time}
    window.requestAction = (target, data, realtime = 1) => {
        if (data.type == 'req') {
            if (user.moreinfo.type == 'guide') {
                createRequest(target, data)
                addNoti(target, 'req', data.time)
                if (realtime) addPopup(target, ' gửi bạn một yêu cầu', data.time)
            }
            else {
                createWaiting(target, data)
            }
        }
        if (data.type == 'accepted') {
            $(`[reqid="${data.key}"]`).hide(400, function () {this.remove()})
            createAccepted(target, data)
            addNoti(target, 'start', data.time)
            if (realtime) {
                if (user.moreinfo.type == 'visitor') addPopup(target, ' đã đồng ý yêu cầu của bạn')
                else addPopup(target, ' tôi là visitor của bạn đây')
            }
            // cancel all previous request (for visitor account)
            if (user.moreinfo.type == 'visitor') {
                db.ref('request/'+user.uid).orderByChild('type').equalTo('req').once('value').then(snap => {
                    snap = snap.val()
                    for (let k in snap) {
                        if (k == data.key) continue
                        let req = snap[k]
                        db.ref('request/'+user.uid+'/'+k).update({type: 'canceled', time: String(data.time), target: req.target, isNew: 1})
                        db.ref('request/'+req.target+'/'+k).update({type: 'canceled', time: String(data.time), target: user.uid, isNew: 1})
                    }
                })
            }
        }
        if (data.type == 'canceled') {
            $(`[reqid="${data.key}"]`).hide(400, function () {this.remove()})
            createCanceled(target, data)
            if (target != user.uid) addNoti(target, 'reject', data.time)
            if (realtime && user.moreinfo.type == 'visitor') {
                addPopup(target, ' đã từ chối yêu cầu')
            }
        }
        if (data.type == 'completed') {
            $(`[reqid="${data.key}"]`).hide(400, function () {this.remove()})
            createCompleted(target, data)
            addNoti(target, 'complete', data.time)
            if (realtime) {
                addPopup(target, ' và bạn đã cùng hoàn thành một chuyến đi !')
                $(`[cardid="${target.uid}"]`).find('.fa-paper-plane').css('color', 'white').attr('data-original-title', 'Request guide')
            }
            if (user.moreinfo.type == 'guide') {
                if (realtime) {
                    setTimeout(() => {
                        if (realtime) addPopup(target, 'đã thêm sao cho bạn '+data.rate)
                        setTimeout(() => {
                            if (realtime)  addPopup(target, 'nhận xét rằng: '+data.comment)
                            setTimeout(() => {
                                notiComment(target, data)
                            }, 1000);
                        }, 1000);
                    }, 1000);
                }
                else {
                    notiComment(target, data)
                }
            }
        }
    }

    incProBar()
}