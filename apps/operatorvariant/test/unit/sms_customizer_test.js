/* global requireApp, suite, suiteSetup, suiteTeardown, setup, teardown, test,
   assert, sinon, smsCustomizer */

'use strict';

requireApp('operatorvariant/test/unit/mock_navigator_moz_settings.js');

requireApp('operatorvariant/js/customizers/customizer.js');
requireApp('operatorvariant/js/customizers/sms_customizer.js');

suite('SMS customizer >', function() {
  const SMS_MAX_CONCAT = 'operatorResource.sms.maxConcat';
  const MMS_SIZE_LIMIT = 'dom.mms.operatorSizeLimitation';

  var createLockSpy;
  var realSettings;

  suiteSetup(function() {
    realSettings = navigator.mozSettings;
    navigator.mozSettings = window.MockNavigatorSettings;
    createLockSpy = sinon.spy(navigator.mozSettings, 'createLock');
  });

  suiteTeardown(function() {
    navigator.mozSettings = realSettings;
    createLockSpy.restore();
  });

  setup(function() {
    createLockSpy.reset();
  });

  teardown(function() {
    navigator.mozSettings.mTeardown();
  });

  test(' set valid value (integer) > ', function() {
    var sttngs = navigator.mozSettings.mSettings;

    smsCustomizer.set({
      smsMaxConcat: 10,
      mmsSizeLimitation: 307200
    });

    assert.isTrue(createLockSpy.calledOnce);

    assert.strictEqual(sttngs[SMS_MAX_CONCAT], 10);
    assert.strictEqual(sttngs[MMS_SIZE_LIMIT], 307200);

  });

  test(' set valid value (decimal) > ', function() {
    var sttngs = navigator.mozSettings.mSettings;

    smsCustomizer.set({
      smsMaxConcat: 10.5,
      mmsSizeLimitation: 307200.2
    });
    assert.isTrue(createLockSpy.calledOnce);

    assert.strictEqual(sttngs[SMS_MAX_CONCAT], 10);
    assert.strictEqual(sttngs[MMS_SIZE_LIMIT], 307200);
  });

  test(' set invalid value (NaN) > ', function() {
    var sttngs = navigator.mozSettings.mSettings;

    smsCustomizer.set({
      smsMaxConcat: 'a'
    });
    assert.isTrue(createLockSpy.notCalled);

    assert.isUndefined(sttngs.SMS_MAX_CONCAT);
    assert.isUndefined(sttngs.MMS_SIZE_LIMIT);
  });

  test(' set invalid value (negative value) > ', function() {
    var sttngs = navigator.mozSettings.mSettings;

    smsCustomizer.set({
      mmsSizeLimitation: -1
    });
    assert.isTrue(createLockSpy.notCalled);

    assert.isUndefined(sttngs.SMS_MAX_CONCAT);
    assert.isUndefined(sttngs.MMS_SIZE_LIMIT);
  });
});
