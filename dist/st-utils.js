!function(){"use strict";angular.module("utils",[])}(),function(){"use strict";function e(){function e(e){var n={};if(Array.isArray(e)||e instanceof Function)return e;if(e instanceof Object){var t=Object.getOwnPropertyNames(e);return t.forEach(function(t){var i=e[t];if(i instanceof Function){var o="";if(/^get/.test(t)){var s=t.substring(3,4).toLowerCase();o=s+t.substring(4);var u=i();if(Array.isArray(u)){var c=[];u.forEach(function(e){var n=r.clone(e);c.push(n)}),n[o]=c}else if(u instanceof Object){var a=r.clone(u);n[o]=a}else n[o]=u}}else n[t]=e[t]}),JSON.stringify(n).replace(/\\/g,"").replace(/"{/g,"{").replace(/\}"/g,"}")}return e}var r=this;r.clone=e}angular.module("utils").service("JsonClonerService",e)}(),function(){"use strict";function e(){function e(e){var r={};for(var n in e)r[n]=e[n];return r}var r=this;r.clone=e}angular.module("utils").service("ClonerService",e)}(),function(){"use strict";function e(){function e(e){for(var r=-1!=e.indexOf("-")?"-":".",n=e.split(r),t=n.length,i=n[0].toLowerCase(),o=1;t>o;o++){var s=n[o].slice(0,1),u=n[o].slice(1);i=i.concat(s.toUpperCase().concat(u.toLowerCase()))}return i}var r=this;r.normalizeString=e}angular.module("utils").service("StringNormalizer",e)}(),function(){"use strict";function e(e,r){function n(){return Base64.encode(i+o+s)}var t=this,i="userUUID:["+e.sessionStorage.userUUID+"]",o="surveyUUID:["+r.generateUUID()+"]",s="repositoryUUID:[ Not done yet ]";t.generateSurveyUUID=n}angular.module("utils").service("SurveyUUIDGenerator",e),e.$inject=["$window","UUIDService"]}(),function(){"use strict";function e(){function e(){return uuid.v1()}var r=this;r.generateUUID=e}angular.module("utils").service("UUIDService",e)}();