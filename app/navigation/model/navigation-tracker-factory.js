(function() {
  'use strict';

  angular
    .module('otusjs.model.navigation')
    .factory('otusjs.model.navigation.NavigationTrackerFactory', Factory);

  Factory.$inject = [
    'otusjs.model.navigation.NavigationTrackingItemFactory'
  ];

  function Factory(NavigationTrackingItemFactory) {
    var self = this;

    /* Public methods */
    self.create = create;
    self.fromJsonObject = fromJsonObject;

    /**
     * Creates a NavigationTracker. A NavigationTracker must have at least one item to track.
     * @param {array} itemsToTrack - the items that will be tracked
     * @returns {NavigationTracker}
     * @throws An error when no items are passed as parameter
     * @memberof NavigationTrackerFactory
     */
    function create(itemsToTrack, startIndex) {
      var validatedData = _applyPolicies(itemsToTrack, startIndex);
      var trackingItems = validatedData.itemsToTrack.map(_toNavigationTrackingItems);
      return new NavigationTracker(trackingItems, validatedData.startIndex);
    }

    function fromJsonObject(jsonObject) {
      return create(jsonObject.items, jsonObject.lastVisitedIndex);
    }

    // TODO: Move these methods to another object
    function _applyPolicies(itemsToTrack, startIndex) {
      _applyAtLeastOneItemToTrackPolicy(itemsToTrack);

      try {
        _applyValidStartIndexPolicy(startIndex, itemsToTrack.length - 1);
      } catch (error) {
        startIndex = null;
      }

      return {
        itemsToTrack: itemsToTrack,
        startIndex: startIndex
      };
    }

    function _applyAtLeastOneItemToTrackPolicy(itemsToTrack) {
      if (!itemsToTrack || !itemsToTrack.length) {
        throw new Error('No item to track is detected.', 'navigation-tracker-factory.js', 51);
      }
    }

    function _applyValidStartIndexPolicy(value, maxIndex) {
      if (!value || isNaN(value) || value < 0 || maxIndex < value) {
        throw new Error('An invalid start index has passed to NavigationTracker.', 'navigation-tracker-factory.js', 57);
      }
    }

    function _toNavigationTrackingItems(itemToTrack, index) {
      var item = {};
      item.index = index;
      item.id = itemToTrack.id || itemToTrack.origin;
      item.state = itemToTrack.state;
      item.previous = itemToTrack.previous;
      item.inputs = itemToTrack.inputs || _buildInputs(itemToTrack);
      item.outputs = itemToTrack.outputs || _buildOutputs(itemToTrack);
      return NavigationTrackingItemFactory.create(item);
    }

    function _buildInputs(itemToTrack) {
      if (itemToTrack.inNavigations) {
        return itemToTrack.inNavigations
          .filter(function(navigation) {
            return navigation.origin !== 'BEGIN NODE';
          })
          .map(function(navigation) {
            return navigation.origin;
          });
      } else {
        return [];
      }
    }

    function _buildOutputs(itemToTrack) {
      if (itemToTrack.inNavigations) {
        return itemToTrack.listRoutes()
          .filter(function(route) {
            return route.getDestination() !== 'END NODE';
          })
          .map(function(route) {
            return route.getDestination();
          });
      } else {
        return [];
      }
    }

    return self;
  }

  function NavigationTracker(items, startIndex) {
    var self = this;
    var _objectType = 'NavigationTracker';
    var _currentItem = null;
    var _items = null;
    var _size = 0;

    /* Public methods */
    self.getObjectType = getObjectType;
    self.getItems = getItems;
    self.getCurrentItem = getCurrentItem;
    self.getCurrentIndex = getCurrentIndex;
    self.getItemCount = getItemCount;
    self.getSkippedItems = getSkippedItems;
    self.visitItem = visitItem;
    self.updateCurrentItem = updateCurrentItem;
    self.hasPreviousItem = hasPreviousItem;
    self.toJson = toJson;

    (function constructor() {
      _items = _createNavigationTrackingItemContainer(items);
      _size = items.length;
    }());

    function _createNavigationTrackingItemContainer(items) {
      var container = {};

      items.forEach(function(item, index) {
        container[item.getID()] = item;
      });

      return container;
    }

    /**
     * Returns the object type of instance.
     * @returns {String}
     * @memberof NavigationTracker
     */
    function getObjectType() {
      return _objectType;
    }

    /**
     * Returns all items that are on tracking.
     * @returns {Map}
     * @memberof NavigationTracker
     */
    function getItems() {
      return _items;
    }

    /**
     * Returns the item being visited.
     * @returns {NavigationTrackingItem}
     * @memberof NavigationTracker
     */
    function getCurrentItem() {
      return _currentItem;
    }

    /**
     * Returns the index of item being visited.
     * @returns {Integer}
     * @memberof NavigationTracker
     */
    function getCurrentIndex() {
      if (_currentItem) {
        return _currentItem.getIndex();
      } else {
        return null;
      }
    }

    /**
     * Returns count of all items on tracking.
     * @returns {Integer}
     * @memberof NavigationTracker
     */
    function getItemCount() {
      return _size;
    }

    /**
     * Returns all items that are currently skipped.
     * @returns {Array}
     * @memberof NavigationTracker
     */
    function getSkippedItems() {
      var skippedItems = [];

      for (var itemID in _items) {
        if (_items[itemID].isSkipped()) {
          skippedItems.push(_items[itemID]);
        }
      }

      return skippedItems;
    }

    /**
     * @memberof NavigationTracker
     */
    function visitItem(idToVisit) {
      if (_isMovingForward(idToVisit)) {
        _setPrevious(idToVisit);
        _move(idToVisit);
        _resolveJumps();
      } else {
        _move(idToVisit);
      }
    }

    /**
     * @memberof NavigationTracker
     */
    function updateCurrentItem(item) {
      if (item.isFilled()) {
        _currentItem.setAsAnswered();
      } else if (item.isIgnored()) {
        _currentItem.setAsIgnored();
      }
    }

    function hasPreviousItem() {
      if (!_currentItem) {
        return false;
      } else {
        return _currentItem.getIndex() > 0;
      }
    }

    /**
     * Returns the representation of instance in JSON format.
     * @returns {JSON}
     * @memberof NavigationTracker
     */
    function toJson() {
      var json = {};

      json.objectType = _objectType;

      if (_currentItem) {
        json.lastVisitedIndex = _currentItem.getIndex();
      } else {
        json.lastVisitedIndex = null;
      }

      json.items = [];
      Object.keys(_items).forEach(function(itemID) {
        json.items.push(_items[itemID].toJson());
      });

      return json;
    }

    function _isMovingForward(idToVisit) {
      if (!_currentItem) {
        return true;
      }

      return (_currentItem.getIndex() < _items[idToVisit].getIndex()) ? true : false;
    }

    function _move(idToVisit) {
      _currentItem = _items[idToVisit];
    }

    function _setPrevious(idToVisit) {
      if (_currentItem) {
        _items[idToVisit].setPrevious(_currentItem.getID());
      }
    }

    //---------------------------------------------------------------------------------------------
    // Skipping service
    //---------------------------------------------------------------------------------------------
    function _resolveJumps() {
      if (_existsSiblings()) {
        _skipUnreachableSiblings();
      }
    }

    function _existsSiblings() {
      if (!_currentItem.getPrevious()) {
        return false;
      }

      if (_items[_currentItem.getPrevious()].getOutputs() === 1) {
        return false;
      }

      return true;
    }

    function _skipUnreachableSiblings() {
      _items[_currentItem.getPrevious()].getOutputs().forEach(function(siblingID) {
        if (!_isItemReachable(siblingID)) {
          _skipItem(siblingID);
          _tryPropagateSkip(siblingID);
        }
      });
    }

    function _isItemReachable(itemID) {
      if (_currentItem.getID() === itemID) {
        return true;
      }
      return _currentItem.getOutputs().some(function(outputID) {
        return outputID === itemID;
      });
    }

    function _tryPropagateSkip(skipedID) {
      _items[skipedID].getOutputs().forEach(function(outputID) {
        if (_isNotCurrentItem(outputID) && _isNotChildOfCurrentItem(outputID) &&  _isNotChildOfOriginItem(outputID)) {
          if (!_isOnPathOf(_currentItem.getID(), outputID, skipedID)) {
            _skipItem(outputID);
            _tryPropagateSkip(outputID);
          }
        }
      });
    }

    function _isNotCurrentItem(itemID) {
      return _currentItem.getID() !== itemID;
    }

    function _isNotChildOfCurrentItem(itemID) {
      return _currentItem.getOutputs().indexOf !== itemID;
    }

    function _isNotChildOfOriginItem(itemID) {
      return _items[_currentItem.getPrevious()].getOutputs().indexOf(itemID) === -1;
    }

    function _isOnPathOf(referenceID, idToTest, idToIgnore) {
      // If idToTest not comes after of the referenceID... is out of the way
      if (_items[idToTest].getIndex() <= _items[referenceID].getIndex()) {
        return false;
      }

      // If idToTest has direct access to referenceID... is on the way
      if (_items[idToTest].getInputs().indexOf(referenceID) !== -1) {
        return true;
      }

      // Verify if some input of idToTest is on the path of referenceID
      return _items[idToTest].getInputs().some(function(inputID) {
        if (idToIgnore !== inputID) {
          return _isOnPathOf(referenceID, inputID);
        }
      });
    }

    function _skipItem(itemID) {
      _items[itemID].setAsSkipped();
    }
  }
}());