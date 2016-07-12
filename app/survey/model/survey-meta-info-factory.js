(function() {
    'use strict';

    angular
        .module('otusjs.survey')
        .factory('SurveyMetaInfoFactory', SurveyMetaInfoFactory);

    function SurveyMetaInfoFactory() {
        var self = this;

        /* Public interdace */
        self.create = create;
        self.load = load;

        function load(surveyMetaInfoJson) {
          return new SurveyMetaInfo(surveyMetaInfoJson.creationDatetime);
        }

        function create() {
            var now = Date.now();
            return new SurveyMetaInfo(now);
        }

        return self;
    }

    function SurveyMetaInfo(creationDatetime) {
        var self = this;

        self.extents = 'StudioObject';
        self.objectType = 'SurveyMetaInfo';
        self.creationDatetime = creationDatetime;
        self.otusStudioVersion = '';

        self.toJson = toJson;

        function toJson() {
            var json = {};

            json.extents = self.extents;
            json.objectType = self.objectType;
            json.creationDatetime = self.creationDatetime;
            json.otusStudioVersion = self.otusStudioVersion;

            return JSON.stringify(json).replace(/"{/g, '{').replace(/\}"/g, '}').replace(/\\/g, '');
        }
    }

}());