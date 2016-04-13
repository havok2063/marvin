/*
* @Author: Brian Cherinka
* @Date:   2016-04-12 01:41:18
* @Last Modified by:   Brian
* @Last Modified time: 2016-04-12 21:17:23
*/

module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // Babel - transpiler from ES6 to ES5
    babel: {
        options: {
            sourceRoot: 'etc/',
            sourceMap: false,
            presets: ['es2015']
            //plugins: ["transform-es2015-classes"]
        },
        dist: {
          files: [{
            expand: true,
            src: ['js/es6/*.js'],
            ext: '.new.js'
          }]
        }
    },
    // File Concatenation
    concat: {
        js: {
          options: {
              separator: ';'
          },
          src: ['js/*.js', '!js/{test,js9,wcs}*.js'],
          dest: '<%= pkg.name %>.js'
        },
        css: {
          src: ['css/*.css', '!css/js9*.css'],
          dest: '<%= pkg.name %>.css'
        }
    },
    // CSS Minification
    cssmin: {
      dist: {
        src: '<%= pkg.name %>.css',
        dest: '<%= pkg.name %>.min.css'
      }
    },
    // JS Minification
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        compress: true
      },
      build: {
        src: '<%= pkg.name %>.js',
        dest: '<%= pkg.name %>.min.js'
      }
    }
  });

  // Load individual plugins that provide the tasks.  Commented out but left as an example.
  // Alternatively you can replace all tasks loads with the single line at the top require('load-grunt-tasks')(grunt);
  //grunt.loadNpmTasks('grunt-contrib-uglify');

  // Set default file path
  grunt.file.setBase('../python/marvin/web/static/');

  // Default task(s). New tasks go in a tasklist.  Tasks are run in that order.
  grunt.registerTask('default', ['babel', 'concat', 'cssmin', 'uglify']);
};