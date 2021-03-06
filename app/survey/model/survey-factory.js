(function () {
  'use strict';

  angular
    .module('otusjs.survey')
    .factory('SurveyFactory', SurveyFactory);

  SurveyFactory.$inject = [
    'SurveyIdentityFactory',
    'SurveyMetaInfoFactory',
    'SurveyUUIDGenerator',
    'otusjs.model.navigation.NavigationManagerFactory',
    'SurveyItemManagerFactory',
    'otusjs.model.survey.DataSourceDefinitionManagerFactory',
    'SurveyDictionaryService',
    'otusjs.staticVariable.StaticVariableManagerFactory',
    'otusjs.surveyItemGroup.SurveyItemGroupManagerFactory',
    'otusjs.survey.ManagerCenterService'
  ];

  var Inject = {};

  function SurveyFactory(SurveyIdentityFactory, SurveyMetaInfoFactory, SurveyUUIDGenerator, NavigationManagerFactory, SurveyItemManagerFactory, DataSourceDefinitionManagerFactory, SurveyDictionaryService, StaticVariableManagerFactory, SurveyItemGroupManagerFactory, ManagerCenterService) {
    var self = this;

    self.OBJECT_TYPE = 'Survey';

    Inject.SurveyItemManagerFactory = SurveyItemManagerFactory;
    Inject.NavigationManagerFactory = NavigationManagerFactory;
    Inject.DataSourceDefinitionManagerFactory = DataSourceDefinitionManagerFactory;
    Inject.SurveyDictionaryService = SurveyDictionaryService;
    Inject.StaticVariableManagerFactory = StaticVariableManagerFactory;
    Inject.SurveyItemGroupManagerFactory = SurveyItemGroupManagerFactory;
    Inject.ManagerCenterService = ManagerCenterService;

    /* Public interface */
    self.create = create;
    self.fromJsonObject = fromJsonObject;
    self.createDictionary = createDictionary;

    function create(name, acronym) {
      var UUID = SurveyUUIDGenerator.generateSurveyUUID();
      var metainfo = SurveyMetaInfoFactory.create();
      var identity = SurveyIdentityFactory.create(name, acronym);
      var survey = new Survey(metainfo, identity, UUID);

      survey.initialize();
      return survey;
    }

    function fromJsonObject(jsonObject) {
      var metainfo = SurveyMetaInfoFactory.fromJsonObject(jsonObject.metainfo);
      var identity = SurveyIdentityFactory.fromJsonObject(jsonObject.identity);
      var UUID = jsonObject.oid;
      var survey = new Survey(metainfo, identity, UUID);

      survey.SurveyItemManager.loadJsonDataObject(jsonObject.itemContainer);
      survey.NavigationManager.loadJsonData(jsonObject.navigationList);
      survey.DataSourceManager.loadJsonData(jsonObject.dataSources);
      survey.StaticVariableManager.loadJsonData(jsonObject.staticVariableList || []);
      survey.SurveyItemGroupManager.loadJsonData(jsonObject.surveyItemGroupList);
      return survey;
    }

    function createDictionary(jsonObject) {
      return Inject.SurveyDictionaryService
        .dictionaryConstructionByExtractionId(jsonObject);
    }

    return self;
  }

  function Survey(surveyMetainfo, surveyIdentity, uuid) {
    var self = this;

    self.extents = 'StudioObject';
    self.objectType = 'Survey';
    self.oid = uuid;
    self.identity = surveyIdentity;
    self.metainfo = surveyMetainfo;
    self.SurveyItemManager = Inject.SurveyItemManagerFactory.create();
    self.NavigationManager = Inject.NavigationManagerFactory.create(self);
    self.DataSourceManager = Inject.DataSourceDefinitionManagerFactory.create();
    self.StaticVariableManager = Inject.StaticVariableManagerFactory.create();
    self.SurveyItemGroupManager = Inject.SurveyItemGroupManagerFactory.create();

    Inject.ManagerCenterService.initialize(self.SurveyItemManager, self.NavigationManager, self.SurveyItemGroupManager); //todo move to initialize if possible

    /* Public methods */
    self.initialize = initialize;
    self.addItem = addItem;
    self.removeItem = removeItem;
    self.moveItem = moveItem;
    self.updateItem = updateItem;
    self.loadItem = loadItem;
    self.getItems = getItems;
    self.getItemByTemplateID = getItemByTemplateID;
    self.getItemByCustomID = getItemByCustomID;
    self.getItemByID = getItemByID;
    self.isAvailableID = isAvailableID;
    self.isAvailableCustomID = isAvailableCustomID;
    self.getDataSource = getDataSource;
    self.getAllDataSources = getAllDataSources;
    self.createStaticVariable = createStaticVariable;
    self.getStaticVariableList = getStaticVariableList;
    self.fillStaticVariablesValues = fillStaticVariablesValues;
    self.getWholeTemplateVariableList = getWholeTemplateVariableList;
    self.getItemStaticVariableList = getItemStaticVariableList;
    self.getGroupByItemID = getGroupByItemID;
    self.getGroupItemsByItemID = getGroupItemsByItemID;
    self.loadIncrementalIDValue = loadIncrementalIDValue;
    self.toJSON = toJSON;

    function initialize() {
      self.SurveyItemManager.init();
      self.NavigationManager.initialize();
    }

    function addItem(type) {
      var item = self.SurveyItemManager.addItem(type, self.identity.acronym);
      self.NavigationManager.addNavigation();
      return item;
    }

    function removeItem(templateID) {
      self.SurveyItemGroupManager.removeItemFromGroup(templateID);
      self.SurveyItemManager.removeItem(templateID);
      self.NavigationManager.removeNavigation(templateID);
    }

    function moveItem(item, position) {
      self.SurveyItemGroupManager.allowItemMovement(item.templateID, position);
      self.SurveyItemManager.moveItem(item, position);
      self.NavigationManager.moveNavigation(item.templateID, position);
    }

    function updateItem(item) {
      self.navigationList[item.templateID] = item;
    }

    function loadItem(type, templateID) {
      var item = self.SurveyItemManager.loadItem(type, templateID, self.identity.acronym);
      self.NavigationManager.addNavigation();
      return item;
    }

    function loadIncrementalIDValue() {
      self.SurveyItemManager.loadIncrementalIDValue(self.identity.acronym);
    }

    function getItems() {
      return self.SurveyItemManager.getItemList();
    }

    function getItemByTemplateID(templateID) {
      return self.SurveyItemManager.getItemByTemplateID(templateID);
    }

    function getItemByCustomID(customID) {
      return self.SurveyItemManager.getItemByCustomID(customID);
    }

    function getItemByID(id) {
      return self.SurveyItemManager.getItemByID(id);
    }

    function isAvailableID(id) {
      return !self.SurveyItemManager.existsItem(id);
    }

    function isAvailableCustomID(id) {
      return self.SurveyItemManager.isAvailableCustomID(id);
    }

    function getDataSource(name) {
      return self.DataSourceManager.getDataSourceDefinition(name);
    }

    function getAllDataSources() {
      return angular.copy(self.DataSourceManager.list());
    }

    /* Static Variables */
    function createStaticVariable() {
      return self.StaticVariableManager.create();
    }

    function getStaticVariableList() {
      return self.StaticVariableManager.getStaticVariableList();
    }

    function getWholeTemplateVariableList() {
      return self.StaticVariableManager.getWholeTemplateVariables();
    }

    function getItemStaticVariableList(itemID) {
      return self.StaticVariableManager.getItemVariables(itemID);
    }

    function fillStaticVariablesValues(fillingArray) {
      self.StaticVariableManager.fillVariables(fillingArray);
    }

    function getGroupByItemID(templateID) {
      return self.SurveyItemGroupManager.getGroupByMember(templateID)
    }

    function getGroupItemsByItemID(templateID) {
      let group = getGroupByItemID(templateID);
      if (group) {
        return group.members.map(member => {
          return getItemByTemplateID(member.id);
        });
      } else {
        return [getItemByTemplateID(templateID)];
      }
    }

    function toJSON() {
      var json = {};

      json.extents = self.extents;
      json.objectType = self.objectType;
      json.oid = self.oid;
      json.identity = self.identity;
      json.metainfo = self.metainfo;
      if (self.DataSourceManager.toJSON().length) {
        json.dataSources = self.DataSourceManager;
      } else {
        json.dataSources = [];
      }

      json.itemContainer = [];
      self.SurveyItemManager.getItemList().forEach(function (item) {
        json.itemContainer.push(item);
      });

      json.navigationList = [];
      self.NavigationManager.getNavigationList().forEach(function (navigation) {
        if (navigation) {
          json.navigationList.push(navigation);
        } else {
          json.navigationList.push({});
        }
      });

      json.staticVariableList = self.StaticVariableManager.getStaticVariableList();
      json.surveyItemGroupList = self.SurveyItemGroupManager.getSurveyItemGroupList();
      return json;
    }
  }
}());
