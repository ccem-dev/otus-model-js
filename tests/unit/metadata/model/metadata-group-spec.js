describe('MetadataGroup', function() {
    var Mock = {};
    var factory, metadataGroup;

    beforeEach(function() {
        module('otusjs');

        inject(function(_$injector_) {
            factory = _$injector_.get('MetadataGroupFactory', {
                MetadataAnswerFactory: mockMetadataAnswerFactory(_$injector_)
            });
        });

        metadataGroup = factory.create();
    });

    describe('getOptionListSize method', function() {

        it('should return the size of option list', function() {
            metadataGroup.createOption();
            expect(metadataGroup.getOptionListSize()).toBe(1);

            metadataGroup.createOption();
            expect(metadataGroup.getOptionListSize()).toBe(2);

            metadataGroup.createOption();
            expect(metadataGroup.getOptionListSize()).toBe(3);

            metadataGroup.removeOption(2);
            expect(metadataGroup.getOptionListSize()).toBe(2);
        });

    });

    describe('getOptionByValue method', function() {

        it('should the option with parameter value', function() {
            metadataGroup.createOption();
            expect(metadataGroup.getOptionByValue(1).value).toBe(1);
            expect(metadataGroup.getOptionByValue(1).value).not.toBe(2);
        });

    });

    describe('createOption method', function() {

        beforeEach(function() {
            metadataGroup.createOption();
        });

        it('should call MetadataAnswerFactory.create', function() {
            expect(Mock.MetadataAnswerFactory.create).toHaveBeenCalled();
        });

        it('should add a new metadata answer option in group', function() {
            expect(metadataGroup.getOptionListSize()).toBe(1);
        });

    });

    describe('removeOption method', function() {

        beforeEach(function() {
            metadataGroup.createOption();
            metadataGroup.createOption();
            metadataGroup.createOption();
            metadataGroup.createOption();
        });

        it('should reomve an option by value from option list', function() {
            metadataGroup.removeOption(3);

            expect(metadataGroup.getOptionListSize()).toBe(3);
        });

        it('should reorder the option values', function() {
            metadataGroup.removeOption(2);

            expect(metadataGroup.getOptionByValue(1).value).toBe(1);
            expect(metadataGroup.getOptionByValue(2).value).toBe(2);
            expect(metadataGroup.getOptionByValue(3).value).toBe(3);
        });

    });

    describe('removeLastOption method', function() {

        beforeEach(function() {
            metadataGroup.createOption();
            metadataGroup.createOption();
            metadataGroup.createOption();
            metadataGroup.createOption();
        });

        it('should reomve the last option from option list', function() {
            metadataGroup.removeLastOption();

            expect(metadataGroup.getOptionListSize()).toBe(3);

            expect(metadataGroup.getOptionByValue(1).value).toBe(1);
            expect(metadataGroup.getOptionByValue(2).value).toBe(2);
            expect(metadataGroup.getOptionByValue(3).value).toBe(3);

            expect(metadataGroup.getOptionByValue(4)).toBeUndefined();
        });

    });

    function mockMetadataAnswerFactory($injector) {
        Mock.MetadataAnswerFactory = $injector.get('MetadataAnswerFactory');

        spyOn(Mock.MetadataAnswerFactory, 'create').and.callThrough();

        return Mock.MetadataAnswerFactory;
    }

});