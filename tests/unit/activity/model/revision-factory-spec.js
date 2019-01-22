describe("Tests revision factory", function () {
  var factory, revision;
  var Mock = {};
  var EMAIL_USER = "otus@email.com";
  var OBJECT_TYPE = "Revision";

  beforeEach(function () {
    angular.mock.module("otusjs.model.activity");

    inject(function (_$injector_) {
      factory = _$injector_.get('otusjs.model.activity.RevisionFactory');
    });

    Mock.jsonObject = {
      user: "otus@email.com",
      date : new Date(2019,1, 11)
    }
  });

  it('should have been defined factory', function () {
    expect(factory).toBeDefined();
  });

  it('should create a revision', function () {
    revision = factory.create(EMAIL_USER);
    expect(revision).toBeDefined();
    expect(revision.objectType).toEqual(OBJECT_TYPE);
    expect(revision.revisionDate instanceof Date).toEqual(true);
    expect(revision.user).toEqual(EMAIL_USER);
    expect(revision.toJSON).toBeDefined();
    expect(function () {
      factory.create();
    }).toThrowError("Invalid user for revision.");

    expect(revision.toJSON().objectType).toBeDefined();
    expect(revision.toJSON().revisionDate).toBeDefined();
    expect(revision.toJSON().user).toBeDefined();
  });

  it('should fromJsonObject', function () {
    revision = factory.fromJsonObject(Mock.jsonObject);
    expect(revision.user).toEqual(EMAIL_USER);
    expect(revision.revisionDate).toEqual(new Date(2019,1, 11));
  });

});
