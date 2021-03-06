describe('Navigation:', function () {

  var Mock = {};
  var injections = {};
  var navigationA, navigationB, navigationC, navigationD;
  var EXTENTS = 'SurveyTemplateObject';
  var OBJECT_TYPE = 'Navigation';
  var DIFF_OBJECT_TYPE = 'DIFF_OBJECT_TYPE';
  var CAD1 = 'CAD1';
  var CAD2 = 'CAD2';
  var CAD3 = 'CAD3';
  var CAD4 = 'CAD4';
  var CAD5 = 'CAD5';

  beforeEach(function () {
    angular.mock.module('otusjs');

    inject(function (_$injector_) {
      mockNavigations(_$injector_);
      mockRouteFactory(_$injector_);
      mockRoutes(_$injector_);
      mockJson();
    });
  });

  describe('addInNavigation method', function () {

    it('should add the "self" navigation as out navigation of parent navigation', function () {
      spyOn(navigationA, 'addOutNavigation');

      navigationB.addInNavigation(navigationA);

      expect(navigationA.addOutNavigation).toHaveBeenCalledWith(navigationB);
    });

    it('should put a navigation in inNavigations list', function () {
      navigationB.addInNavigation(navigationA);

      expect(navigationB.inNavigations[0].equals(navigationA)).toBe(true);
    });

  });

  describe('hasMultipleOutRoutes', function () {
   it('should be true when have more than the default route', function () {
      navigationA.setupDefaultRoute(Mock.routeCAD1_CAD2);
      expect(navigationA.hasMultipleOutRoutes()).toBe(false);

      navigationA.createAlternativeRoute(Mock.routeCAD1_CAD3);
      navigationA.createAlternativeRoute(Mock.routeCAD1_CAD4);

      expect(navigationA.hasMultipleOutRoutes()).toBe(true);
    })
  });

  describe('hasMultipleInNavigations', function () {
    it('should be true when have more than the one inNavigation route', function () {
      navigationD.addInNavigation(navigationA);
      expect(navigationD.hasMultipleInNavigations()).toBe(false);

      navigationD.addInNavigation(navigationB);
      navigationD.addInNavigation(navigationC);
      navigationD.addInNavigation(navigationD);

      expect(navigationD.hasMultipleInNavigations()).toBe(true);
    })
  });

  describe('the outer nodes test methods', function () {
    it('isEndNode and isOuterNode should be true when is end node', function () {
      navigationA.origin = "END NODE";

      expect(navigationA.isEndNode()).toBe(true);
      expect(navigationA.isOuterNode()).toBe(true);
    });

    it('isBeginNode and isOuterNode should be true when is begin node', function () {
      navigationA.origin = "BEGIN NODE";

      expect(navigationA.isBeginNode()).toBe(true);
      expect(navigationA.isOuterNode()).toBe(true);
    });
  });

  describe('addOutNavigation method', function () {

    it('should put a navigation in inNavigations list', function () {
      navigationA.addOutNavigation(navigationB);

      expect(navigationA.outNavigations[0].equals(navigationB)).toBe(true);
    });

  });

  describe('clone method', function () {

    it('should return a clone of object', function () {
      var clone = navigationA.clone();

      expect(navigationA.equals(clone)).toBe(true);
      expect(navigationA.selfsame(clone)).toBe(false);
    });

  });

  describe('createAlternativeRoute method', function () {

    beforeEach(function () {
      navigationA.setupDefaultRoute(Mock.routeCAD1_CAD2);
    });

    it('should put a new route in route list', function () {
      navigationA.createAlternativeRoute(Mock.routeCAD1_CAD3);

      expect(navigationA.listRoutes().length).toBe(2);
    });

    it('should not put a route twice', function () {
      navigationA.createAlternativeRoute(Mock.routeCAD1_CAD3);

      expect(function () {
        navigationA.createAlternativeRoute(Mock.routeCAD1_CAD3);
      }).toThrow(new Error('Route already exists.'));
    });

    it('should not put a new route without conditions', function () {
      expect(function () {
        navigationA.createAlternativeRoute(Mock.routeCAD3_CAD4);
      }).toThrow(new Error('There are no conditions for this route.'));
    });

    it('should force the route to not be default', function () {

      Mock.routeCAD1_CAD3.isDefault = true;
      navigationA.createAlternativeRoute(Mock.routeCAD1_CAD3);

      expect(navigationA.listRoutes()[1].isDefault).toBe(false);
    });

  });

  describe('equals method', function () {

    describe('true cases', function () {

      it('should return true when two objects have the same properties and equal values', function () {
        var navigationB = Mock.NavigationFactory.create(CAD1, CAD2);
        expect(navigationA.equals(navigationB)).toBe(true);

        navigationA.createAlternativeRoute(Mock.routeCAD1_CAD3);
        navigationB.createAlternativeRoute(Mock.routeCAD1_CAD3);
        expect(navigationA.equals(navigationB)).toBe(true);
      });

      it('should return true when two objects have same routes in the list but in different order', function () {
        navigationA.createAlternativeRoute(Mock.routeCAD1_CAD3);
        navigationA.createAlternativeRoute(Mock.routeCAD1_CAD4);

        var navigationB = Mock.NavigationFactory.create(CAD1, CAD2)
        navigationB.createAlternativeRoute(Mock.routeCAD1_CAD4);
        navigationB.createAlternativeRoute(Mock.routeCAD1_CAD3);

        expect(navigationA.equals(navigationB)).toBe(true);
      });

    });

    describe('false cases', function () {

      it('should return false when two objects have different objectType value', function () {
        navigationB.objectType = DIFF_OBJECT_TYPE;

        expect(navigationA.equals(navigationB)).toBe(false);
      });

      it('should return false when two objects have different indexes', function () {
        navigationA.index = 0;
        var navigationB = Mock.NavigationFactory.create(CAD1, CAD2);
        navigationB.index = 1;

        expect(navigationA.equals(navigationB)).toBe(false);
      });

      it('should return false when two objects have different size of condition list', function () {
        navigationA.createAlternativeRoute(Mock.routeCAD1_CAD3);

        var navigationB = Mock.NavigationFactory.create(CAD1, CAD2);

        expect(navigationA.equals(navigationB)).toBe(false);
      });

      it('should return false when two objects have equal size of condition list but with different conditions', function () {
        navigationA.createAlternativeRoute(Mock.routeCAD1_CAD3);

        var navigationB = Mock.NavigationFactory.create(CAD1, CAD2);
        navigationB.createAlternativeRoute(Mock.routeCAD1_CAD4);

        expect(navigationA.equals(navigationB)).toBe(false);
      });

    });

  });

  describe('getRouteByName method', function () {

    describe('when route exists', function () {
      beforeEach(function () {
        navigationA.setupDefaultRoute(Mock.routeCAD1_CAD2);
      });

      it('should return a cloned route', function () {
        var clone1 = navigationA.getRouteByName(Mock.routeCAD1_CAD2.name);
        var clone2 = navigationA.getRouteByName(Mock.routeCAD1_CAD2.name);

        expect(clone1.equals(clone2)).toBe(true);
        clone1.isDefault = false;
        expect(clone1.equals(clone2)).toBe(false);
      });

    });

    describe('when route does not exists', function () {

      it('should return a null', function () {
        expect(navigationA.getRouteByName('INVALID_NAME')).toBe(null);
      });

    });

  });

  describe('hasRoute method', function () {
    beforeEach(function () {
      navigationA.setupDefaultRoute(Mock.routeCAD1_CAD2);
    });

    describe('when route exists', function () {

      it('should return true', function () {
        expect(navigationA.hasRoute(Mock.routeCAD1_CAD2)).toBe(true);
      });

    });

    describe('when route does not exists', function () {

      it('should return false', function () {
        expect(navigationA.hasRoute(Mock.routeCAD1_CAD3)).toBe(false);
      });

    });

  });

  describe('hasOrphanRoot method', function () {

    describe('true cases', function () {

      describe('when all parents are orphans', function () {

        it('should return true', function () {
          spyOn(navigationA, 'isOrphan').and.returnValue(true);

          navigationB.addInNavigation(navigationA);

          expect(navigationB.hasOrphanRoot()).toBe(true);
        });

      });

      describe('when all parents have orphan roots', function () {

        it('should return true', function () {
          spyOn(navigationA, 'hasOrphanRoot').and.returnValue(true);

          navigationB.addInNavigation(navigationA);

          expect(navigationB.hasOrphanRoot()).toBe(true);
        });

      });

    });

    describe('false cases', function () {

      describe('when navigation index is 0', function () {

        it('should return false', function () {
          navigationA.index = 0;

          expect(navigationA.hasOrphanRoot()).toBe(false);
        });

      });

      describe('when any parent is not orphan', function () {

        it('should return false', function () {
          navigationA.index = 0;
          spyOn(navigationA, 'isOrphan').and.returnValue(false);
          spyOn(navigationB, 'isOrphan').and.returnValue(true);

          navigationC.addInNavigation(navigationA);
          navigationC.addInNavigation(navigationB);

          expect(navigationC.hasOrphanRoot()).toBe(false);
        });

      });

      describe('when any parent does not have orphan root', function () {

        it('should return false', function () {
          spyOn(navigationB, 'isOrphan').and.returnValue(false);
          spyOn(navigationB, 'hasOrphanRoot').and.returnValue(false);

          navigationC.index = 2;
          spyOn(navigationC, 'isOrphan').and.returnValue(false);
          spyOn(navigationC, 'hasOrphanRoot').and.returnValue(true);

          navigationD.addInNavigation(navigationB);
          navigationD.addInNavigation(navigationC);

          expect(navigationD.hasOrphanRoot()).toBe(false);
        });

      });

    });

  });

  describe('isOrphan method', function () {

    describe('true cases', function () {

      describe('when navigation does not have parents', function () {

        it('should return true', function () {
          navigationB.index = 1;

          expect(navigationB.isOrphan()).toBe(true);
        });

      });

    });

    describe('false cases', function () {

      describe('when navigation is index zero', function () {

        it('should return true', function () {
          navigationA.index = 0;

          expect(navigationA.isOrphan()).toBe(false);
        });

      });

      describe('when navigation have parent', function () {

        it('should return true', function () {
          navigationB.addInNavigation(navigationA);

          expect(navigationB.isOrphan()).toBe(false);
        });

      });

    });

  });

  describe('listRoutes method', function () {

    beforeEach(function () {
      navigationA.setupDefaultRoute(Mock.routeCAD1_CAD2);
      navigationA.createAlternativeRoute(Mock.routeCAD1_CAD3);
      Mock.routeCAD1_CAD3.isDefault = true;
    });

    it('should return a list of cloned routes', function () {
      var cloneZero = navigationA.listRoutes()[0];
      cloneZero.name = 'AN_INVALID_NAME';

      expect(navigationA.getRouteByName(cloneZero.name)).toBe(null);
      expect(navigationA.getRouteByName(Mock.routeCAD1_CAD2.name).name).toBe('CAD1_CAD2');
    });

  });

  describe('removeInNavigation method', function () {

    it('should remove the navigation from inNavigation list', function () {
      navigationB.addInNavigation(navigationA);
      expect(navigationB.inNavigations.length).toBe(1);

      navigationB.removeInNavigation(navigationA);
      expect(navigationB.inNavigations.length).toBe(0);
    });

  });

  describe('removeRouteByName method', function () {

    beforeEach(function () {
      navigationA.createAlternativeRoute(Mock.routeCAD1_CAD3);
    });

    it('should remove the route from route list by the name', function () {
      navigationA.removeRouteByName(Mock.routeCAD1_CAD2.name);
      navigationA.removeRouteByName(Mock.routeCAD1_CAD3.name);

      expect(navigationA.listRoutes().length).toBe(0);
    });

  });

  describe('selfsame method', function () {

    it('should call Object.is', function () {
      spyOn(Object, 'is').and.callThrough();

      navigationA.createAlternativeRoute(Mock.routeCAD1_CAD3);
      navigationB.createAlternativeRoute(Mock.routeCAD1_CAD3);

      var resultA = navigationA.selfsame(navigationA);
      var resultB = navigationA.selfsame(navigationB);

      expect(Object.is).toHaveBeenCalled();
      expect(resultA).toBe(true);
      expect(resultB).toBe(false);
    });

  });

  describe('setupDefaultRoute method', function () {

    describe('when is possible setup de route', function () {

      it('should put the route at the index zero of route list', function () {
        navigationA.setupDefaultRoute(Mock.routeCAD1_CAD4);

        expect(navigationA.listRoutes()[0].equals(Mock.routeCAD1_CAD4)).toBe(true);
      });

      it('should set default route with value of new route', function () {
        navigationA.setupDefaultRoute(Mock.routeCAD1_CAD4);

        expect(navigationA.getDefaultRoute().equals(Mock.routeCAD1_CAD4)).toBe(true);
      });

      it('should not preserve the previous default route', function () {
        navigationA.setupDefaultRoute(Mock.routeCAD1_CAD4);

        expect(navigationA.listRoutes().length).toBe(1);
        expect(navigationA.getRouteByName(Mock.routeCAD1_CAD4)).toBe(null);
      });

      it('should force the route to not have conditions', function () {
        navigationA.setupDefaultRoute(Mock.routeCAD1_CAD4);

        expect(navigationA.listRoutes()[0].conditions.length).toBe(0);
      });

    });

    describe('when is not possible setup de route', function () {

      it('should throw a TypeError if route parameter is undefined', function () {
        expect(function () {
          navigationA.setupDefaultRoute(undefined);
        }).toThrow(new TypeError('Default route should not be undefined or null.'));
      });

      it('should throw a TypeError if route parameter is null', function () {
        expect(function () {
          navigationA.setupDefaultRoute(null);
        }).toThrow(new TypeError('Default route should not be undefined or null.'));
      });

    });

  });

  describe('updateInNavigation method', function () {

    describe('when navigation is not present in the list yet', function () {

      it('should add the navigation in the list', function () {
        navigationB.updateInNavigation(navigationA);

        expect(navigationB.inNavigations.length).toBe(1);
        expect(navigationB.inNavigations[0].equals(navigationA)).toBe(true);
      });

    });

    describe('when navigation is present in the list', function () {

      it('should replace the navigation in the list', function () {
        navigationB.updateInNavigation(navigationA);
        var inNavigationBeforeUpdate = navigationB.inNavigations[0];
        expect(inNavigationBeforeUpdate.anyChange).toBeUndefined();

        navigationA.anyChange = true;
        navigationB.updateInNavigation(navigationA);

        expect(navigationB.inNavigations.length).toBe(1);
        expect(navigationB.inNavigations[0].equals(navigationA)).toBe(true);
        expect(inNavigationBeforeUpdate.anyChange).toBeDefined();
      });

    });

  });

  describe('updateRoute method', function () {

    describe('when updated route is the current default', function () {

      it('should do nothing', function () {
        navigationA.setupDefaultRoute(Mock.routeCAD1_CAD2);
        Mock.routeCAD1_CAD2.isDefault = true;
        navigationA.updateRoute(Mock.routeCAD1_CAD2);

        expect(navigationA.getDefaultRoute().name).toBe(Mock.routeCAD1_CAD2.name);
        expect(navigationA.getDefaultRoute().isDefault).toBe(true);
      });

    });

    describe('when updated route is not the current default', function () {

      describe('and updated route is configured to be default', function () {

        beforeEach(function () {
          navigationA.setupDefaultRoute(Mock.routeCAD1_CAD2);
          navigationA.createAlternativeRoute(Mock.routeCAD1_CAD3);
          Mock.routeCAD1_CAD3.isDefault = true;
        });

        it('should remove the current default route', function () {
          navigationA.updateRoute(Mock.routeCAD1_CAD3);

          expect(navigationA.getRouteByName(Mock.routeCAD1_CAD2.name)).toBe(null);
        });

        it('should replace current default route with updated route data', function () {
          Mock.routeCAD1_CAD3.isDefault = true;
          navigationA.updateRoute(Mock.routeCAD1_CAD3);

          expect(navigationA.listRoutes().length).toBe(1);
          expect(navigationA.getDefaultRoute().equals(Mock.routeCAD1_CAD3)).toBe(true);
          expect(navigationA.getDefaultRoute().destination).toEqual(Mock.routeCAD1_CAD3.destination);
        });

      });

      describe('and updated route is configured to not be default', function () {

        beforeEach(function () {
          navigationA.setupDefaultRoute(Mock.routeCAD1_CAD2);
          navigationA.createAlternativeRoute(Mock.routeCAD1_CAD3);
        });

        it('should just replace the current route with updated route data', function () {
          Mock.routeCAD1_CAD3.conditions = [];

          navigationA.updateRoute(Mock.routeCAD1_CAD3);

          expect(navigationA.listRoutes()[1].equals(Mock.routeCAD1_CAD3)).toBe(true);
        })

      });

    });

  });

  describe('toJSON method', function () {

    beforeEach(function () {
      navigationA.index = 1;
    });

    it('should return a well formatted json based on Navigation', function () {
      navigationA.setupDefaultRoute(Mock.routeCAD1_CAD2);
      expect(JSON.parse(JSON.stringify(navigationA))).toEqual(Mock.json);
    });

    it('should return object well defined', function () {
      expect(navigationA.toJSON).toBeDefined();
    });

    xit('method toJSON should called method _buildJsonInNavigations', function () {
      spyOn(navigationA, '_buildJsonInNavigations').and.callThrough();
      navigationA.toJSON();

      expect(navigationA._buildJsonInNavigations).toHaveBeenCalled();
    });

  });

  function mockRouteFactory($injector) {
    Mock.RouteFactory = $injector.get('otusjs.model.navigation.RouteFactory');
    injections.RouteFactory = Mock.RouteFactory;
  }

  function mockRoutes($injector) {
    var RuleFactory = $injector.get('otusjs.model.navigation.RuleFactory');
    var conditionFactory = $injector.get('otusjs.model.navigation.RouteConditionFactory');

    Mock.condition = conditionFactory.create(CAD1, [RuleFactory.create(CAD1, 'equal', 1)]);

    Mock.routeCAD1_CAD2 = Mock.RouteFactory.createDefault(CAD1, CAD2);
    Mock.routeCAD1_CAD3 = Mock.RouteFactory.createAlternative(CAD1, CAD3, [Mock.condition]);
    Mock.routeCAD1_CAD4 = Mock.RouteFactory.createAlternative(CAD1, CAD4, [Mock.condition]);
    Mock.routeCAD1_CAD5 = Mock.RouteFactory.createAlternative(CAD1, CAD5, [Mock.condition]);

    Mock.routeCAD2_CAD3 = Mock.RouteFactory.createDefault(CAD2, CAD3);
    Mock.routeCAD2_CAD4 = Mock.RouteFactory.createAlternative(CAD2, CAD4, [Mock.condition]);
    Mock.routeCAD2_CAD5 = Mock.RouteFactory.createAlternative(CAD2, CAD5, [Mock.condition]);

    Mock.routeCAD3_CAD4 = Mock.RouteFactory.createDefault(CAD3, CAD4);
    Mock.routeCAD3_CAD5 = Mock.RouteFactory.createAlternative(CAD3, CAD5, [Mock.condition]);

    Mock.routeCAD4_CAD5 = Mock.RouteFactory.createDefault(CAD4, CAD5);
  }

  function mockNavigations($injector) {
    Mock.NavigationFactory = $injector.get('otusjs.model.navigation.NavigationFactory');

    navigationA = Mock.NavigationFactory.create(CAD1);
    navigationB = Mock.NavigationFactory.create(CAD2);
    navigationC = Mock.NavigationFactory.create(CAD3);
    navigationD = Mock.NavigationFactory.create(CAD4);
  }

  function mockJson() {
    Mock.json = JSON.parse(JSON.stringify({
      extents: EXTENTS,
      objectType: OBJECT_TYPE,
      origin: CAD1,
      index: 1,
      inNavigations: [],
      routes: [Mock.routeCAD1_CAD2]
    }));
  }
});
