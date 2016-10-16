var app = angular.module('myApp', ['ngRoute','ngResource','ui.router','ngProgress', 'ngAnimate', 'toaster','ui.bootstrap','firebase','angular-md5']);
app.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'partials/home.html',
      resolve: {
        requireNoAuth: function($state){
            firebase.auth().onAuthStateChanged(function(user) {
              if (user) {
                // User is signed in.
                $state.go('channels')
              } else {
                console.log("login dulu bro");
              }
            });


        }
      }
    })
    .state('login', {
      url: '/login',
      controller: 'AuthCtrl as authCtrl',
      templateUrl: 'app/auth/login.html',
      resolve: {
        requireNoAuth: function($state) {
            firebase.auth().onAuthStateChanged(function(user) {
              if (user) {
                $state.go('home');
              } else {
                // No user is signed in.
              }
            });

          }
      }
    })
    .state('register', {
      url: '/register',
      controller: 'AuthCtrl as authCtrl',
      templateUrl: 'app/auth/register.html',
      resolve: {
        requireNoAuth: function($state) {
            var user = firebase.auth().currentUser;

              if (user) {
                $state.go('home');
              } else {
                console.log("belum login bro");
              }
          }
      }
    })
    .state('profile', {
      url: '/profile',
      controller: 'ProfileCtrl as profileCtrl',
      templateUrl: 'app/users/profile.html',
    //   resolve: {
    //     auth: function($state, Users, Auth) {
    //       return Auth.$requireAuth().catch(function() {
    //         $state.go('home');
    //       });
    //     },
    //     profile: function(Users, Auth) {
    //       returnAuth.$requireAuth().then(function(auth) {
    //         return Users.getProfile(auth.uid).$loaded();
    //       });
    //     }
    //   }
    })
    .state('news',{
      url: '/news',
      controller: 'NewsCtrl',
      templateUrl: 'partials/news.html'
    })
    .state('scholarship',{
      url: '/scholarship',
      controller:'ScholarshipCtrl',
      templateUrl:'partials/scholarship.html'
    })
    .state('sdetail',{
      url:'/scholarship/:id',
      controller:'ScholarshipDetailCtrl',
      templateUrl:'partials/scholarshipDetail.html'
    })
    .state('ndetail',{
      url:'/news/:id',
      controller:'NewsDetailCtrl',
      templateUrl:'partials/newsDetail.html'
    })
    .state('channels', {
      url: '/channels',
      controller: 'ChannelsCtrl as channelsCtrl',
      templateUrl: 'app/channels/index.html',
      resolve: {
        profile: function ($state){
            var profile = '';
            firebase.auth().onAuthStateChanged(function(user) {
              if (user) {
                // profile = firebase.database().ref('users/'+user.uid);
                profile = user;
              } else {
                  console.log("belum login bro");
                  $state.go('home');
              }
          });
            return profile;
        }
      }
    })
    .state('channels.create', {
      url: '/create',
      templateUrl: 'app/channels/create.html',
      controller: 'ChannelsCtrl as channelsCtrl'
    })
    .state('channels.messages', {
      url: '/{channelId}/messages',
      templateUrl: 'app/channels/message.html',
      controller: 'MessagesCtrl as messagesCtrl',
          resolve: {
            messages: function($stateParams){
            //   return Messages.forChannel($stateParams.channelId);
            },
            channelId:function($stateParams){
                return $stateParams.channelId;
            }
          }
    })
    .state('channels.direct', {
      url: '/{uid}/messages/direct',
      templateUrl: 'app/channels/messages.html',
      controller: 'MessagesCtrl as messagesCtrl',
      resolve: {
        messages: function($stateParams, Messages, profile){
          return Messages.forUsers($stateParams.uid, profile.$id).$loaded();
        },
        channelName: function($stateParams, Users){
          return Users.all.$loaded().then(function(){
            return '@'+Users.getDisplayName($stateParams.uid);
          });
        }
      }
    });


  $urlRouterProvider.otherwise('/');
});


app.directive('fileModel', ['$parse', function ($parse) {
   return {
      restrict: 'A',
      link: function(scope, element, attrs) {
         var model = $parse(attrs.fileModel);
         var modelSetter = model.assign;

         element.bind('change', function(){
            scope.$apply(function(){
               modelSetter(scope, element[0].files[0]);
            });
         });
      }
   };
}]);

// Handle http server errors
app.factory('myHttpInterceptor', function ($q,toaster) {
    return {
        responseError: function (response) {
          console.log(response);
          if(response.data){
            if(response.data.message)
            toaster.error("Error: ", response.data.message);
            else
            toaster.error("Error: ", response.data);
          }
          return $q.reject(response);
        }
    };
});

// Showing loading indicator on top while data is requested from database
app.directive('loading',   ['$http', 'ngProgress', function ($http, ngProgress)
{
    return {
        restrict: 'A',
        link: function (scope, elm, attrs)
        {
            scope.isLoading = function () {
                return $http.pendingRequests.length > 0;
            };

            scope.$watch(scope.isLoading, function (v)
            {
                if(v){
                    ngProgress.start();
                }else{
                    ngProgress.complete();
                }
            });
        }
    };
}]);

app.run(function($rootScope) {
    $rootScope.admin = true;
})
