(function() {
    'use strict';

    angular
        .module('otusjs.surveyItem')
        .service('SurveyItemManagerService', SurveyItemManagerService);

    SurveyItemManagerService.$inject = [
        'SurveyItemContainerService'
    ];

    function SurveyItemManagerService(SurveyItemContainerService) {
        var self = this;

        var incrementalIDValue = 0;

        /* Public interface */
        self.init = init;
        self.getItemList = getItemList;
        self.getItemListSize = getItemListSize;
        self.getItemByTemplateID = getItemByTemplateID;
        self.getItemByCustomID = getItemByCustomID;
        self.getItemByID = getItemByID;
        self.getAllCustomOptionsID = getAllCustomOptionsID;
        self.addItem = addItem;
        self.removeItem = removeItem;
        self.existsItem = existsItem;

        function init() {
            SurveyItemContainerService.init();
            incrementalIDValue = 0;
        }

        function getItemList() {
            return SurveyItemContainerService.getItemList();
        }

        function getItemListSize() {
            return SurveyItemContainerService.getItemListSize();
        }

        function getItemByTemplateID(templateID) {
            return SurveyItemContainerService.getItemByTemplateID(templateID);
        }

        function getItemByCustomID(customID) {
            return SurveyItemContainerService.getItemByCustomID(customID);
        }

        function getItemByID(id) {
            return SurveyItemContainerService.getItemByID(id);
        }

        function getAllCustomOptionsID() {
            var customOptionsID = [];
            var checkboxQuestions = SurveyItemContainerService.getAllCheckboxQuestion();
            if(checkboxQuestions.length > 0) {
                checkboxQuestions.forEach(function(checkboxQuestion){
                    checkboxQuestion.getAllCustomOptionsID().forEach(function(customOptionID){
                        customOptionsID.push(customOptionID);
                    });
                });
            }
            return customOptionsID;
        }

        function addItem(itemType, templateIDPrefix) {
            var templateID = templateIDPrefix + getNextIncrementalGenerator();
            var item = SurveyItemContainerService.createItem(itemType, templateID);
            return item;
        }

        function removeItem(templateID) {
            SurveyItemContainerService.removeItem(templateID);
        }

        function getNextIncrementalGenerator() {
            return ++incrementalIDValue;
        }

        function existsItem(id) {
            return SurveyItemContainerService.existsItem(id);
        }

    }

}());
