(function() {
  angular
    .module('otusjs.laboratory')
    .service('otusjs.laboratory.LaboratoryConfigurationService', service);

  function service() {
    var self = this;
    var _laboratoryDescriptor;

    /* Public Interface */
    self.initialize = initialize;
    self.getLaboratoryConfiguration = getLaboratoryConfiguration;
    self.getAliquotDescriptor = getAliquotDescriptor;
    self.getTubeAliquots = getTubeAliquots;

    function initialize(labDescriptor) {
      _laboratoryDescriptor = labDescriptor;
    }

    function getLaboratoryConfiguration(){
      return _laboratoryDescriptor;
   }

    function getAliquotDescriptor(aliquotName, momentName, tubeType, groupName){
      console.log(_laboratoryDescriptor.aliquotConfiguration.aliquotMomentDescriptors);
      return _laboratoryDescriptor.aliquotConfiguration
      .aliquotMomentDescriptors
      .find(function(momentDescriptor){
          return momentDescriptor.name === momentName;
      })
      .aliquotTypesDescriptors
      .find(function(typeDescriptor){
          return typeDescriptor.name === tubeType;
      })
      .aliquoteGroupDescriptors
      .find(function(groupDescriptor){
          return groupDescriptor.name === groupName;
      })
      .aliquots
      .find(function(aliquotDescriptor){
          return aliquotDescriptor.name === aliquotName;
      });
   }

    function getTubeAliquots(momentName, tubeType, groupName){
      var allTubeAliquots = _laboratoryDescriptor.aliquotConfiguration
      .aliquotMomentDescriptors
      .find(function(momentDescriptor){
          return momentDescriptor.name === momentName;
      })
      .aliquotTypesDescriptors
      .find(function(typeDescriptor){
          return typeDescriptor.name === tubeType;
      })
      .aliquoteGroupDescriptors
      .find(function(groupDescriptor){
          return groupDescriptor.name === groupName;
      })
      .aliquots;

      return allTubeAliquots;
   }

    return self;
  }
}());
