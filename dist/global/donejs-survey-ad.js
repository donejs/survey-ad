/*[global-shim-start]*/
(function(exports, global, doEval) {
	// jshint ignore:line
	var origDefine = global.define;

	var get = function(name) {
		var parts = name.split("."),
			cur = global,
			i;
		for (i = 0; i < parts.length; i++) {
			if (!cur) {
				break;
			}
			cur = cur[parts[i]];
		}
		return cur;
	};
	var set = function(name, val) {
		var parts = name.split("."),
			cur = global,
			i,
			part,
			next;
		for (i = 0; i < parts.length - 1; i++) {
			part = parts[i];
			next = cur[part];
			if (!next) {
				next = cur[part] = {};
			}
			cur = next;
		}
		part = parts[parts.length - 1];
		cur[part] = val;
	};
	var useDefault = function(mod) {
		if (!mod || !mod.__esModule) return false;
		var esProps = { __esModule: true, default: true };
		for (var p in mod) {
			if (!esProps[p]) return false;
		}
		return true;
	};

	var hasCjsDependencies = function(deps) {
		return (
			deps[0] === "require" && deps[1] === "exports" && deps[2] === "module"
		);
	};

	var modules =
		(global.define && global.define.modules) ||
		(global._define && global._define.modules) ||
		{};
	var ourDefine = (global.define = function(moduleName, deps, callback) {
		var module;
		if (typeof deps === "function") {
			callback = deps;
			deps = [];
		}
		var args = [],
			i;
		for (i = 0; i < deps.length; i++) {
			args.push(
				exports[deps[i]]
					? get(exports[deps[i]])
					: modules[deps[i]] || get(deps[i])
			);
		}
		// CJS has no dependencies but 3 callback arguments
		if (hasCjsDependencies(deps) || (!deps.length && callback.length)) {
			module = { exports: {} };
			args[0] = function(name) {
				return exports[name] ? get(exports[name]) : modules[name];
			};
			args[1] = module.exports;
			args[2] = module;
		} else if (!args[0] && deps[0] === "exports") {
			// Babel uses the exports and module object.
			module = { exports: {} };
			args[0] = module.exports;
			if (deps[1] === "module") {
				args[1] = module;
			}
		} else if (!args[0] && deps[0] === "module") {
			args[0] = { id: moduleName };
		}

		global.define = origDefine;
		var result = callback ? callback.apply(null, args) : undefined;
		global.define = ourDefine;

		// Favor CJS module.exports over the return value
		result = module && module.exports ? module.exports : result;
		modules[moduleName] = result;

		// Set global exports
		var globalExport = exports[moduleName];
		if (globalExport && !get(globalExport)) {
			if (useDefault(result)) {
				result = result["default"];
			}
			set(globalExport, result);
		}
	});
	global.define.orig = origDefine;
	global.define.modules = modules;
	global.define.amd = true;
	ourDefine("@loader", [], function() {
		// shim for @@global-helpers
		var noop = function() {};
		return {
			get: function() {
				return { prepareGlobal: noop, retrieveGlobal: noop };
			},
			global: global,
			__exec: function(__load) {
				doEval(__load.source, global);
			}
		};
	});
})(
	{},
	typeof self == "object" && self.Object == Object ? self : window,
	function(__$source__, __$global__) {
		// jshint ignore:line
		eval("(function() { " + __$source__ + " \n }).call(__$global__);");
	}
);

/*donejs-survey-ad@0.1.0#donejs-survey-ad*/
define('donejs-survey-ad', [
    'require',
    'exports',
    'module',
    'can-control',
    'donejs-survey-ad/donejs-survey-ad.less'
], function (require, exports, module) {
    var Control = require('can-control');
    require('donejs-survey-ad/donejs-survey-ad.less');
    module.exports = Control.extend({
        defaults: {
            addShowingClassToElement: null,
            engagementCountKey: 'survey-ad-engagement-count',
            engagementCountMinimum: 3,
            linkTarget: null,
            projectName: 'DoneJS',
            userDidCloseKey: 'survey-ad-closed'
        }
    }, {
        init: function () {
            var surveyAdElement = this.element;
            var linkTarget = this.options.linkTarget;
            if (linkTarget) {
                var linkElement = surveyAdElement.querySelector('a');
                linkElement.target = linkTarget;
            }
            var projectNameContainer = surveyAdElement.querySelector('.project-name');
            if (projectNameContainer) {
                projectNameContainer.textContent = this.options.projectName;
            }
            var closeButton = surveyAdElement.querySelector('.close');
            if (closeButton.classList) {
                closeButton.style.display = 'inline-block';
            }
            try {
                var didClose = window.localStorage.getItem(this.options.userDidCloseKey);
                var engagementCount = window.localStorage.getItem(this.options.engagementCountKey);
                if (!didClose && engagementCount >= this.options.engagementCountMinimum) {
                    this.show();
                }
            } catch (error) {
                console.info('Caught localStorage error:', error);
            }
        },
        didEngage: function () {
            try {
                var storageKey = this.options.engagementCountKey;
                var engagementCount = parseInt(window.localStorage.getItem(storageKey) || '0', 10);
                var newEngagementCount = 1 + engagementCount;
                window.localStorage.setItem(storageKey, newEngagementCount);
                if (newEngagementCount >= this.options.engagementCountMinimum) {
                    var didClose = window.localStorage.getItem(this.options.userDidCloseKey);
                    if (!didClose) {
                        this.show();
                    }
                }
            } catch (error) {
                console.info('Caught localStorage error:', error);
            }
        },
        hide: function () {
            if (this.element.classList) {
                this.element.classList.remove('showing');
            }
            var addShowingClassToElement = this.options.addShowingClassToElement;
            if (addShowingClassToElement) {
                addShowingClassToElement.classList.remove('survey-ad-showing');
            }
        },
        show: function () {
            if (this.element.classList) {
                this.element.classList.add('showing');
            }
            var addShowingClassToElement = this.options.addShowingClassToElement;
            if (addShowingClassToElement) {
                addShowingClassToElement.classList.add('survey-ad-showing');
            }
        },
        '{element} .close click': function () {
            this.hide();
            try {
                var currentTime = new Date().getTime();
                var storageKey = this.options.userDidCloseKey;
                window.localStorage.setItem(storageKey, currentTime);
            } catch (error) {
                console.info('Caught localStorage error:', error);
            }
        }
    });
});
/*[global-shim-end]*/
(function(global) { // jshint ignore:line
	global._define = global.define;
	global.define = global.define.orig;
}
)(typeof self == "object" && self.Object == Object ? self : window);