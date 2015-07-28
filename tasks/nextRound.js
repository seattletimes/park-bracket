/*

This task exports a spreadsheet that can be used to set up the next round in
Google sheets. It should be run using the `close` meta-task:

```
grunt close --round=round_id
```

We'll use this option command syntax for symmetricality with the `open` task.

*/

module.exports = function(grunt) {

  grunt.registerTask("advance", function() {

    grunt.task.requires("content");

    var roundID = grunt.option("round");

  });

}