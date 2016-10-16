angular.module('myApp')
	.factory('Users', function() {
		var usersRef = firebase.database().ref('users');
		var users = '';
		var connectedRef = firebase.database().ref('.info/connected');
		usersRef.once('value').then(function(snapshot){
			users = snapshot.val();

		})
		function getUser(uid){
			firebase.database().ref('users/'+uid).once('value').then(function(snapshot){
				var users = snapshot.val();
				return users;

			});
		}
		var Users = {
			getProfile: function(uid) {
				return getUser(uid);
			},
			getDisplayName: function(uid) {
					return getUser(uid).username;
			},
			getGravatar: function(uid) {

				return '//www.gravatar.com/avatar/'+getUser(uid);
			},
			setOnline: function(uid){
			connectedRef.once('value').then(function(snapshot){
  				  var connected = snapshot.val();
				  var online = getUser(uid+'/online');

							  //   connected.$watch(function (){
							  //     if(connected.$value === true){
							  //       online.$add(true).then(function(connectedRef){
							  //         connectedRef.onDisconnect().remove();
							  //       });
							  //     }
							  //   });

  			  })

			},
			all: users
		};
		return Users;
	});
