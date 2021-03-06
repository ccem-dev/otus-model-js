(function () {
  'use strict';

  angular.module('utils')
    .factory('GeoJSON', Factory);

  function Factory() {
    var constructor = function (callback) {
      return new GeoJSON(callback);
    };

    function GeoJSON(callback) {
      var self = this;

      function getLocation() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(setPosition, showError, {timeout: 10000, maximumAge: 300000 });
        } else {
          throw new Error("Geolocation is not supported by this browser.");
        }
      }

      function setPosition(position) {
        self.type = angular.copy('point');
        self.coordinates = angular.copy([0,0]);
        self.coordinates[0] =  angular.copy(position.coords.latitude);
        self.coordinates[1] = angular.copy(position.coords.longitude);
        if (callback) callback(toJSON())
        self = toJSON();
      }

      function showError(error) {
        switch(error.code) {
          case error.PERMISSION_DENIED:
           console.error("User denied the request for Geolocation.");
          case error.POSITION_UNAVAILABLE:
           console.error("Location information is unavailable.");
          case error.TIMEOUT:
           console.error("The request to get user location timed out.");
          case error.UNKNOWN_ERROR:
           console.error("An unknown error occurred.");
        }
        callback(null);
      }

      function toJSON() {
        var json = {
          type: self.type,
          coordinates: self.coordinates
        };
        return json;
      }
      getLocation();
      return self;
    }

    return constructor;
  }
}());
