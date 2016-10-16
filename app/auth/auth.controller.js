app.controller('AuthCtrl', function($scope,$state) {

		var authCtrl = this;
		$scope.login = function(login) {
			var provider = new firebase.auth.GoogleAuthProvider();
			  firebase.auth().signInWithPopup(provider);
	// 		firebase.auth().signInWithEmailAndPassword(login.email, login.password).catch(function(error) {
  // // Handle Errors here.
	// 		  var errorCode = error.code;
	// 		  var errorMessage = error.message;
	// 		  // ...
	// 		});
		};
		$scope.register = function(register) {
			console.log("REGISTER");
			firebase.auth().createUserWithEmailAndPassword(register.email, register.password).catch(function(error) {
			  // Handle Errors here.
			  authCtrl.error = error;// ...
			  console.log(error);
			});
		};
	});
