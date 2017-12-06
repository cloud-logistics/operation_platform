/**
 * Created by xianZJ on 2017/12/5.
 */
(function(){
   'use strict';
   angular.module('ngGrid',[])
    .directive('ngGrid',[function(){
       return {
          restrict: 'EA',
          templateUrl: './assets/js_components/ngGrid/ng-grid.html',
          replace: true,
          scope: {
             tableConfig: '='
          },
          link: function (scope, element, attrs) {
             console.log("scope",scope);
          }
       }
    }])
}());