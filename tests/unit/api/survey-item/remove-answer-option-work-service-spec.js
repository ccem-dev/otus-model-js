describe('the RemoveAnswerOptionService', function() {
  var service;
  var Mock = {};

  beforeEach(function() {
    angular.mock.module('otusjs');

    inject(function(_$injector_) {
      mockJson();
      service = _$injector_.get('RemoveAnswerOptionService');
    });
  });

  describe('execute method', function() {

    it('should exist', function() {
      var container = service.execute(Mock.item);
      expect(container).not.toBeDefined();
    });

  });

  function mockJson() {
    Mock.validatorType = {};
    Mock.item = {

      removeLastOption: function() {}

    };

  }


});
