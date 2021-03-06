module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    lint: {
      all: ['grunt.js', 'routes/*.js', 'public/js/*.js', 'test/*.js']
    },
    jshint: {
      options: {
        browser: true,
        laxcomma: true
      }
    }
  });

  // Load tasks from "grunt-sample" grunt plugin installed via Npm.
  //grunt.loadNpmTasks('grunt-sample');

  // Default task.
  grunt.registerTask('default', 'lint sample');

};