(function() {
  'use strict';

  angular
    .module('otusjs.model.navigation')
    .service('otusjs.model.navigation.RouteAddService', service);

  service.$inject = [
    'otusjs.model.navigation.RouteFactory',
    'otusjs.model.navigation.RouteConditionFactory',
    'otusjs.model.navigation.RuleFactory'
  ];

  function service(RouteFactory, RouteConditionFactory, RuleFactory) {
    var self = this;

    /* Public methods */
    self.execute = execute;

    function execute(routeData, navigation) {
      var route = RouteFactory.create(routeData.origin, routeData.destination);

      routeData.conditionSet.forEach(function(condition) {
        var condition = RouteConditionFactory.create(condition.name);

        condition.rules.forEach(function(rule) {
          var newRule = RuleFactory.create(rule.when.customID);

          if (rule.answer instanceof Object) {
            newRule[rule.operator.type]();
          } else {
            newRule[rule.operator.type](rule.answer);
          }

          condition.addRule(newRule);
        });

        route.addCondition(condition);
      });

      navigation.addRoute(route);
      return route;
    }
  }
}());
