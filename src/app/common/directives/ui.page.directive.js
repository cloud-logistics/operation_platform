(function () {
    'use strict';
    // Declare app directives module which depends on views, and components
    angular
        .module('smart_container')
        .directive('autoPagination',autoPagination);

    /** @ngInject */
    function autoPagination() {
        return {
            restrict : "AE",
            scope : {
                pageination:'=',
                updateDatas:'&'
            },
            template : '<div class="btn-group pagination pull-right padder-lg">' +
            '<button type="button" class="btn btn-default" ng-click="preAction()" ng-disabled= !pagePreEnabled>上一页</button> ' +
            '<button type="button" class="btn btn-default" ng-click="goPage(page)" ng-disabled= "true">{{1}}</button> ' +
            '<button type="button" class="btn btn-default" ng-click="nextAction()" ng-disabled= !pageNextEnabled>下一页</button> ' +
            '</div>',
            controller : pageController
        };
        function pageController($scope) {
            $scope.authError = null;

            $scope.pageCurrent = 1;/** **/
            $scope.pagePreEnabled = false;
            $scope.pageNextEnabled = false;
            $scope.pages = [];

            function getDatas() {
                $scope.$parent.vm.updateDatas($scope.pageCurrent);
            }
            $scope.$watch('pageination',function(newValue,oldValue, scope){

                updatePagination(newValue);

            });

            // 分页 Start
            $scope.preAction = function () {
                $scope.pageCurrent --;
                if ($scope.pageCurrent < 1) $scope.pageCurrent = 1;
                getDatas();
            };
            $scope.nextAction = function () {
                $scope.pageCurrent ++;
                getDatas();
            };
            $scope.goPage = function (page) {
                $scope.pageCurrent = Number(page);
                getDatas();
            };
            $scope.pageCurrentState = function (page) {
                if (Number(page) == $scope.pageCurrent)
                    return true;
                return false;
            };

            function updatePagination(pageination) {

                if (!pageination || !pageination.hasContent){
                   return;
                }

                var page = pageination.page;
                var toalPages = pageination.totalPages;

                $scope.pageNextEnabled = pageination.hasNextPage;
                $scope.pagePreEnabled = pageination.hasPreviousPage;


                if (toalPages < 2){
                    $scope.pages = ['1'];
                }else{
                    $scope.pages = [];
                    var pageControl = 5;
                    var stepStart = page - (pageControl - 1)/2;
                    if (stepStart < 1 || toalPages < pageControl) stepStart = 1;
                    var stepEnd = stepStart + pageControl - 1;
                    if (stepEnd > toalPages) {
                        stepEnd = toalPages;
                        stepStart = toalPages - pageControl + 1;
                        if (stepStart < 1){
                            stepStart = 1;
                        }
                    }

                    for (var i=stepStart;i<= (stepEnd > toalPages ? toalPages : stepEnd);i++) {
                        $scope.pages.push(i);
                    }
                }

            }

        }
    }


})();
