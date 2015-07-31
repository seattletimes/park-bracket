require("./lib/social");
require("./lib/ads");
var track = require("./lib/tracking");

require("component-responsive-frame/child");

var $ = require("jquery");

window.bracket.currentRound = window.bracket.rounds.filter(r => r.id == window.bracket.current).pop();

var dot = require("./lib/dot");
var roundTemplate = dot.compile(require("./_round.html"));

var renderRound = function(round) {
  var roundElement = $(`#${round.id}`);
  roundElement.html(roundTemplate({round}));
};

var memory = require("./memory");
memory.configure(window.config.page, window.bracket.current);
memory.remember(votes => {
  window.bracket.currentRound.matchups.forEach(function(match) {
    if (match.options.some(o => o.id in votes)) {
      match.voted = match.options[0].id in votes ? match.options[0].id : match.options[1].id;
    }
  });
  renderRound(window.bracket.currentRound);
});

var Tabletop = require("tabletop");
Tabletop.init({
  key: window.config.sheet,
  simpleSheet: true,
  wanted: [window.bracket.current],
  callback: function(rows) {
    var round = window.bracket.currentRound;
    if (!round) return;
    var voting = {};
    rows.forEach(function(row) {
      voting[row.id] = row.votes * 1;
    });
    round.matchups.forEach(function(match) {
      //first pass, recount the votes
      match.options.forEach(function(option) {
        if (voting[option.id]) {
          option.votes = voting[option.id];
        }
      });
      match.total = match.options[0].votes + match.options[1].votes;
    });
    renderRound(round);
  }
});

$(".bracket").on("click", ".matchup", function(e) {
  $(this).toggleClass("expanded");
});

$(".bracket").on("click", ".vote", function(e) {

  var $this = $(this);
  var $card = $this.closest(".card");
  $card.addClass("voting");

  var vote = this.getAttribute("data-vote");
  
  //mark this vote in our memory structure
  var matchID = $this.closest(".matchup").attr("data-index");
  var round = window.bracket.currentRound;
  var match = round.matchups[matchID];
  match.voted = vote;

  var request = $.ajax({
    url: window.config.endpoint,
    data: { vote },
    dataType: "jsonp"
  });
  request.done(function(data) {
    console.log(data);
    renderRound(window.bracket.currentRound);
  });

  //mark it in the evercookie
  memory.flag(vote);

});