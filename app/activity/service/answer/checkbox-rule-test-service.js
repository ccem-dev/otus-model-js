(function() {
  'use strict';

  angular
    .module('otusjs.model.activity')
    .service('otusjs.model.activity.CheckboxRuleTestService', Service);

  Service.$inject = [
    'otusjs.model.activity.NumericRuleTestService'
  ];

  function Service(NumericRuleTestService) {
    var self = this;
    var _runner = {};
    self.name = 'CheckboxRuleTest';

    /* Public Methods */
    self.run = run;

    function run(rule, answer) {
      _polyfillIsInteger();

      if (answer instanceof Array) {
        return _runner[rule.operator](rule.answer, answer);
      } else if (rule.isMetadata || Number.isInteger(answer)) {
        return NumericRuleTestService.run(rule, answer);
      } else {
        return false;
      }
    }

    _runner.equal = function(reference, answer) {
      var result = answer.filter(function(answer) {
        if (answer.option === reference && answer.state === true) {
          return true;
        }
      });
      return result.length > 0 ? true : false;
    }

    _runner.notEqual = function(reference, answer) {
      var result = answer.filter(function(answer) {
        if (answer.option === reference && answer.state === true) {
          return true;
        }
      });
      return result.length > 0 ? false : true;
    }

    _runner.contains = function(reference, answer) {
      var result = answer.filter(function(answer) {
        if (answer.option === reference && answer.state === true) {
          return true;
        }
      });
      return result.length > 0 ? true : false;
    }

    _runner.quantity = function(reference, answer) {
      var result = answer.filter(function(answer) {
        if (answer.state === true) {
          return true;
        }
      });
      return result.length == reference;
    }

    _runner.minSelected = function(reference, answer) {
      var result = answer.filter(function(answer) {
        if (answer.state === true) {
          return true;
        }
      });
      return result.length >= reference;
    }

    _runner.maxSelected = function(reference, answer) {
      var result = answer.filter(function(answer) {
        if (answer.state === true) {
          return true;
        }
      });

      return result.length <= reference;
    }

    function _polyfillIsInteger() {
      Number.isInteger = Number.isInteger || function(value) {
        return typeof value === "number" &&
          isFinite(value) &&
          Math.floor(value) === value;
      };
    }

  }
}());
