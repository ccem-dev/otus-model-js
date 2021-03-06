describe('ActivityImportFactory Tests', function () {
  var Mock = {};
  var Injections = {};
  var service;
  var surveyFactory;
  var surveyForm;

  beforeEach(function () {
    angular.mock.module('otus.validation');
  });

  beforeEach(function () {
    angular.mock.module('otusjs');
  });

  beforeEach(function () {
    inject(function (_$injector_) {
      Injections['ElementRegisterFactory'] = _$injector_.get('ElementRegisterFactory');
      Injections['ValidationService'] = _$injector_.get('otusjs.validation.api.ValidationService');
      Injections['ActivityFactory'] = _$injector_.get('otusjs.model.activity.ActivityFactory');
      surveyFactory = _$injector_.get('SurveyFormFactory');
      surveyForm = surveyFactory.fromJsonObject(Test.utils.data.activityPASC.surveyForm);
      service = _$injector_.get('otusjs.model.activity.ActivityImportService', Injections);
    });
  });

  it('should defined service', function () {
    expect(service).toBeDefined();
    expect(service.fromJsonObject).toBeDefined();
    expect(service.create).toBeDefined();
  });


  it('should create activities PASC in fromJsonObject method', function () {
    var user = {
      name: 'otus',
      surname: 'solutions',
      phone: 654897566,
      email: 'user@gmail.com'
    };
    var _activities = service.fromJsonObject(surveyForm, Test.utils.data.jsonObjectImport, user);
    expect(_activities.length).toBe(2);
    expect(_activities[0].isValid).toBeFalsy();
    expect(_activities[1].isValid).toBeFalsy();
    expect(_activities[0].statusHistory.getLastStatus().name).toEqual('FINALIZED');
    expect(_activities[0].statusHistory.historySize()).toEqual(4);
    expect(_activities[0].interviews.getInterviewSizeOfList()).toEqual(1);
    expect(_activities[0].interviews.getInterviews()[0].interviewer.email).toEqual('user@gmail.com');

    expect(_activities[1].statusHistory.getLastStatus().name).toEqual('SAVED');
    expect(_activities[1].statusHistory.historySize()).toEqual(4);
    expect(_activities[1].interviews.getInterviewSizeOfList()).toEqual(1);
    expect(_activities[1].interviews.getInterviews()[0].interviewer.email).toEqual('user@gmail.com');
  });

  it('should create activities DSOC in fromJsonObject method', function () {
    var user = {
      name: 'otus',
      surname: 'solutions',
      phone: 654897566,
      email: 'user@gmail.com'
    };
    var DSOC = surveyFactory.fromJsonObject(Test.utils.data.surveyFormDSOC);
    var _activities = service.fromJsonObject(DSOC, Test.utils.data.jsonImportDSOC, user);
    expect(_activities.length).toBe(1);
    expect(_activities[0].isValid).toBeFalsy();
    expect(_activities[0].statusHistory.getLastStatus().name).toEqual('FINALIZED');
    expect(_activities[0].statusHistory.historySize()).toEqual(4);
    expect(_activities[0].interviews.getInterviewSizeOfList()).toEqual(1);
  });

});