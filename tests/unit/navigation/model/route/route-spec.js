describe('Route', function() {

  var Mock = {};
  var route;
  var DIFF_OBJECT_TYPE = 'DIFF_OBJECT_TYPE';
  var ORIGIN = 'ORIGIN';
  var DIFF_ORIGIN = 'DIFF_ORIGIN';
  var DESTINATION = 'DESTINATION';
  var DIFF_DESTINATION = 'DIFF_DESTINATION';
  var ROUTE_NAME = 'ORIGIN_DESTINATION';

  beforeEach(function() {
    module('otusjs');

    inject(function(_$injector_) {
      mockCondition(_$injector_);

      factory = _$injector_.get('otusjs.model.navigation.RouteFactory');
    });

    route = factory.create(ORIGIN, DESTINATION);
  });

  describe('addCondition method', function() {

    it('should put a new condition in route object', function() {
      route.addCondition(Mock.conditionA);

      expect(route.listConditions()).toBeDefined();
      expect(route.listConditions().length).toBe(1);
    });

    it('should not put a condition twice', function() {
      route.addCondition(Mock.conditionA);
      route.addCondition(Mock.conditionB);

      route.addCondition(Mock.conditionA);
      route.addCondition(Mock.conditionB);

      expect(route.listConditions().length).toBe(2);
    });

  });

  describe('removeCondition method', function() {

    beforeEach(function() {
      route.addCondition(Mock.conditionA);
      route.addCondition(Mock.conditionB);
    });

    it('should remove the condition from route object', function() {
      route.removeCondition(Mock.conditionA);

      expect(route.listConditions().length).toBe(1);
    });

    it('should delete condition attribute from route if the size of these set is zero', function() {
      route.removeCondition(Mock.conditionA);
      route.removeCondition(Mock.conditionB);

      expect(route.listConditions()).toEqual([]);
    });

  });

  describe('from new instance', function() {

    describe('listConditions method', function() {

      it('should return an object of conditions with size equal to 0', function() {
        expect(Object.keys(route.listConditions()).length).toBe(0);
      });

      it('should return a clone of original object of conditions', function() {
        var clone = route.listConditions();

        clone.attribute = jasmine.any(Object);

        expect(Object.keys(clone).length).not.toBe(Object.keys(route.listConditions()).length);
      });

    });

  });

  describe('equals method', function() {

    it('should return true when two objects have the same properties and equal values', function() {
      var routeA = factory.create(ORIGIN, DESTINATION);
      var routeB = factory.create(ORIGIN, DESTINATION);
      expect(routeA.equals(routeB)).toBe(true);

      routeA.addCondition(Mock.conditionA);
      routeB.addCondition(Mock.conditionA);
      expect(routeA.equals(routeB)).toBe(true);
    });

    it('should return true when two objects have same rules in the list but in different order', function() {
      var routeA = factory.create(ORIGIN, DESTINATION);
      routeA.addCondition(Mock.conditionA);
      routeA.addCondition(Mock.conditionB);

      var routeB = factory.create(ORIGIN, DESTINATION);
      routeB.addCondition(Mock.conditionA);
      routeB.addCondition(Mock.conditionB);

      expect(routeA.equals(routeB)).toBe(true);
    });

    it('should return true when two objects have same rules in the list but in different order', function() {
      var routeA = factory.create(ORIGIN, DESTINATION);
      routeA.addCondition(Mock.conditionA);
      routeA.addCondition(Mock.conditionB);

      var routeB = factory.create(ORIGIN, DESTINATION);
      routeB.addCondition(Mock.conditionB);
      routeB.addCondition(Mock.conditionA);

      expect(routeA.equals(routeB)).toBe(true);
    });

    it('should return false when two objects have different objectType value', function() {
      var routeA = factory.create(ORIGIN, DESTINATION);
      var routeB = factory.create(ORIGIN, DESTINATION);
      routeB.objectType = DIFF_OBJECT_TYPE;

      expect(routeA.equals(routeB)).toBe(false);
    });

    it('should return false when two objects have different origins', function() {
      var routeA = factory.create(ORIGIN, DESTINATION);
      var routeB = factory.create(DIFF_ORIGIN, DESTINATION);

      expect(routeA.equals(routeB)).toBe(false);
    });

    it('should return false when two objects have different destinations', function() {
      var routeA = factory.create(ORIGIN, DESTINATION);
      var routeB = factory.create(ORIGIN, DIFF_DESTINATION);

      expect(routeA.equals(routeB)).toBe(false);
    });

    it('should return false when two objects have different names', function() {
      var routeA = factory.create(ORIGIN, DESTINATION);
      var routeB = factory.create(DIFF_ORIGIN, DIFF_DESTINATION);

      expect(routeA.equals(routeB)).toBe(false);
    });

    it('should return false when two objects have different size of condition list', function() {
      var routeA = factory.create(ORIGIN, DESTINATION);
      routeA.addCondition(Mock.conditionA);

      var routeB = factory.create(ORIGIN, DESTINATION);

      expect(routeA.equals(routeB)).toBe(false);
    });

    it('should return false when two objects have different size of condition list', function() {
      var routeA = factory.create(ORIGIN, DESTINATION);
      routeA.addCondition(Mock.conditionA);

      var routeB = factory.create(ORIGIN, DESTINATION);
      routeB.addCondition(Mock.conditionB);

      expect(routeA.equals(routeB)).toBe(false);
    });

  });

  describe('selfsame method', function() {

    it('should call Object.is', function() {
      spyOn(Object, 'is').and.callThrough();

      var routeA = factory.create(ORIGIN, DESTINATION);
      routeA.addCondition(Mock.conditionA);

      var routeB = factory.create(ORIGIN, DESTINATION);
      routeB.addCondition(Mock.conditionA);

      var resultA = routeA.selfsame(routeA);
      var resultB = routeA.selfsame(routeB);

      expect(Object.is).toHaveBeenCalled();
      expect(resultA).toBe(true);
      expect(resultB).toBe(false);
    });

  });

  describe('clone method', function() {

    it('should call Object.assign', function() {
      spyOn(Object, 'assign').and.callThrough();

      var routeA = factory.create(ORIGIN, DESTINATION);
      routeA.addCondition(Mock.conditionA);
      var clone = routeA.clone();

      expect(Object.assign).toHaveBeenCalled();
      expect(routeA.equals(clone)).toBe(true);
      expect(routeA.selfsame(clone)).toBe(false);
    });

  });

  describe('toJson method', function() {

    beforeEach(function() {
      route.addCondition(Mock.conditionA);
      mockJson();
    });

    it('should return a well formatted json based on Route', function() {
      expect(route.toJson()).toEqual(Mock.json);
    });

  });

  function mockCondition($injector) {
    var conditionFactory = $injector.get('otusjs.model.navigation.RouteConditionFactory');
    Mock.conditionA = conditionFactory.create('CONDITION A');
    Mock.conditionB = conditionFactory.create('CONDITION B');
  }

  function mockJson() {
    Mock.json = JSON.stringify({
      extents: 'SurveyTemplateObject',
      objectType: 'Route',
      origin: ORIGIN,
      destination: DESTINATION,
      name: ROUTE_NAME,
      isDefault: false,
      conditions: [Mock.conditionA.toJson()]
    }).replace(/"{/g, '{').replace(/\}"/g, '}').replace(/\\/g, '');
  }
});