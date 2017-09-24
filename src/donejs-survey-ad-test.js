import QUnit from 'steal-qunit';
import plugin from './donejs-survey-ad';

QUnit.module('donejs-survey-ad');

QUnit.test('Initialized the plugin', function(){
  QUnit.equal(typeof plugin, 'function');
  QUnit.equal(plugin(), 'This is the donejs-survey-ad plugin');
});
