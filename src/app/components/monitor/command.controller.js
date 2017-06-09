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
    function CommandController($stateParams,ApiServer,MapService,toastr,$state,$timeout,$interval,$scope) {
        /* jshint validthis: true */
        var vm = this;

        var width = document.body.clientWidth;
        var height = document.body.clientHeight;
        vm.mapSize = {"width":width + 'px',"height":height + 'px'};

        vm.queryParams = {
            containerId : $stateParams.containerId
        };

        var map = MapService.map_init("commandLocation", "terrain", 4);

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