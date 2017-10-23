import plugin from './donejs-survey-ad';
import QUnit from 'steal-qunit';

QUnit.module('donejs-survey-ad');

QUnit.test('Initialized the plugin', function(){
  QUnit.equal(typeof plugin, 'object');
});

QUnit.test('Control exported as SurveyAd', function(){
	QUnit.equal(typeof plugin.SurveyAd, 'function');
});
