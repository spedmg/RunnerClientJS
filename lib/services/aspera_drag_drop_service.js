'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = require('./drag_drop_service'),
    DragDropService = _require.DragDropService;

var _require2 = require('./aspera_connect_service'),
    AsperaConnectService = _require2.AsperaConnectService;

var AW4 = window.AW4;

var AsperaDragDropService = function (_DragDropService) {
  _inherits(AsperaDragDropService, _DragDropService);

  function AsperaDragDropService() {
    _classCallCheck(this, AsperaDragDropService);

    return _possibleConstructorReturn(this, (AsperaDragDropService.__proto__ || Object.getPrototypeOf(AsperaDragDropService)).apply(this, arguments));
  }

  _createClass(AsperaDragDropService, null, [{
    key: 'addTarget',
    value: function addTarget(target, eventCallbacks) {
      _get(AsperaDragDropService.__proto__ || Object.getPrototypeOf(AsperaDragDropService), 'addTarget', this).call(this, target, eventCallbacks);
      AsperaConnectService.connect.initSession();
    }
  }, {
    key: 'dropCallback',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(event) {
        var _this2 = this;

        var filesDropped, data, manifest, dragDropManifestGrouping, parentDirectory, dropHelper;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                event.stopPropagation();
                event.preventDefault();

                filesDropped = Array.from(event.dataTransfer.files);
                data = {
                  dataTransfer: {
                    files: filesDropped.map(function (_ref2) {
                      var lastModifiedDate = _ref2.lastModifiedDate,
                          name = _ref2.name,
                          size = _ref2.size,
                          type = _ref2.type;

                      return { lastModifiedDate: lastModifiedDate, name: name, size: size, type: type };
                    })
                  }
                };
                _context.next = 6;
                return this._groupedFolderContents(event);

              case 6:
                manifest = _context.sent;
                dragDropManifestGrouping = {};

                for (parentDirectory in manifest) {
                  dragDropManifestGrouping[parentDirectory] = Object.keys(manifest[parentDirectory]);
                }

                dropHelper = function dropHelper(files) {
                  _this2._executeEventCallbacksFor('drop', { event: event, files: files, dragDropManifestGrouping: dragDropManifestGrouping });
                };

                AsperaConnectService.connect.connectHttpRequest(AW4.Connect.HTTP_METHOD.POST, '/connect/file/dropped-files', data, AW4.Utils.SESSION_ID, { success: dropHelper });

              case 11:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function dropCallback(_x) {
        return _ref.apply(this, arguments);
      }

      return dropCallback;
    }()
  }]);

  return AsperaDragDropService;
}(DragDropService);

module.exports = { AsperaDragDropService: AsperaDragDropService };