(function () {
    'use strict';

    angular.module('otusjs.survey')
      .service('otusjs.survey.ManagerCenterService', Service);

    function Service() {
      var self = this;
      var _surveyItemManager, _navigationManager, _surveyItemGroupManager;

      self.initialize = initialize;
      self.getSurveyItemManager = getSurveyItemManager;
      self.getNavigationManager = getNavigationManager;
      self.getSurveyItemGroupManager = getSurveyItemGroupManager;

      function initialize(surveyItemManager, navigationManager, surveyItemGroupManager) {
        _surveyItemManager = surveyItemManager;
        _navigationManager = navigationManager;
        _surveyItemGroupManager = surveyItemGroupManager;
      }

      function getSurveyItemManager() {
        return _surveyItemManager;
      }


      function getNavigationManager() {
        return _navigationManager;
      }

      function getSurveyItemGroupManager() {
        return _surveyItemGroupManager;
      }
    }
} ());