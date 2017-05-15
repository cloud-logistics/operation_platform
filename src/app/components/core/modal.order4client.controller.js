/**
 * Created by Otherplayer on 16/7/27.
 */

(function () {
    'use strict';

    angular
        .module('airs')
        .controller('ModalOrder4ClientInstanceCtrl', ModalOrder4ClientInstanceCtrl);

    /** @ngInject */
    function ModalOrder4ClientInstanceCtrl($uibModalInstance,$scope,good) {
        /* jshint validthis: true */
        // var vm = this;

        $scope.good = good;
        $scope.containers = [];
        $scope.containers = good.containers;
        if ($scope.containers && $scope.containers.length > 0){
            $scope.good.containerno = $scope.containers[0].containerno;
        }


        $scope.ok = function () {
            $uibModalInstance.close(good);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('CANCEL');
        };

    }

})();