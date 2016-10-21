(function() {
    'use strict';

    angular
        .module('grainAdminApp')
        .controller('BidDialogController', BidDialogController);

    BidDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'Bid', 'Contact', 'QualityValue', 'Partner'];

    function BidDialogController ($timeout, $scope, $stateParams, $uibModalInstance, entity, Bid, Contact, QualityValue, Partner) {
        var vm = this;

        vm.bid = entity;
        vm.clear = clear;
        vm.datePickerOpenStatus = {};
        vm.openCalendar = openCalendar;
        vm.save = save;
        vm.contacts = Contact.query();
        vm.qualityvalues = QualityValue.query();
        vm.partners = Partner.query();

        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function save () {
            vm.isSaving = true;
            if (vm.bid.id !== null) {
                Bid.update(vm.bid, onSaveSuccess, onSaveError);
            } else {
                Bid.save(vm.bid, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess (result) {
            $scope.$emit('grainAdminApp:bidUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        }

        function onSaveError () {
            vm.isSaving = false;
        }

        vm.datePickerOpenStatus.creationDate = false;
        vm.datePickerOpenStatus.archiveDate = false;

        function openCalendar (date) {
            vm.datePickerOpenStatus[date] = true;
        }
    }
})();