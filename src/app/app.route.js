(function () {
    'use strict';

    /** @ngInject */
    angular
        .module('smart_container')
        .config(routeConfig)
        .run(function($rootScope, $state, $stateParams,constdata,$location) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
            $rootScope.pageRoutes = [];
            var count = 0;

            $rootScope.$on("$stateChangeSuccess",  function(event, toState, toParams, fromState, fromParams) {
                // to be used for back button //won't work when page is reloaded.
                var findedIndex = -1;
                $rootScope.previousState_name = fromState.name;
                $rootScope.previousState_params = fromParams;
                var myUrl = constdata.routeName[toState.name];
                var routeObj = {
                url : myUrl,
                name : toState.name,
                params : toParams
                }

                var firstLevelNav = [
                    'app.overview',
                    'app.monitor',
                    'app.signin'
                ];

                //点击一级把一级和后面所有的route全部去掉
                if ( R.any(R.equals(routeObj.name))(firstLevelNav) ) {
                    // have to use splice, otherwise, nav works abnormal, do not know why...
                    $rootScope.pageRoutes.splice(0);
                } else {
                    findedIndex = R.findIndex(R.propEq("name", routeObj.name))($rootScope.pageRoutes)
                    //去掉同一级别的route及以后的route
                    if (findedIndex !== -1) {
                        var dropLen = R.length($rootScope.pageRoutes) - findedIndex;
                        $rootScope.pageRoutes.splice(findedIndex, dropLen);
                        // $rootScope.pageRoutes = R.dropLast(dropLen)($rootScope.pageRoutes)
                    }
                }

                $rootScope.pageRoutes.push(routeObj);

                //对后追加的两个routeName进行去重处理
                // checkLastTwoRoute($rootScope.pageRoutes);

                //数组去重处理函数
                function checkLastTwoRoute(arr) {
                var arrLen = arr.length;
                if(arrLen>=2) {
                    //后两个重复处理
                    if(arr[arrLen-1].url == arr[arrLen-2].url) {
                    arr.splice(arrLen-1,1);
                    return;
                    }
                    //最后一个和前面的某一个重复处理
                    var arrExceptLast = arr.slice(0, arrLen-2);
                    var urlArrExceptLast = [];
                    arrExceptLast.forEach(function(item, index) {
                    urlArrExceptLast.push(item.url);
                    });
                    var findIndex = urlArrExceptLast.indexOf(arr[arrLen-1].url);
                    findIndex>=0 ? arr.splice(findIndex+1) : console.log();
                }
                }
            });
            //back button function called from back button's ng-click="backPre()"
            $rootScope.backPre = function() {//实现返回的函数
                $state.go($rootScope.previousState_name,$rootScope.previousState_params);
            };
        });


    function routeConfig($stateProvider, $urlRouterProvider) {

        // $locationProvider.html5Mode(true);
        $urlRouterProvider
            .otherwise('siteoverview');
        $stateProvider
            .state('app.containeroverview', {
                url: 'containeroverview',
                templateUrl: 'app/components/monitor/containeroverview.html'
            })
            .state('app.siteoverview', {
                url: 'siteoverview',
                templateUrl: 'app/components/monitor/siteoverview.html'
            })
            //实时报文详情
            .state('app.realtime',{
                url: 'realtime/:containerId',
                templateUrl: 'app/components/monitor/realtime.html'
            })
            //实时位置
            .state('app.instantlocation',{
                url: 'instantlocation/:containerId',
                templateUrl: 'app/components/monitor/instantlocation.html'
            })
            //历史轨迹
            .state('app.historylocation',{
                url: 'historylocation/:containerId/:startTime/:endTime',
                templateUrl: 'app/components/monitor/historylocation.html'
            })
            //告警详情
            .state('app.alert',{
                url: 'alert/:containerId/:alertLevel/:alertType/:alertCode',
                templateUrl: 'app/components/monitor/alert.html'
            })
            //基础信息查询
            .state('app.basicinfo',{
                url: 'basicinfo/:containerId/:containerType/:factory',
                templateUrl: 'app/components/monitor/basicinfo.html'
            })
            //状态汇总
            .state('app.boxstatus',{
                url: 'boxstatus/:containerId/:alertLevel/:alertType',
                templateUrl: 'app/components/monitor/boxstatus.html'
            })
            //云箱管理 ---- 云箱信息
            .state('app.boxbasic',{
                url: 'boxbasic',
                templateUrl: 'app/components/basic/boxbasic.html'
            })
            //云箱管理  ----  安全参数
            .state('app.boxparam',{
                url: 'boxparam',
                templateUrl: 'app/components/basic/boxparam.html'
            })
            //云箱管理  ---- 维修处理
            .state('app.boxalert',{
                url: 'boxalert',
                templateUrl: 'app/components/basic/boxalert.html'
            })
            //仓库信息
            .state('app.warehouseInfo', {
                url: 'warehouseInfo/',
                templateUrl: 'app/components/warehouse/warehouseInfo.html'
            })
            //仓库状态
            .state('app.warehouseStatus', {
                url: 'warehouseStatus/',
                templateUrl: 'app/components/warehouse/warehouseStatus.html'
            })

            //云箱信息查询
            .state('app.boxdetail',{
                url: 'boxdetail',
                templateUrl: 'app/components/monitor/boxDetail.html'
            })
            .state('app.prediction', {
                url: 'prediction/',
                templateUrl: 'app/components/predictionDecision/predictionDecision.html'
            })
            .state('access.signin', {
                url: '/signin',
                templateUrl: 'app/components/signin/signin.html'
            })
            .state('access.signup', {
                url: '/signup',
                templateUrl: 'app/components/signin/signup.html'
            })

            .state('app.command',{
                url: 'command/:containerId/:endpointId',
                templateUrl: 'app/components/monitor/command.html'
            })

            /** LOGIN **/
            .state('access', {
                url: '/access',
                templateUrl: 'signin.html',
                controller: 'SigninController',
                controllerAs: 'vm'
            })

            .state('app', {
                url: '/',
                controller: 'MainController',
                controllerAs: 'main',
                templateUrl: 'app/main/main.html'
            });
    }
})();
