require("./lib/social");
require("./lib/ads");
var track = require("./lib/tracking");

require("component-responsive-frame/child");

var $ = require("jquery");
var endpoint = "https://script.google.com/macros/s/AKfycbxc9-lpS4InceOver_BHPjISvt6wM6hTJpArG1wGC0CQWE9lTs/exec";

var Tabletop = require("tabletop");

var storage = require("./evercookie");

var cardHTML = require("../_card.html");
var dot = require("./lib/dot");
var cardTemplate = dot.compile(cardHTML);

Tabletop.init({
  key: "1S5hBvOBl_tDNTlr3wE3sFxz2jkg2RCkRR1ZjYTdnCbk",
  simpleSheet: true,
  wanted: [window.bracket.current],
  callback: function(rows) {
    var round = window.bracket.rounds.filter(r => r.id == window.bracket.current).pop();
    if (!round) return;
    var voting = {};
    rows.forEach(function(row) {
      voting[row.id] = row.votes;
    });
    round.matchups.forEach(function(match) {
      //first pass, recount the votes
      match.options.forEach(function(option) {
        if (voting[option.id]) {
          option.votes = voting[option.id];
        }
      });
      match.total = options[0].votes + options[1].votes;
      //second pass, re-render the elements
      match.options.forEach(function(option) {
        var html = cardTemplate({ round, match, candidate: option})
      });
    });
  }
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