(function() {
  'use strict';

  angular
    .module('otusjs.laboratory.participant')
    .factory('otusjs.laboratory.participant.ParticipantAliquotFactory', factory);

  factory.$inject = [
    'otusjs.laboratory.participant.AliquotCollectionDataFactory',
    'otusjs.laboratory.participant.aliquot.HistoryRoleFactory',
    'otusjs.laboratory.configuration.LaboratoryConfigurationService'
  ];

  function factory(AliquotCollectionDataFactory, HistoryRoleFactory, LaboratoryConfigurationService) {
    var self = this;

    self.create = create;
    self.fromJSON = fromJSON;

    function fromJSON(aliquotsArray, tubeInfo) {
      //builds the aliquots array that comes along with the tube from base
      return aliquotsArray.map(function(aliquotInfo) {
        return new ParticipantAliquot(AliquotCollectionDataFactory, HistoryRoleFactory, LaboratoryConfigurationService, aliquotInfo, tubeInfo);
      });
    }

    function create(aliquotInfo, tubeInfo) {
      //used to build an filled aliquot
      var newInfo = angular.copy(aliquotInfo);
      return new ParticipantAliquot(AliquotCollectionDataFactory, HistoryRoleFactory, LaboratoryConfigurationService, newInfo, tubeInfo);
    }
    return self;
  }

  function ParticipantAliquot(AliquotCollectionDataFactory, HistoryRoleFactory, LaboratoryConfigurationService, aliquotInfo, tubeInfo) {
    var self = this;
    var _aliquotDescriptor;

    /* Public Interface*/
    self.objectType = "Aliquot";
    self.name = aliquotInfo.name;
    self.role = aliquotInfo.role;
    self.code = aliquotInfo.code || aliquotInfo.aliquotCode; //.aliquotCode
    self.container = aliquotInfo.container;

    self.aliquotCollectionData = AliquotCollectionDataFactory.create(aliquotInfo.aliquotCollectionData);
    self.history = HistoryRoleFactory.createHistoryArray(aliquotInfo.history);

    self.collect = collect;
    self.toJSON = toJSON;

    //Custom
    self.tubeCode = tubeInfo.code;

    onInit();

    function onInit() {
      _aliquotDescriptor = LaboratoryConfigurationService.getAliquotDescriptor(self.name);
      _runDescriptors(_aliquotDescriptor);
    }

    function _runDescriptors(aliquotDescriptor) {
      self.label = aliquotDescriptor.label;
    }

    function collect(operator, processing) {
      self.aliquotCollectionData.fill(operator, processing);
    }

    function toJSON() {
      var json = {
        objectType: self.objectType,
        code: self.code,
        name : self.name,
        container: self.container,
        role: self.role,
        aliquotCollectionData: self.aliquotCollectionData,
        history: self.history
      };
      return json;
    }
  }
}());
