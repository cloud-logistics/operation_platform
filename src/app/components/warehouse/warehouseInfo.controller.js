/**
 * Created by xianZJ on 2017/10/31.
 */
(function () {
    'use strict';
    angular.module('smart_container').controller('WarehouseInfoController', WarehouseInfoController);

    /** @ngInject */
    function WarehouseInfoController($scope, ApiServer,toastr, MapService, optionsTransFunc) {
        var vm = this;
        var map;
        vm.reports = [];
        var marker;
        $scope.cityDataBack;
        vm.siteInfo = {
            "location": "",
            "longitude": "",
            "latitude": "",
            "site_code": "",
            "volume": "",
            "city":{},
            "nation":{},
            province:{}
        };
        var initialMap = function () {
            var width = document.body.clientWidth;
            var height = document.body.clientHeight;
            var mapCenter = {lat: 31.2891, lng: 121.4648};
            vm.mapSize = {"width": '200px', "height": '100px'};
            map = MapService.map_init("warehouseInfo_map", mapCenter, "terrain", 3.5);
        };
        $scope.showAdd = false;
        $scope.switchShowAdd = function () {
            $scope.showAdd = !$scope.showAdd;
        };
        $scope.basicUpdate = function () {
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

        function clearMarker() {
            if (marker) {
                marker.setMap(null)
            }
        }

        $scope.conf = {
            currentPage: 1,
            itemsPerPage: 10,
            totalItems:0,
            pagesLength: 15,
            perPageOptions: [10, 20, 30, 40, 50],
            onChange: function () {
            }
        };

        vm.getCountryList = function (callback) {
            ApiServer.getCountryList({
                "success": function (res) {
                    res = res.data;
                    vm.countryList = res.data;
                    if(callback){
                        callback();
                    }
                    $scope.validationCheck();
                },
                "error": function (res) {
                    console.log("获取国家列表失败")
                }
            })
        };
        vm.getProvinceList = function (callback) {
            vm.siteInfo.province.province_id = 0;
            vm.siteInfo.city.city_id = 0;
            vm.provinceList = [];
            vm.cityList = [];
            ApiServer.getProvinceList({
                "countryId": vm.siteInfo.nation.nation_id,
                "success": function (res) {
                    res = res.data;
                    console.log("res = ", res)
                    vm.provinceList = res.data;
                    if (callback) {
                        callback();
                    }
                    $scope.validationCheck();
                },
                "error": function () {

                }
            })
        };
        vm.getCityList = function (callback) {
            vm.siteInfo.city_id = null;
            vm.cityList = [];
            ApiServer.getCityList({
                "provinceId": vm.siteInfo.province.province_id,
                "success": function (res) {
                    res = res.data;
                    console.log("res = ", res)
                    vm.cityList = res.data;
                    $scope.cityDataBack = _.clone(res.data);
                    if(callback){
                        callback();
                    }

                    $scope.validationCheck();
                },
                "error": function () {

                }
            })
        };

        vm.getCountryList();
        initialMap();

        vm.setPointer = function (point) {
            clearMarker();
            $scope.validationCheck();
            if(!vm.siteInfo.city.city_id){
                return;
            }
            if(!point){
                var data = _.find($scope.cityDataBack,function(item){
                    return item.city_id ==  vm.siteInfo.city.city_id;
                });
                vm.siteInfo.longitude = data.longitude;
                vm.siteInfo.latitude = data.latitude;
            }else{
                vm.siteInfo.longitude = point.longitude;
                vm.siteInfo.latitude = point.latitude;
            }
            var point = {
                lng: parseFloat(vm.siteInfo.longitude),
                lat: parseFloat(vm.siteInfo.latitude)
            };
            marker = MapService.addMarker(map)(point, {draggable: true,notTranslate:true});
            google.maps.event.addListener(marker, 'dragend', function (MouseEvent) {
                console.log("移动后的经纬度", MouseEvent.latLng.lng() + " " + MouseEvent.latLng.lat());
                getAddressByLngLat(MouseEvent.latLng.lng(), MouseEvent.latLng.lat());
            });

        };

        var resetLocation = function (obj,lng,lat) {
            console.log("obj = ", obj);
            vm.siteInfo.nation_id = obj.nation_id;
            var obj = {
                latitude:lat,
                id:obj.id,
                location:obj.position_name,
                longitude:lng,
                city:{
                    city_id:obj.city_id
                },
                nation:{
                    nation_id:obj.nation_id
                },
                province:{
                   province_id:obj.province_id
                },
                site_code:vm.siteInfo.site_code,
                volume:vm.siteInfo.volume,
                name:vm.siteInfo.name
            };
            vm.edit(obj);
        };

        var getAddressByLngLat = function (lng, lat) {
            vm.siteInfo.longitude = lng;
            vm.siteInfo.latitude = lat;
            ApiServer.getAddressByLngLat({
                "param": {
                    "longitude": lng + "",
                    "latitude": lat + ''
                },
                "success": function (res) {
                    console.log("res = ", res);
                    if(!res.data.position_name){
                        toastr.info(res.data.msg);
                    }else{
                        vm.siteInfo.location = res.data.position_name;
                        resetLocation(_.extend(res.data,{id:vm.siteInfo.id}),lng,lat);
                    }
                },
                "error": function (res) {
                    console.log(222)
                }
            })
        };

        vm.edit = function (obj,isNeedSwitchShowAdd) {
            console.log("obj =", obj);
            vm.getCountryList(function(){
                vm.siteInfo.nation.nation_id = obj.nation.nation_id;

                vm.getProvinceList(function(){
                    vm.siteInfo.province.province_id = obj.province.province_id;

                    vm.getCityList(function(){
                        vm.siteInfo = _.clone(obj);
                        vm.siteInfo.city = {
                            "city_id":obj.city.city_id||obj.city.id,
                            "city_name":obj.city.city_name,
                            "longitude":obj.longitude,
                            "latitude":obj.latitude
                        };
                        vm.setPointer({
                            "longitude":obj.longitude,
                            "latitude":obj.latitude
                        });
                    })
                });
            });
            if(isNeedSwitchShowAdd){
                $scope.switchShowAdd();
            }
        };

        $scope.validationCheck = function(){
            if(!$scope.saveBtnClick){
                return;
            }
            var flag = true;
            var menu1 = [
                'nation.nation_id',
                'province.province_id',
                'city.city_id',
                'name',
                'volume',
                'location'
            ];
            var menu2 = [
                'nation_class',
                'province_class',
                'city_class',
                'name_class',
                'volume_class',
                'location_class'
            ];
            for(var s = 0,len = menu1.length;s<3;s++){
                if(!(vm.siteInfo[menu1[s].split(".")[0]][menu1[s].split(".")[1]])){
                    $scope[menu2[s]] = " areaRequire ";
                    console.log("s = ",s)
                    flag = false;
                }else{
                    $scope[menu2[s]] = " ";
                }
            }
            for(var s = 3,len = menu1.length;s<len;s++){
                if(!(vm.siteInfo[menu1[s]])){
                    $scope[menu2[s]] = " areaRequire ";
                    console.log("s = ",s)
                    flag = false;
                }else{
                    $scope[menu2[s]] = " ";
                }
            }

            return flag;
        };

        function save() {
            $scope.saveBtnClick = true;
            if(!$scope.validationCheck()){
                console.log("校验失败.",$scope);
                return;
            }
            if (!(vm.siteInfo.site_code)) {
                addSiteInfo();
            } else {
                updateSiteInfo()
            }
        }

        function cancel() {
            clearMarker();
            emptyInfo();
            $scope.switchShowAdd();
        }

        var emptyInfo = function () {
            vm.siteInfo = {
                "location": "",
                "longitude": "",
                "latitude": "",
                "site_code": "",
                "volume": "",
                "city":{},
                "nation":{},
                province:{}
            };
            clearMarker();
            $scope.saveBtnClick = false;
            var menu2 = [
                'nation_class',
                'province_class',
                'city_class',
                'name_class',
                'volume_class',
                'location_class'
            ];
            for(var s = 0,len = menu2.length;s <len;s++){
                $scope[menu2[s]] = "";
            }
        }

        function addSiteInfo() {
            var data = {
                "location": vm.siteInfo.location,
                "longitude": vm.siteInfo.longitude,
                "latitude": vm.siteInfo.latitude,
                "site_code": vm.siteInfo.site_code || "1111",
                "volume": vm.siteInfo.volume||0,
                "name":vm.siteInfo.name,
                "city_id": vm.siteInfo.city.city_id,
                "province_id": vm.siteInfo.province.province_id,
                "nation_id": vm.siteInfo.nation.nation_id
            };
            ApiServer.addSiteInfo({
                "param": data,
                "success": function (response) {
                    toastr.success(response.data.msg);
                    console.log(response.data.code);
                    $scope.switchShowAdd();
                    emptyInfo();
                    retrieveSiteInfo();
                },
                "error": function (err) {
                    toastr.error(err.msg);
                }
            });
        }


        vm.deleteSiteInfo = function (site_id) {
            var opt = {
                okFn:function(){
                    console.log("del site_code :", site_id);
                    if(!site_id){
                        console.log("site_id为空")
                        return;
                    }
                    ApiServer.deleteSiteInfo({
                        "param": site_id,
                        "site_code":site_id,
                        "success": function (res) {
                            toastr.success(res.data.msg);
                            retrieveSiteInfo();
                        },
                        "error": function (err) {
                            toastr.error(err.msg||"删除仓库失败.");
                        }
                    })
                }
            };
            $scope.$emit('showDelMsg',opt);

        }

        function updateSiteInfo() {
            var data = {
                "location": vm.siteInfo.location,
                "longitude": vm.siteInfo.longitude,
                "latitude": vm.siteInfo.latitude,
                "site_code": vm.siteInfo.site_code || "1111",
                "volume": vm.siteInfo.volume,
                "name":vm.siteInfo.name,
                "city_id": vm.siteInfo.city.city_id,
                "province_id": vm.siteInfo.province.province_id,
                "nation_id": vm.siteInfo.nation.nation_id
            };
            ApiServer.updateSiteInfo({
                "param": data,
                "site_code":vm.siteInfo.id,
                "success": function (response) {
                    toastr.success(response.data.msg);
                    console.log(response.data.code);
                    emptyInfo();
                    $scope.switchShowAdd();
                    retrieveSiteInfo();
                },
                "error": function (err) {
                    toastr.error(err.msg || "更新仓库失败");
                }
            });
        }

        function retrieveSiteInfo() {
            ApiServer.retrieveSiteInfo({
                "limit": $scope.conf.itemsPerPage,
                "offset": ($scope.conf.currentPage - 1)*$scope.conf.itemsPerPage,
                "success": function (res) {
                    vm.siteInfoList = res.data.data.results;
                    $scope.conf.totalItems = res.data.data.count;
                    console.log("vm.siteInfoList", vm.siteInfoList)
                },
                "error": function (err) {
                    toastr.error(err.msg ||"获取仓库信息失败");
                }
            });
        }

        retrieveSiteInfo();

        $scope.$watchGroup(['conf.currentPage','conf.itemsPerPage'],retrieveSiteInfo)
    }
})();