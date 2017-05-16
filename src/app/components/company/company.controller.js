/**
 * Created by Otherplayer on 16/7/21.
 */
(function () {
    'use strict';

    angular.module('smart_container').controller('CompanyController', CompanyController);

    /** @ngInject */
    function CompanyController(toastr,ApiServer,$stateParams,$state) {
        /* jshint validthis: true */
        var vm = this;

        var type = $stateParams.type;

        vm.items = [];
        vm.titles = ['公司名称','公司地址','公司网址','组织机构代码','税务登记号码','统一社会信用代码','商业标识','认证'];

        function getDatas() {
            ApiServer.userGetByRoleType(type,function (res) {
                vm.items = res.data;
                vm.displayedCollection = [].concat(vm.items);
            },function (err) {
                var errInfo = '获取数据失败：' + err.statusText + ' (' + err.status +')';
                toastr.error(errInfo);
            })
        }
        

        getDatas();
        
        
    }

})();
