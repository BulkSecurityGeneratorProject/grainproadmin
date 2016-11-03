(function () {
    'use strict';

    angular
        .module('grainAdminApp')
        .controller('PartnerDialogController', PartnerDialogController);

    PartnerDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'Partner',
        'OrganisationType', 'District', 'Region', 'Locality', 'Station', 'Contact', 'ServicePrice', 'ServiceType',
        '$q', 'Email'
    ];

    function PartnerDialogController($timeout, $scope, $stateParams, $uibModalInstance, entity, Partner,
                                     OrganisationType, District, Region, Locality, Station,
                                     Contact, ServicePrice, ServiceType, $q, Email) {
        var vm = this;

        vm.partner = entity;
        vm.children = vm.partner.ownedBies.map(function (child) {
            return {
                obj: child
            }
        });
        vm.clear = clear;
        vm.datePickerOpenStatus = {};
        vm.openCalendar = openCalendar;
        vm.save = save;
        vm.partners = Partner.query();
        vm.getPartnersSuggestions = getPartnersSuggestions;
        vm.organisationtypes = OrganisationType.query();
        vm.districts = District.query();
        vm.regions = Region.query();
        vm.localities = Locality.query();
        vm.stations = Station.query();
        vm.contacts = Contact.query();
        vm.servicePriceTypes = ServiceType.query();
        vm.formatSelection = formatSelection;
        vm.isAddChild = false;
        vm.addChild = addChild;
        vm.isAddServicePrice = false;
        vm.selectedServicePriceType = null;
        vm.selectedservicePriceValue = null;
        vm.addServicePrice = addServicePrice;
        vm.cancelAddServicePrice = cancelAddServicePrice;
        vm.isAddContact = false;
        vm.selectedContact = {
            personName: null,
            status: null,
            phone: null,
            skype: null,
            emailEmail: null
        };
        vm.addContact = addContact;
        vm.cancelAddContact = cancelAddContact;
        vm.selectedNDS = {
            "INCLUDED": vm.partner.nds === 'INCLUDED' || vm.partner.nds === 'BOTH',
            'EXCLUDED': vm.partner.nds === 'EXCLUDED' || vm.partner.nds === 'BOTH'
        };
        vm.partnerPostUpdateNeeded = false;

        $timeout(function () {
            angular.element('.form-group:eq(1)>input').focus();
        });

        function clear() {
            $uibModalInstance.dismiss('cancel');
        }

        function save() {
            vm.isSaving = true;
            updateAllRelatedObjectsOnUpdate(vm.partner).then(function (partner) {
                partner.lastUpdate = new Date();
                partner.nds = vm.selectedNDS.INCLUDED ? (vm.selectedNDS.EXCLUDED ? 'BOTH' : 'INCLUDED') : 'EXCLUDED';
                if (partner.id !== null) {
                    updateAllRelatedPartnersOnUpdate(partner);
                    Partner.update(partner, onSaveSuccess, onSaveError);
                } else {
                    vm.partnerPostUpdateNeeded = true;
                    Partner.save(partner, onSaveSuccess, onSaveError);
                }
            });
        }

        function updateAllRelatedPartnersOnUpdate(partner) {
            //if any child has ben added/removed
            vm.children.forEach(function (child, index) {
                if (child.obj === null) {
                    child = partner.ownedBies[index];
                    child.ownerForId = null;
                    Partner.update(child);
                } else {
                    if (child.obj.ownerForId !== partner.id) {
                        child.obj.ownerForId = partner.id;
                        Partner.update(child.obj);
                    }
                }
            });
        }

        function updateAllRelatedObjectsOnUpdate(partner) {
            var returnDeferred = $q.defer();
            var promises = [];
            var updatedServicePrices = [];
            var updatedContacts = [];
            var returnPartner = angular.copy(partner);
            returnPartner.servicePrices = [];
            returnPartner.contacts = [];
            partner.servicePrices.forEach(function (servicePrice) {
                if (!servicePrice.id) {
                    promises.push(
                        ServicePrice.save(servicePrice, function (updatedServicePrice) {
                            updatedServicePrices.push(updatedServicePrice);
                        }).$promise
                    );
                } else {
                    updatedServicePrices.push(servicePrice);
                }
            });

            partner.contacts.forEach(function (contact) {
                if (!contact.id) {
                    var contactDeferred = $q.defer();
                    promises.push(contactDeferred.promise);

                    var emailPromise = null;
                    if (contact.emailEmail) {
                        var email = {
                            email: contact.emailEmail
                        };
                        emailPromise = Email.save(email, function (updatedEmail) {
                            contact.emailId = updatedEmail.id;
                        }).$promise
                    }

                    if (emailPromise) {
                        emailPromise.then(function () {
                            updateAndAddContact(updatedContacts, contact).then(function () {
                                contactDeferred.resolve();
                            });
                        });
                    } else {
                        updateAndAddContact(updatedContacts, contact).then(function () {
                            contactDeferred.resolve();
                        });
                    }
                } else {
                    updatedContacts.push(contact);
                }
            });

            $q.all(promises).then(function () {
                returnPartner.servicePrices = updatedServicePrices;
                returnPartner.contacts = updatedContacts;
                returnDeferred.resolve(returnPartner);
            }, function (reason) {
                returnDeferred.reject(reason);
            });

            return returnDeferred.promise;
        }

        function updateAndAddContact(contacts, contact) {
            return Contact.save(contact, function (updatedContact) {
                contacts.push(updatedContact);
            }).$promise;
        }

        function onSaveSuccess(result) {
            $scope.$emit('grainAdminApp:partnerUpdate', result);
            if (vm.partnerPostUpdateNeeded) {
                updateAllRelatedPartnersOnUpdate(result);
            }

            $uibModalInstance.close(result);
            vm.isSaving = false;
        }

        function onSaveError() {
            vm.isSaving = false;
        }

        vm.datePickerOpenStatus.lastUpdate = false;

        function openCalendar(date) {
            vm.datePickerOpenStatus[date] = true;
        }

        function formatSelection(selectedValue, objects, parameterName) {
            if (!selectedValue) return "";

            return objects.find(function (object) {
                return object.id === selectedValue;
            })[parameterName];
        }

        function addChild() {
            vm.children.push({obj: null});
            vm.isAddChild = false;
        }

        function getPartnersSuggestions() {
            return vm.partners.filter(function (partner) {
                return partner.id !== vm.partner.id &&
                    partner.id !== vm.partner.ownerForId &&
                    vm.partner.ownedBies.filter(
                        function (child) {
                            return child.id === partner.id;
                        }
                    ).length <= 0;
            });
        }

        function addServicePrice() {
            if (vm.selectedServicePriceType != null && vm.selectedservicePriceValue != null) {
                vm.partner.servicePrices.push(
                    {
                        serviceTypeId: angular.copy(vm.selectedServicePriceType.id),
                        serviceTypeName: angular.copy(vm.selectedServicePriceType.name),
                        price: angular.copy(vm.selectedservicePriceValue)
                    }
                );
                vm.isAddServicePrice = false;
                vm.selectedServicePriceType = null;
                vm.selectedservicePriceValue = null;
            }
        }

        function cancelAddServicePrice() {
            vm.selectedServicePriceType = null;
            vm.selectedservicePriceValue = null;
            vm.isAddServicePrice = false;
        }

        function addContact() {
            if (vm.selectedContact != null) {
                vm.partner.contacts.push(vm.selectedContact);
                vm.isAddContact = false;
                vm.selectedContact = null;
            }
        }

        function cancelAddContact() {
            vm.selectedContact = null;
            vm.isAddContact = false;
        }
    }
})();
