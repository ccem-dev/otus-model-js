describe('NavigationFactory', function () {

  var Mock = {};
  var injections = {};
  var EXTENTS = 'SurveyTemplateObject';
  var OBJECT_TYPE = 'Navigation';
  var ORIGIN = 'CAD1';
  var DESTINATION = 'CAD2';
  var INDEX = 1;
  var factory, nullNavigation;

  beforeEach(function () {
    angular.mock.module('otusjs');

    inject(function (_$injector_) {
      factory = _$injector_.get('otusjs.model.navigation.NavigationFactory');
      mockRouteFactory(_$injector_);
    });
  });

  describe('create method', function () {

    var navigation;

    it('should return an object that extends SurveyTemplateObject', function () {
      navigation = factory.create(ORIGIN);

      expect(navigation.extents).toEqual(EXTENTS);
    });

    it('should return an object of Navigation type', function () {
      navigation = factory.create(ORIGIN);

      expect(navigation.objectType).toEqual(OBJECT_TYPE);
    });

    it('should return an object with a valid origin defined', function () {
      navigation = factory.create(ORIGIN);

      expect(navigation.origin).toBeDefined();
    });

    it('should return null when origin is not set', function () {
      navigation = factory.create(null);

      expect(navigation.origin).toBe('NULL NAVIGATION');
    });

    it('should clear navigations', function () {
      mockJson();

      navigation = factory.fromJson(Mock.json);
      navigation.clearNavigation();

      expect(navigation.inNavigations).toEqual([]);
      expect(navigation.routes).toEqual([]);
    });

    it('should remove a route with given destination', function () {
      mockJson();

      navigation = factory.fromJson(Mock.json);
      navigation.removeRouteByDestination(DESTINATION);

      expect(navigation.routes).toEqual([]);
    });

    it('should inform if giver destination is default route', function () {
      mockJson();

      navigation = factory.fromJson(Mock.json);

      expect(navigation.isDefaultRoute(DESTINATION)).toBe(true);
    });
  });

  describe('fromJson method', function () {

    beforeEach(function () {
      mockJson();
    });

    it('should return an object that extends StudioObject', function () {
      var navigation = factory.fromJson(Mock.json);

      expect(navigation.extents).toEqual(EXTENTS);
    });

    it('should return an object of Navigation type', function () {
      var navigation = factory.fromJson(Mock.json);

      expect(navigation.objectType).toEqual(OBJECT_TYPE);
    });

    it('should return an object with a valid origin defined', function () {
      var navigation = factory.fromJson(Mock.json);

      expect(navigation.origin).toBeDefined();
    });

    it('should return NULL NAVIGATION when origin is not set', function () {
      var navigation = factory.fromJson(Mock.jsonWithoutOrigin);

      expect(navigation.origin).toBe('NULL NAVIGATION');
    });

    it('should return NULL NAVIGATION when is json without route', function () {
      var navigation = factory.fromJson(Mock.jsonWithoutRoute);

      expect(navigation.origin).toBe('NULL NAVIGATION');
    });
  });

  describe('createNullNavigation method', function () {
    beforeEach(function () {
      nullNavigation = factory.createNullNavigation();
    });

    it('should have NULL NAVIGATION as origin', function () {
      expect(nullNavigation.origin).toEqual('NULL NAVIGATION');
    });

    it('should have empty arrays of navigations and routes', function () {
      expect(nullNavigation.inNavigations.length).toBe(0);
      expect(nullNavigation.outNavigations.length).toBe(0);
      expect(nullNavigation.routes.length).toBe(0);
    });

    it('should return true for orphan', function () {
      expect(nullNavigation.isOrphan()).toBe(true);
      expect(nullNavigation.hasOrphanRoot()).toBe(true);
    });

    it('should have null index', function () {
      expect(nullNavigation.index).toBe(null);
    });
  });

  describe('setRoutes method', function () {
    it('should assign the expected value', function () {
      var navigation = factory.fromJson(Mock.json);
      var routes = navigation.listRoutes();
      routes.push(Mock.RouteFactory.fromJson({
        extents: EXTENTS,
        objectType: 'Route',
        origin: ORIGIN,
        destination: 'CAD3',
        name: ORIGIN + '_' + DESTINATION,
        isDefault: true,
        conditions: []
      }));

      navigation.setRoutes(routes);
      expect(navigation.listRoutes().length).toBe(2);
    });
  });

  function mockRouteFactory($injector) {
    Mock.RouteFactory = $injector.get('otusjs.model.navigation.RouteFactory');
    injections.RouteFactory = Mock.RouteFactory;
  }

  function mockJson() {
    Mock.json = {
      extents: EXTENTS,
      objectType: OBJECT_TYPE,
      origin: ORIGIN,
      index: INDEX,
      isDefault: true,
      routes: [{
        extents: EXTENTS,
        objectType: 'Route',
        origin: ORIGIN,
        destination: 'CAD2',
        name: ORIGIN + '_' + DESTINATION,
        isDefault: true,
        conditions: []
      }]
    };

    Mock.jsonWithoutOrigin = {
      extents: EXTENTS,
      objectType: OBJECT_TYPE,
      index: INDEX,
      isDefault: true,
      routes: [{
        extents: EXTENTS,
        objectType: 'Route',
        origin: ORIGIN,
        destination: 'CAD2',
        name: ORIGIN + '_' + DESTINATION,
        isDefault: true,
        conditions: []
      }]
    };

    Mock.jsonWithoutDestination = {
      extents: EXTENTS,
      objectType: OBJECT_TYPE,
      origin: ORIGIN,
      index: INDEX,
      isDefault: true,
      routes: [{
        extents: EXTENTS,
        objectType: 'Route',
        origin: ORIGIN,
        name: ORIGIN + '_' + DESTINATION,
        isDefault: true,
        conditions: []
      }]
    };

    Mock.jsonWithoutRoute = {
      extents: EXTENTS,
      objectType: OBJECT_TYPE,
      origin: ORIGIN,
      index: INDEX,
      isDefault: true,
      routes: []
    };
  }

});
