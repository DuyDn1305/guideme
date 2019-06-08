function guideme_request () {
    if (firstLoad) return;

    // type = [req, waiting, accepted, complete, cancel]
    window.sendingRequest =  (req) => {
        let newReqRef = reqListRef.push()
        newReqRef.set({type: req.type, time: String(req.time), target: req.receiver, isNew: 1});
        db.ref('request/'+req.receiver+'/'+newReqRef.key).update({type: req.type, time: String(req.time), target: user.uid, isNew: 1})
    }

    function acceptingRequest (req) {
        db.ref('request/'+user.uid+'/'+req.key).update({type: 'accepted', time: String(req.time), target: req.receiver, isNew: 1})
        db.ref('request/'+req.receiver+'/'+req.key).update({type: 'accepted', time: String(req.time), target: user.uid, isNew: 1})
    }

    function cancelingRequest (req) {
        db.ref('request/'+user.uid+'/'+req.key).update({type: 'canceled', time: String(req.time), target: req.receiver, isNew: 1})
        db.ref('request/'+req.receiver+'/'+req.key).update({type: 'canceled', time: String(req.time), target: user.uid, isNew: 1})
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
                    let action = newElement("SPAN", 'action', ' sent you a request')
                info.append(action)
            content.append(info)
        req.append(content)
            let btn = newElement("DIV",  "btn")
                let btnAccept = newElement("DIV", "btnAccept", "Accept")
                btnAccept.onclick = () => {
                    accpetingRequest({type: 'accepted', receiver: target.uid, time: new Date(), key: data.key})
                    req.remove()
                    console.log('accepted request')
                }
                let btnDecline = newElement("DIV", "btnDecline", "Decline")
                btnDecline.onclick = () => {
                    cancelingRequest({type: 'canceled', receiver: target.uid, time: new Date(), key: data.key})
                    req.remove()
                    console.log('canceled request')
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
                    let action = newElement("SPAN", 'action', ' are responding your request')
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
        console.log('created waiting')   
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
            let btn = newElement("DIV",  "btn")
                btn.append(newElement("DIV", "btnAccept", "Trip started <i class='fas fa-walking'></i>"))
        req.append(btn)
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
            let btn = newElement("DIV",  "btn")
                btn.append(newElement("DIV", "btnAccept", "Trip completed <i class='fas fa-check'></i>"))
        req.append(btn)
        if (data.key) req.setAttribute('reqId', data.key)
        reqBox.prepend(req)
        console.log('created complte')
    }

    function createCanceled(target, data, key) {
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
                let btn = newElement("DIV",  "btn")
                    btn.append(newElement("DIV", "btnAccept", "Trip canceled <i class='far fa-frown-open'></i>"))
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
                if (realtime) addPopup(target, ' sent you a request', data.time)
            }
            else {
                createWaiting(target, data)
            }
        }
        if (data.type == 'accepted') {
            createAccepted(target, data)
            addNoti(target, 'start', data.time)
            if (realtime) {
                if (user.moreinfo.type == 'visitor') addPopup(target, ' accepted your request')
                else addPopup(target, ' i am your visitor')
            }
        }
        if (data.type == 'canceled') {
            createCanceled(target, data)
            addNoti(target, 'reject', data.time)
            if (realtime && user.moreinfo.type == 'visitor') addPopup(target, ' rejected your request')
        }
    }
    
    incProBar()
    console.log('request.js loaded')
}