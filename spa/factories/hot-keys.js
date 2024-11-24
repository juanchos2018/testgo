window.angular.module('ERP').factory('HotKeys', [
	'$window', '$timeout',
	function ($window, $timeout) {
		var $, HotKeys, isPressed, registeredKeys = {}, defaultSelector = '[ng-view] > *';

		$ = angular.element;

		HotKeys = {};

		isPressed = function (key, event) {
			var keyCode = event.keyCode || event.which;

			if (typeof key === 'number') {
				return (keyCode === key);
			} else if (typeof key === 'string') {
				var newKey = {};
				var keys = {
					'intro': 13, 'esc': 27, 'space': 32, 'tab': 9, 'del': 8, 'supr': 46, 'left': 37, 'right': 39, 'up': 38, 'down': 40,
					'f1': 112, 'f2': 113, 'f3': 114, 'f4': 115, 'f5': 116, 'f6': 117, 'f7': 118, 'f8': 119, 'f9': 120, 'f10': 121, 'f11': 122, 'f12': 123
				};

				key.split('+').forEach(function (strKey) {
					strKey = strKey.trim().toLowerCase();

					switch (strKey) {
						case 'ctrl':
							newKey.ctrlKey = true;
							break;
						case 'alt':
							newKey.altKey = true;
							break;
						case 'shift':
							newKey.shiftKey = true;
							break;
						default:
							if (strKey.length > 1) {
								newKey.key = keys[strKey] || 0;
							} else {
								newKey.key = strKey;
							}
					}
				});

				return isPressed(newKey, event);
			} else if (key.constructor.name === 'Object') {
				var keyProps = Object.keys(key);

				for (var i = 0; i < keyProps.length; i++) {
					var keyProp = keyProps[i];
					var keyVal = key[keyProp];
					
					switch (keyProp) {
						case 'key':
							if (typeof keyVal === 'number') {
								if (keyCode !== keyVal) {
									return false;
								}
							} else if (keyVal === '.') {
								if (keyCode !== 190 && keyCode !== 110 && keyCode !== 46) {
									return false;
								}
							} else if (keyVal === '*') {
								if (keyCode !== 106) {
									return false;
								}
							} else if (isNaN(keyVal)) {
								if (keyCode !== keyVal.toUpperCase().charCodeAt(0) && keyCode !== keyVal.toLowerCase().charCodeAt(0)) {
									return false;
								}
							} else {
								if (keyCode !== (48 + parseInt(keyVal)) && keyCode !== (96 + parseInt(keyVal))) {
									return false;
								}
							}
							break;
						default:
							if (event[keyProp] !== keyVal) {
								return false;
							}
					}
				}

				return true;
			}
		};

		HotKeys.add = function (keys, target, callback, alias) {
			var _add = function (key) {
				if (alias) {
					if (!(key in registeredKeys)) {
						registeredKeys[key] = {};
					}

					if (alias in registeredKeys[key]) {
						target.off('keydown', registeredKeys[key][alias]);
						registeredKeys[key][alias] = null;
					}

					registeredKeys[key][alias] = function (e) {
						if (isPressed(key, e)) {
							callback.call(target.get(0), e, key);
						}
					};

					target.keydown(registeredKeys[key][alias]);
				} else {
					target.keydown(function (e) {
						if (isPressed(key, e)) {
							callback.call(target.get(0), e, key);
						}
					});
				}
			};

			$timeout(function () {
				if (typeof callback === 'string') {
					alias = callback;
				}

				if (typeof target === 'function') {
					callback = target;
					target = $(defaultSelector);
				} else if (typeof target === 'boolean') {
					target = $($window);
				} else if (target !== undefined) {
					target = $(target);
				}

				if (keys.constructor.name === 'Array') {
					keys.forEach(function (key) {
						_add(key);
					});
				} else {
					_add(keys);
				}
			});
		};

		HotKeys.remove = function (keys, target, alias) {
			var _remove = function (key) {
				if (key in registeredKeys) {
					if (alias in registeredKeys[key]) {
						target.off('keydown', registeredKeys[key][alias]);
						registeredKeys[key][alias] = null;
						delete registeredKeys[key][alias];
					}
				}
			};

			if (typeof target === 'string') {
				alias = target;

				if ($(target).length) {
					target = $(target);
				} else {
					target = $(defaultSelector);
				}
			} else if (typeof target === 'boolean') {
				target = $($window);
				alias = '$window';
			} else {
				target = $(target);
				alias = target.selector;
			}

			if (keys.constructor.name === 'Array') {
				keys.forEach(function (key) {
					_remove(key);
				});
			} else {
				_remove(keys);
			}
		};

		return HotKeys;
	}
]);