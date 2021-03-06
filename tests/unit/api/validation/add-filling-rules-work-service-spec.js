describe('AddFillingRulesService', function() {
  var service;
  var Mock = {};

  beforeEach(function() {
    angular.mock.module('otusjs');

    inject(function(_$injector_) {
      mockJson();
      service = _$injector_.get('AddFillingRulesService');
    });
  });

  describe('execute method', function() {

    it('should exist', function() {
      var container = service.execute(Mock.item, Mock.validatorType);
      expect(container).not.toBeDefined();
    });

  });

  function mockJson() {
    Mock.item = {
      fillingRules: {
        createOption: function() {}
      }
    };
    Mock.validatorType = {};
  }

});
