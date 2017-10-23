/*donejs-survey-ad@0.1.1#donejs-survey-ad*/
define([
    'require',
    'exports',
    'module',
    'can-control',
    'css!./donejs-survey-ad.less.css'
], function (require, exports, module) {
    var Control = require('can-control');
    require('css!./donejs-survey-ad.less.css');
    exports.SurveyAd = Control.extend({
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