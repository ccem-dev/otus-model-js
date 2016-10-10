(function() {
    'use strict';

    angular
        .module('otusjs.surveyItem')
        .factory('CheckboxAnswerOptionFactory', CheckboxAnswerOptionFactory);

    CheckboxAnswerOptionFactory.$inject = ['LabelFactory'];

    function CheckboxAnswerOptionFactory(LabelFactory) {
        var self = this;

        /* Public interface */
        self.create = create;
        self.createWithData = createWithData;

        function create(optionID) {
            return new CheckboxAnswerOption(optionID, LabelFactory);
        }

        function createWithData(checkboxAnswerOptionJSON) {
            var parsedJson = JSON.parse(checkboxAnswerOptionJSON);
            var CheckboxAnswerOptionObject = new CheckboxAnswerOption(parsedJson.optionID, LabelFactory);

            CheckboxAnswerOptionObject.optionID = parsedJson.optionID;
            CheckboxAnswerOptionObject.customOptionID = parsedJson.customOptionID;
            CheckboxAnswerOptionObject.label = parsedJson.label;

            return CheckboxAnswerOptionObject;
        }

        return self;
    }

    function CheckboxAnswerOption(optionID, LabelFactory) {
        var self = this;

        self.extents = 'StudioObject';
        self.objectType = 'CheckboxAnswerOption';
        self.optionID = optionID;
        self.customOptionID = optionID;
        self.dataType = 'Boolean';
        self.value = false;
        self.label = {
            ptBR: LabelFactory.create(),
            enUS: LabelFactory.create(),
            esES: LabelFactory.create()
        };

        /* Public methods */
        self.toJson = toJson;
        self.setCustomOptionID = setCustomOptionID;

        function setCustomOptionID(id) {
            self.customOptionID = id;
        }

        function toJson() {
            var json = {};

            json.extents = self.extents;
            json.objectType = self.objectType;
            json.optionID = self.optionID;
            json.customOptionID = self.customOptionID;
            json.dataType = self.dataType;
            json.value = self.value;
            json.label = self.label;

            return JSON.stringify(json).replace(/"{/g, '{').replace(/\}"/g, '}').replace(/\\/g, '');
        }
    }

}());
