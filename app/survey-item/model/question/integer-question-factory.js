(function() {
  'use strict';

  angular
    .module('otusjs.surveyItem')
    .factory('IntegerQuestionFactory', IntegerQuestionFactory);

  IntegerQuestionFactory.$inject = [
    'LabelFactory',
    'MetadataGroupFactory',
    'UnitFactory',
    'FillingRulesOptionFactory'
  ];

  function IntegerQuestionFactory(LabelFactory, MetadataGroupFactory, UnitFactory, FillingRulesOptionFactory) {
    var self = this;

    /* Public interface */
    self.create = create;
    self.fromJson = fromJson;

    function create(templateID, prototype) {
      var labelObject = LabelFactory.create();
      var metadataGroupObject = MetadataGroupFactory.create();
      var fillingRulesObject = FillingRulesOptionFactory.create();

      var unitObject = {};
      unitObject.ptBR = UnitFactory.create();
      unitObject.enUS = UnitFactory.create();
      unitObject.esES = UnitFactory.create();

      return new IntegerQuestion(templateID, prototype, labelObject, metadataGroupObject, unitObject, fillingRulesObject);
    }

    function fromJson(json) {
      if (typeof json === 'string') {
        throw new Error("otusjs.model.misc.model.IntegerQuestionFactory.fromJson() method expects to receive a object instead a String");
      }
      var labelObject = LabelFactory.fromJson(json.label);
      var metadataGroupObject = MetadataGroupFactory.fromJson(json.metadata);
      var fillingRulesObject = FillingRulesOptionFactory.fromJson(json.fillingRules);

      var unitObject = {};
      unitObject.ptBR = UnitFactory.fromJson(json.unit.ptBR);
      unitObject.enUS = UnitFactory.fromJson(json.unit.enUS);
      unitObject.esES = UnitFactory.fromJson(json.unit.esES);

      var prototype = {};
      prototype.objectType = "SurveyItem";
      var question = new IntegerQuestion(json.templateID, prototype, labelObject, metadataGroupObject, fillingRulesObject);
      question.customID = json.customID;

      return question;
    }

    return self;
  }

  function IntegerQuestion(templateID, prototype, labelObject, metadataGroupObject, unitObject, fillingRulesObject) {
    var self = this;

    self.extents = prototype.objectType;
    self.objectType = 'IntegerQuestion';
    self.templateID = templateID;
    self.customID = templateID;
    self.dataType = 'Integer';
    self.label = labelObject;
    self.metadata = metadataGroupObject;
    self.fillingRules = fillingRulesObject;
    self.unit = unitObject;

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
        'distinct',
        'lowerLimit',
        'upperLimit',
        'precision',
        'in'
      ];
      return validatorsList;
    }

    function toJson() {
      var json = {};

      json.extents = self.extents;
      json.objectType = self.objectType;
      json.templateID = self.templateID;
      json.customID = self.customID;
      json.dataType = self.dataType;
      json.label = self.label;
      json.metadata = self.metadata;
      json.unit = self.unit;
      json.fillingRules = self.fillingRules;


      return JSON.stringify(json).replace(/"{/g, '{').replace(/\}"/g, '}').replace(/\\/g, '');
    }
  }

}());
