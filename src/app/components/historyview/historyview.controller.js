/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('smart_container').controller('HistoryviewController', HistoryviewController);

    /** @ngInject */
    function HistoryviewController($stateParams,ApiServer,MapService,toastr,$state,$timeout,$interval) {
        /* jshint validthis: true */
        var vm = this;

        var width = document.body.clientWidth;
        var height = document.body.clientHeight;
        var histories = [];
        var markers = [];
        vm.mapSize = {"width":width + 'px',"height":height + 'px'};

        var mapInfo = MapService.map_init("histotyview", "terrain");

        // 鼠标绘图工具
        var overlay = undefined;

        getHistoryviewInfo();
        var timer = $interval(function(){
            getHistoryviewInfo();
        },5000, 500);


        function getHistoryviewInfo() {
            var queryParams = {
              containerId: "123",
              startTime:"111",
              endTime: "321"
            }
            ApiServer.getHistoryviewInfo(queryParams, function (response) {
                histories = response.data

                console.log(histories);

                markers = response.data.map(MapService.addMarker(mapInfo.map))
            },function (err) {
                console.log("Get Historyview Info Failed", err);
            });
        }

    }

})();
