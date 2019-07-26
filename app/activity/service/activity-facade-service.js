(function () {
  'use strict';

  angular
    .module('otusjs.model.activity')
    .service('otusjs.model.activity.ActivityFacadeService', ActivityFacadeService);

  ActivityFacadeService.$inject = [
    'otusjs.model.activity.AnswerFillFactory',
    'otusjs.model.activity.MetadataFillFactory',
    'otusjs.model.activity.QuestionFillFactory',
    'otusjs.model.activity.ActivityFactory',
    'otusjs.model.activity.InterviewFactory',
    'otusjs.model.activity.RevisionFactory'
  ];

  function ActivityFacadeService(
    AnswerFillFactory,
    MetadataFillFactory,
    QuestionFillFactory,
    ActivityFactory,
    InterviewFactory,
    ActivityRevisionFactory
  ) {
    var self = this;
    var _user = null;
    self.surveyActivity = null;

    /* Public interface */
    self.createActivity = createActivity;
    self.createPaperActivity = createPaperActivity;
    self.createQuestionFill = createQuestionFill;
    self.fillQuestion = fillQuestion;
    self.getInterviewer = getInterviewer;
    self.openActivitySurvey = openActivitySurvey;
    self.initializeActivitySurvey = initializeActivitySurvey;
    self.finalizeActivitySurvey = finalizeActivitySurvey;
    self.saveActivitySurvey = saveActivitySurvey;
    self.getFillingByQuestionID = getFillingByQuestionID;
    self.clearSkippedAnswers = clearSkippedAnswers;
    self.getNavigationTracker = getNavigationTracker;
    self.createActivityRevision = createActivityRevision;
    self.createActivityRevisionFromJson = createActivityRevisionFromJson;
    self.getWholeTemplateVariableList = getWholeTemplateVariableList;
    self.getItemStaticVariableList = getItemStaticVariableList;
    self.fillStaticVariablesValues = fillStaticVariablesValues;

    function createActivity(template, user, participant, activityConfiguration) {
      self.surveyActivity = ActivityFactory.create(template, user, participant, activityConfiguration);
    }

    function createPaperActivity(template, user, participant, paperActivityData, activityConfiguration) {
      self.surveyActivity = ActivityFactory.createPaperActivity(template, user, participant, paperActivityData, activityConfiguration);
      self.surveyActivity.interviews.push(InterviewFactory.create(paperActivityData));
    }

    function getInterviewer() {
      return _user;
    }

    function openActivitySurvey(user) {
      _user = user;
      self.surveyActivity.statusHistory.newOpenedRegistry(_user);
    }

    function initializeActivitySurvey() {
      self.surveyActivity.statusHistory.newInitializedOnlineRegistry(_user);
      self.surveyActivity.interviews.push(InterviewFactory.create(_user));
    }

    function finalizeActivitySurvey() {
      self.surveyActivity.statusHistory.newFinalizedRegistry(_user);
    }

    function saveActivitySurvey() {
      self.surveyActivity.statusHistory.newSavedRegistry(_user);
    }

    function createQuestionFill(question, answer, metadata, comment) {
      return QuestionFillFactory.create(question, answer, metadata, comment);
    }

    function fillQuestion(filling) {
      self.surveyActivity.fillContainer.updateFilling(filling);
    }

    function getFillingByQuestionID(questionID) {
      return self.surveyActivity.fillContainer.searchFillingByID(questionID);
    }

    function clearSkippedAnswers() {
      self.surveyActivity.clearSkippedAnswers();
    }

    function getNavigationTracker() {
      return self.surveyActivity.getNavigationTracker();
    }

    function createActivityRevision(activityId, revisionDate) {
      return ActivityRevisionFactory.create(activityId, revisionDate);
    }

    function createActivityRevisionFromJson(jsonArray) {
      return ActivityRevisionFactory.fromJson(jsonArray);
    }

    function getWholeTemplateVariableList() {
      return self.surveyActivity.getWholeTemplateVariableList();
    }

    function getItemStaticVariableList(itemID) {
      return self.surveyActivity.getItemStaticVariableList(itemID);
    }

    function fillStaticVariablesValues(fillingArray) {
      return self.surveyActivity.fillStaticVariablesValues(fillingArray);
    }
  }
}());
