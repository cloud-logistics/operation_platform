/**
 * Created by xianZJ on 2017/10/31.
 */
(function(){
    'use strict';
    angular.module('smart_container').controller('WarehouseInfoController', WarehouseInfoController);

    /** @ngInject */
    function WarehouseInfoController($scope, ApiServer, MapService,optionsTransFunc){

        var vm = this;
        var map;
        vm.title = '报警监控';
        vm.reports = [];
        vm.queryParams = {};
        var setMap = function(){
            var width = document.body.clientWidth;
            var height = document.body.clientHeight;
            var mapCenter = {lat: 31.2891, lng: 121.4648};
            vm.mapSize = {"width": width + 'px', "height": '57.8%'};
            map = MapService.map_init("warehouseInfo_map", mapCenter, "terrain");
        };
        $scope.showAdd = false;
        $scope.switchShowAdd = function(){
            $scope.showAdd = ! $scope.showAdd;
        };
        $scope.basicUpdate = function(){
            vm.options = R.merge(vm.options, {
                title: "录入仓库基础信息",
                is_insert: false
            })

            $scope.bbUpdate = !$scope.bbUpdate;
            // $scope.modalUpdate = !$scope.modalUpdate;
        };

        vm.save = save;
        vm.cancel = cancel;
        $scope.save = save;
        $scope.cancel = cancel;
        vm.options = {};
        var transformations = undefined;

        vm.getCountryList = function(){
            ApiServer.getCountryList({
                "countryId":vm.country,
                "success":function(res){
                    vm.countryList = res.data;
                    console.log("vm.countryList  = ",vm.countryList )
                },
                "error":function(res){
                    console.log(222)
                }
            })
        };


        vm.getProvinceList = function(){
            vm.province = null;
            vm.city = null;
            vm.provinceList = [];
            vm.cityList = [];
            ApiServer.getProvinceList({
                "countryId":vm.country,
                "success":function(res){
                    console.log("res = ",res)
                    vm.provinceList = res.data;
                },
                "error":function(){

                }
            })
        };

        vm.getCityList = function(){
            vm.city = null;
            vm.cityList = [];
            ApiServer.getCityList({
                "provinceId":vm.province,
                "success":function(res){
                    console.log("res = ",res)
                    vm.cityList = res.data;
                },
                "error":function(){

                }
            })
        };

        vm.getCountryList();
        setMap();

        vm.setPointer = function(){
            var point = {
                lng:JSON.parse(vm.city).longitude,
                lat:JSON.parse(vm.city).latitude
            };
            var marker = MapService.addMarker(map)(point,{draggable:true});
            google.maps.event.addListener(marker, 'dragend', function(MouseEvent) {
                console.log("移动后的经纬度",MouseEvent.latLng);

            });
        };

        getWarehouseInfo();

        function getWarehouseInfo () {
            ApiServer.getBasicInfo({}, function (response) {
                vm.basicInfoManage = response.data.basicInfo
                console.log(vm.basicInfoManage);
            },function (err) {
                console.log("Get ContainerOverview Info Failed", err);
            });
        }

        function save(isUseForAdd) {
            add();
            if(isUseForAdd){
                $scope.switchShowAdd();
            }else{
                $scope.bbUpdate = false;
            }
        }

        function cancel(isUseForAdd) {
            if(isUseForAdd){
                $scope.switchShowAdd();
            }else{
                $scope.bbUpdate = false;
            }
        }

        function add () {
            var config = R.evolve(transformations)(vm.newBasicInfoConfig)
            console.log("new basicInfo params: ", config);
            ApiServer.newBasicInfoConfig(config, function (response) {
                console.log(response.data.code);
            },function (err) {
                console.log("Get ContainerOverview Info Failed", err);
            });
        }

        function inputTransFunc (num) {
            return parseInt(num, 10)
        }

    }
})();