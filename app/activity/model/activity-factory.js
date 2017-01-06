(function() {
  'use strict';

  angular
    .module('otusjs.model.activity')
    .factory('otusjs.model.activity.ActivityFactory', Factory);

  Factory.$inject = [
    'otusjs.model.activity.StatusHistoryManagerFactory',
    'otusjs.model.activity.FillingManagerService',
    'otusjs.model.activity.InterviewFactory',
    'otusjs.model.navigation.NavigationPathFactory',
    'SurveyFactory'
  ];

  var Inject = {};

  function Factory(StatusHistoryManagerFactory, FillingManagerService, InterviewFactory, NavigationPathFactory, SurveyFactory) {
    Inject.FillingManagerService = FillingManagerService;
    Inject.NavigationPathFactory = NavigationPathFactory;

    var self = this;
    self.OBJECT_TYPE = 'Activity';

    /* Public methods */
    self.create = create;
    self.createPaperActivity = createPaperActivity;
    self.fromJsonObject = fromJsonObject;

    function create(template, user, participant) {
      Inject.FillingManagerService.init();

      var statusHistory = StatusHistoryManagerFactory.create();
      statusHistory.newCreatedRegistry(user);

      var activity = new ActivitySurvey(template, participant, statusHistory);
      activity.mode = 'ONLINE';
      return activity;
    }

    function createPaperActivity(template, user, participant, paperActivityData) {
      Inject.FillingManagerService.init();

      var statusHistory = StatusHistoryManagerFactory.create();
      statusHistory.newCreatedRegistry(user);
      statusHistory.newInitializedOfflineRegistry(paperActivityData);

      var activity = new ActivitySurvey(template, participant, statusHistory);
      activity.mode = 'PAPER';
      return activity;
    }

    function fromJsonObject(jsonObject) {
      var activity = new ActivitySurvey(SurveyFactory.fromJsonObject(jsonObject.template), jsonObject.participantData);
      activity.mode = jsonObject.mode;
      activity.statusHistory = StatusHistoryManagerFactory.fromJsonObject(jsonObject.statusHistory);;
      activity.interviews = jsonObject.interviews.map(function(interview) {
        return InterviewFactory.fromJsonObject(interview);
      });
      return activity;
    }

    return self;
  }

  function ActivitySurvey(template, participant, statusHistory) {
    var self = this;

    self.objectType = 'Activity';
    self.activityID = null;
    self.template = template;
    self.participantData = participant;
    self.interviews = [];
    self.fillContainer = Inject.FillingManagerService;
    self.statusHistory = statusHistory;
    self.navigationStack = Inject.NavigationPathFactory.create();

    /* Public methods */
    self.getRealizationDate = getRealizationDate;
    self.getNavigationStack = getNavigationStack;
    self.setNavigationStack = setNavigationStack;
    self.toJson = toJson;

    function getRealizationDate() {
      var finalizedRegistries = self.statusHistory.getFinalizedRegistries();
      var lastFinalizedStatus = finalizedRegistries[finalizedRegistries.length - 1];
      var offlineInitialization = self.statusHistory.getInitializedOfflineRegistry();

      if (lastFinalizedStatus) {
        return lastFinalizedStatus.date;
      } else if(offlineInitialization) {
        return offlineInitialization.date;
      } else {
        throw new Error('Can not determine the realization date of Activity.');
      }
    }

    function getNavigationStack() {
      self.navigationStack.goToBeginning();
      return self.navigationStack;
    }

    function setNavigationStack(stack) {
      return self.navigationStack = stack;
    }

    function toJson() {
      var json = {};

      json.objectType = self.objectType;
      json.activityID = self.activityID;
      json.template = self.template.toJson();
      json.participantData = self.participantData;
      json.mode = self.mode;
      json.interviews = self.interviews.map(function(interview) {
        return interview.toJson();
      });
      json.fillContainer = self.fillContainer.toJson();
      json.statusHistory = self.statusHistory.toJson();
      // json.navigationStack = self.navigationStack.toJson();

      return JSON.stringify(json).replace(/"{/g, '{').replace(/\}"/g, '}').replace(/\\/g, '').replace(/ ":/g, '":');
    }
  }
}());
