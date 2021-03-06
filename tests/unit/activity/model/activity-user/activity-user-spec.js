describe('ActivityUserF', function() {

    var USER_NAME = 'User Name';
    var USER_EMAIL = 'user@email.com';
    var factory;
    var Mock = {};

    beforeEach(function() {
        angular.mock.module('otusjs');

        mockJson();

        inject(function(_$injector_) {
            factory = _$injector_.get('otusjs.model.activity.ActivityUserFactory');
        });
    });

    describe('toJSON method', function() {

        it('should return a well formatted json based on instance of ActivityStatus', function() {
            var user = factory.create(USER_NAME, USER_EMAIL);

            expect(user.toJSON()).toEqual(Mock.json);
        });

    });

    function mockJson() {
        Mock.json = {
            objectType: 'ActivityUser',
            name: USER_NAME,
            email: USER_EMAIL
        };
    }

});
