/*

This task sets up the grunt.data properties needed to correctly generate a
round. You should run it using the `open` meta-task:

```
grunt open --round=round_id
```

By using the CLI options, instead of a target (as we do with `publish`), we
can make this the default task, and it'll be preserved across `watch` runs.

*/

module.exports = function(grunt) {

  var getSheet = function(id) { return grunt.data.json["HikeBracket_" + id] };

  grunt.registerTask("matchups", function() {

    //load up candidate metadata
    var candidates = getSheet("candidates");

    var processRound = function(sheet, isPast) {
      var round = { matchups: [] };
      for (var i = 0; i < sheet.length; i += 2) {
        var a = sheet[i];
        var b = sheet[i + 1];
        var matchup = {
          options: [a, b],
          winner: null
        };
        matchup.options.forEach(function(option) {
          option.data = candidates[option.id];
        });
        if (isPast) {
          matchup.winner = a.votes > b.votes ? a.id : b.id
        }
        round.matchups.push(matchup);
      }
      return round;
    };

    var orderSheet = getSheet("order");

    if (!orderSheet) {
      grunt.fail.fatal("Unable to load the config sheet with order data -- have you run `grunt sheets`?");
    }

    var roundID = grunt.option("round");

    if (!roundID) {
      grunt.log.errorlns("You didn't specify a round, defaulting to the first in config sheet (\"" + orderSheet[0].sheet + "\"). Use --round=round_id to avoid this error.");
      roundID = orderSheet[0].sheet;
    }

    if (!getSheet(roundID)) {
      grunt.fail.fatal("Sheet for the specified round doesn't exist -- do you need to re-run `grunt sheets`?");
    }

    //technically, we don't need order, but I dislike assuming object key order is reliable
    var bracket = {
      rounds: [],
      current: roundID
    };

    //first handle sheets up to the current round
    for (var i = 0; i < orderSheet.length; i++) {
      var order = orderSheet[i];
      var sheet = getSheet(order.sheet);
      var data = processRound(sheet, true);
      data.title = order.title;
      data.id = order.sheet;
      bracket.rounds.push(data);
      if (order.sheet == roundID) break;
    }

    grunt.data.bracket = bracket;

  });

};