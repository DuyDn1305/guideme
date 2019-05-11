<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Bootstrap Sign in Form with Facebook and Twitter Buttons</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
    <script src="/__/firebase/5.9.3/firebase-app.js"></script>
    <script src="/__/firebase/5.9.3/firebase-auth.js"></script>
    <script src="/__/firebase/init.js"></script>
    <script src="https://www.gstatic.com/firebasejs/5.11.1/firebase-database.js"></script>
    <script>
      // Initialize Firebase
      var config = {
        apiKey: "AIzaSyDm5trWPhjRf6ufTHAfTF3nOxplC5l_JNU",
        authDomain: "thtd3-529b7.firebaseapp.com",
        databaseURL: "https://thtd3-529b7.firebaseio.com",
        projectId: "thtd3-529b7",
        storageBucket: "thtd3-529b7.appspot.com",
        messagingSenderId: "784194456958"
      };
      firebase.initializeApp(config);
    </script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script> 
    <style type="text/css">
    	.login-form {
    		width: 335px;
    		margin: 30px auto;
        opacity: 0.7;
    	}
      :hover {
        opacity: 1.0;
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
    <script type="text/javascript">
    function google() {
      if (!firebase.auth().currentUser) {
        var provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
        firebase.auth().signInWithPopup(provider).then(function(result) {
          var token = result.credential.accessToken;
          var user = result.user;
        }).catch(function(error) {
          var errorCode = error.code;
          var errorMessage = error.message;
          var email = error.email;
          var credential = error.credential;
          if (errorCode === 'auth/account-exists-with-different-credential') {
            alert('You have already signed up with a different auth provider for that email.');
          } else {
            console.error(error);
          }
        });
      } else {
        firebase.auth().signOut();
      }
      //document.getElementById('quickstart-sign-in').disabled = true;
    }  

    /*function facebook() {
      if (!firebase.auth().currentUser) {
        var provider = new firebase.auth.FacebookAuthProvider();
        firebase.auth().signInWithPopup(provider).then(function(result) {
          var token = result.credential.accessToken;
          var user = result.user;
        }).catch(function(error) {
          var errorCode = error.code;
          var errorMessage = error.message;
          var email = error.email;
          var credential = error.credential;
          if (errorCode === 'auth/account-exists-with-different-credential') {
            alert('You have already signed up with a different auth provider for that email.');
          } else {
            console.error(error);
          }
        });
      } else {
        firebase.auth().signOut();
      }
      //document.getElementById('quickstart-sign-in').disabled = true;
    }

    function twitter() {
      if (!firebase.auth().currentUser) {
        var provider = new firebase.auth.TwitterAuthProvider();
        firebase.auth().signInWithPopup(provider).then(function(result) {
          var token = result.credential.accessToken;
          var user = result.user;
        }).catch(function(error) {
          var errorCode = error.code;
          var errorMessage = error.message;
          var email = error.email;
          var credential = error.credential;
          if (errorCode === 'auth/account-exists-with-different-credential') {
            alert('You have already signed up with a different auth provider for that email.');
          } else {
            console.error(error);
          }
        });
      } else {
        firebase.auth().signOut();
      }
      //document.getElementById('quickstart-sign-in').disabled = true;
    }*/

    function handleSignIn() {
      var email = document.getElementById('email').value;
      var password = document.getElementById('password').value;
      if (email.length < 4) {
         alert('Please enter an email address.');
        return;
      }
      if (password.length < 4) {
        alert('Please enter a password.');
        return;
      }
        // Sign in with email and pass.
        // [START authwithemail]
      firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
          // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
          // [START_EXCLUDE]
        if (errorCode === 'auth/wrong-password') {
            alert('Wrong password.');
        } else {
           alert(errorMessage);
        }
         console.log(error);
        document.getElementById('quickstart-sign-in').disabled = false;
          // [END_EXCLUDE]
       });
        // [END authwithemail]
      }

    function initApp() {
      var dbRef = firebase.database().ref('object');
      dbRef.on('value', function(snapshot){
        console.log(snapshot.val());
      });
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          var displayName = user.displayName;
          var email = user.email;
          var emailVerified = user.emailVerified;
          var photoURL = user.photoURL;
          var isAnonymous = user.isAnonymous;
          var uid = user.uid;
          var providerData = user.providerData;
          document.getElementById('quickstart-account-details').textContent = JSON.stringify(user, null, '  ');
          console.log();
          /*var cmnd = null;
          var temp = JSON.stringify(user, null, '  ');
          var realdata ="";
          var i = 0;
          for(; i < temp.length; i++){
            console.log(temp.charCodeAt(i));
            if(temp[i] == 92){
              i += 1;
            } else realdata += temp[i];

          }
          console.log(realdata);*/
          var postData = {
            email: email, displayName: user.displayName, emailVerified: emailVerified,
            photoURL: photoURL, isAnonymous: isAnonymous, uid: uid, providerData: user.providerData,
          };
          firebase.database().ref('user/' + user.uid).update(postData);
        } else {
        }
      });
      document.getElementById('google').addEventListener('click', google, false);
      document.getElementById('submit').addEventListener('click', handleSignIn, false);
      /*document.getElementById('facebook').addEventListener('click', facebook, false);
      document.getElementById('twitter').addEventListener('click', facebook, false);*/
    }
    window.onload = function() {
      initApp();
    };
  </script>
</head>
<body>
<div class="login-form">
    <form action="/examples/actions/confirmation.php" method="post">
        <h2 class="text-center">Sign in</h2>   
        <div class="form-group">
        	<div class="input-group">
                <span class="input-group-addon"><i class="fa fa-user"></i></span>
                <input type="text" class="form-control" name="username" placeholder="Email" id = "email" required="required">				
            </div>
        </div>
		<div class="form-group">
            <div class="input-group">
                <span class="input-group-addon"><i class="fa fa-lock"></i></span>
                <input type="password" class="form-control" name="password" placeholder="Password" id = "password" required="required">				
            </div>
        </div>        
        <div class="form-group">
            <button type="button" id = "submit" class="btn btn-primary login-btn btn-block">Sign in</button>
        </div>
        <div class="clearfix">
            <label class="pull-left checkbox-inline"><input type="checkbox"> Remember me</label>
            <a href="#" class="pull-right">Forgot Password?</a>
        </div>
		<div class="or-seperator"><i>or</i></div>
        <p class="text-center">Login with your Google account</p>
        <div class="text-center social-btn">
            <!--<a href="#" class="btn btn-primary" id = "facebook"><i class="fa fa-facebook"></i>&nbsp; Facebook</a>
            <a href="#" class="btn btn-info" id = "twitter"><i class="fa fa-twitter"></i>&nbsp; Twitter</a>
			--><a href="#" class="btn btn-danger btn-block" id = "google"><i class="fa fa-google"></i>&nbsp; Google</a>
        </div>
    </form>
    <p class="text-center text-muted small">Don't have an account? <a href="signup.php">Sign up here!</a></p>
</div>
</body>
</html>                            
