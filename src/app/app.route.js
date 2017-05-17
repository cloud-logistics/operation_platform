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
                    'app.dashboard',
                    'app.mapview',
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
            .otherwise('dashboard');
        $stateProvider


            .state('app.dashboard', {
                url: 'dashboard',
                templateUrl: 'app/components/dashboard/dashboard.html'
            })
            //全景地图
            .state('app.mapview', {
                url: 'mapview',
                templateUrl: 'app/components/mapview/mapview.html'
            })
            //全景视图
            .state('app.overview',{
                url: 'overview',
                templateUrl: 'app/components/overview/overview.html'
            })
            //云箱监控
            .state('app.monitor',{
                url: 'monitor',
                templateUrl: 'app/components/monitor/monitor.html'
            })

            /** LOGIN **/
            .state('access', {
                url: '/access',
                templateUrl: 'signin.html',
                controller: 'SigninController',
                controllerAs: 'vm'
            })
            .state('access.signin', {
                url: '/signin',
                templateUrl: 'app/components/signin/signin.html'
            })
            .state('access.signup', {
                url: '/signup',
                templateUrl: 'app/components/signin/signup.html'
            })


            .state('app.profile', {
                url: 'user/profile',
                templateUrl: 'app/components/profile/profile.html'
            })
            .state('app.company', {
                url: 'regular/company?type',
                templateUrl: 'app/components/company/company.html'
            })

            /** ACCOUNT **/

            //////用户
            .state('app.userorder', {
                url: 'regular/order',
                templateUrl: 'app/components/order/user.order.html'
            })
            .state('app.userorderadd', {
                url: 'regular/order/:orderId',
                templateUrl: 'app/components/order/user.order.add.html'
            })


            //////货代公司
            .state('app.goodorder', {
                url: 'good/order',
                templateUrl: 'app/components/order/good.order.html'
            })
            .state('app.goodorderadd', {
                url: 'good/order/:orderId',
                templateUrl: 'app/components/order/good.order.add.html'
            })
            .state('app.goodordercar', {
                url: 'good/order/:orderId/car',
                templateUrl: 'app/components/order/good.order.car.html'
            })
            .state('app.goodorderspace', {
                url: 'good/order/:orderId/space',
                templateUrl: 'app/components/order/good.order.space.html'
            })
            .state('app.goodstorages', {
                url: 'good/storages',
                templateUrl: 'app/components/storage/storages.html'
            })
            .state('app.goodstorage', {
                url: 'good/storage',
                templateUrl: 'app/components/storage/storage.html'
            })

            //////拖车公司
            .state('app.carorder', {
                url: 'car/order',
                templateUrl: 'app/components/order/car.order.html'
            })
            .state('app.carorderadd', {
                url: 'car/order/:orderId',
                templateUrl: 'app/components/order/car.order.add.html'
            })
            .state('app.carorderaddpacking', {
                url: 'car/order/packing/:orderId',
                templateUrl: 'app/components/order/car.order.packing.html'
            })
            .state('app.vehicles', {
                url: 'car/vehicles',
                templateUrl: 'app/components/vehicle/vehicles.html'
            })
            .state('app.vehicle', {
                url: 'car/vehicle/:vehicleId',
                templateUrl: 'app/components/vehicle/vehicle.html'
            })
            .state('app.transporttask', {
                url: 'car/transporttask',
                templateUrl: 'app/components/transporttask/transporttask.html'
            })

            //////船运公司
            .state('app.shiporder', {
                url: 'ship/order',
                templateUrl: 'app/components/order/ship.order.html'
            })
            .state('app.shiporderadd', {
                url: 'ship/order/:orderId',
                templateUrl: 'app/components/order/ship.order.add.html'
            })
            .state('app.containers', {
                url: 'ship/containers',
                templateUrl: 'app/components/container/containers.html'
            })
            .state('app.container', {
                url: 'ship/container/:containerId',
                templateUrl: 'app/components/container/container.html'
            })
            .state('app.shippingschedule', {
                url: 'ship/shippingschedule',
                templateUrl: 'app/components/shippingschedule/shippingschedule.html'
            })
            .state('app.shippingscheduleadd', {
                url: 'ship/shippingschedule/:shippingScheduleId',
                templateUrl: 'app/components/shippingschedule/shippingschedule.add.html'
            })


            .state('app', {
                //abstract: true,
                url: '/',
                controller: 'MainController',
                controllerAs: 'main',
                templateUrl: 'app/main/main.html'
            })

        ;
    }

})();
