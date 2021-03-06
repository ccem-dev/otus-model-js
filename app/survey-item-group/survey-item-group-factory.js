(function () {
  'use strict';

  angular
    .module('otusjs.surveyItemGroup')
    .factory('otusjs.surveyItemGroup.SurveyItemGroupFactory', Factory);

  Factory.$inject = [];

  function Factory() {
    var self = this;

    /* Public interface */
    self.create = create;
    self.fromJson = fromJson;

    function create(members) {
      return new SurveyItemGroup(members);
    }

    function fromJson(groupJson) {
      let group = new SurveyItemGroup();
      group.rewrite(groupJson);
      return group;
    }
    return self;
  }

  function SurveyItemGroup(members) {
    var self = this;
    const POSITION = {
      START: 'start',
      MIDDLE: 'middle',
      END: 'end'
    };

    self.objectType = "SurveyItemGroup";
    self.start = '';
    self.end = '';
    self.members = [];

    self.hasMember = hasMember;
    self.getMember = getMember;
    self.removeMember = removeMember;
    self.rewrite = rewrite;

    init();

    function init() {
      if (members && members.length) {
        let start = members.shift();
        let end = members.pop();
        self.start = start;
        self.end = end;
        self.members.push(new GroupMember(start, POSITION.START));
        members.forEach(member => {
          self.members.push(new GroupMember(member, POSITION.MIDDLE));
        });
        self.members.push(new GroupMember(end, POSITION.END));
      }
    }

    function getMember(id) {
      return self.members.find(member => {
        return member.id === id;
      });
    }

    function removeMember(id) {
      let member = self.getMember(id);
      if (self.members.length <= 2) {
        throw new Error("A group must have at least 2 members");
      }
      if (member) {
        if (member.position === 'start') {
          self.members.splice(0, 1);
          let newStart = self.members[0];
          self.start = newStart.id;
          newStart.position = 'start';

        } else if (member.position === 'end') {
          self.members.splice(-1, 1);
          let newEnd = self.members[self.members.length - 1];
          self.end = newEnd.id;
          newEnd.position = 'end';

        } else if (member.position === 'middle') {
          let indexToRemove = self.members.indexOf(member);
          self.members.splice(indexToRemove, 1);
        }
      }
    }

    function hasMember(id) {
      return !!getMember(id);
    }

    function rewrite(surveyItemGroup) {
      if (surveyItemGroup && surveyItemGroup.objectType === self.objectType) {
        self.start = surveyItemGroup.start;
        self.end = surveyItemGroup.end;
        self.members = surveyItemGroup.members;
      }
    }
    self.toJSON = toJSON;

    function toJSON() {
      let json = {};
      json.objectType = self.objectType;
      json.start = self.start;
      json.end = self.end;
      json.members = self.members;
      return json;
    }
    return self;
  }

  function GroupMember(id, position) {
    return {
      id: id,
      position: position
    }
  }
}());