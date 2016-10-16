angular.module('myApp')
	.controller('ProfileCtrl', function($state) {
		var profileCtrl = this;
		profileCtrl.profile = firebase.auth().currentUser;
		profileCtrl.updateProfile = function(){
			var user = firebase.auth().currentUser;

			user.updateProfile(profileCtrl.profile).then(function() {
			  // Update successful.
			  $state.go('channels');
			}, function(error) {
			  // An error happened.
			});

		};
	});
