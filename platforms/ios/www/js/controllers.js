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

.controller('Email_LoginCtrl', function($scope, $rootScope, $state, homeFactory){


  $scope.user = {email:"", password:""};

  $scope.forgot = function(){
    console.log('forgot');
    
  }

  $scope.login = function(){
    
    // console.log('email :', $scope.user.email);
    // console.log('password:', $scope.user.password);

    // if($scope.user.email.length == 0 || $scope.user.password.length == 0){
    //   alert("email or password is not specified.")
      // $state.go('tab.deuxmillecols');
    // }else{
      //
      $rootScope.show();

      var link1 = 'http://www.clubdeuxmille.com/api/get_nonce/?controller=user&method=generate_auth_cookie';
      homeFactory
      .apiCall(link1, 'GET')
      .then(function(response){
        $rootScope.hide();
        console.log(response);
        if(response.data.status == "ok"){
          
          var link = 'https://www.clubdeuxmille.com/api/user/generate_auth_cookie/?username=Gomez&password=RwbF6vI426CPdLJO';
          
          homeFactory
          .apiCall(link, 'GET')
          .then(function (response) {
            $rootScope.hide();
            
            var result = response.data;
            if(result.status == "ok"){
              $rootScope.userID = result.user.id;
              $state.go('tab.deuxmillecols');
            }else{
              alert("User Login failed!")
            }
          });
        }
      }) 

      
      //
      // $state.go('tab.deuxmillecols');
    // }
  }

  $scope.login_facebook = function(){
    console.log('facebook login');

  }

})

.controller('DeuxmillecolsCtrl', function($state, $scope, $rootScope, $ionicLoading, homeFactory) {

  $rootScope.show();

  $rootScope.json_result = [];
  
  var link = 'http://www.clubdeuxmille.com/api/posts/get_cols_posts/?cols_per_page=-1';
  // var link = 'http://www.clubdeuxmille.com/wp-json/wp/v2/cols-access';
  homeFactory
  .colsCall(link, 'GET')
  .then(function (response) {
    $rootScope.hide();
    
    var result = response.data;
    var result_cols = result.posts;
       
    for (var i = 0; i < result_cols.length; i ++){
      
      var title_result = result_cols[i].title;
      var roads_0_road_name_result = result_cols[i].meta.roads_0_road_name;
      var roads_0_altitude_result = result_cols[i].meta.roads_0_altitude;
      var roads_0_vertical_result = result_cols[i].meta.roads_0_vertical;
      var roads_0_length_result = result_cols[i].meta.roads_0_length;
      var roads_0_avggradient_result = result_cols[i].meta.roads_0_avggradient;

      $rootScope.json_result.push({cols_title:title_result, cols_roads_0_road_name:roads_0_road_name_result, cols_roads_0_altitude:roads_0_altitude_result, cols_roads_0_vertical:roads_0_vertical_result, cols_roads_0_length:roads_0_length_result, cols_roads_0_avggradient:roads_0_avggradient_result});
    }
    
    console.log($rootScope.json_result.length);
  });

  $scope.listlength = 10;

  console.log($scope.listlength);
  console.log($rootScope.json_result.length);
  console.log($rootScope.json_result);

  $scope.loadMore = function(){
    if(!$rootScope.json_result){
      console.log('end');
      $scope.$broadcast('scroll.infiniteScrollComplete');
      return;
    }

    if($scope.listlength < $rootScope.json_result.length){
      $scope.listlength += 10;
      console.log('step');

      var link = 'http://www.clubdeuxmille.com/api/posts/get_cols_posts/?start=' + $scope.listlength.toString();
      homeFactory
      .colsCall(link, 'GET')
      .then(function (response) {
        $rootScope.hide();
        console.log(response);
        var result = response.data;
        var result_cols = result.posts;
        $rootScope.json_result = [];
        console.log(result_cols.length);
        console.log(result_cols);
       
        for (var i = 0; i < result_cols.length; i ++){
          var id_result = result_cols[i].id;
          var title_result = result_cols[i].title;
          $rootScope.json_result.push({cols_id:id_result, cols_title:title_result});
        }
        
        console.log($rootScope.json_result);
      })
    }
    $scope.$broadcast('scroll.infiniteScrollComplete');
  }

  $scope.item_click = function(value){
   console.log("item click;", value);
   $rootScope.selected_item = value;
   $state.go('tab.deuxmillecol-detail'); 
  }

})

.controller('DeuxmillecolsDetailCtrl', function($scope, $rootScope, homeFactory) {
  console.log("come;", $rootScope.selected_item);
  var col_item = $rootScope.selected_item;
  $scope.title = col_item.cols_title;
  $scope.roads_0_road_name = col_item.cols_roads_0_road_name;
  $scope.roads_0_altitude = col_item.cols_roads_0_altitude;
  $scope.roads_0_vertical = col_item.cols_roads_0_vertical;
  $scope.roads_0_length = col_item.cols_roads_0_length;
  $scope.roads_0_avggradient = col_item.cols_roads_0_avggradient;

  console.log($scope.title);
  
  var link = 'https://www.clubdeuxmille.com/api/user.get_memberinfo/?user_id=' + $rootScope.userID.toString();
  console.log(link);
 
  homeFactory
  .apiCall(link, 'GET')
  .then(function (response) {
    $rootScope.hide();
    
    var result = response.data;
    if(result.status == "ok"){
      
      $scope.member_id = result.id;
      $scope.member_avatar = result.avatar;
      $scope.member_ftp = result.ftp;
      // $scope.member_targettime = result

    }else{
      alert("User Login failed!")
    }
  });

  $scope.image_change = function(){
    console.log("image change;");
  }

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

.controller('ProfileCtrl', function($scope) {
  
});
