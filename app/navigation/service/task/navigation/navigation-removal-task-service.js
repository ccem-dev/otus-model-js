(function () {
  'use strict';

  angular
    .module('otusjs.model.navigation')
    .service('otusjs.model.navigation.NavigationRemovalTaskService', Service);

  Service.$inject = [
    'otusjs.model.navigation.RouteUpdateTaskService'
  ];

  function Service(RouteUpdateTaskService) {
    var self = this;
    var _container = null;

    /* Public methods */
    self.setContainer = setContainer;
    self.execute = execute;

    function setContainer(container) {
      _container = container;
    }

    function execute(templateID) {
      let navigationToRemove = _container.getNavigationByOrigin(templateID);
      let inNavigations = angular.copy(navigationToRemove.inNavigations);

      inNavigations.forEach(inNavigation => _updateInRoutes(inNavigation));

      //TODO remove conditions that take navigationToRemove into account

      _container.removeNavigationOf(templateID);
      _container.reorderNavigationIndex();

      function _updateInRoutes(inNavigation) {
        let navigationToUpdate = _container.getNavigationByOrigin(inNavigation.origin);

        if (navigationToUpdate) {
          if (navigationToUpdate.isDefaultRoute(templateID)) {
            let routeData = _getRouteData(navigationToUpdate, navigationToRemove);
            RouteUpdateTaskService.execute(routeData, navigationToUpdate);
          } else {
            let navigation = _container.getNavigationByOrigin(inNavigation.origin);
            navigation.removeRouteByDestination(templateID);
          }
        }
      }
    }

    function _getRouteData(navigationToUpdate, navigationToRecycle) {
      var routeData = {};
      routeData.isDefault = true;
      routeData.origin = navigationToUpdate.routes[0].origin;
      routeData.destination = navigationToRecycle.routes[0].destination;

      if (navigationToUpdate.origin === "BEGIN NODE") {
        let newDestination = _container.getNextOf(_container.getNavigationPosition(navigationToRecycle));
        routeData.destination = newDestination.origin;
      }

      return routeData;
    }
  }
}());
