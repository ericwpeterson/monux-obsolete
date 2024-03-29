'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _extends = Object.assign || function(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function() { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function(Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : {'default': obj}; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, {constructor: {value: subClass, enumerable: false, writable: true, configurable: true}}); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _spinJs = require('spin.js');

var _spinJs2 = _interopRequireDefault(_spinJs);

var ReactSpinner = (function(_React$Component) {
    _inherits(ReactSpinner, _React$Component);

    function ReactSpinner() {
        _classCallCheck(this, ReactSpinner);

        _get(Object.getPrototypeOf(ReactSpinner.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(ReactSpinner, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _props = this.props;
            var color = _props.color;
            var config = _props.config;

            var spinConfig = _extends({
                // a few sensible defaults
                width: 2,
                radius: 10,
                length: 7,
                // color should not overwrite config
                color: color
            }, config);

            this.spinner = new _spinJs2['default'](spinConfig);
            var targetElement = document.getElementById(_props.targetID);
            if (_props.showSpinner && targetElement) {
                targetElement.className += " spinnerOnTop"; //make sure a space is prepended
                this.spinner.spin(targetElement);
            }
        }
    }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(props) {
        var targetElement = document.getElementById(props.targetID);
        if (props.showSpinner && targetElement) {
            targetElement.className += " spinnerOnTop"; //make sure a space is prepended
            this.spinner.spin(targetElement);
        } else {
            if (targetElement) {
                targetElement.className =
                  targetElement.className.replace
                      (/(?:^|\s)spinnerOnTop(?!\S)/g , '');
            }
            this.spinner.stop();
        }
    }
},  {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
        //this.spinner.stop();
    }
}, {
    key: 'render',
    value: function render() {
        return _react2['default'].createElement('span', {ref: 'spinnerReference'});
    }
}], [{
    key: 'propTypes',
    value: {
        // This object is passed in wholesale as the spinner config
        config: _react.PropTypes.object,
        // This is a quick way to overwrite just the color on the config
        color: _react.PropTypes.string.isRequired
    },
    enumerable: true
}, {
    key: 'defaultProps',
    value: {
        config: {},
        color: 'black',
        showSpinner: false
    },
    enumerable: true
}]);

    return ReactSpinner;
})(_react2['default'].Component);

exports['default'] = ReactSpinner;
module.exports = exports['default'];
// config will overwrite anything else
