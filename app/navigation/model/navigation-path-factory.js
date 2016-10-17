(function() {
  'use strict';

  angular
    .module('otusjs.model.navigation')
    .factory('otusjs.model.navigation.NavigationPathFactory', Factory);

  function Factory() {
    var self = this;

    /* Public methods */
    self.create = create;

    function create() {
      return new NavigationStack();
    }

    return self;
  }

  function NavigationStack() {
    var self = this;
    var _size = 0;
    var _head = null;
    var _tail = null;
    var _current = null;
    var _currentIndex = null;

    /* Public methods */
    self.add = add;
    self.ahead = ahead;
    self.back = back;
    self.getCurrentItem = getCurrentItem;
    self.getSize = getSize;
    self.goToBeginning = goToBeginning;

    function add(item) {
      if (_notExistsHead()) {
        _setupHead(item);
      } else {
        _ensureCurrentValue();
        _setupTail(item);
        _setupCurrent();
      }
      _updateIndexation();
    }

    function ahead() {
      _current = _current.getNext();
      ++_currentIndex;
    }

    function back() {
      _current = _current.getPrevious();
      --_currentIndex;
      if (!_current) {
        _head = null;
      }
    }

    function getCurrentItem() {
      return _current;
    }

    function getSize() {
      return _size;
    }

    function goToBeginning() {
      _current = _head;
      _currentIndex = 0;
    }

    function _ensureCurrentValue() {
      _current = _current || _tail;
    }

    function _notExistsHead() {
      return !_head;
    }

    function _setupCurrent() {
      _current.setNext(_tail);
      _current = _tail;
    }

    function _setupHead(item) {
      _head = item;
      _head.setPrevious(null);
      _head.setNext(null);
      _current = _head;
    }

    function _setupTail(item) {
      _tail = item;
      _tail.setPrevious(_current);
      _tail.setNext(null);
    }

    function _updateIndexation() {
      if ( (_currentIndex < (_size - 1)) ){
        _size = _currentIndex + 2;
        ++_currentIndex;
      } else {
        ++_size;
        _currentIndex = _size - 1;
      }
    }
  }
}());
