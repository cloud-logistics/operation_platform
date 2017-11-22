/**
 * app main controller
 */

(function () {
    'use strict';

    angular.module('smart_container').controller('NavController', AsideController);

    /** @ngInject */
    function AsideController($scope, StorageService, constdata) {
        /* jshint validthis: true */
        var vm = this;
        var height = document.body.clientHeight + 'px';
        vm.navStyle = {'height': height};

        $scope.switchNav = function(flag){
            setTimeout(function(){
                $(".nav").find("li").removeClass("active")
            },10)
        };

        vm.role = "carrier" || StorageService.get(constdata.informationKey).role;

    }
})();
