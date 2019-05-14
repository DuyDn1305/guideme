<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Bootstrap Sign in Form with Facebook and Twitter Buttons</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
    <script defer src="https://www.gstatic.com/firebasejs/6.0.2/firebase-auth.js"></script>
    <script defer src="https://www.gstatic.com/firebasejs/6.0.2/firebase-firestore.js"></script>
    <script src="https://www.gstatic.com/firebasejs/5.11.1/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/5.11.1/firebase-database.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script> 
	<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
	<script src="../lib/webchat.js"></script>
    <style type="text/css">
    	.login-form {
    		width: 385px;
    		margin: 30px auto;
    	}
        .login-form form {        
        	margin-bottom: 15px;
            background: #f7f7f7;
            box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
            padding: 30px;
        }
        .login-form h2 {
            margin: 0 0 15px;
        }
        .form-control, .login-btn {
            min-height: 38px;
            border-radius: 2px;
        }
        .input-group-addon .fa {
            font-size: 18px;
        }
        .login-btn {
            font-size: 15px;
            font-weight: bold;
        }
    	.social-btn .btn {
    		border: none;
            margin: 10px 3px 0;
            opacity: 1;
    	}
        .social-btn .btn:hover {
            opacity: 0.9;
        }
    	.social-btn .btn-primary {
            background: #507cc0;
        }
    	.social-btn .btn-info {
    		background: #64ccf1;
    	}
    	.social-btn .btn-danger {
    		background: #df4930;
    	}
        .or-seperator {
            margin-top: 20px;
            text-align: center;
            border-top: 1px solid #ccc;
        }
        .or-seperator i {
            padding: 0 10px;
            background: #f7f7f7;
            position: relative;
            top: -11px;
            z-index: 1;
        }   
    </style>
    <script>
      // Initialize Firebase
       var config = {
        apiKey: "AIzaSyDejD_sOSrt_GSGjyxDJj40nGTYCaJ5MJI",
        authDomain: "guideme1.firebaseapp.com",
        databaseURL: "https://guideme1.firebaseio.com",
        projectId: "guideme1",
        storageBucket: "guideme1.appspot.com",
        messagingSenderId: "283911475239",
        appId: "1:283911475239:web:d08fa5d4aa81e905"
      };
      firebase.initializeApp(config);
      let database = firebase.database();
    </script>
  <script type="text/javascript">
    var email = null;
    var login = 0;
    var password = null;
    var cmnd = null
    var dob = null;
    var fullname = null;
    var uid = null;
    var type = null;
    var job = null;
    var workplace = null;
    var fb = null;
    var ig = null;
    var twitter = null;
    var positionLat = 10.003115; 
    var positionLng = 105.775900;
    function handleSignUp() {
      fullname = document.getElementById('username').value;
      email = document.getElementById('email').value;
      password = document.getElementById('password').value;
      cmnd = document.getElementById('cmnd').value;
      dob = document.getElementById('dob').value.toString();
      job = document.getElementById('job').value;
      workplace = document.getElementById('workplace').value;
      ig = document.getElementById('ig').value;
      fb = document.getElementById('fb').value;
      twitter = document.getElementById('twitter').value;
      if(document.getElementById('r1').checked){
        type = document.getElementById('r1').value;
      } else type = document.getElementById('r2').value;
      console.log(email + " " + password + " " + cmnd + " " + dob);
      if (email.length < 4) {
        alert('Please enter an email address.');
        return;
      }
      if (password.length < 4) {
        alert('Please enter a password.');
        return;
      }
      if(dob.length < 8){
        alert('Please enter a valid dob.');
        return;
      }
      if(cmnd < 11){
        alert('Please enter cmnd');
        return;
      }
      if(job.length < 4){
        alert('Please enter a job');
        return;
      }
      if(workplace.length < 4){
        alert('Please enter a workplace');
        return;
      }
    if(login){
            var postData = {
                moreinfo:{
                    dob: dob,
                    cmnd: cmnd,
                    password: password,
                    job: job,
                    workplace: workplace,
                    fb: fb,
                    ig: ig,
                    twitter: twitter,
                    type: type,
                    positionLat: 10.003115,  
                    positionLng: 105.775900
                }
            };
            firebase.database().ref('user/' + uid).update(postData);
            window.location = '../';
        } else {
            var user = firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error){
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode == 'auth/weak-password') {
                alert('The password is too weak.');
            } else if(errorMessage.length > 1) {
                 alert(errorMessage);
            } else {
                 alert("Sucessful");
                  firebase.auth().signInWithEmailAndPassword(email, password);
            }
             console.log(error);
            });
        }
    }
    //import * as myModule from '../lib/webchat.min.js';   
    function initApp() {
        WebChat.createUser('testtt', 'testttt', () => console.log('ok'));
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                login = 1;
                document.getElementById('email').value = user.email;
                document.getElementById('username').value = user.displayName;
                var emailVerified = user.emailVerified;
                var photoURL = user.photoURL;
                var isAnonymous = user.isAnonymous;
                uid = user.uid;
                console.log(uid);
                console.log(WebChat.createUser);
               
                //WebChat.createUser(uid, user.displayName);

                // check login aldready
                var check = database.ref('user/'+uid+'/moreinfo');
                check.on('value', function(snapshot) {
                    if (snapshot.val() != null) window.location = '../'
                });

                var providerData = user.providerData;
    
                var postData = {
                    email: email, displayName: fullname, emailVerified: emailVerified,
                    photoURL: photoURL, isAnonymous: isAnonymous, uid: uid, providerData: user.providerData,
                    moreinfo:{
                        dob: dob,
                        cmnd: cmnd,
                        password: password,
                        job: job,
                        workplace: workplace,
                        ig: ig,
                        twitter: twitter,
                        fb: fb,
                        type: type,
                    }
                };
                if(dob != null) {
                    firebase.database().ref('user/' + user.uid).update(postData);
                    window.location = "../";
                }
            } else {
                
            }
        });
        document.getElementById('submit').addEventListener('click', handleSignUp, false);
    }

    window.onload = function() {
      initApp();
    };
  </script>
</head>
<body>
    <div class="login-form">
        <form action="#" method="post">
            <h2 class="text-center">Registration</h2>   
            <div class="form-group">
            	<div class="input-group" style="width:100%;">
                    <input id = "username" type="text" class="form-control" placeholder="Full Name" required="required">				
                </div>
            </div>
    		<div class="form-group">
                <div class="input-group" style="width:100%;">
                    <input type="input" class="form-control" id="email" placeholder="E-Mail Address" required="required">				
                </div>
            </div> 
            <div class="form-group">
                <div class="input-group" style="width:100%;">
                    <input type="password" class="form-control" id="password" placeholder="Password" required="required">             
                </div>
            </div> 
            <div class="form-group">
              <div class="input-group" style="width:100%;">
                  <input placeholder="DOB" class="form-control" type="text" onfocus="(this.type='date')" onblur="(this.type='text')" id="dob" required="required"> 
                </div>
            </div>  
            <div class="form-group">
                <div class="input-group" style="width:100%;">
                    <input type="text" class="form-control" name="cmnd" placeholder="CMND" id = "cmnd" required="required">      
                </div>
            </div>
            <div class="form-group">
                <div class="input-group" style="width:100%;"> 
                    <center><label class="radio-inline"><input type="radio" name = "type" id="r1" value = "visitor" checked>Visitor</label>
                    <label class="radio-inline"><input type="radio" name = "type" id="r2" value = "guide">Guide</label> </center>
                </div>
            </div> 
            <div class="form-group">
                <div class="input-group" style="width:100%;">
                    <input type="text" class="form-control" name="job" placeholder="Job" id = "job" required="required"> 
                </div>
            </div> 
            <div class="form-group">
                <div class="input-group" style="width:100%;">
                    <input type="text" class="form-control" name="workplace" placeholder="Workplace" id = "workplace" required="required">      
                </div>
            </div> 
            <div class="form-group">
                <div class="input-group" style="width:100%;">
                    <input type="text" class="form-control" name="ig" placeholder="Facebook" id = "fb">      
                </div>
            </div>  
            <div class="form-group">
                <div class="input-group" style="width:100%;">
                    <input type="text" class="form-control" name="ig" placeholder="Instagram" id = "ig">      
                </div>
            </div>  
            <div class="form-group">
                <div class="input-group" style="width:100%;">
                    <input type="text" class="form-control" name="twitter" placeholder="Twitter" id = "twitter">      
                </div>
            </div>
            <div class="form-group">
                <button class="btn btn-primary login-btn btn-block" type = "button" id = "submit">Submit</button>
            </div>
        </form>
    </div>
</body>
</html>                            
