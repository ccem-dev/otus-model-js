(function () {
  'use strict';

  angular
    .module('otusjs.staticVariable')
    .factory('otusjs.staticVariable.StaticVariableFactory', Factory);

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
      var variable = new StaticVariable(jsonObject.label, jsonObject.name, jsonObject.sending, jsonObject.bindToWholeTemplate, jsonObject.customizations, jsonObject.bindTo);

      variable.value = jsonObject.value;
      return variable;
    }

    return self;
  }

  function StaticVariable(label, name, sending, wholeTemplate, customizations, bindTo) {
    var self = this;

    self.objectType = "StaticVariable";
    self.name = name || '';
    self.label = label || '';
    self.sending = sending || '';
    self.customized = false;
    self.bindToWholeTemplate = wholeTemplate === undefined ? true : wholeTemplate;
    self.bindTo = bindTo || [];
    self.value = '';
    self.customizations = customizations || [];

    _init();

    self.setCustomizations = setCustomizations;
    self.addCustomization = addCustomization;
    self.removeCustomization = removeCustomization;
    self.setValue = setValue;
    self.toJSON = toJSON;

    function _init() {
      self.customized = !!self.customizations.length;
      _translateValue();
    }

    function addCustomization(value, label) {
      if (!value) {
        throw new Error("Customization must have a value");
      }

      if(_findCustomization(value)) {
        throw new Error("Customization with value " + value + "already exists.");
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
      let stringValue = self.value.toString();
      let translation = self.customizations.find(custom => {
        return custom.value === stringValue;
      });

      if (!translation) {
        self.translatedValue = stringValue;
        return;
      }

      self.translatedValue = translation.label;
    }

    function _findCustomization(value) {
      return self.customizations.find(custom => {
        return custom.value === value;
      })
    }

    function toJSON() {
      let json = {};

      json.objectType = self.objectType;
      json.name = self.name;
      json.label = self.label;
      json.sending = self.sending;
      json.bindToWholeTemplate = self.bindToWholeTemplate;
      json.bindTo = self.bindTo;
      json.customizations = self.customizations;

      return json;
    }

    return self;
  }

  function StaticVariableCustomization(value, label) {
    var self = this;

    self.toJSON = toJSON;

    self.objectType = "StaticVariableCustomization";
    self.value = value;
    self.label = label || '';

    function toJSON() {
      let json = {};

      json.objectType = self.objectType;
      json.value = self.value;
      json.label = self.label;

      return json;
    }

    return self;
  }


}());