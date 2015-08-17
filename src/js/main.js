require("./lib/social");
require("./lib/ads");
var track = require("./lib/tracking");

var memory = require("./memory");
memory.configure(window.config.page, window.bracket.current);
var Tabletop = require("tabletop");



// //disable Tabletop updates during testing due to Google API limits
// if (false) Tabletop.init({
//   key: window.config.sheet,
//   simpleSheet: true,
//   wanted: [window.bracket.current],
//   callback: function(rows) {
//     var round = window.bracket.currentRound;
//     if (!round) return;
//     var voting = {};
//     rows.forEach(function(row) {
//       voting[row.id] = row.votes * 1;
//     });
//     round.matchups.forEach(function(match) {
//       //first pass, recount the votes
//       match.options.forEach(function(option) {
//         if (voting[option.id]) {
//           option.votes = voting[option.id];
//         }
//       });
//       match.total = match.options[0].votes + match.options[1].votes;
//     });
//     renderRound(round);
//   }
// });

var app = require("./application");

var controller = function($scope, $http) {
  $scope.bracket = window.bracket;

  var current = window.bracket.rounds.filter(r => r.current).pop();
  memory.remember(votes => {
    current.matchups.forEach(function(match) {
      if (match.options.some(o => o.id in votes)) {
        match.voted = match.options[0].id in votes ? match.options[0].id : match.options[1].id;
      }
    });
    $scope.$apply();
  });

  $scope.vote = function(candidate, match) {
    var vote = candidate.id;
    candidate.voting = true;
    
    var request = $http.jsonp(window.config.endpoint, {
      params: { vote, callback: "JSON_CALLBACK" }
    });
    request.then(function(response) {
      candidate.voting = false;
      if (response.data.status == "success") {
        memory.flag(vote);
        match.voted = vote;
      }
    });

  }

};
controller.$inject = ["$scope", "$http"];

app.controller("bracket-controller", controller);

// $(".bracket").on("click", ".vote", function(e) {

//   var $this = $(this);
//   var $card = $this.closest(".card");
//   $card.addClass("voting");

//   var vote = this.getAttribute("data-vote");
  
//   //mark this vote in our memory structure
//   var matchID = $this.closest(".matchup").attr("data-index");
//   var round = window.bracket.currentRound;
//   var match = round.matchups[matchID];
//   match.voted = vote;

//   var request = $.ajax({
//     url: window.config.endpoint,
//     data: { vote },
//     dataType: "jsonp"
//   });
//   request.done(function(data) {
//     console.log(data);
//     renderRound(window.bracket.currentRound);

//     //mark it in the evercookie
//     memory.flag(vote);
//   });
//   request.fail(function() {
//     $card.removeClass("voting");
//   });
// });