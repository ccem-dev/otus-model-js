(function() {
  'use strict';

  angular
    .module('otusjs.surveyItem')
    .factory('OptionItemFactory', OptionItemFactory);

  function OptionItemFactory() {
    var self = this;

    /* Public interface */
    self.create = create;
    self.fromJsonObject = fromJsonObject;

    function create(optionValue) {
      return new Option(optionValue);
    }

    function fromJsonObject(option) {
      if(option.objectType === 'OptionItem'){
          return new Option(option.value);
      } else {
        return [];
      }
    }

    return self;
  }

  function Option(value) {
    var self = this;
    self.extends = 'StudioObject';
    self.objectType = 'OptionItem';
    self.value = value;
  }

}());
