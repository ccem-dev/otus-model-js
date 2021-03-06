(function() {
  'use strict';

  angular
    .module('otusjs.laboratory.participant')
    .factory('otusjs.laboratory.participant.AliquotCollectionDataFactory', factory);

  function factory() {
    var self = this;

    self.create = create;

    function create(collectionInfo) {
      var _collectionInfo = collectionInfo || {};
      return new AliquotCollectionData(_collectionInfo);
    }

    return self;
  }

  function AliquotCollectionData(collectionInfo) {
    var self = this;

    self.objectType = 'AliquotCollectionData';
    self.metadata = collectionInfo.metadata || '';
    self.operator = collectionInfo.operator || '';
    self.time = collectionInfo.time || '';
    self.processing = collectionInfo.processing || '';

    self.fill = fill;
    self.toJSON = toJSON;

    function fill(operator, processing) {
      self.metadata = ""; // sem aplicação de metadados até o momento
      self.operator = operator.email;
      self.time = new Date().toISOString();
      self.processing = new Date(processing).toISOString();
    }

    function toJSON() {
      return {
        objectType: self.objectType,
        metadata: self.metadata,
        operator: self.operator,
        time: self.time,
        processing: self.processing
      };
    }
  }
}());
