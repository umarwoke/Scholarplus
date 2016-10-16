app.controller('ScholarshipCtrl', function($scope,$modal,$log, ngProgress, toaster,$rootScope) {

$scope.product = {};
var count = 0;
function refresh() {
  var myUserId = firebase.auth().currentUser.uid;
  var listBeasiswa = firebase.database().ref('beasiswa').orderByChild('startdate');

  var fetchPosts = function(postsRef) {
    postsRef.once('value', function(snapshot) {
        $scope.$apply(function() {
          $scope.products = snapshot.val();
          $scope.product = " ";

        });

    });
  };

  fetchPosts(listBeasiswa);
}

  $scope.animationsEnabled = true;
  $scope.remove = function(product) {
  if(confirm("Are you sure to remove the product")){
      var desertRef = firebase.storage().ref().child('beasiswa/'+product);

          // Delete the file
          desertRef.delete().then(function() {
              console.log("Penghapus file1 berhasil");
              	var desertRef = firebase.storage().ref().child('beasiswa/'+product+'_2');
	
	          // Delete the file
	          desertRef.delete().then(function() {
	              console.log("Penghapus file2 berhasil");
	
	          }).catch(function(error) {
	            console.log(error);
	            console.log("tidak ada file2");
	        });

          }).catch(function(error) {
            console.log(error);
            console.log("tidak ada file1");
        });

      var remove = firebase.database().ref('beasiswa/'+product).remove();
      console.log(remove);
      refresh();

    }
  };
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      refresh();

    } else {
    }
  });
  $scope.open = function (k,p,size) {
     if ($rootScope.admin) {
        var modalInstance = $modal.open({
          templateUrl: 'partials/admin/scholarshipEditnew.html',
          controller: 'scholarshipEditCtrl',
          size: size,
          backdrop:'static',
          resolve: {
            item: function () {
              return p;
          },
            key:function(){
                return k;
            }
          }
        });

        modalInstance.result.then(function (selectedObject) {
          refresh();
          if(selectedObject.save == "insert"){

                }else if(selectedObject.save == "update"){


                }

        }, function () {

          $log.info('Modal dismissed at: ' + new Date());
        });
    }
  };


})

app.controller('scholarshipEditCtrl', function ($scope,key,item, $modalInstance,ngProgress,$rootScope) {

    if ($rootScope.admin) {



            $scope.product = angular.copy(item);
            $scope.bea = $scope.product;
            console.log($scope.bea);
            if ($scope.bea) {
                $scope.bea.id = angular.copy(key);
                if ($scope.bea.persyaratankualitatif && $scope.bea.berkas) {
                    $scope.berkas = [];
                    $scope.persyaratan = [];
                    for (var i = 0; i < $scope.bea.berkas.length; i++) {
                        $scope.berkas.push({'id':'choice'+i});
                    }
                    for (var i = 0; i < $scope.bea.persyaratankualitatif.length; i++) {
                        $scope.persyaratan.push({'id':'choice'+i});
                    }
                }
                else if($scope.bea.persyaratankualitatif){
                    $scope.persyaratan = [];
                    for (var i = 0; i < $scope.bea.persyaratankualitatif.length; i++) {
                        $scope.persyaratan.push({'id':'choice'+i});
                    }
                    $scope.bea.berkas = [{id: 'berkas1'}, {id: 'berkas2'}];

                }
                else if ($scope.bea.berkas) {
                    $scope.berkas = [];
                    for (var i = 0; i < $scope.bea.berkas.length; i++) {
                        $scope.berkas.push({'id':'choice'+i});
                    }
                    $scope.persyaratan = [{id: 'syarat1'}, {id: 'syarat2'}];

                }
                else{
                    $scope.persyaratan = [{id: 'syarat1'}, {id: 'syarat2'}];
                    $scope.berkas = [{id: 'berkas1'}, {id: 'berkas2'}];
                }
            }
            else{
                $scope.persyaratan = [{id: 'syarat1'}, {id: 'syarat2'}];
                $scope.berkas = [{id: 'berkas1'}, {id: 'berkas2'}];
            }

            $scope.buttonText = (item != null) ? 'Update File' : 'Upload';


            $scope.addNewChoice = function(pil) {
              var newItemNo = $scope.persyaratan.length+1;
              pil.push({'id':'choice'+newItemNo});
            };

            $scope.removeChoice = function(pil) {
              var lastItem = $scope.persyaratan.length-1;
              if ($scope.persyaratan.length > 1) {
              $scope.persyaratan.splice(lastItem);
              }

            };

            $scope.ok = function (product) {
console.log(product);

              ngProgress.start();
                    if(product && product.id){


                        var x = angular.copy(product);
                        console.log(x);
                        x.save = 'update';
                        var newPostKey = product.id;
                        if (typeof product.photopath === 'object' && typeof product.bgphotopath === 'object') {
                            console.log("upload");
                            var desertRef = firebase.storage().ref().child('beasiswa/'+product.id);

                                // Delete the file
                                desertRef.delete().then(function() {
                                    console.log("Penghapus file berhasil");

                                }).catch(function(error) {
                                  console.log(error);
                                })
                                var file = product.photopath;
                                var file2 = product.bgphotopath;


                                var metadata = {
                                  'contentType': file.type
                                };

                                // Push to child path.
                                var uploadTask = firebase.storage().ref().child('beasiswa/'+newPostKey).put(file, metadata);
                                uploadTask.on('state_changed', null, function(error) {
                                  // [START onfailure]
                                  console.error('Upload failed:', error);
                                  // [END onfailure]
                                }, function() {
                                      var uploadTask2 = firebase.storage().ref().child('beasiswa/'+newPostKey+'_2').put(file2, metadata);
                                      uploadTask2.on('state_changed', null, function(error) {
                                        // [START onfailure]
                                        console.error('Upload failed:', error);
                                        // [END onfailure]
                                      }, function() {

                                        var url = uploadTask.snapshot.metadata.downloadURLs[0];
                                        var url2 = uploadTask2.snapshot.metadata.downloadURLs[0];

                                        // [START_EXCLUDE]
                                        product.photopath = url;
                                        product.bgphotopath = url2;
                                        product.kuantitatif = {

                                              ipk : product.kuantitatif.ipk,
                                              semester : product.kuantitatif.semester,
                                              bidang : product.kuantitatif.bidang

                                          }
                                      product.persyaratankualitatif = product.persyaratankualitatif;
                                      product.berkas = product.berkas;
                                      product.id=null;


                                      firebase.database().ref('beasiswa/'+newPostKey).update(product);
                                      $modalInstance.close(x);
                                      });

                            });

                        }
                        else{
                            console.log("gaada file");
                            product.kuantitatif = {

                              ipk : product.kuantitatif.ipk,
                              semester : product.kuantitatif.semester,
                              bidang : product.kuantitatif.bidang

                              }
                          product.persyaratankualitatif = product.persyaratankualitatif;
                          product.berkas = product.berkas;
                          product.id=null;
                          firebase.database().ref('beasiswa/'+newPostKey).update(product);
                           $modalInstance.close(x);
                        }




                    }else{

                            var x = angular.copy(product);
                            x.save = "insert";
                            var file = '';
                            if (product.photopath) {
                            file = product.photopath;
                            file2 = product.bgphotopath;
                            }

                            var newPostKey = firebase.database().ref('beasiswa').push().key;

                            var metadata = {
                              'contentType': file.type
                            };

                            // Push to child path.
                            var uploadTask = firebase.storage().ref().child('beasiswa/'+newPostKey).put(file, metadata);

                            // Listen for errors and completion of the upload.
                            // [START oncomplete]
                            uploadTask.on('state_changed', null, function(error) {
                              // [START onfailure]
                              console.error('Upload failed:', error);
                              // [END onfailure]
                            }, function() {
                              var uploadTask2 = firebase.storage().ref().child('beasiswa/'+newPostKey+'_2').put(file2, metadata);
                                  uploadTask2.on('state_changed', null, function(error) {
                                    // [START onfailure]
                                    console.error('Upload failed:', error);
                                    // [END onfailure]
                                  }, function() {

                                    var url = uploadTask.snapshot.metadata.downloadURLs[0];
                                    var url2 = uploadTask2.snapshot.metadata.downloadURLs[0];                                    

                                    // [START_EXCLUDE]
                                    product.photopath = url;
                                    product.bgphotopath = url2;
                                    product.kuantitatif = {

                                        ipk : product.kuantitatif.ipk,
                                        semester : product.kuantitatif.semester,
                                        bidang : product.kuantitatif.bidang

                                      };
                                      product.persyaratankualitatif = product.persyaratankualitatif;
                                  product.berkas = product.berkas;
                                  product.likes = {};
                                  // product.id='';

                                  firebase.database().ref('beasiswa/'+newPostKey).set(product);


                                   $modalInstance.close(x);

                                  });

                            });





                    }

            };

            $scope.cancel = function () {
              $modalInstance.dismiss('cancel');
            };

    }

  })

  app.controller('ScholarshipDetailCtrl', function($scope,$log,$stateParams,ngProgress, toaster,$rootScope) {
      var id = $stateParams.id;
      function refresh() {
        var listBeasiswa = firebase.database().ref('beasiswa/'+id);

        var fetchPosts = function(postsRef) {
          postsRef.once('value', function(snapshot) {
              $scope.$apply(function() {
                $scope.product = snapshot.val();


              });

          });
        };

        fetchPosts(listBeasiswa);
      }
      refresh();
  })