var Promise = require("es6-promise").Promise;

var parseCookie = function() {
  var result = {};
  var pairs = document.cookie.split(";");
  pairs.forEach(function(pair) {
    var split = pair.split("=");
    var value = decodeURI(split[1]);
    try {
      value = JSON.parse(value);
    } catch(_) { }
    result[split[0].trim()] = value;
  });
  return result;
};

var cookie = function(key, value) {
  return new Promise(function(ok, fail) {
    if (value) {
      value = encodeURI(JSON.stringify(value));
      document.cookie = `${key}=${value};path=/;expires=Fri, 31 Dec 9999 23:59:59 GMT`;
      ok();
    } else {
      var cookies = parseCookie();
      ok(cookies[key]);
    }
  });
};

var Database = require("./idb");
var db = new Database("evercookie", 1, function() {
  db.createStore("cookies", {
    key: "key",
    autoincrement: false
  });
});

var idb = function(key, value) {
  if (value) {
    return db.ready.then(() => db.put("cookies", { key: key, value: value}));
  } else {
    return db.ready.then(() => db.get("cookies", key)).then(result => result.value);
  }
};

var localS = function(key, value) {
  return new Promise(function(ok, fail) {
    if (value) {
      window.localStorage.setItem(key, encodeURI(JSON.stringify(value)));
      ok();
    } else {
      var result = decodeURI(window.localStorage.getItem(key));
      try {
        result = JSON.parse(result);
      } catch(_) {}
      ok(result);
    }
  });
};

var methods = [cookie, idb, localS];

var facade = {
  access: function(key, value) {
    return new Promise(function(ok, fail) {
      var promises = methods.map(m => m(key, value));
      Promise.all(promises).then(function(results) {
        for (var i = 0; i < results.length; i++) {
          if (results[i]) return ok(results[i]);
        }
      }, function(err) { console.error("IDB crashed", err) });
    });
  },
  spawn: function() {

  }
};

module.exports = facade;