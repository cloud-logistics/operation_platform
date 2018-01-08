/**
 * Created by Otherplayer on 2016/12/12.
 */

(function () {
    'use strict';
    /**
     *
     * facotry是一个单例,它返回一个包含service成员的对象。
     * 注：所有的Angular services都是单例，这意味着每个injector都只有一个实例化的service。
     *
     */
    angular
        .module('smart_container')
        .factory('MainServer', MainServer);

    /** @ngInject */
    function MainServer(constdata,NetworkService) {

        var service = {
            jsonQueryStandard: jsonQueryStandard,
            setSelect2Fn:setSelect2Fn
        };

        return service;

        ////////////

        function jsonQueryStandard(param, successHandler, failedHandler) {
            NetworkService.post( constdata.api.query, param, successHandler, failedHandler);
        }

        function setSelect2Fn(domId,selectionCallback,initialValue){

            $("#"+domId).select2({
                placeholder: initialValue,
                ajax: {
                    url:location.href.indexOf("localhost") > -1 ?
                        constdata.apiHost_OFFLINE + "fuzzyDeviceid"
                        : "/container/api/v1/cloudbox/monservice/fuzzyDeviceid",
                    dataType: 'json',
                    delay: 250,
                    headers:{
                        Authorization:JSON.parse(localStorage.getItem("airspc_access_authorization")).val.Authorization
                    },
                    data: function (params) {
                        return {
                            deviceid: params.term,
                        };
                    },
                    processResults: function (response) {
                        var data = _.map(response.data, function (item, index) {
                            return {
                                id: index,
                                text: item
                            }
                        });
                        return {
                            results: data
                        };
                    },
                    cache: false
                },
                escapeMarkup: function (markup) {
                    return markup;
                },
                minimumInputLength: 1,
                templateResult:function formatRepo(results){
                    return results.text;
                },
                templateSelection: function formatRepoSelection(results){
                    selectionCallback(results.text);
                    return results.text;
                }
            });

            $("select[id='" + domId + "']").prop("enable", true);
        }

    }


})();
