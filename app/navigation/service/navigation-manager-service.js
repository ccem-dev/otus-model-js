(function() {
  'use strict';

  angular
    .module('otusjs.model.navigation')
    .factory('otusjs.model.navigation.NavigationManagerFactory', Factory);

  Factory.$inject = [
    'otusjs.model.navigation.NavigationContainerFactory',
    'otusjs.model.navigation.NavigationAddService',
    'otusjs.model.navigation.NavigationRemoveService',
    'otusjs.model.navigation.CreateDefaultRouteTaskService',
    'otusjs.model.navigation.AddAlternativeRouteTaskService',
    'otusjs.model.navigation.RemoveRouteTaskService',
    'otusjs.model.navigation.UpdateRouteTaskService',
    'otusjs.model.navigation.NavigationValidatorService',
    'otusjs.model.navigation.InitialNodesAddService'
  ];

  var Inject = {};

  function Factory(
    NavigationContainerFactory,
    NavigationAddService,
    NavigationRemoveService,
    CreateDefaultRouteTaskService,
    AddAlternativeRouteTaskService,
    RemoveRouteTaskService,
    UpdateRouteTaskService,
    NavigationValidatorService,
    InitialNodesAddService
  ) {

    Inject.NavigationAddService = NavigationAddService;
    Inject.NavigationRemoveService = NavigationRemoveService;
    Inject.CreateDefaultRouteTaskService = CreateDefaultRouteTaskService;
    Inject.AddAlternativeRouteTaskService = AddAlternativeRouteTaskService;
    Inject.RemoveRouteTaskService = RemoveRouteTaskService;
    Inject.UpdateRouteTaskService = UpdateRouteTaskService;
    Inject.NavigationValidatorService = NavigationValidatorService;
    Inject.InitialNodesAddService = InitialNodesAddService;

    var self = this;

    self.create = create;

    function create(SurveyItemManager) {
      return new NavigationManager(SurveyItemManager, NavigationContainerFactory.create());
    }

    return self;
  }

  function NavigationManager(SurveyItemManager, NavigationContainer) {

    var self = this;
    var _selectedNavigation = null;

    /* Public interface */
    self.init = init;
    self.loadJsonData = loadJsonData;
    self.getNavigationList = getNavigationList;
    self.getDefaultNavigationPath = getDefaultNavigationPath;
    self.selectNavigationByOrigin = selectNavigationByOrigin;
    self.selectedNavigation = selectedNavigation;
    self.addNavigation = addNavigation;
    self.applyRoute = applyRoute;
    self.deleteRoute = deleteRoute;
    self.removeNavigation = removeNavigation;
    self.getAvaiableRuleCriterionTargets = getAvaiableRuleCriterionTargets;
    self.listOrphanNavigations = listOrphanNavigations;
    self.getExportableList = getExportableList;

    function init() {
      NavigationContainer.init();
      _generateNavigation();
    }

    function loadJsonData(data) {
      NavigationContainer.loadJsonData(data);
    }

    function _updateRoutesOnLoad() {
      var navList = getNavigationList();
      data.forEach(function(jsonNav) {
        _selectedNavigation = selectNavigationByOrigin(jsonNav.origin);
        jsonNav.routes.forEach(function(route) {
          applyRoute(route);
        });
      });
    }

    function getNavigationList() {
      return NavigationContainer.getNavigationList();
    }

    function getExportableList() {
      var fullList = NavigationContainer.getNavigationList();
      return fullList.slice(2, fullList.length);
    }

    function getDefaultNavigationPath() {
      var navigations = getNavigationList();
      var currentPathState = navigations[0];
      var defaultPath = [currentPathState];

      navigations.forEach(function(navigation) {
        if (navigation.origin === currentPathState.getDefaultRoute().destination) {
          defaultPath.push(navigation);
          currentPathState = navigation;
        }
      });

      return defaultPath;
    }

    function selectNavigationByOrigin(origin) {
      _selectedNavigation = NavigationContainer.getNavigationByOrigin(origin);
      return _selectedNavigation;
    }

    function selectedNavigation() {
      return _selectedNavigation;
    }

    function addNavigation() {
      if (!NavigationContainer.getNavigationListSize()) {  //TODO remove?
        _generateNavigation();
      }
      _selectedNavigation = Inject.NavigationAddService.execute();

    }

    function _generateNavigation() {
      Inject.InitialNodesAddService.execute();
    }

    function applyRoute(routeData) {
      if (_selectedNavigation.hasRoute(routeData)) {
        return Inject.UpdateRouteTaskService.execute(routeData, _selectedNavigation);
      } else if (routeData.isDefault) {
        Inject.CreateDefaultRouteTaskService.execute(routeData, _selectedNavigation);
      } else {
        Inject.AddAlternativeRouteTaskService.execute(routeData, _selectedNavigation);
      }
    }

    function deleteRoute(routeData) {
      Inject.RemoveRouteTaskService.execute(routeData, _selectedNavigation);
    }

    function removeNavigation(templateID) {
      Inject.NavigationRemoveService.execute(templateID);
    }

    function getAvaiableRuleCriterionTargets(referenceItemID) {
      var referenceItemIndex = SurveyItemManager.getItemPosition(referenceItemID);
      var allItems = SurveyItemManager.getItemList();

      var avaiableItems = allItems.filter(function(item, index) {
        return index <= referenceItemIndex;
      });

      return avaiableItems;
    }

    function listOrphanNavigations() {
      return NavigationContainer.getOrphanNavigations();
    }
  }
}());
