(function() {
    'use strict';

    angular
        .module('otusjs.activity')
        .service('ActivityFacadeService', ActivityFacadeService);

    ActivityFacadeService.$inject = [
        'FillingManagerService',
        'StatusHistoryManagerService',
        'AnswerFillFactory',
        'MetadataFillFactory',
        'QuestionFillFactory',
        'ActivitySurvey'
    ];

    function ActivityFacadeService(FillingManagerService, StatusHistoryManagerService, AnswerFillFactory, MetadataFillFactory, QuestionFillFactory, ActivitySurvey) {
        var self = this;

        /* Public interface */
        self.fillQuestion = fillQuestion;

        /**

        var reposta = fachada.criarResposta(reposta);
        var metadata = fachada.criarMetadata(metadata);
        fachada.criarQuestao(1, reposta, metadata, comentario);

        **/

        function createAnswerFill(answer) {
            return AnswerFillFactory.create(answer);
        }

        function createMetadataFill(metadata) {
            return MetadataFillFactory.create(metadata);
        }

        function createQuestionFill(questionID, answer, metadata, comment) {
            var question = QuestionFillFactory.create(questionID, answer, metadata, comment);
            //TODO: adicionar na lista de fillingList, é preciso decidir quando iniciar a lista
            FillingManagerService.updateFilling(question);
            return question;
        }

        function addFillingOnList(question) {
            FillingManagerService.updateFilling(question);
        }

        function updateFillingOnList(question) {
            FillingManagerService.updateFilling(question);
        }

        function removeFillingOnList(question) {
            // FillingManagerService._removeFilling(question.questionID);
        }

        function searchFillingByIDOnList(questionID) {
            return FillingManagerService.searchFillingByID(questionID);
        }

        function createActivitySurvey(category, group, templateOID) {
            return ActivitySurvey.create(category, group, templateOID, FillingManagerService, StatusHistoryManagerService)
        }
    }

}());
