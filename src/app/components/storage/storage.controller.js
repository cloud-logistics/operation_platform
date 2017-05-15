/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('airs').controller('StorageController', StorageController);

    /** @ngInject */
    function StorageController($stateParams,ApiServer,toastr) {
        /* jshint validthis: true */
        var vm = this;

        vm.statusType = [{id:'a',name:'空闲'},{id:'b',name:'使用中'}];
        vm.status = 'a';

        var storageId = $stateParams.storageId;

        vm.submitAction = submitAction;

        function submitAction() {
            var param = {};

            if (storageId === 'new'){
                ApiServer.containerAdd(param,function (res) {
                    toastr.success('添加成功');
                },function (err) {
                    var errInfo = '添加失败：' + err.statusText + ' (' + err.status +')';
                    toastr.error(errInfo);
                });
            }else {
                ApiServer.containerUpdate(null,function (res) {
                    toastr.success('更新成功');
                },function (err) {
                    var errInfo = '更新失败：' + err.statusText + ' (' + err.status +')';
                    toastr.error(errInfo);
                });
            }

        }
        function getData() {
            if (storageId !== 'new'){
                ApiServer.containerGet(storageId,function (res) {
                    console.log(res);
                },function (err) {
                    var errInfo = '获取数据失败：' + err.statusText + ' (' + err.status +')';
                    toastr.error(errInfo);
                });
            }
        }

        getData();

    }

})();
