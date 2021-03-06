describe('ActivityStatus', function() {

  var CREATED = 'CREATED';
  var OPENED = 'OPENED';
  var SAVED = 'SAVED';
  var FINALIZED = 'FINALIZED';
  var INITIALIZED_OFFLINE = 'INITIALIZED_OFFLINE';
  var INITIALIZED_ONLINE = 'INITIALIZED_ONLINE';

  var factory;
  var Mock = {};
  var baseDate;

  beforeEach(function() {
    angular.mock.module('otusjs');

    baseDate = Date.now();
    jasmine.clock().mockDate(baseDate);


    inject(function(_$injector_) {
      mockUser(_$injector_);
      mockJson();

      factory = _$injector_.get(
        'otusjs.model.activity.ActivityStatusFactory');
    });

  });

  describe('toJSON method', function() {

    it(
      'should return a well formatted json based on instance of ActivityStatus',
      function() {
        var status = factory.createCreatedStatus(Mock.user);
        baseDate = new Date();
        jasmine.clock().mockDate(baseDate);
        expect(status.toJSON()).toEqual(Mock.json);
      });

  });

  function mockJson() {
    Mock.json = {
      objectType: 'ActivityStatus',
      name: 'CREATED',
      date: new Date(),
      user: Mock.user
    };
  }

  function mockUser($injector) {
    Mock.user = $injector.get('otusjs.model.activity.ActivityUserFactory').create(
      'User Name', 'user@email.com');
  }

});
