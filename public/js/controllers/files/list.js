define(function(require, exports, module){
  return ['$scope', '$http', '$state', '$stateParams', '$filter', 'apiBaseUrl',
    function($scope, $http, $state, $stateParams, $filter, apiBaseUrl){

    var path = $stateParams.path.replace('$', '/');

    var breadcrumbs = $scope.$parent.breadcrumbs = [],
      paths = path.split('/');

    for (var i = 0, len = paths.length; i < len; i++){
      if (!paths[i]) break;

      breadcrumbs.push({
        name: paths[i],
        path: paths.slice(0, i + 1).join('/')
      });
    }

    $scope.columnType = 0;
    $scope.order = 'name';
    $scope.files = [];
    $scope.selected = [];

    $http.get(apiBaseUrl + 'files/list/' + path)
      .success(function(data){
        for (var i = 0, len = data.length; i < len; i++){
          var item = data[i];

          if (item.is_dir){
            item.type = 'Folder';
            item.size = '--';
            item.link = 'list/';
          } else {
            item.type = $filter('mimeType')(item.mime);
            item.ext = item.name.match(/\.(\w+)$/)[1];
            item.size = $filter('size')(item.size);
            item.link = 'show/';
          }

          item.link += item.path.replace('/', '$');
        }

        $scope.files = data;
      })
      .error(function(){
        $state.transitionTo('files.list', {path: ''});
      });

    $scope.select = function(item, $event){
      $event.stopPropagation();

      if ($event.ctrlKey || $event.metaKey){
        $scope.selected.push(item);
      } else {
        $scope.selected = [item];
      }
    };

    $scope.blur = function(){
      $scope.selected = [];
    };

    $scope.enter = function(item, $event){
      var target = item.path.replace('/', '$');

      $event && $event.preventDefault();

      if (item.is_dir){
        $state.transitionTo('files.list', {path: target});
      } else {
        $state.transitionTo('files.show', {path: target});
      }
    }

    $scope.sortName = function(){
      if ($scope.order === 'name'){
        $scope.order = '-name';
      } else {
        $scope.order = 'name';
      }
    };

    $scope.sortDate = function(){
      if ($scope.order === 'mtime'){
        $scope.order = '-mtime';
      } else {
        $scope.order = 'mtime';
      }
    };

    $scope.changeColumnType = function(){
      $scope.columnType = ($scope.columnType + 1) % 2;
    };

    $scope.newFolder = function(){
      //
    };

    $scope.upload = function(){
      //
    };
  }]
});