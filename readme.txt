Main function:
MENU
-Xem comment ai đó gửi cho một user nào đó
-Xem ai đã rate cho mình
-Xem profile ngta
-Xem tat ca request

REQUSET:
+Send
+Accept or Deny
.accept =>  {
  request float on the top of requset-menu 
  requset-menu change color to GREEN
  messager of sender change color
  +End trip => {
    requset change color
    form popup {
      rate for guide/visitor 
      comment for guide/visitor
    }
  }
}
.deny => requset change color to RED

GOOGLE MAP
-Search place
-Search name
-Map filter (status, distance, take a mark)

RATE 
-pick stars (1 to 5)

COMMENT
-type some text + some pacman :V

MESSAGER
-show all who chatted before on the mess
-status seen or not
-special (this guy is guiding me)

PROFILE (done by duy + ngoc)
-click to inspect popup one's profile 

UPDATE MY PROFILE

*reponsive

*administrator (account, comment, rate, request sort theo thu tu thoi gian)

FRONT-END
+messager
+requset form (send->accpect->deny)
+form (rate, comment)
+google filter
+pop up (done by duy + ngoc)
+show all comments, rates
+profile (user, users) (done by duy)
