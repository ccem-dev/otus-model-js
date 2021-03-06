describe('ParticipantAliquotFactory', function() {
  var Mock = {};
  var Injections = [];
  var factory;

  beforeEach(function() {
    angular.mock.module('otusjs.laboratory');

    inject(function(_$injector_) {
      Injections.AliquotCollectionDataFactory = _$injector_.get('otusjs.laboratory.participant.AliquotCollectionDataFactory');
      Injections.AliquotHistoryFactory = _$injector_.get('otusjs.laboratory.participant.aliquot.AliquotHistoryFactory');
      Injections.LaboratoryConfigurationService = _$injector_.get('otusjs.laboratory.configuration.LaboratoryConfigurationService');

    factory = _$injector_.get('otusjs.laboratory.participant.ParticipantAliquotFactory', Injections);
  });

  mockSelectedParticipant();
  mockLabDescriptors();
  mockParticipantLaboratory();
  mockSingleTube();
  mockAliquotInfo();
  Injections.LaboratoryConfigurationService.initializeLaboratoryConfiguration(Mock.LabDescriptors);

  spyOn(Injections.AliquotCollectionDataFactory, 'create').and.callThrough();
  spyOn(Injections.AliquotHistoryFactory, 'create').and.callThrough();
  spyOn(Injections.AliquotHistoryFactory, 'fromArray').and.callThrough();
});

  it('fatoryExistence check',function () {
    expect(factory).toBeDefined();
  });

  it('factoryMethodsExistence_check', function () {
    expect(factory.create).toBeDefined();
    expect(factory.fromJSON).toBeDefined();
  });

describe('the creation method', function() {

  beforeEach(function() {
    mockAliquotInfo();
    mockAliquot();
  });

  it('should create an aliquot typed object', function() {
    expect(Mock.aliquot.objectType).toEqual('Aliquot');
  });

  it('createMethod injection AliquotCollectionDataFactory should have been evoked', function () {
    expect(Injections.AliquotCollectionDataFactory.create).toHaveBeenCalledTimes(1);
  });

  it('createMethod injection AliquotHistoryFactory should have been evoked', function () {
    Mock.aliquot.convertStorage(Mock.testOperator, Mock.testDescription, Mock.testType);
    expect(Injections.AliquotHistoryFactory.create).toHaveBeenCalledTimes(1);
  });

  it('fromArrayMethod injection AliquotHistoryFactory should have been evoked', function () {
    expect(Injections.AliquotHistoryFactory.fromArray).toHaveBeenCalledTimes(1);
  });

  it('collectMethod function of ParticipantAliquot should have been evoked',function () {
    spyOn(Mock.aliquot, 'collect').and.callThrough();

    Mock.aliquot.collect(Mock.testOperator,Mock.testProcesing);
    expect(Mock.aliquot.collect).toHaveBeenCalledTimes(1);
  });

  it('getHistoryByTypeMethod function of ParticipantAliquot should have been evoked',function () {
    spyOn(Mock.aliquot, 'getHistoryByType').and.callThrough();

    expect(Mock.aliquot.getHistoryByType(Mock.testType)).toEqual(Mock.aliquotInfo.aliquotHistory);
    expect(Mock.aliquot.getHistoryByType).toHaveBeenCalledTimes(1);
  });

  it('should generate the same values for this fields', function() {
    expect(Mock.aliquot.objectType).toEqual(Mock.aliquotInfo.objectType);
    expect(Mock.aliquot.code).toEqual(Mock.aliquotInfo.code);
    expect(Mock.aliquot.name).toEqual(Mock.aliquotInfo.name);
    expect(Mock.aliquot.container).toEqual(Mock.aliquotInfo.container);
    expect(Mock.aliquot.role).toEqual(Mock.aliquotInfo.role);
    expect(Mock.aliquot.isConverted).toBeTruthy();
    expect(Mock.aliquot.history).toEqual(Mock.aliquotInfo.history);
  });

  it('toJSONMethod should compare', function () {
    expect(JSON.stringify(Mock.aliquot.toJSON())).toEqual(JSON.stringify(Mock.aliquotInfo));
  })
});

describe('the fromJSON method', function() {
  beforeEach(function() {
    mockAliquotFromJson();
  });

  it('should create an aliquot typed object', function() {
    expect(Mock.AliquotFromJson[0].objectType).toEqual('Aliquot');
  });

  it('should generate the same values for this fields', function() {
    expect(Mock.AliquotFromJson[0].objectType).toEqual(Mock.aliquotInfo.objectType);
    expect(Mock.AliquotFromJson[0].code).toEqual(Mock.aliquotInfo.code);
    expect(Mock.AliquotFromJson[0].name).toEqual(Mock.aliquotInfo.name);
    expect(Mock.AliquotFromJson[0].container).toEqual(Mock.aliquotInfo.container);
    expect(Mock.AliquotFromJson[0].role).toEqual(Mock.aliquotInfo.role);
  });
});

describe('the Aliquot descriptor filler', function() {
  var aliquot;
  var aliquotDescriptor;
  beforeEach(function() {
    aliquot = factory.create(Mock.aliquotInfo, Mock.singleTube);
    aliquotDescriptor = Injections.LaboratoryConfigurationService
      .getAliquotDescriptor(Mock.aliquotInfo.name, Mock.singleTube.moment,
        Mock.singleTube.type, Mock.singleTube.groupName);
  });

  it('should attrib the right label for the given aliquot', function() {
    expect(aliquot.label).toEqual(aliquotDescriptor.label);
  });

});

function mockSelectedParticipant() {
  Mock.SelectedParticipant = angular.copy(Test.utils.data.selectedParticipant); //json-importer.js
}

function mockParticipantLaboratory() {
  Mock.ParticipantLaboratory = Test.utils.data.participantLaboratory; //json-importer.js
}

function mockLabDescriptors() {
  Mock.LabDescriptors = Test.utils.data.laboratoryConfiguration; //json-importer.js
}

function mockSingleTube() {
  Mock.singleTube = Mock.ParticipantLaboratory.tubes[0];
}

function mockAliquotInfo() {
  Mock.aliquotInfo = Mock.singleTube.aliquots[0];
}

function mockAliquot() {
  Mock.aliquot = factory.create(Mock.aliquotInfo, Mock.singleTube);
  Mock.testOperator = "";
  Mock.testDescription = "";
  Mock.testType = "CONVERTED_STORAGE";
  Mock.testProcesing = "2018-06-20T18:58:10.942Z";
}

function mockAliquotFromJson() {
  var aliquotsArray = [Mock.ParticipantLaboratory.tubes[0].aliquots[0]];
  Mock.AliquotFromJson = factory.fromJSON(aliquotsArray, Mock.singleTube);
}

});
