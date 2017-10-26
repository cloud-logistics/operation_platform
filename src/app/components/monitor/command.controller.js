/**
 * Created by guankai on 09/06/2017.
 */
/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('smart_container').controller('CommandController', CommandController);

    /** @ngInject */
    function CommandController($stateParams,ApiServer,MapService,toastr,$state,$timeout,constdata, $interval,$scope) {
        /* jshint validthis: true */
        var vm = this;

        var width = document.body.clientWidth;
        var height = document.body.clientHeight;
        vm.mapSize = {"width":width + 'px',"height":height + 'px'};

        vm.queryParams = {
            containerId : $stateParams.containerId
        };

        vm.commandParams = {
            containerId : $stateParams.containerId || constdata.defaultContainerId,
            endpointId : $stateParams.endpointId,
            action: "reset"
        };

        vm.reset = reset
        vm.poweroff = poweroff
        vm.cancelcmd = cancelcmd

        var map = undefined

        getInstantlocationInfo()

        function reset() {
            vm.commandParams = R.merge(vm.commandParams, {
                action: "reset"
            })

            deliverCmd()

            cancelcmd()
        }


        function cancelcmd () {
            $scope.resetShow = false;
            $scope.shutShow = false;
        }

        function poweroff() {
            vm.commandParams = R.merge(vm.commandParams, {
                action: "poweroff"
            })

            deliverCmd()

            cancelcmd()
        }

        function deliverCmd() {
            ApiServer.command(vm.commandParams, function(response){
                console.log(response.data);
            },function (err) {
                console.log("Get Historyview Info Failed", err);
            })
        }


        function getInstantlocationInfo() {
            ApiServer.getInstantlocationInfo(vm.queryParams, function (response) {
                var bounds = new google.maps.LatLngBounds();
                var containerInfo = response.data.containerInfo
                var currentPosition = response.data.currentPosition
                var locationName = undefined;
                var content = undefined;

                map = MapService.map_init("commandLocation", currentPosition, "terrain", 4);

                console.log(response.data);

                var currentPositionMarker = MapService.addMarker(map)(currentPosition)
                content = 
                    '<div class="map-marker">' +
                        '<div class="marker-content">' +
                            '<div class="content-left">' +
                                '<span>最近维修点</span>' +
                            '</div>' +
                            '<div class="content-right">' +
                                '<span>清风港口001维修站</span>' +
                                '<span>台湾省花莲市莲湖区234号海航大厦</span>' +
                                '<span>668-87-038402</span>' +
                            '</div>' +
                        '</div>' +
                        '<div class="marker-bottom">' +
                            '<div class="bottom-text">' +
                                '<p>相距<span>393</span>KM</p>' +
                            '</div>' +
                            '<div class="marker-line">' +

                            '</div>' +
                        '</div>' +
                        // '<div class="marker-point">' +

                        // '</div>' +
                    '</div>';
                //infoWindow(map, currentPositionMarker, content)

                // bounds.extend(currentPositionMarker.getPosition());

                // map.fitBounds(bounds);

            },function (err) {
                console.log("Get Historyview Info Failed", err);
            });
        }

        function infoWindow(map, marker, content) {
          var infowindow = new google.maps.InfoWindow({
            content: content
          });

          infowindow.open(map, marker);
        }


        $scope.resetShow = false;
        $scope.resetClick = function () {
            $scope.resetShow = !$scope.resetShow;
        }

        $scope.shutShow = false;
        $scope.shutClick = function () {
            $scope.shutShow = !$scope.shutShow;
        }

    }

})();
