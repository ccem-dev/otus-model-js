(function() {
  'use strict';

  angular
    .module('otusjs.survey')
    .factory('SurveyIdentityFactory', SurveyIdentityFactory);

  function SurveyIdentityFactory() {
    var self = this;

    self.OBJECT_TYPE = 'SurveyIdentity';

    /* Public interface */
    self.create = create;
    self.fromJsonObject = fromJsonObject;

    function fromJsonObject(jsonObject) {
      if (typeof jsonObject === 'string') {
        throw new Error("otusjs.model.survey.model.SurveyIdentityFactory.fromJsonObject() method expects to receive a object instead a String");
      }
      var surveyIdentity = new SurveyIdentity(jsonObject.name, jsonObject.acronym, jsonObject.version);

      surveyIdentity.recommendedTo = jsonObject.recommendedTo;
      surveyIdentity.description = jsonObject.description;
      surveyIdentity.keywords = jsonObject.keywords;

      return surveyIdentity;
    }

    function create(name, acronym) {
      return new SurveyIdentity(name, acronym);
    }

    return self;
  }

  function SurveyIdentity(name, acronym) {
    var self = this;

    self.extents = 'StudioObject';
    self.objectType = 'SurveyIdentity';
    self.name = name;
    self.acronym = acronym;
    self.recommendedTo = '';
    self.description = '';
    self.keywords = [];

    /* Public methods */
    self.toJSON = toJSON;

    function toJSON() {
      var json = {};

      json.extents = self.extents;
      json.objectType = self.objectType;
      json.name = self.name;
      json.acronym = self.acronym;
      json.recommendedTo = self.recommendedTo;
      json.description = self.description;
      json.keywords = self.keywords;

      return json;
    }
  }

}());
