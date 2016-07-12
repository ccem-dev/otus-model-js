(function() {
    'use strict';

    angular
        .module('otusjs.navigation')
        .service('RemoveRuleService', RemoveRuleService);

    function RemoveRuleService() {
        var self = this;

        self.execute = execute;

        function execute(rule, route) {
            route.conditionSet[0].removeRule(rule);
        }
    }

}());