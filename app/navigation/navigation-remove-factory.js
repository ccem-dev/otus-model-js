(function() {
    'use strict';

    angular
        .module('otusjs.navigation')
        .factory('NavigationRemoveFactory', NavigationRemoveFactory);

    NavigationRemoveFactory.$inject = ['NavigationContainerService'];

    function NavigationRemoveFactory(NavigationContainerService) {
        var self = this;

        /* Public interdace */
        self.create = create;

        function create(templateID) {
            return new NavigationRemove(templateID, NavigationContainerService);
        }

        return self;
    }

    function NavigationRemove(templateID, NavigationContainerService) {
        var self = this;

        /* Public methods */
        self.execute = execute;

        function execute() {
            if (NavigationContainerService.existsNavigationTo(templateID)) {
                var navigationToRecicle = NavigationContainerService.getNavigationByOrigin(templateID);
                var positionToRecicle = NavigationContainerService.getNavigationPosition(templateID);

                var navigationToUpdate = NavigationContainerService.getNavigationByPosition(positionToRecicle - 1);
                navigationToUpdate.routes = navigationToRecicle.routes;
                
                NavigationContainerService.removeNavigationOf(templateID);
            } else {
                NavigationContainerService.removeCurrentLastNavigation();
            }
        }
    }

}());
