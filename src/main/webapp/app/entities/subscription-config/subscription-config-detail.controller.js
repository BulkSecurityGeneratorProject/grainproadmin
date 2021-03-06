(function() {
    'use strict';

    angular
        .module('grainAdminApp')
        .controller('SubscriptionConfigDetailController', SubscriptionConfigDetailController);

    SubscriptionConfigDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'previousState', 'entity', 'SubscriptionConfig', 'Contact', 'Station', 'Partner'];

    function SubscriptionConfigDetailController($scope, $rootScope, $stateParams, previousState, entity, SubscriptionConfig, Contact, Station, Partner) {
        var vm = this;

        vm.subscriptionConfig = entity;
        vm.previousState = previousState.name;

        var unsubscribe = $rootScope.$on('grainAdminApp:subscriptionConfigUpdate', function(event, result) {
            vm.subscriptionConfig = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();
