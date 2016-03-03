var app = angular.module('mobide', ['ionic', 'ionic-material', 'ui.codemirror', 'ngCordova']);

app.run(function($ionicPlatform, $cordovaStatusbar, $cordovaFile, $cordovaToast, $cordovaSplashscreen) {
  $ionicPlatform.ready(function() {
    var admobid = {};
    if( /(android)/i.test(navigator.userAgent) ) {
        admobid = {
            banner: 'ca-app-pub-1011446018846649/6238905616'
        };
    } else if(/(ipod|iphone|ipad)/i.test(navigator.userAgent)) {
            admobid = {
                banner: 'ca-app-pub-1011446018846649/1369237211'
            };
        } else {
            admobid = { // for Windows Phone
                banner: ''
            };
        }

    if(window.AdMob){
        AdMob.createBanner( {
        adId:admobid.banner,
        position:AdMob.AD_POSITION.BOTTOM_CENTER,
        autoShow:true} );
    }

    if(ionic.Platform.isAndroid()){
      $cordovaFile.checkDir(cordova.file.externalRootDirectory, "Mobide")
        .then(function (success) {
          $cordovaToast.showShortBottom("Android Directory Loaded");
        }, function (error) {
          $cordovaFile.createDir(cordova.file.externalRootDirectory, "Mobide", true)
          .then(function(success){
            $cordovaToast.showLongBottom("Mobide Directory Created!");
          }, function(error){
            $cordovaToast.showLongBottom(error);
          });
        });
    }
    if(ionic.Platform.isIOS()){
      $cordovaFile.checkDir(cordova.file.documentsDirectory, "Mobide")
        .then(function (success) {
          $cordovaToast.showShortBottom("iOS Directory Loaded");
        }, function (error) {
          $cordovaFile.createDir(cordova.file.documentsDirectory, "Mobide", true)
          .then(function(success){
            $cordovaToast.showLongBottom("Mobide Directory Created!");
          }, function(error){
            $cordovaToast.showLongBottom(error);
          });
        });
    }
    if(ionic.Platform.isIPad()){
      $cordovaFile.checkDir(cordova.file.documentsDirectory, "Mobide")
        .then(function (success) {
          $cordovaToast.showShortBottom("iOS Directory Loaded");
        }, function (error) {
          $cordovaFile.createDir(cordova.file.documentsDirectory, "Mobide", true)
          .then(function(success){
            $cordovaToast.showLongBottom("Mobide Directory Created!");
          }, function(error){
            $cordovaToast.showLongBottom(error);
          });
        });
    }
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      $cordovaStatusbar.styleHex('#4f4f4f');
    }
  });

});

app.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  $stateProvider
    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'mainCtrl'
  })
  .state('app.about', {
    url: '/about',
    views: {
      'menuContent': {
        templateUrl: 'templates/about.html'
      }
    }
  })
  .state('app.editor', {
    url: '/editor',
    views: {
      'menuContent': {
        templateUrl: 'templates/editor.html'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/editor');
});

app.controller('mainCtrl', function($scope, $window, $timeout, $http, $ionicPlatform, ionicMaterialInk, ionicMaterialMotion, $ionicSideMenuDelegate, $ionicPopover, $ionicModal, $cordovaInAppBrowser, $cordovaFile, $cordovaToast){
  $timeout(function(){
    ionicMaterialInk.displayEffect();
    ionicMaterialMotion.ripple();
  }, 0);

  $scope.toggleLeft = function(){
    $ionicSideMenuDelegate.toggleLeft();
  };

  var options = {
    location: 'yes',
    toolbar: 'yes'
  };

  $scope.openTwitter = function(){
    $cordovaInAppBrowser.open('https://twitter.com/joselevelsup', '_system', options)
    .then(function(success){
      // Success
    }, function(error){
      $cordovaToast.showLongBottom('Error with Opening App');
    });
  }
  $scope.openInsta = function(){
    $cordovaInAppBrowser.open('https://instagram.com/joselevelsup/', '_system', options).
    then(function(success){
      // Success
    }, function(error){
      $cordovaToast.showLongBottom('Error with Opening App')
    });
  }

  //Popovers
  $ionicPopover.fromTemplateUrl('templates/popover.html', {
    scope: $scope,
  }).then(function(popover) {
    $scope.popover = popover;
  });

  //Modals
  $ionicModal.fromTemplateUrl('templates/saveModal.html', {
    scope: $scope,
    animation: 'slide-in-down'
  }).then(function(modal){
    $scope.modal = modal;
  });
  $ionicModal.fromTemplateUrl('templates/openModal.html', {
    scope: $scope,
    animation: 'slide-in-down'
  }).then(function(modal2){
    $scope.modal2 = modal2;
  });
  $ionicModal.fromTemplateUrl('templates/newFolderModal.html', {
    scope: $scope,
    animation: 'slide-in-down'
  }).then(function(modal3){
    $scope.modal3 = modal3;
  });
  $ionicModal.fromTemplateUrl('templates/newFileModal.html', {
    scope: $scope,
    animation: 'slide-in-down'
  }).then(function(modal4){
    $scope.modal4 = modal4;
  });
  $ionicModal.fromTemplateUrl('templates/langModal.html', {
    scope: $scope,
    animation: 'slide-in-down'
  }).then(function(modal5){
    $scope.modal5 = modal5;
  });


  $scope.file = {
    save: "",
    editor: "",
    themes: "",
    folder: null,
    open: ""
  }

    $scope.editOptions = {
      lineWrapping : true,
       lineNumbers: true,
       theme: 'material',
       mode: '',
       parserfile: '',
       stylesheet: '',
       path: ''
    };


    //Language Change Functions
    $http.get('js/lang.json')
      .then(function(resp){
        $scope.modes = resp.data.languages;
      }, function(error){
        console.log(error);
      });

      $scope.playButton = {'visibility': 'hidden'};
    $scope.changeMode = function(modeName, modeType){
      $scope.editOptions.mode = modeType;
      $scope.modal5.hide();
      if(modeType == "text/html"){
        $scope.playButton = {'visibility': 'visible'};
        $scope.editOptions.parserfile = ["parsexml.js", "parsecss.js", "tokenizejavascript.js", "parsejavascript.js", "parsehtmlmixed.js"];
        $scope.editOptions.stylesheet = ["css/xmlcolors.css", "css/jscolors.css", "css/csscolors.css"];
        $scope.editOptions.path = "js/";
      }
      else{
        $scope.playButton = {'visibility': 'hidden'};
      }
      $cordovaToast.showShortBottom(modeName+' Mode');
      // console.log(modeName+' Mode');
    }


  $scope.newFileModal = function(){
    $scope.modal4.show();
    $scope.popover.hide();
  }

  $scope.newFile = function(modeType){
    $scope.file.editor = null;
    $scope.editOptions.mode = modeType;
    $scope.modal4.hide();
    if(modeType == "text/html"){
      $scope.playButton = {'visibility': 'visible'};
      $scope.editOptions.parserfile = ["parsexml.js", "parsecss.js", "tokenizejavascript.js", "parsejavascript.js", "parsehtmlmixed.js"];
      $scope.editOptions.stylesheet = ["css/xmlcolors.css", "css/jscolors.css", "css/csscolors.css"];
      $scope.editOptions.path = "js/";
    }
    else{
      $scope.playButton = {'visibility': 'hidden'};
    }
  }

  $scope.newFolderModal = function(){
    $scope.modal3.show();
    $scope.popover.hide();
  }

  $scope.createFolder = function(){
    if(ionic.Platform.isAndroid()){
      $cordovaFile.createDir(cordova.file.externalRootDirectory+"/Mobide", $scope.file.folder, true)
      .then(function(success){
        $scope.modal3.hide();
        $cordovaToast.showLongBottom("Directory Created!");
      }, function(error){
        $cordovaToast.showLongBottom("Error Making Directory");
      });
    }
    if(ionic.Platform.isIOS()){
      $cordovaFile.createDir(cordova.file.documentsDirectory+"/Mobide", $scope.file.folder, true)
      .then(function(success){
        $scope.modal3.hide();
        $cordovaToast.showLongBottom("Directory Created!");
      }, function(error){
        $cordovaToast.showLongBottom("Error Making Directory");
      });
    }
    if(ionic.Platform.isIPad()){
      $cordovaFile.createDir(cordova.file.documentsDirectory+"/Mobide", $scope.file.folder, true)
      .then(function(success){
        $scope.modal3.hide();
        $cordovaToast.showLongBottom("Directory Created!");
      }, function(error){
        $cordovaToast.showLongBottom("Error Making Directory");
      });
    }
  }

  $scope.saveModal = function(){
    $scope.modal.show();
    $scope.popover.hide();
    if(ionic.Platform.isAndroid()){
      $window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory+"/Mobide", function (dirEntry) {
        var dirReader = dirEntry.createReader();
        dirReader.readEntries(function (entries) {
          $scope.savedFiles = entries;
        }, function (err) {
          console.log(err);
        });
      }, function (err) {
        console.log(err);
      });
    }
    if(ionic.Platform.isIOS()){
      $window.resolveLocalFileSystemURL(cordova.file.documentsDirectory+"/Mobide", function (dirEntry) {
        var dirReader = dirEntry.createReader();
        dirReader.readEntries(function (entries) {
          $scope.savedFiles = entries;
        }, function (err) {
          console.log(err);
        });
      }, function (err) {
        console.log(err);
      });
    }
    if(ionic.Platform.isIPad()){
      $window.resolveLocalFileSystemURL(cordova.file.documentsDirectory+"/Mobide", function (dirEntry) {
        var dirReader = dirEntry.createReader();
        dirReader.readEntries(function (entries) {
          $scope.savedFiles = entries;
        }, function (err) {
          console.log(err);
        });
      }, function (err) {
        console.log(err);
      });
    }
  };

  $scope.saveThisFile = function(fileName){
    if(ionic.Platform.isAndroid()){
      $cordovaFile.writeExistingFile(cordova.file.externalRootDirectory+'/Mobide', fileName, $scope.file.editor)
      .then(function(success){
        $scope.modal.hide();
        $scope.popover.hide();
        $cordovaToast.showShortBottom('Saved!');
      }, function(error){
        $scope.modal.hide();
        $scope.popover.hide();
        $cordovaToast.showLongBottom('An Error Occured')
      });
    }
    if(ionic.Platform.isIOS()){
      $cordovaFile.writeExistingFile(cordova.file.documentsDirectory+"/Mobide", fileName, $scope.file.editor)
      .then(function(success){
        $scope.modal.hide();
        $scope.popover.hide();
        $cordovaToast.showShortBottom('Saved!');
      }, function(error){
        $scope.modal.hide();
        $scope.popover.hide();
        $cordovaToast.showLongBottom('An Error Occured')
      });
    }
    if(ionic.Platform.isIPad()){
      $cordovaFile.writeExistingFile(cordova.file.documentsDirectory+"/Mobide", fileName, $scope.file.editor)
      .then(function(success){
        $scope.modal.hide();
        $scope.popover.hide();
        $cordovaToast.showShortBottom('Saved!');
      }, function(error){
        $scope.modal.hide();
        $scope.popover.hide();
        $cordovaToast.showLongBottom('An Error Occured')
      });
    }
  }

  $scope.saveAs = function(){
    if(ionic.Platform.isAndroid()){
      $cordovaFile.checkFile(cordova.file.externalRootDirectory+'/Mobide', $scope.file.save)
      .then(function(success){
        $cordovaFile.writeExistingFile(cordova.file.externalRootDirectory+'/Mobide', $scope.file.save, $scope.file.editor)
        .then(function(success){
          $scope.modal.hide();
          $scope.popover.hide();
          $cordovaToast.showShortBottom('Overwriten Existing file');
        }, function(error){
          $scope.modal.hide();
          $scope.popover.hide();
          $cordovaToast.showLongBottom('An Error Occured')
        })
      }, function(error){
        $cordovaFile.writeFile(cordova.file.externalRootDirectory+'/Mobide', $scope.file.save, $scope.file.editor, true)
        .then(function(success){
          $scope.modal.hide();
          $scope.popover.hide();
          $cordovaToast.showShortBottom('New File Saved!!');
        }, function(error){
          $scope.modal.hide();
          $scope.popover.hide();
          $cordovaToast.showLongBottom('An Error Occured');
        })
      })
    }
    if(ionic.Platform.isIOS()){
      $cordovaFile.checkFile(cordova.file.documentsDirectory+"/Mobide", $scope.file.save)
      .then(function(success){
        $cordovaFile.writeExistingFile(cordova.file.documentsDirectory+"/Mobide", $scope.file.save, $scope.file.editor)
        .then(function(success){
          $scope.modal.hide();
          $scope.popover.hide();
          $cordovaToast.showShortBottom('Saved!');
        }, function(error){
          $scope.modal.hide();
          $scope.popover.hide();
          $cordovaToast.showLongBottom('An Error Occured')
        })
      }, function(error){
        $cordovaFile.writeFile(cordova.file.documentsDirectory+"/Mobide", $scope.file.save, $scope.file.editor, true)
        .then(function(success){
          $scope.modal.hide();
          $scope.popover.hide();
          $cordovaToast.showShortBottom('New File Saved!');
        }, function(error){
          $scope.modal.hide();
          $scope.popover.hide();
          $cordovaToast.showLongBottom('An Error Occured');
        })
      })
    }
    if(ionic.Platform.isIPad()){
      $cordovaFile.checkFile(cordova.file.documentsDirectory+"/Mobide", $scope.file.save)
      .then(function(success){
        $cordovaFile.writeExistingFile(cordova.file.documentsDirectory+"/Mobide", $scope.file.save, $scope.file.editor)
        .then(function(success){
          $scope.modal.hide();
          $scope.popover.hide();
          $cordovaToast.showShortBottom('Saved!');
        }, function(error){
          $scope.modal.hide();
          $scope.popover.hide();
          $cordovaToast.showLongBottom('An Error Occured')
        })
      }, function(error){
        $cordovaFile.writeFile(cordova.file.documentsDirectory+"/Mobide", $scope.file.save, $scope.file.editor, true)
        .then(function(success){
          $scope.modal.hide();
          $scope.popover.hide();
          $cordovaToast.showShortBottom('New File Saved!');
        }, function(error){
          $scope.modal.hide();
          $scope.popover.hide();
          $cordovaToast.showLongBottom('An Error Occured');
        })
      })
    }
  };

  $scope.openFileModal = function(){
    $scope.modal2.show();
    $scope.popover.hide();
    $ionicPlatform.ready(function(){
      if(ionic.Platform.isAndroid()){
        $window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory+"/Mobide", function (dirEntry) {
          var dirReader = dirEntry.createReader();
          dirReader.readEntries(function (entries) {
            $scope.dirFiles = entries;
            // console.log(entries);
          }, function (err) {
            console.log(err);
          });
        }, function (err) {
          console.log(err);
        });
      }
      if(ionic.Platform.isIOS()){
        $window.resolveLocalFileSystemURL(cordova.file.documentsDirectory+"/Mobide", function (dirEntry) {
          var dirReader = dirEntry.createReader();
          dirReader.readEntries(function (entries) {
            $scope.dirFiles = entries;
            // console.log(entries);
          }, function (err) {
            console.log(err);
          });
        }, function (err) {
          console.log(err);
        });
      }
      if(ionic.Platform.isIPad()){
        $window.resolveLocalFileSystemURL(cordova.file.documentsDirectory+"/Mobide", function (dirEntry) {
          var dirReader = dirEntry.createReader();
          dirReader.readEntries(function (entries) {
            $scope.dirFiles = entries;
          }, function (err) {
            console.log(err);
          });
        }, function (err) {
          console.log(err);
        });
      }
    })
  }

  $scope.openThis = function(fileName, file, directory){
    if(ionic.Platform.isAndroid()){
      var currentDirectory = cordova.file.externalRootDirectory+"/Mobide";
      if(file == true){
        $cordovaFile.readAsText(currentDirectory, fileName)
          .then(function(result){
            $scope.modal2.hide();
            $scope.file.editor = result;
            $scope.playFile = function(){
              $cordovaInAppBrowser.open(currentDirectory+'/'+fileName, "_blank", options)
                .then(function(success){
                  // Success
                  console.log("Worked");
                }, function(error){
                  console.log("Failed");
                  // $cordovaToast.showLongBottom('Error with Opening App')
                });
            }
            $cordovaToast.showShortBottom("Opened");
          }, function(error){
            $cordovaToast.showLongBottom('File did not open');
          });
      }
      if(directory == true){
        $window.resolveLocalFileSystemURL(currentDirectory+"/"+fileName, function (dirEntry) {
          var dirReader = dirEntry.createReader();
          dirReader.readEntries(function (entries) {
            $scope.dirFiles = entries;
            currentDirectory = cordova.file.externalRootDirectory+"/Mobide/"+fileName;
          }, function (err) {
            console.log(err);
          });
        }, function (err) {
          console.log(err);
        });
        if(file == true){
          $cordovaFile.readAsText(currentDirectory, fileName)
            .then(function(result){
              $scope.modal2.hide();
              $scope.file.editor = result;
              $scope.playFile = function(){
                $cordovaInAppBrowser.open(currentDirectory+'/'+fileName, "_blank", options)
                  .then(function(success){
                    // Success
                    console.log("Worked");
                  }, function(error){
                    console.log("Failed");
                    // $cordovaToast.showLongBottom('Error with Opening App')
                  });
              }
              $cordovaToast.showShortBottom("Opened");
            }, function(error){
              $cordovaToast.showLongBottom('File did not open');
            });
        }
      }
    }
    if(ionic.Platform.isIOS()){
      $cordovaFile.readAsText(cordova.file.documentsDirectory+"/Mobide", fileName)
        .then(function(result){
          $scope.modal2.hide();
          $scope.file.editor = result;
          $scope.playFile = function(){
            $cordovaInAppBrowser.open(cordova.file.documentsDirectory+"Mobide"+'/'+fileName, "_blank", options)
              .then(function(success){
                // Success
                console.log("Worked");
              }, function(error){
                console.log("Failed");
                // $cordovaToast.showLongBottom('Error with Opening App')
              });
          }
          $cordovaToast.showShortBottom("Opened");
        }, function(error){
          $cordovaToast.showLongBottom('File did not open');
        });
    }
    if(ionic.Platform.isIPad()){
      $cordovaFile.readAsText(cordova.file.documentsDirectory+"/Mobide", fileName)
        .then(function(result){
          $scope.modal2.hide();
          $scope.file.editor = result;
          $scope.playFile = function(){
            $cordovaInAppBrowser.open(cordova.file.documentsDirectory+"Mobide"+'/'+fileName, "_blank", options)
              .then(function(success){
                // Success
                console.log("Worked");
              }, function(error){
                console.log("Failed");
                // $cordovaToast.showLongBottom('Error with Opening App')
              });
          }
          $cordovaToast.showShortBottom("Opened");
        }, function(error){
          $cordovaToast.showLongBottom('File did not open');
        });
    }
  }
});
