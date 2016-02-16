var app = angular.module('starter', ['ionic', 'ionic-material', 'ui.ace', 'ngCordova']);

app.run(function($ionicPlatform, $cordovaStatusbar, $cordovaFile, $cordovaToast, $cordovaSplashscreen) {
  $ionicPlatform.ready(function() {
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
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
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

app.controller('mainCtrl', function($scope, ionicMaterialInk, ionicMaterialMotion, $ionicSideMenuDelegate, $ionicPopover, $ionicModal, $cordovaInAppBrowser, $cordovaFile, $cordovaFileOpener2, $cordovaToast){
  // ionicMaterialMotion.ripple();
  ionicMaterialInk.displayEffect();
  $scope.toggleLeft = function(){
    $ionicSideMenuDelegate.toggleLeft();
  };
  $scope.toggleRight = function(){
    $ionicSideMenuDelegate.toggleRight();
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
    open: ""
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
  }

  $scope.saveThis = function(){
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
    if(ionic.Platform.isIOS()){
      $cordovaFile.checkFile(cordova.file.documentsDirectory+'/Mobide', $scope.file.save)
      .then(function(success){
        $cordovaFile.writeExistingFile(cordova.file.documentsDirectory+'/Mobide', $scope.file.save, $scope.file.editor)
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
        $cordovaFile.writeFile(cordova.file.documentsDirectory+'/Mobide', $scope.file.save, $scope.file.editor, true)
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
  }

  $scope.openFile = function(){
    $cordovaFile.readAsText(cordova.file.externalRootDirectory+"/Mobide", $scope.file.open)
      .then(function(result){
        $scope.modal2.hide();
        $scope.file.editor = result;
        $cordovaToast.showShortBottom("Opened");
      }, function(error){
        $cordovaToast.showLongBottom('File did not open');
      });
  }

});
