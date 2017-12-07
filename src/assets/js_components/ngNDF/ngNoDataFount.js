/**
 * Created by xianZJ on 2017/12/5.
 */
(function(){
    'use strict';
    angular.module('ngNoDataFount',[])
        .directive('ngNoDataFount',[function(){
            return {
                restrict: 'EA',
                templateUrl: './assets/js_components/ngNDF/ng-noDataFount.html',
                replace: true,
                scope: {
                    conf: '='
                },
                link: function ($scope, element, attrs) {
                    console.log("scope",$scope.conf);
                },
                controller:function($scope){
                    var menu = {
                        "search":{
                            text1:"当前页面无数据",
                            text2:"去其他页面逛逛吧",
                            src:"images/img_other_nothing_01.png"
                        },
                        "filter":{
                            text1:"抱歉，没搜到",
                            text2:"换个关键词试试吧",
                            src:"images/img_other_nothing_02.png"
                        }
                    }
                    $scope.model = menu[$scope.conf];
                }
            }
        }])
}());