(function() {
    'use strict';

    angular
        .module('otusjs.validation')
        .factory('LowerLimitValidatorFactory', LowerLimitValidatorFactory);

    LowerLimitValidatorFactory.$inject = ['LabelFactory'];

    function LowerLimitValidatorFactory(LabelFactory) {
        var self = this;

        /* Public interface */
        self.create = create;

        function create(value) {
            return new LowerLimitValidator(value, LabelFactory);
        }

        return self;
    }

    function LowerLimitValidator(value, LabelFactory) {
        var self = this;

        self.extends = 'StudioObject';
        self.objectType = 'LowerLimitValidator';
        self.dataType = 'Integer';
        self.value = value;
        self.label = {
            'ptBR': LabelFactory.create(),
            'enUS': LabelFactory.create(),
            'esES': LabelFactory.create()
        };
    }

}());
