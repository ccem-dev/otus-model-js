(function() {
    'use strict';

    angular
        .module('otusjs.activity')
        .service('ActivityFacadeService', ActivityFacadeService);

    ActivityFacadeService.$inject = [
        'AnswerFillFactory',
        'MetadataFillFactory',
        'QuestionFillFactory',
        'ActivitySurveyFactory'
    ];

    function ActivityFacadeService(AnswerFillFactory, MetadataFillFactory, QuestionFillFactory, ActivitySurveyFactory) {
        var self = this;
        self.activitySurvey = null;

        /* Public interface */
        self.createActivity = createActivity;
        self.createQuestionFill = createQuestionFill;
        self.openActivitySurvey = openActivitySurvey;
        self.initializeActivitySurvey = initializeActivitySurvey;


        function createActivity(category, group, templateOID, user) {
            self.activitySurvey = ActivitySurveyFactory.create(category, group, templateOID, user);
        }

        function openActivitySurvey() {
            self.activitySurvey.statusHistory.newOpenedRegistry();
        }

        function initializeActivitySurvey() {
            self.activitySurvey.statusHistory.newInitializedOnlineRegistry();
        }

        function createQuestionFill(questionID, answer, metadata, comment) {
            var question = QuestionFillFactory.create(questionID, answer, metadata, comment);
            self.activitySurvey.fillContainer.updateFilling(question);
            //console.log(self.activitySurvey);
            return question;
        }

    }

}());