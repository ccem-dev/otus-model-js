describe('the TubeCollectionDataFactory', function() {
  var Mock = {};
  var factory;

  beforeEach(function() {
    angular.mock.module('otusjs.laboratory');

    inject(function(_$injector_) {

      factory = _$injector_.get(
        'otusjs.laboratory.participant.TubeCollectionDataFactory'
      );

    });

    mockSelectedParticipant();
    mockParticipantLaboratory();
    mockLabDescriptors();
    mockSingleTube();
    mockLoggedUser();


    // Mock.LaboratoryConfigurationService.initializeParticipantConfiguration(
    //   Mock.SelectedParticipant, "DEFAULT");
    // Mock.LaboratoryConfigurationService.initializeLaboratoryConfiguration(
    //   Mock.LabDescriptors);

  });

  describe("create method", function() {
    beforeEach(function() {
      mockSingleTube();

      spyOn(factory, 'create').and.callThrough();
    })
    it('should create an ParticipanTubeFactory object ', function() {

      expect(factory.create.calls.any()).toEqual(false);
      var item = factory.create(Mock.singleTube);

      expect(factory.create.calls.any()).toEqual(true);
      expect(factory.create).toHaveBeenCalled();
      expect(factory.create)
        .toHaveBeenCalledWith(Mock.singleTube);
      expect(item.objectType)
        .toEqual('TubeCollectionData');;

    });
  });

  xdescribe("build a tube", function() {
    it('should build a tube from Array', function() {
      var object = factory.buildFromArray([Mock.singleTube],
        Mock.LoggedUser);
      spyOn(factory, 'buildFromArray').and.callThrough();
      expect(object[0].objectType).toEqual("Tube");
    });

  });

  // function mockTubeCollectionDataFactory(_$injector_) {
  //   Mock.TubeCollectionDataFactory = _$injector_.get(
  //     'otusjs.laboratory.participant.TubeCollectionDataFactory');
  //   spyOn(Mock.TubeCollectionDataFactory, 'create').and.callThrough();
  //   // spyOn(Mock.TubeCollectionDataFactory, 'TubeCollectionData').and.callThrough(); //private method
  //   return Mock.TubeCollectionData;
  // }

  function mockParticipantAliquotFactory(_$injector_) {
    Mock.ParticipantAliquotFactory = _$injector_.get(
      'otusjs.laboratory.participant.ParticipantAliquotFactory');
    spyOn(Mock.ParticipantAliquotFactory, 'create').and.callThrough();
    return Mock.ParticipantAliquotFactory;

  }

  function mockLaboratoryConfigurationService(_$injector_) {
    Mock.LaboratoryConfigurationService = _$injector_.get(
      'otusjs.laboratory.configuration.LaboratoryConfigurationService'
    );
    return Mock.LaboratoryConfigurationService;
  }

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
    // Mock.singleTube = Mock.ParticipantLaboratory.tubes[0];
    Mock.singleTube = {
      isCollected: false,
      metadada: "",
      operator: {
        email: "a@a.com.br"
      },
      time: new Date().toISOString()
    }
  }

  function mockLoggedUser() {
    Mock.LoggedUser = Test.utils.data.otusLoggedUser;
  }
});
