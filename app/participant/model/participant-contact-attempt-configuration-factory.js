(function () {
  'use strict';

  angular
    .module('otusjs.model.participant')
    .factory('otusjs.model.participant.ParticipantContactAttemptConfigurationFactory', Factory);

  function Factory() {
    var self = this;

    /* Public methods */
    self.create = create;
    self.fromJson = fromJson;

    function create(attemptConfiguration) {
      return new ParticipantContactAttemptConfiguration(attemptConfiguration);
    }

    function fromJson(attemptConfiguration) {
      return new ParticipantContactAttemptConfiguration(attemptConfiguration);
    }

    return self;
  }

  function ParticipantContactAttemptConfiguration(attemptConfiguration) {
    var self = this;
    self.objectType = attemptConfiguration.objectType ? attemptConfiguration.objectType : "";
    self._id = attemptConfiguration._id ? attemptConfiguration._id : "";
    self.numberOfAttempts = attemptConfiguration.numberOfAttempts ? attemptConfiguration.numberOfAttempts : "";
    self.statusMetadata = attemptConfiguration.statusMetadata ? attemptConfiguration.statusMetadata : [];

    /* Public methods */
    self.toJSON = toJSON;

    function toJSON() {
      var json = {};
      json.objectType = self.objectType;
      json._id = self._id;
      json.numberOfAttempts = self.numberOfAttempts;
      json.statusMetadata = self.statusMetadata;

      return json;
    }

    return self;
  }

}());