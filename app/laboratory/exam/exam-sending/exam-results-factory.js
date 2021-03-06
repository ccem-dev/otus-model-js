(function() {
  'use strict';

  angular
    .module('otusjs.laboratory.exam.sending')
    .factory('otusjs.laboratory.exam.sending.ExamResults', Factory);

  Factory.$inject = [
    'otusjs.laboratory.exam.sending.ExamObservation'
  ];

  function Factory(ExamObservation) {
    var self = this;
    self.create = create;
    self.fromJson = fromJson;

    function create() {
      return new ExamResults(ExamObservation, {});
    }

    function fromJson(resultInfoArray) {
      if (Array.isArray(resultInfoArray)) {
        return resultInfoArray.map(function(result) {
          return new ExamResults(ExamObservation, result);
        });
      } else {
        return [];
      }
    }

    return self;
  }

  function ExamResults(ExamObservation, result) {
    var self = this;

    self.observations = ExamObservation.fromJson(result.observations);

    self.objectType = 'ExamResults';
    self.examName = result.examName || '';
    self.code = result.code || result.aliquotCode || '';
    self.releaseDate = result.releaseDate || '';
    self.realizationDate = result.realizationDate || '';
    self.resultName = result.resultName || '';
    self.value = result.value || '';
    self.cutOffValue = result.cutOffValue || '';
    self.extraVariables = result.extraVariables || [];
    self.isValid = result['isValid' || 'aliquotValid'] === false ? false : true;

    /* Public methods */
    self.toJSON = toJSON;
    self.insertObservation = insertObservation;
    self.removeObservationByIndex = removeObservationByIndex;

    function toJSON() {
      var json = {
        objectType: self.objectType,
        examName: self.examName,
        code: self.code,
        resultName: self.resultName,
        releaseDate: self.releaseDate,
        realizationDate: self.realizationDate,
        observations: self.observations,
        value: self.value,
        cutOffValue: self.cutOffValue,
        extraVariables: self.extraVariables,
        isValid: self.isValid
      };

      return json;
    }

    function insertObservation(observation) {
      var newObservation = ExamObservation.create(observation);
      self.observations.push(newObservation);
      return newObservation;
    }

    function removeObservationByIndex(index) {
      return self.observations.splice(index, 1);
    }

  }


}());
