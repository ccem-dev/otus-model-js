describe('RouteFactory', function() {

  var Mock = {};
  var route;
  var ORIGIN = 'ORIGIN';
  var DESTINATION = 'DESTINATION';
  var ROUTE_NAME = 'ORIGIN_DESTINATION';

  beforeEach(function() {
    module('otusjs');

    inject(function(_$injector_) {
      mockCondition(_$injector_);
      factory = _$injector_.get('otusjs.model.navigation.RouteFactory');
    });
  });

  describe('createAlternative method', function() {

    beforeEach(function() {
      route = factory.createAlternative(ORIGIN, DESTINATION, [Mock.conditionA]);
    })

    it('should return a Route object with extends value equal to "SurveyTemplateObject"', function() {
      expect(route.extents).toBe('SurveyTemplateObject');
    });

    it('should return a Route object with objectType value equal to "Route"', function() {
      expect(route.objectType).toBe('Route');
    });

    it('should return a Route object with a valid origin value', function() {
      expect(route.origin).toEqual(ORIGIN);
    });

    it('should return a Route object with a valid destination value', function() {
      expect(route.destination).toEqual(DESTINATION);
    });

    it('should return a Route object with a valid name value', function() {
      expect(route.name).toEqual(ROUTE_NAME);
    });

    it('should return a Route object with isDefault equals false', function() {
      expect(route.isDefault).toEqual(false);
    });

    it('should return a Route object with a condition list with at least one condition', function() {
      expect(route.listConditions()).toEqual(jasmine.any(Array));
      expect(route.listConditions().length).toBe(1);
    });

  });

  describe('createDefault method', function() {

    beforeEach(function() {
      route = factory.createDefault(ORIGIN, DESTINATION);
    });

    it('should return a Route object with extends value equal to "SurveyTemplateObject"', function() {
      expect(route.extents).toBe('SurveyTemplateObject');
    });

    it('should return a Route object with objectType value equal to "Route"', function() {
      expect(route.objectType).toBe('Route');
    });

    it('should return a Route object with a valid origin value', function() {
      expect(route.origin).toEqual(ORIGIN);
    });

    it('should return a Route object with a valid destination value', function() {
      expect(route.destination).toEqual(DESTINATION);
    });

    it('should return a Route object with a valid name value', function() {
      expect(route.name).toEqual(ROUTE_NAME);
    });

    it('should return a Route object with isDefault equals true', function() {
      expect(route.isDefault).toEqual(true);
    });

    it('should return a Route object with a empty condition list', function() {
      expect(route.listConditions()).toEqual(jasmine.any(Array));
      expect(route.listConditions().length).toBe(0);
    });

  });

  describe('fromJson method', function() {

    beforeEach(function() {
      mockJson();
      route = factory.fromJson(Mock.json);
    });

    it('should return a Route object with extends value equal to "SurveyTemplateObject"', function() {
      expect(route.extents).toBe('SurveyTemplateObject');
    });

    it('should return a Route object with objectType value equal to "Route"', function() {
      expect(route.objectType).toBe('Route');
    });

    it('should return a Route object with a valid origin value', function() {
      expect(route.origin).toEqual(ORIGIN);
    });

    it('should return a Route object with a valid destination value', function() {
      expect(route.destination).toEqual(DESTINATION);
    });

    it('should return a Route object with a valid name value', function() {
      expect(route.name).toEqual(ROUTE_NAME);
    });

    it('should return a Route object with a valid isDefault value', function() {
      expect(route.isDefault).toEqual(true);
    });

    it('should return a Route object with a condition list', function() {
      expect(route.listConditions()).toBeDefined();
      expect(route.listConditions().length).toBe(1);
    });

  });

  function mockCondition($injector) {
    var RuleFactory = $injector.get('otusjs.model.navigation.RuleFactory');
    var rule = RuleFactory.create('QID1', 'equal', 1);
    var conditionFactory = $injector.get('otusjs.model.navigation.RouteConditionFactory');
    Mock.conditionA = conditionFactory.create('CONDITION_A', [rule]);
    Mock.conditionB = conditionFactory.create('CONDITION_A', [rule]);
  }

  function mockJson() {
    Mock.json = JSON.stringify({
      extents: 'SurveyTemplateObject',
      objectType: 'Route',
      name: ROUTE_NAME,
      origin: ORIGIN,
      destination: DESTINATION,
      isDefault: true,
      conditions: [Mock.conditionA.toJson()]
    });
  }

});
