(function () {
  'use strict';

  angular
    .module('otusjs.staticVariable')
    .factory('otusjs.staticVariable.SurveyStaticVariableFactory', Factory);

  Factory.$inject = [];

  function Factory() {
    var self = this;

    /* Public interface */
    self.create = create;
    self.fromJson = fromJson;

    function create() {
      return new StaticVariable();
    }

    function fromJson(jsonObject) {
      var variable = new StaticVariable(jsonObject.label, jsonObject.name, jsonObject.sending, jsonObject.wholeTemplate, jsonObject.customizations, jsonObject.bindTo);

      variable.value = jsonObject.value;
      return variable;
    }

    return self;
  }

  function StaticVariable(label, name, sending, wholeTemplate, customizations, bindTo) {
    var self = this;

    self.name = name || '';
    self.label = label || '';
    self.sending = sending || -1;
    self.customized = false;
    self.bindToWholeTemplate = wholeTemplate || true;
    self.bindTo = bindTo || [];
    self.value = '';
    self.customizations = customizations || [];

    _init();

    self.setCustomizations = setCustomizations;
    self.addCustomization = addCustomization;
    self.removeCustomization = removeCustomization;
    self.setValue = setValue;

    function _init() {
      self.customized = !!self.customizations;
      _translateValue();
    }

    function addCustomization(value, label) {
      if(!value){
        throw new Error("Customization must have a value");
      }

      self.customizations.push(new StaticVariableCustomization(value, label));
    }

    function removeCustomization(ix) {
      return self.customizations.splice(ix, 1);
    }

    function setValue(value) {
      self.value = value;
      _translateValue();
    }

    function setCustomizations(customizations) {
      self.customizations = customizations.map(custom => {
        return new StaticVariableCustomization(custom.value, custom.label);
      });
    }

    function _translateValue() {
      let translation = self.customizations.find(custom => {
        return custom.value === self.value;
      });

      if (!translation){
        self.translatedValue = self.value;
        return;
      }

      self.translatedValue = translation.label;
    }


    return self;
  }

  function StaticVariableCustomization(value, label) {
    var self = this;

    self.value = value;
    self.label = label || '';

    return self;
  }


}());