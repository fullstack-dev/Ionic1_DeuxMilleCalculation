angular.module('starter.controllers', ['ionic', 'ngCordova', 'ngCordovaOauth'])

.controller('LoginCtrl', function($scope, $state, $cordovaOauth, homeFactory) {
  $scope.facebooklogin = function(){

    console.log("facebook login clicked.");

    $cordovaOauth.facebook("273083806475263", ["email"]).then(function(result) {
      // alert("Auth Success..!!"+JSON.stringify(result));
      var access_token_res = result.access_token;
      alert(access_token_res);
      var link = 'http://www.clubdeuxmille.com/api/user/fb_connect/?access_token=access_token_res';
      // homeFactory
      // .facebookCall(link, 'GET')
      // .then(function(response){
      //   $scope.facebook_res = response.data;
        
      // })
    }, function(error) {
      alert("Auth Failed..!!"+error);
    });
    alert('facebook response: ',$scope.facebook_res);
    // $state.go('tab.deuxmillecols');
  }

  $scope.login = function(){
    console.log("login clicked.");
    $state.go('email_login');
  }

})

.controller('Email_LoginCtrl', function($scope, $state){

  $scope.forgot = function(){
    console.log('forgot');
    
  }

  $scope.login = function(){
    console.log('login');

    var email_val = $scope.email;
    var password_val = $scope.password;

    console.log('email : ', email_val);
    console.log($scope.password);

  }

  $scope.login_facebook = function(){
    console.log('facebook login');
    $state.go('login');
  }

})

.controller('DeuxmillecolsCtrl', function($state, $scope, $rootScope, $ionicLoading, Chats, homeFactory) {
  // $scope.chats = Chats.all();
  // $scope.remove = function(chat) {
  //   Chats.remove(chat);
  // };

  $rootScope.show();
  var link = 'http://www.clubdeuxmille.com/wp-json/wp/v2/cols-access?per_page=100&filter[order]=asc';
  homeFactory
  .colsCall(link, 'GET')
  .then(function (response) {
    $rootScope.hide();
    var result = response.data;
    $rootScope.json_result = [];
   
    for (var i = 0; i < result.length; i ++){
      var id_result = result[i].id;
      var title_result = result[i].title.rendered;
      $rootScope.json_result.push({cols_id:id_result, cols_title:title_result});
    }
    
    console.log($rootScope.json_result);

    $scope.item_click = function(id){
      console.log(id);
      $rootScope.colsID = id;
      $state.go('tab.deuxmillecols-detail');
    }
    // console.log(JSON.stringify(result));
    // localStorage.setItem('dashboardData', JSON.stringify(response.data));
    // if (loginTime != null) {
    //     $state.go('menu.homepage');
    // }
  });
})

.controller('CalculatorCtrl', function($scope) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // $scope.chats = Chats.all();
  // $scope.remove = function(chat) {
  //   Chats.remove(chat);
  // };
})

.controller('DeuxmillecolsDetailCtrl', function($scope, $rootScope, $stateParams, Chats) {
  // $scope.chat = Chats.get($stateParams.chatId);
  // $scope.title = $rootScope.json_result.id
  console.log($rootScope.colsID);
  // console.log($rootScope.json_result[$rootScope.colsID].title.rendered);
})

.controller('ProfileCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
