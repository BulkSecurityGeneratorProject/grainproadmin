(function() {
    'use strict';

    angular
        .module('grainAdminApp')
        .controller('MarketController', MarketController);

    MarketController.$inject = ['$scope', '$state', 'bids', 'StationSearch', 'Market'];

    function MarketController ($scope, $state, bids, StationSearch, Market) {
        var vm = this;
        vm.bids = bids;
        vm.getFCAPrice = getFCAPrice;
        vm.getCPTPrice = getCPTPrice;
        vm.refreshStationSuggestions = refreshStationSuggestions;
        vm.stations = [];
        vm.station = null;
        vm.onSelectStation = onSelectStation;

        function getFCAPrice(bid) {
            var price = parseFloat(bid.price);
            if (!bid.elevator.servicePrices) {
                console.error("Service price for elevator %o is unavailable!! ", bid.elevator);
                return 0;
            }

            var loadPrice = parseFloat(bid.elevator.servicePrices[0].price);

            var result = 0;

            if (price) {
                result += price;
            }

            if (loadPrice) {
                result += loadPrice;
            }

            return result;
        }

        function getCPTPrice(bid) {
            var result = getFCAPrice(bid);
            var transpPrice = parseFloat(bid.transportationPricePrice);

            if (transpPrice) {
                result += transpPrice;
            }

            return result;
        }

        function refreshStationSuggestions(term) {
            if (term) {
                vm.stations = StationSearch.query({query: term});
            }
            return null;
        }

        function onSelectStation() {
            if (vm.station && vm.station.code) {
                vm.bids = Market.query({code: vm.station.code});
            } else {
                vm.bids = Market.query();
            }
        }
    }
})();