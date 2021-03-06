(function() {
    'use strict';

    angular
        .module('otusjs.staticVariable')
        .service('otusjs.staticVariable.RemoveStaticVariableTaskService', RemoveStaticVariableService);

    function RemoveStaticVariableService() {
        var self = this;

        self.execute = execute;

        function execute(survey, index) {
            return survey.StaticVariableManager.remove(index);
        }
    }

}());
