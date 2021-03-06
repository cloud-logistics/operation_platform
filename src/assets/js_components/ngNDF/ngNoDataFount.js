/**
 * Created by xianZJ on 2017/12/5.
 */
(function(){
    'use strict';
    angular.module('ngNoDataFount',[])
        .directive('ngNoDataFount',[function(){
            return {
                restrict: 'EA',
                templateUrl: 'js_components/ngNDF/ng-noDataFount.html',
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
                        },
                        "noFlowData":{
                            text1:"当前仓库无出入库记录",
                            text2:"",
                            src:"images/img_other_nothing_02.png"
                        },
                        "noDataFound":{
                            text1:"当前仓库无在库云箱",
                            text2:"",
                            src:"images/img_other_nothing_02.png"
                        },
                        "noDispatch":{
                            text1:"暂无调度数据",
                            text2:"",
                            src:"images/img_other_nothing_01.png"
                        }

                    }
                    console.log("model = ",$scope.conf)
                    $scope.model = menu[$scope.conf];
                }
            }
        }])
}());