describe('ActivityFacadeService_UnitTest_Suite', () => {
  let facade;
  let Injections = [];
  let Mock = {};

  beforeEach(() => {
    angular.mock.module('otusjs');
    angular.mock.inject($injector => {
      Injections.AnswerFillFactory = $injector.get('otusjs.model.activity.AnswerFillFactory');
      Injections.MetadataFillFactory = $injector.get('otusjs.model.activity.MetadataFillFactory');
      Injections.QuestionFillFactory = $injector.get('otusjs.model.activity.QuestionFillFactory');
      Injections.ActivityFactory = $injector.get('otusjs.model.activity.ActivityFactory');
      Injections.InterviewFactory = $injector.get('otusjs.model.activity.InterviewFactory');
      Injections.RevisionFactory = $injector.get('otusjs.model.activity.RevisionFactory');
      Injections.ActivityBasicFactory = $injector.get('otusjs.model.activity.ActivityBasicFactory');

      facade = $injector.get('otusjs.model.activity.ActivityFacadeService', Injections);

      Mock.ActivityStatusFactory = $injector.get('otusjs.model.activity.StatusHistoryManagerFactory',
        {
          ActivityStatusFactory: $injector.get('otusjs.model.activity.StatusHistoryManagerFactory'),
          ACTIVITY_CONSTANTS: $injector.get('ACTIVITY_CONSTANTS')
        })
    });
  });

  it('facadeExistence_check', () => {
    expect(facade).toBeDefined();
  });

  it('facadeMethodsExistence_check', () => {
    expect(facade.createActivity).toBeDefined();
    expect(facade.createPaperActivity).toBeDefined();
    expect(facade.createAutoFillActivity).toBeDefined();
    expect(facade.createQuestionFill).toBeDefined();
    expect(facade.fillQuestion).toBeDefined();
    expect(facade.getInterviewer).toBeDefined();
    expect(facade.openActivitySurvey).toBeDefined();
    expect(facade.initializeActivitySurvey).toBeDefined();
    expect(facade.finalizeActivitySurvey).toBeDefined();
    expect(facade.saveActivitySurvey).toBeDefined();
    expect(facade.reopenActivitySurvey).toBeDefined();
    expect(facade.getFillingByQuestionID).toBeDefined();
    expect(facade.clearSkippedAnswers).toBeDefined();
    expect(facade.getNavigationTracker).toBeDefined();
    expect(facade.createActivityRevision).toBeDefined();
    expect(facade.createActivityRevisionFromJson).toBeDefined();
    expect(facade.getWholeTemplateVariableList).toBeDefined();
    expect(facade.getItemStaticVariableList).toBeDefined();
    expect(facade.fillStaticVariablesValues).toBeDefined();
    expect(facade.hasRequiredExternalID).toBeDefined();
    expect(facade.getActivityBasicFactory).toBeDefined();
  });

  it('createActivity should invoke the same method of ActivityFactory', function () {
    spyOn(Injections.ActivityFactory, 'create').and.returnValue({});
    facade.createActivity();
    expect(Injections.ActivityFactory.create).toHaveBeenCalledTimes(1);
  });

  it('createPaperActivity should invoke the same method of ActivityFactory', function () {
    spyOn(Injections.ActivityFactory, 'createPaperActivity').and.returnValue({});
    facade.createPaperActivity();
    expect(Injections.ActivityFactory.createPaperActivity).toHaveBeenCalledTimes(1);
  });

  it('createAutoFillActivity should invoke the same method of ActivityFactory', function () {
    spyOn(Injections.ActivityFactory, 'createAutoFillActivity').and.returnValue({});
    facade.createAutoFillActivity();
    expect(Injections.ActivityFactory.createAutoFillActivity).toHaveBeenCalledTimes(1);
  });

  describe('SurveyActivity statusHistory Suite Test', () => {

    beforeEach(() => {
      _mockSurveyActivity();
    });

    it('openActivitySurvey should invoke surveyActivity.statusHistory.newOpenedRegistry', function () {
      spyOn(facade.surveyActivity.statusHistory, 'newOpenedRegistry');
      facade.openActivitySurvey();
      expect(facade.surveyActivity.statusHistory.newOpenedRegistry).toHaveBeenCalledTimes(1);
    });

    it('initializeActivitySurvey should invoke surveyActivity.statusHistory.newInitializedOnlineRegistry', function () {
      spyOn(facade.surveyActivity.statusHistory, 'newInitializedOnlineRegistry');
      facade.initializeActivitySurvey();
      expect(facade.surveyActivity.statusHistory.newInitializedOnlineRegistry).toHaveBeenCalledTimes(1);
    });

    it('finalizeActivitySurvey should invoke surveyActivity.statusHistory.newFinalizedRegistry', function () {
      spyOn(facade.surveyActivity.statusHistory, 'newFinalizedRegistry');
      facade.finalizeActivitySurvey();
      expect(facade.surveyActivity.statusHistory.newFinalizedRegistry).toHaveBeenCalledTimes(1);
    });

    it('saveActivitySurvey should invoke surveyActivity.statusHistory.newSavedRegistry', function () {
      spyOn(facade.surveyActivity.statusHistory, 'newSavedRegistry');
      facade.saveActivitySurvey();
      expect(facade.surveyActivity.statusHistory.newSavedRegistry).toHaveBeenCalledTimes(1);
    });

    it('reopenActivitySurvey should invoke surveyActivity.statusHistory.newReopenedRegistry', function () {
      spyOn(facade.surveyActivity.statusHistory, 'newReopenedRegistry');
      facade.reopenActivitySurvey();
      expect(facade.surveyActivity.statusHistory.newReopenedRegistry).toHaveBeenCalledTimes(1);
    });

  });

  it('createQuestionFill should invoke QuestionFillFactory create', function () {
    spyOn(Injections.QuestionFillFactory, 'create');
    facade.createQuestionFill();
    expect(Injections.QuestionFillFactory.create).toHaveBeenCalledTimes(1);
  });

  it('fillQuestion should invoke surveyActivity.fillContainer.updateFilling', function () {
    _mockSurveyActivity();
    spyOn(facade.surveyActivity.fillContainer, 'updateFilling');
    facade.fillQuestion();
    expect(facade.surveyActivity.fillContainer.updateFilling).toHaveBeenCalledTimes(1);
  });

  it('getFillingByQuestionID should invoke surveyActivity.fillContainer.searchFillingByID', function () {
    _mockSurveyActivity();
    spyOn(facade.surveyActivity.fillContainer, 'searchFillingByID');
    facade.getFillingByQuestionID();
    expect(facade.surveyActivity.fillContainer.searchFillingByID).toHaveBeenCalledTimes(1);
  });

  it('getActivityBasicFactory method should return factory of activityBasic', () => {
    let result = facade.getActivityBasicFactory();
    expect(result.OBJECT_TYPE).toBe('ActivityBasicModelFactory')
  })

  function _mockSurveyActivity() {
    const surveyActivity = Test.utils.data.activityPASC;
    // facade.createActivity(
    //   surveyActivity.template,
    //   surveyActivity.surveyForm.sender,
    //   surveyActivity.participantData,
    //   {},
    //   surveyActivity.externalID
    // );
    // console.log(facade.surveyActivity)
    // angular.extend(facade.surveyActivity, facade.surveyActivity, surveyActivity);

    facade.surveyActivity = angular.copy(surveyActivity);
    facade.surveyActivity.statusHistory = Mock.ActivityStatusFactory.create();
    facade.surveyActivity.statusHistory.init(surveyActivity.statusHistory);
    facade.surveyActivity.interviews = {
      newRegistry: function (user) {
      }
    };
    facade.surveyActivity.fillContainer.updateFilling = function (any) {
    };
    facade.surveyActivity.fillContainer.searchFillingByID = function (any) {
    };
  }

});


//old test with mock injections

// describe('the ActivityFacadeService', function () {
//
//   var Mock = {};
//   var service;
//   var ANSWER = 'test_answer';
//   var METADATA = 'test_metadata';
//   var COMMENT = 'test_comment';
//   var QUESTION_FILL_TYPE = 'QuestionFill';
//   var QUESTION_ID = 'TEST1';
//
//   beforeEach(function () {
//     angular.mock.module('otusjs');
//
//     inject(function (_$injector_) {
//       var Injections = {
//         'AnswerFillFactory': mockAnswerFillFactory(_$injector_),
//         'MetadataFillFactory': mockMetadataFillFactory(
//           _$injector_),
//         'QuestionFillFactory': mockQuestionFillFactory(
//           _$injector_),
//         'ActivityFactory': mockActivityFactory(_$injector_),
//         'InterviewFactory': mockInterviewFactory(_$injector_)
//
//
//       };
//       /* Test data */
//       mockQuestionItem();
//       mockSurveyTemplate();
//
//       /* Injectable mocks */
//
//       service = _$injector_.get('otusjs.model.activity.ActivityFacadeService', Injections);
//       mockSelectedParticipant();
//       mockParticipantLaboratory();
//       mockLoggedUser();
//
//     });
//   });
//
//   it('hasRequiredExternalID_should ', function () {
//     console.log(service.hasRequiredExternalID())
//   });
//
//   describe('basic tests scenarios', function () {
//     it('check created service', function () {
//       expect(service).toBeDefined();
//     });
//   });
//
//   xdescribe('createActivity method', function () {
//
//     it('should call method create', function () {
//       beforeEach(function () {
//
//       });
//
//       var factory = service.createActivity(Mock.surveyTemplate,
//         Mock.LoggedUser,
//         Mock.SelectedParticipant);
//
//       expect(factory).not.toBeDefined();
//     });
//
//     xit(
//       'should create new object ActivitySurvey with call method create',
//       function () {
//         service.createActivity(Mock.surveyTemplate);
//
//         expect(service.surveyActivity.objectType).toEqual('Activity');
//       });
//
//     xit('should create ActivitySurvey with parameter template',
//       function () {
//         service.createActivity(Mock.surveyTemplate);
//
//         expect(service.surveyActivity.surveyForm.surveyTemplate).toEqual(
//           Mock.surveyTemplate);
//       });
//
//     xit(
//       'should create new object ActivitySurvey with call method create used parameter User',
//       function () {
//         service.createActivity(Mock.surveyTemplate);
//
//         expect(Mock.ActivityFactory.create).toHaveBeenCalledWith(Mock
//           .surveyTemplate);
//       });
//
//   });
//
//   xdescribe('openActivitySurvey method', function () {
//
//     beforeEach(function () {
//       service.createActivity(Mock.surveyTemplate);
//     });
//
//     it(
//       'should call method newOpenedRegistry when method openActivitySurvey called ',
//       function () {
//         spyOn(service.surveyActivity.statusHistory,
//           'newOpenedRegistry');
//         service.openActivitySurvey();
//         expect(service.surveyActivity.statusHistory.newOpenedRegistry)
//           .toHaveBeenCalled();
//       });
//
//   });
//
//   xdescribe('initializeActivitySurvey method', function () {
//
//     beforeEach(function () {
//       service.createActivity(Mock.surveyTemplate);
//     });
//
//     it(
//       'should call method newInitializedOnlineRegistry when method initializeActivitySurvey called ',
//       function () {
//         spyOn(service.surveyActivity.statusHistory,
//           'newInitializedOnlineRegistry');
//         service.initializeActivitySurvey();
//         expect(service.surveyActivity.statusHistory.newInitializedOnlineRegistry)
//           .toHaveBeenCalled();
//       });
//
//   });
//
//   xdescribe('createQuestionFill method', function () {
//
//     beforeEach(function () {
//       service.createActivity(Mock.surveyTemplate);
//     });
//
//     it(
//       'should call method create when method createQuestionFill called',
//       function () {
//         service.createQuestionFill(Mock.item, ANSWER, METADATA,
//           COMMENT);
//
//         expect(Mock.QuestionFillFactory.create).toHaveBeenCalled();
//       });
//
//     it(
//       'should return object question when method createQuestionFill called',
//       function () {
//         var questionFill = service.createQuestionFill(Mock.item,
//           ANSWER, METADATA, COMMENT);
//
//         expect(questionFill.objectType).toEqual('QuestionFill');
//       });
//
//     it('should create QuestionFill with parameter QuestionID', function () {
//       var questionFill = service.createQuestionFill(Mock.item,
//         ANSWER, METADATA, COMMENT);
//
//       expect(questionFill.questionID).toEqual(QUESTION_ID);
//     });
//
//     it('should create QuestionFill with parameter ANSWER', function () {
//       var questionFill = service.createQuestionFill(Mock.item,
//         ANSWER, METADATA, COMMENT);
//
//       expect(questionFill.answer.value).toEqual(ANSWER);
//     });
//
//     it('should create QuestionFill with parameter METADATA', function () {
//       var questionFill = service.createQuestionFill(Mock.item,
//         ANSWER, METADATA, COMMENT);
//
//       expect(questionFill.metadata.value).toEqual(METADATA);
//     });
//
//     it('should create QuestionFill with parameter COMMENT', function () {
//       var questionFill = service.createQuestionFill(Mock.item,
//         ANSWER, METADATA, COMMENT);
//
//       expect(questionFill.comment).toEqual(COMMENT);
//     });
//
//   });
//
//   xdescribe('fillQuestion method', function () {
//
//     beforeEach(function () {
//       service.createActivity(Mock.surveyTemplate);
//     });
//
//     it(
//       'should call method updateFilling when method createQuestionFill called ',
//       function () {
//         spyOn(service.surveyActivity.fillContainer, 'updateFilling');
//
//         service.fillQuestion(QUESTION_ID, ANSWER, METADATA, COMMENT);
//
//         expect(service.surveyActivity.fillContainer.updateFilling).toHaveBeenCalled();
//       });
//
//   });
//
//   xdescribe('getFillingByQuestionID method', function () {
//
//     var filling = {};
//
//     beforeEach(function () {
//       service.createActivity(Mock.surveyTemplate);
//       filling = service.createQuestionFill(Mock.item, ANSWER,
//         METADATA, COMMENT);
//       service.fillQuestion(filling);
//     });
//
//     it('should retrieve the filling of a question', function () {
//       spyOn(service.surveyActivity.fillContainer,
//         'searchFillingByID').and.callThrough();
//
//       var returnedValue = service.getFillingByQuestionID(
//         QUESTION_ID);
//
//       expect(service.surveyActivity.fillContainer.searchFillingByID)
//         .toHaveBeenCalled();
//       expect(returnedValue).toEqual(filling);
//     });
//
//   });
//
//   function mockQuestionItem() {
//     Mock.item = {};
//     Mock.item.customID = QUESTION_ID;
//     Mock.item.objectType = 'IntegerQuestion';
//   }
//
//   function mockSurveyTemplate() {
//     Mock.surveyTemplate = {};
//   }
//
//   function mockAnswerFillFactory($injector) {
//     Mock.AnswerFillFactory = $injector.get(
//       'otusjs.model.activity.AnswerFillFactory');
//
//     spyOn(Mock.AnswerFillFactory, 'create').and.callThrough();
//
//     return Mock.AnswerFillFactory;
//   }
//
//   function mockMetadataFillFactory($injector) {
//     Mock.MetadataFillFactory = $injector.get(
//       'otusjs.model.activity.MetadataFillFactory');
//
//     spyOn(Mock.MetadataFillFactory, 'create').and.callThrough();
//
//     return Mock.MetadataFillFactory;
//   }
//
//   function mockQuestionFillFactory($injector) {
//     Mock.QuestionFillFactory = $injector.get(
//       'otusjs.model.activity.QuestionFillFactory');
//
//     spyOn(Mock.QuestionFillFactory, 'create').and.callThrough();
//
//     return Mock.QuestionFillFactory;
//   }
//
//   function mockActivityFactory($injector) {
//     Mock.ActivityFactory = $injector.get(
//       'otusjs.model.activity.ActivityFactory');
//
//     spyOn(Mock.ActivityFactory, 'create').and.callThrough();
//
//     return Mock.ActivityFactory;
//   }
//
//   function mockInterviewFactory($injector) {
//     Mock.InterviewFactory = $injector.get(
//       'otusjs.model.activity.InterviewFactory');
//
//     spyOn(Mock.InterviewFactory, 'create').and.callThrough();
//
//     return Mock.InterviewFactory;
//   }
//
//   function mockTemplate($injector) {
//     var SurveyFormFactory = $injector.get('SurveyFormFactory');
//     Mock.template = SurveyFormFactory.fromJsonObject(Test.utils.data.jsonObject);
//   }
//
//   // Mock Functions
//
//
//   function mockParticipantLaboratory() {
//     Mock.ParticipantLaboratory = Test.utils.data.participantLaboratory; //json-importer.js
//   }
//
//   function mockLoggedUser() {
//     Mock.LoggedUser = Test.utils.data.otusLoggedUser; //json-importer.js
//   }
//
//   function mockSelectedParticipant() {
//     Mock.SelectedParticipant = Test.utils.data.selectedParticipant; //json-importer.js
//   }
//
//
//   function mockAliquotInfo() {
//     Mock.aliquotInfo = Mock.singleTube.aliquots[0];
//   }
// });