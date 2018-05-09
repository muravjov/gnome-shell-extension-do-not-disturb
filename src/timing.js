const GLib = imports.gi.GLib;
const Lang = imports.lang;

const setTimeout = (func, millis) => {
    return GLib.timeout_add(GLib.PRIORITY_DEFAULT, millis, () => {
        func();

        return false; // Don't repeat
    }, null);
};

const clearTimeout = id => GLib.Source.remove(id);

const setInterval = (func, millis) => {
    let id = GLib.timeout_add(GLib.PRIORITY_DEFAULT, millis, () => {
        func();

        return true; // Repeat
    }, null);

    return id;
};

const clearInterval = id => GLib.Source.remove(id);

const Time = function(hour, minute, second){
  return {
    hour: hour,
    minute: minute,
    second: second
  };
};

const Alarm = function(func, time){

  var id = undefined;

  var isEnabled = function(){
    return id != undefined;
  };

  var cancel = function(){
    if (isEnabled()) {
      clearTimeout(id);
      id = undefined;
    }
  };

  var start = function(repeating){
    var date = new Date();
    date.setHours(time.hour, time.minute, time.second);

    var currentTime = new Date();

    // If the alarm time is in the past, move it to the next day
    if(date.getTime() < currentTime.getTime()){
      date.setTime(date.getTime() + 86400000); // Increment by 1 day in millis
    }

    var timeout = parseInt(date - currentTime);

    if (!isEnabled()) {
      id = setTimeout(function(){
        func();
        id = undefined;
        if (repeating) {
          start(repeating);
        }
      }, timeout);
    }
  };

  return {
    start: start,
    cancel: cancel,
    isEnabled: isEnabled
  };
};
