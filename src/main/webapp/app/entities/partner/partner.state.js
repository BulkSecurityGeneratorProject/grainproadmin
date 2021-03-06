(function () {
    'use strict';

    angular
        .module('grainAdminApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
            .state('partner', {
                parent: 'entity',
                url: '/partner?page&sort&search',
                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'grainAdminApp.partner.home.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/entities/partner/partners.html',
                        controller: 'PartnerController',
                        controllerAs: 'vm'
                    }
                },
                params: {
                    page: {
                        value: '1',
                        squash: true
                    },
                    sort: {
                        value: 'id,asc',
                        squash: true
                    },
                    search: null
                },
                resolve: {
                    pagingParams: ['$stateParams', 'PaginationUtil', function ($stateParams, PaginationUtil) {
                        return {
                            page: PaginationUtil.parsePage($stateParams.page),
                            sort: $stateParams.sort,
                            predicate: PaginationUtil.parsePredicate($stateParams.sort),
                            ascending: PaginationUtil.parseAscending($stateParams.sort),
                            search: $stateParams.search
                        };
                    }],
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('partner');
                        $translatePartialLoader.addPart('nDS');
                        $translatePartialLoader.addPart('global');
                        $translatePartialLoader.addPart('contact');
                        $translatePartialLoader.addPart('servicePrice');
                        $translatePartialLoader.addPart('email');
                        return $translate.refresh();
                    }]
                }
            })
            .state('partner-detail', {
                parent: 'entity',
                url: '/partner/{id}?sort',
                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'grainAdminApp.partner.detail.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/entities/partner/partner-detail.html',
                        controller: 'PartnerDetailController',
                        controllerAs: 'vm'
                    }
                },
                params: {
                    sort: {
                        value: 'creationDate,desc',
                        squash: true
                    }
                },
                resolve: {
                    pagingParamsBuy: ['$stateParams', 'PaginationUtil', function ($stateParams, PaginationUtil) {
                        return {
                            sort: $stateParams.sort,
                            predicate: PaginationUtil.parsePredicate($stateParams.sort),
                            ascending: PaginationUtil.parseAscending($stateParams.sort)
                        };
                    }],
                    pagingParamsSell: ['$stateParams', 'PaginationUtil', function ($stateParams, PaginationUtil) {
                        return {
                            sort: $stateParams.sort,
                            predicate: PaginationUtil.parsePredicate($stateParams.sort),
                            ascending: PaginationUtil.parseAscending($stateParams.sort)
                        };
                    }],
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('partner');
                        $translatePartialLoader.addPart('nDS');
                        $translatePartialLoader.addPart('bidType');
                        $translatePartialLoader.addPart('contact');
                        $translatePartialLoader.addPart('servicePrice');
                        $translatePartialLoader.addPart('email');
                        $translatePartialLoader.addPart('bid');
                        $translatePartialLoader.addPart('qualityClass');
                        $translatePartialLoader.addPart('subscriptionConfig');
                        $translatePartialLoader.addPart('subscriptionType');
                        return $translate.refresh();
                    }],
                    entity: ['$stateParams', 'Partner', function ($stateParams, Partner) {
                        return Partner.get({id: $stateParams.id}).$promise;
                    }],
                    previousState: ["$state", function ($state) {
                        var currentStateData = {
                            name: $state.current.name || 'partner',
                            params: $state.params,
                            url: $state.href($state.current.name, $state.params)
                        };
                        return currentStateData;
                    }]
                }
            })
            .state('partner-detail.edit', {
                parent: 'partner-detail',
                url: '/detail/edit',
                data: {
                    authorities: ['ROLE_USER']
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/entities/partner/partner-dialog.html',
                        controller: 'PartnerDialogController',
                        controllerAs: 'vm',
                        backdrop: 'static',
                        size: 'lg',
                        resolve: {
                            entity: ['Partner', function (Partner) {
                                return Partner.get({id: $stateParams.id}).$promise;
                            }]
                        }
                    }).result.then(function () {
                        $state.go('^', {}, {reload: false});
                    }, function () {
                        $state.go('^');
                    });
                }]
            })
            .state('partner.new', {
                parent: 'partner',
                url: '/new',
                data: {
                    authorities: ['ROLE_USER']
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/entities/partner/partner-dialog.html',
                        controller: 'PartnerDialogController',
                        controllerAs: 'vm',
                        backdrop: 'static',
                        size: 'lg',
                        resolve: {
                            entity: function () {
                                return {
                                    name: null,
                                    shortName: null,
                                    inn: null,
                                    nds: null,
                                    card: null,
                                    lastUpdate: null,
                                    id: null,
                                    servicePrices: [],
                                    ownedBies: [],
                                    contacts: []
                                };
                            }
                        }
                    }).result.then(function () {
                        $state.go('partner', null, {reload: 'partner'});
                    }, function () {
                        $state.go('partner');
                    });
                }]
            })
            .state('partner.edit', {
                parent: 'partner',
                url: '/{id}/edit',
                data: {
                    authorities: ['ROLE_USER']
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/entities/partner/partner-dialog.html',
                        controller: 'PartnerDialogController',
                        controllerAs: 'vm',
                        backdrop: 'static',
                        size: 'lg',
                        resolve: {
                            entity: ['Partner', function (Partner) {
                                return Partner.get({id: $stateParams.id}).$promise;
                            }]
                        }
                    }).result.then(function () {
                        $state.go('partner', null, {reload: 'partner'});
                    }, function () {
                        $state.go('^');
                    });
                }]
            })
            .state('partner.delete', {
                parent: 'partner',
                url: '/{id}/delete',
                data: {
                    authorities: ['ROLE_USER']
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/entities/partner/partner-delete-dialog.html',
                        controller: 'PartnerDeleteController',
                        controllerAs: 'vm',
                        size: 'md',
                        resolve: {
                            entity: ['Partner', function (Partner) {
                                return Partner.get({id: $stateParams.id}).$promise;
                            }]
                        }
                    }).result.then(function () {
                        $state.go('partner', null, {reload: 'partner'});
                    }, function () {
                        $state.go('^');
                    });
                }]
            })
            .state('bid.addFor', {
                parent: 'partner-detail',
                url: '/bid/new',
                data: {
                    authorities: ['ROLE_USER']
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/entities/bid/bid-dialog.html',
                        controller: 'BidDialogController',
                        controllerAs: 'vm',
                        backdrop: 'static',
                        size: 'lg',
                        resolve: {
                            entity: function () {
                                return {
                                    creationDate: new Date(),
                                    qualityClass: null,
                                    qualityPassport: null,
                                    volume: null,
                                    price: null,
                                    nds: null,
                                    isActive: true,
                                    archiveDate: null,
                                    id: null
                                };
                            },
                            partner: ['Partner', function (Partner) {
                                return Partner.get({id: $stateParams.id}).$promise;
                            }],
                            translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                                $translatePartialLoader.addPart('nDS');
                                $translatePartialLoader.addPart('bidType');
                                $translatePartialLoader.addPart('contact');
                                $translatePartialLoader.addPart('bid');
                                $translatePartialLoader.addPart('qualityClass');
                                return $translate.refresh();
                            }]
                        }
                    }).result.then(function () {
                        $state.go('^', {}, {reload: false});
                    }, function () {
                        $state.go('^');
                    });
                }]
            })
            .state('bid.editFor', {
                parent: 'partner-detail',
                url: '/bid/{bidId}/edit',
                data: {
                    authorities: ['ROLE_USER']
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/entities/bid/bid-dialog.html',
                        controller: 'BidDialogController',
                        controllerAs: 'vm',
                        backdrop: 'static',
                        size: 'lg',
                        resolve: {
                            entity: ['Bid', function (Bid) {
                                return Bid.get({id: $stateParams.bidId}).$promise;
                            }],
                            partner: ['Partner', function (Partner) {
                                return Partner.get({id: $stateParams.id}).$promise;
                            }]
                        }
                    }).result.then(function () {
                        $state.go('^', {}, {reload: false, notify: false});
                    }, function () {
                        $state.go('^');
                    });
                }]
            })
            .state('partner-detail.subscriptionConfig', {
                parent: 'partner-detail',
                url: '/subscriptionConfig/edit',
                data: {
                    authorities: ['ROLE_USER']
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/entities/subscription-config/subscription-config-dialog.html',
                        controller: 'SubscriptionConfigDialogController',
                        controllerAs: 'vm',
                        backdrop: 'static',
                        size: 'lg',
                        resolve: {
                            entity: ['SubscriptionConfig', function (SubscriptionConfig) {
                                return SubscriptionConfig.getByPartner({partnerId: $stateParams.id}).$promise;
                            }]
                        }
                    }).result.then(function () {
                        $state.go('^', {}, {reload: false});
                    }, function () {
                        $state.go('^');
                    });
                }]
            })
            .state('partner-detail.quality-passport', {
                parent: 'partner-detail',
                url: '/bid/{bidId}/carousel',
                data: {
                    authorities: ['ROLE_USER']
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/entities/bid/bid-quality-passport.html',
                        controller: 'BidQualityPassportController',
                        controllerAs: 'vm',
                        backdrop: 'static',
                        size: 'lg',
                        resolve: {
                            entity: ['Bid', function (Bid) {
                                return Bid.get({id: $stateParams.bidId}).$promise;
                            }]
                        }
                    }).result.then(function () {
                        $state.go('^', {}, {reload: false});
                    }, function () {
                        $state.go('^');
                    });
                }]
            })
            .state('bid.archive', {
                parent: 'partner-detail',
                url: '/bid/{bidId}/archive',
                data: {
                    authorities: ['ROLE_USER']
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function ($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/entities/bid/bid-archive-dialog.html',
                        controller: 'BidArchiveController',
                        controllerAs: 'vm',
                        size: 'md',
                        resolve: {
                            entity: ['Bid', function (Bid) {
                                return Bid.get({id: $stateParams.bidId}).$promise;
                            }]
                        }
                    }).result.then(function () {
                        $state.go('^', {}, {reload: false});
                    }, function () {
                        $state.go('^');
                    });
                }]
            });
    }

})();
