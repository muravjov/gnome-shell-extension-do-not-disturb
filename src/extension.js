const Me = imports.misc.extensionUtils.getCurrentExtension();
const Settings = Me.imports.settings;
const Widget = Me.imports.widgets;
const Main = imports.ui.main;
const Timing = Me.imports.timing;

/**
 * Called when the extension is loaded.
 */
function init() {
}

/**
 * Enable the do not disturb extension. Adds all UI elements and monitors the settings object.
 */
function enable() {

    this._lastMuteState = false;

    this._disturbToggle = new Widget.DoNotDisturbToggle();
    this._disturbToggle.show();

    this._hideDotController = new Widget.HideDotController();

    this._enabledIcon = new Widget.DoNotDisturbIcon();

    this._settings = new Settings.SettingsManager();

    this._disturbToggle.onToggleStateChanged(() => _toggle());

    this._settings.onDoNotDisturbChanged(() => _sync());
    this._settings.onShowIconChanged(() => _sync());
    this._settings.onHideNotificationDotChanged(() => _sync());
    this._settings.onMuteSoundChanged(() => _sync());

    // Turn on at time
    // var startTime = new Date();
    // startTime.setHours(12);
    // startTime.setMinutes(45);
    // startTime.setSeconds(0, 0);
    //
    // var millis = startTime - Date.now();
    //
    // Timing.setTimeout(function(){
    //   this._settings.setDoNotDisturb(true);
    // }.bind(this), millis);


    this._sync();
}

/**
 * Disables the extension. Tears down all UI components.
 */
function disable() {
    this._disturbToggle.destroy();
    this._enabledIcon.destroy();
    this._hideDotController.unhideDot();
}

/**
 * Toggle the status of the do not disturb mode in _settings.
 */
function _toggle(){
  this._settings.setDoNotDisturb(this._disturbToggle.getToggleState()); // This will trigger a call to _sync
}

/**
 * Updates the UI based on the _settings. Includes switching the toggle state and showing the status icon.
 */
function _sync(){
  let enabled = this._settings.isDoNotDisturb();
  let showIcon = this._settings.shouldShowIcon();
  let hideDot = this._settings.shouldHideNotificationDot();
  let muteSounds = this._settings.shouldMuteSound();

  // Turn off after timeout
  if(enabled){
    // this.timeout_id = Timing.setTimeout(function(){
    //   this._settings.setDoNotDisturb(false);
    // }.bind(this), 5000);
  } else {
    Timing.clearTimeout(this.timeout_id);
  }

  if(enabled && showIcon){
      this._enabledIcon.hide();
      this._enabledIcon.show();
  } else {
    this._enabledIcon.hide();
  }

  if(enabled && hideDot){
    this._hideDotController.hideDot();
  } else {
    this._hideDotController.unhideDot();
  }

  if(enabled && muteSounds){
    this._settings.muteAllSounds();
  } else if (this._lastMuteState && !muteSounds){
    this._settings.unmuteAllSounds();
  }

  this._lastMuteState = muteSounds;

  this._disturbToggle.setToggleState(enabled);
}
