angular.module('myApp')
	.controller('ChannelsCtrl', function($scope,$state,Users) {
		var channelsCtrl = this;
		firebase.auth().onAuthStateChanged(function(user) {
		  if (user) {
			// profile = firebase.database().ref('users/'+user.uid);
			channelsCtrl.profile = user;
			console.log(user.email);
		  } else {
		 }
	  });

		firebase.database().ref('connect').on('value', function(snapshot) {

	          		channelsCtrl.channels  = snapshot.val();
					console.log(channelsCtrl.channels)
	        		});


		channelsCtrl.getDisplayName = Users.getDisplayName;
		channelsCtrl.getGravatar = Users.getGravatar;
		channelsCtrl.users = firebase.database().ref('user');
		// Users.setOnline(channelsCtrl.profile.uid);
		channelsCtrl.logout = function(){
		//   channelsCtrl.profile.online = null;
		//   channelsCtrl.profile.$save().then(function(){
		//     Auth.$unauth();
		//     $state.go('home');
		//   });
		};
		channelsCtrl.newChannel = {
			name: ''
		};
		channelsCtrl.createChannel = function(){
			if (channelsCtrl.newChannel.name.length > 1) {


    	var newPostKey = firebase.database().ref('connect').push().key;
		firebase.database().ref('connect/'+newPostKey).set(channelsCtrl.newChannel).then(function(){

		  $state.go('channels.messages', {channelId: newPostKey});
			});
			};
		}
	});
