angular.module('myApp')
	.controller('MessagesCtrl', function(profile, channelId,$scope) {
		var messagesCtrl = this;
		var currentUser = firebase.auth().currentUser;
		var channelMessagesRef = firebase.database().ref('connect-comments/'+channelId);
		channelMessagesRef.on('value', function(snapshot) {
				messagesCtrl.messages = snapshot.val();
				console.log(messagesCtrl);


			})
		firebase.database().ref('connect/'+channelId).on('value', function(snapshot) {
			var name = snapshot.val().name;
		messagesCtrl.channelName = '#'+name;
			})

		messagesCtrl.message = '';
		messagesCtrl.sendMessage = function (){
					  if(messagesCtrl.message.length > 0){
			var newPostKey = channelMessagesRef.push().set({
		      uid: currentUser.uid,
			  name: currentUser.displayName,
		      body: messagesCtrl.message
		    }).then(function(){
					messagesCtrl.message = '';
			});
			messagesCtrl.message = '';

		  }
		};
	});
