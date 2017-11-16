/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('smart_container').controller('ProfileController', ProfileController);

    /** @ngInject */
    function ProfileController($scope,ApiServer,toastr,constdata,$state) {
        /* jshint validthis: true */
        var vm = this;

        var userInfo = constdata.informationKey;
        var info = ApiServer.info();
        vm.roleType = info.role;
        vm.submitAction = submitAction;
        vm.cancelAction = cancelAction;

        vm.user = {role:info.role};

        function submitAction() {
            ApiServer.userUpdate(vm.user,function (res) {
                //更新本地信息
                // StorageService.put(userInfo,vm.user,24 * 3 * 60 * 60);
                toastr.success('更新成功');

            },function (err) {
                var errInfo = '更新失败：' + err.statusText + ' (' + err.status +')';
                toastr.error(errInfo);
            })
        }
        function cancelAction() {
            history.back();
        }
        function getDatas() {
            ApiServer.userGet(info.id,function (res) {
                vm.user = res.data;
            },function (err) {
                var errInfo = '获取数据失败：' + err.statusText + ' (' + err.status +')';
                toastr.error(errInfo);
            })
        }
        getDatas();
    }

})();
