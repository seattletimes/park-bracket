require("./lib/social");
require("./lib/ads");
var track = require("./lib/tracking");

require("component-responsive-frame/child");

var $ = require("jquery");
var endpoint = "https://script.google.com/macros/s/AKfycbxc9-lpS4InceOver_BHPjISvt6wM6hTJpArG1wGC0CQWE9lTs/exec";

var Tabletop = require("tabletop");

var storage = require("./evercookie");

Tabletop.init({
  key: "1S5hBvOBl_tDNTlr3wE3sFxz2jkg2RCkRR1ZjYTdnCbk",
  simpleSheet: true,
  wanted: ["Round1"],
  callback: console.log.bind(console)
});

$(".bracket").on("click", ".matchup", function(e) {
  $(this).toggleClass("expanded");
});

$(".bracket").on("click", ".vote", function(e) {

  var vote = this.getAttribute("data-vote");
  var request = $.ajax({
    url: endpoint,
    data: { vote },
    dataType: "jsonp"
  });
  request.done(e => console.log(e));

});