
// FirebaseUI config.
var uiConfig = {
    signInSuccessUrl: 'https://iamshouvikmitra.github.io/stepping-stones/dashboard.html',
    //signInSuccessUrl: 'http://localhost:5500/dashboard.html',
    // signInSuccessUrl: 'https://6b7eb1a4.ngrok.io/dashboard.html',
    signInOptions: [
      // Leave the lines as is for the providers you want to offer your users.
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    //   firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    //   firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    //   firebase.auth.GithubAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      firebase.auth.PhoneAuthProvider.PROVIDER_ID,
      firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
    ],
    // tosUrl and privacyPolicyUrl accept either url string or a callback
    // function.
    // Terms of service url/callback.
    tosUrl: 'http://localhost:5500/tos.html',
    // tosUrl: 'http://6b7eb1a4.ngrok.io/tos.html',
    // Privacy policy url/callback.
    privacyPolicyUrl: function() {
      window.location.assign('https://iamshouvikmitra.github.io/stepping-stones/privacy.html');
      //window.location.assign('http://localhost:5500/privacy.html');
      // window.location.assign('https://6b7eb1a4.ngrok.io/privacy.html');
    }
  };

  // Initialize the FirebaseUI Widget using Firebase.
  var ui = new firebaseui.auth.AuthUI(firebase.auth());
  // The start method will wait until the DOM is loaded.
  ui.start('#firebaseui-auth-container', uiConfig);
