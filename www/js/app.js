var app = angular.module('starter', ['ionic', 'ionic-material', 'ui.ace', 'ngCordova']);

app.run(function($ionicPlatform, $cordovaStatusbar, $cordovaFile, $cordovaToast, $cordovaSplashscreen) {
  $ionicPlatform.ready(function() {
    var admobid = {};
        // select the right Ad Id according to platform
    if( /(android)/i.test(navigator.userAgent) ) {
        admobid = { // for Android
            banner: 'ca-app-pub-1011446018846649/6238905616'
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
            $cordovaSplashscreen.hide();
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
  $ionicConfigProvider.navBar.alignTitle('left');

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
        title: 'About',
        templateUrl: 'templates/about.html'
      }
    }
  })
  .state('app.editor', {
    url: '/editor',
    views: {
      'menuContent': {
        title: 'Editor',
        templateUrl: 'templates/editor.html'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/editor');
});

app.controller('mainCtrl', function($scope, $window, $timeout, $ionicPlatform, ionicMaterialInk, ionicMaterialMotion, $ionicSideMenuDelegate, $ionicPopover, $ionicModal, $cordovaInAppBrowser, $cordovaFile, $cordovaToast, $http){
  // ionicMaterialMotion.ripple();
  $timeout(function(){
    ionicMaterialInk.displayEffect();
    ionicMaterialMotion.ripple();
  },0);

  $scope.toggleLeft = function(){
    $ionicSideMenuDelegate.toggleLeft();
  };

  var options = {
    location: 'yes',
    toolbar: 'no'
  };

  $scope.openTwitter = function(){
    $cordovaInAppBrowser.open('https://twitter.com/joselevelsup', '_system', options)
    .then(function(success){
      $cordovaToast.showShortBottom('Changed!');
    }, function(error){
      $cordovaToast.showLongBottom('Error with Opening App');
    });
  }
  $scope.openInsta = function(){
    $cordovaInAppBrowser.open('https://www.instagram.com/joselevelsup/', '_system', options).
    then(function(success){
      $cordovaToast.showShortBottom('Changed!');
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
  $ionicPopover.fromTemplateUrl('templates/popover2.html', {
    scope: $scope,
  }).then(function(popover2) {
    $scope.popover2 = popover2;
  });

  //Modals
  $ionicModal.fromTemplateUrl('templates/newFolderModal.html', {
    scope: $scope,
    animation: 'slide-in-down'
  }).then(function(modal3){
    $scope.modal3 = modal3;
  });
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


  $scope.file = {
    save: "",
    editor: "",
    themes: "",
    folder: null
  }

    $scope.aceOption = {
      mode: 'text',
      theme: 'terminal'
    };

    //Language Change Functions
    $scope.htmlChange = function(){
      $scope.aceOption.mode = "html";
      $cordovaToast.showLongBottom('HTML Mode');
      $scope.popover2.hide();
    }
    $scope.cssChange = function(){
      $scope.aceOption.mode = "css";
      $cordovaToast.showLongBottom('CSS Mode');
      $scope.popover2.hide();
    }
    $scope.javascriptChange = function(){
      $scope.aceOption.mode = "javascript";
      $cordovaToast.showLongBottom('Javascript Mode');
      $scope.popover2.hide();
    }
    $scope.coffeeChange = function(){
      $scope.aceOption.mode = "coffee";
      $cordovaToast.showLongBottom('CoffeeScript Mode');
      $scope.popover2.hide();
    }
    $scope.cplusChange = function(){
      $scope.aceOption.mode = "c_cpp";
      $cordovaToast.showLongBottom('C++ Mode');
      $scope.popover2.hide();
    }
    $scope.csharpChange = function(){
      $scope.aceOption.mode = "csharp";
      $cordovaToast.showLongBottom('C# Mode');
      $scope.popover2.hide();
    }
    $scope.javaChange = function(){
      $scope.aceOption.mode = "java";
      $cordovaToast.showLongBottom('Java Mode');
      $scope.popover2.hide();
    }

  $scope.newFile = function(){
    $scope.file.editor = null;
    $scope.popover.hide();
  }

  $scope.newFolderModal = function(){
    $scope.modal3.show();
    $scope.popover.hide();
  }

  $scope.createFolder = function(){
    $cordovaFile.createDir(cordova.file.externalRootDirectory+"/Mobide", $scope.file.folder, true)
    .then(function(success){
      $scope.modal3.hide();
      $cordovaToast.showLongBottom("Directory Created!");
    }, function(error){
      $cordovaToast.showLongBottom("Error Making Directory");
    });
  }

  $scope.saveModal = function(){
    $scope.modal.show();
    $scope.popover.hide();
  };

  $scope.saveThisFile = function(){
    if(ionic.Platform.isAndroid()){
      $cordovaFile.checkFile(cordova.file.externalRootDirectory+'/Mobide', $scope.file.save)
      .then(function(success){
        $cordovaFile.writeExistingFile(cordova.file.externalRootDirectory+'/Mobide', $scope.file.save, $scope.file.editor)
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
        $cordovaFile.writeFile(cordova.file.externalRootDirectory+'/Mobide', $scope.file.save, $scope.file.editor, true)
        .then(function(success){
          $scope.modal.hide();
          $scope.popover.hide();
          $cordovaToast.showShortBottom('Saved!');
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
      $window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory+"/Mobide", function (dirEntry) {
        var dirReader = dirEntry.createReader();
        dirReader.readEntries(function (entries) {
          $scope.dirFiles = entries;
          console.log(entries);
        }, function (err) {
          console.log(err);
        });
      }, function (err) {
        console.log(err);
      });
    })
  }

  $scope.openFile = function(fileName){
    $cordovaFile.readAsText(cordova.file.externalRootDirectory+"/Mobide", fileName)
      .then(function(result){
        $scope.modal2.hide();
        $scope.file.editor = result;
        $cordovaToast.showShortBottom("Opened");
      }, function(error){
        $cordovaToast.showLongBottom('File did not open');
      });
  }

});
