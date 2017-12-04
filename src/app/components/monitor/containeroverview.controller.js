/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('smart_container').controller('ContainerOverviewController', ContainerOverviewController);

    /** @ngInject */
    function ContainerOverviewController($stateParams, constdata, ApiServer, MapService, toastr,$state,$timeout,$interval,$scope) {
        /* jshint validthis: true */
        var vm = this;

        var width = document.body.clientWidth;
        var height = document.body.clientHeight;
        var histories = [];
        var routes = [];
        vm.mapSize = {"width":width + 'px',"height":height + 'px'};
        var mapCenter = {lat: 31.2891, lng: 121.4648};

        var map = MapService.map_init("containeroverview", mapCenter, "terrain", 4);
        var heatmap = undefined;

        vm.getHistorylocationInfo = getHistorylocationInfo

        vm.queryParams = {
            containerId: $stateParams.containerId || constdata.defaultContainerId,
            start_time: moment(new Date()),
            end_time: moment(new Date())
        };

        $scope.validationCheck = function(){
            $scope.isContainerIdInvalida = vm.queryParams.containerId != "" &&!constdata['validation']['id'].test(vm.queryParams.containerId);
        };

        // 鼠标绘图工具
        $scope.container_num = undefined;

        vm.getHistorylocationInfo = getHistorylocationInfo;

        getHistorylocationInfo();
        getOperationOverview();

        function getHistorylocationInfo() {
            ApiServer.getContainerOverviewInfo(function (response) {
                var containers = R.compose(
                    R.map(function(item){
                        return new google.maps.LatLng(item.lat, item.lng);
                    }),
                    R.filter(
                      R.compose(
                        R.not,
                        R.equals({lng:0, lat:0})
                      )
                    ),
                    R.map(R.prop("position")),
                    R.prop("data")
                )(response)

                var bounds = new google.maps.LatLngBounds();

                if(R.isEmpty(containers)){
                  toastr.error('未查询到云箱信息，请联系管理员！');
                }else {
                    heatmap = new google.maps.visualization.HeatmapLayer({
                      data: containers,
                      map: map
                    });

                    containers.map(function (item) {
                      bounds.extend(item);
                    })

                    map.fitBounds(bounds);
                }

            },function (err) {
                console.log("Get Historyview Info Failed", err);
            });
        }

        function getOperationOverview(){
          ApiServer.getOperationOverview(function (response) {
              $scope.container_num = response.data.container_num;
          }, function (err) {
              console.log("Get getOperationOverview  Info Failed", err);
          });
        }

    }

})();
