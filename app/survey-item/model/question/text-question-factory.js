(function() {
    'use strict';

    angular
        .module('otusjs.surveyItem')
        .factory('TextQuestionFactory', TextQuestionFactory);

    TextQuestionFactory.$inject = [
        'LabelFactory',
        'MetadataGroupFactory',
        'FillingRulesOptionFactory'
    ];

    function TextQuestionFactory(LabelFactory, MetadataGroupFactory, FillingRulesOptionFactory) {
        var self = this;

        /* Public interface */
        self.create = create;

        function create(templateID, prototype) {
            return new TextQuestion(templateID, prototype, LabelFactory, MetadataGroupFactory, FillingRulesOptionFactory);
        }

        return self;
    }

    function TextQuestion(templateID, prototype, LabelFactory, MetadataGroupFactory, FillingRulesOptionFactory) {
        var self = this;

        self.extents = prototype.objectType;
        self.objectType = 'TextQuestion';
        self.templateID = templateID;
        self.dataType = 'String';
        self.label = {
            ptBR: LabelFactory.create(),
            enUS: LabelFactory.create(),
            esES: LabelFactory.create()
        };
        self.metadata = MetadataGroupFactory.create();
        self.validate = FillingRulesOptionFactory.create();

        /* Public methods */
        self.isQuestion = isQuestion;
        self.validators = validators;
        self.toJson = toJson;

        function isQuestion() {
            return true;
        }

        function validators() {
            var validatorsList = [
                'mandatory',
                'alphanumeric',
                'lowercase',
                'minLength',
                'maxLength',
                'specials',
                'upperCase'
            ];
            return validatorsList;
        }

        function toJson() {
            var json = {};

            json.extents = self.extents;
            json.objectType = self.objectType;
            json.templateID = self.templateID;
            json.dataType = self.dataType;
            json.label = self.label;
            json.metadata = self.metadata;
            json.validate = self.validate;


            return JSON.stringify(json).replace(/"{/g, '{').replace(/\}"/g, '}').replace(/\\/g, '');
        }
    }

}());