module.exports = function(grunt) {

// Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-remove-logging');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-htmlrefs');
    
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            build: ['build/**/'],
            js: ['src/js/<%= pkg.name %>.app.js']
        },
        concat: {
            options: {
                separator: "\n", //add a new line after each file
                banner: "", //added before everything
                footer: "" //added after everything
            },
            libCss: {
                src: [
                    '',
                    ''
                ],
                dest: ''
            }
        },
        removelogging: {
            dist: {
                files: {
                    'src/js/<%= pkg.name %>.app.min.js': 
                    ['src/js/app.js']
                }
            }
        },
        uglify: {
            options: {
                banner: ""
            },
            build: {
                files: {
                    'src/js/<%= pkg.name %>.app.min.js': 
                    ['src/js/<%= pkg.name %>.app.min.js']
                }
            }
        },
        copy: {
            main: {
                options: { dot: true },
                files: [
                    // includes files within path
                    {cwd: 'src/templates', src: '**/*', dest: 'build/templates', expand: true},
                    {cwd: 'src/v0.1', src: '**/*', dest: 'build/v0.1', expand: true},
                    {cwd: 'src/lib', src: '**/*', dest: 'build/lib', expand: true},
                    {cwd: 'src/css', src: '**/*', dest: 'build/css', expand: true},
                    {cwd: 'src/img', src: '**/*', dest: 'build/img', expand: true},
                    {src: 'src/js/<%= pkg.name %>.app.min.js', dest: 'build/js/<%= pkg.name %>.app.min.js',
                        filter: 'isFile'},
                    {src: 'src/v0.1/.htacess', dest: 'build/v0.1/.htaccess',
                        filter: 'isFile'},
                    {src: 'src/.htacess', dest: 'build/.htaccess',
                        filter: 'isFile'},
                ]
            }
        },
        htmlrefs: {
            dist: {
              /** @required  - string including grunt glob variables */
              src: './src/index.php',
              /** @optional  - string directory name*/
              dest: './build/index.php',
              options: {
                /** @optional  - references external files to be included */
                includes: {
                  analytics: './ga.inc' // in this case it's google analytics (see sample below)
                },
                /** any other parameter included on the options will be passed for template evaluation */
                appName: '<%= pkg.name %>'
              }
            }
      }
    });
    // Define the default task
    grunt.registerTask('default', ['removelogging', 'clean',
        'copy','htmlrefs']);
};
