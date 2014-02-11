
module.exports = function(grunt) {
	'use strict';

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		version: grunt.file.readJSON('package.json').version,
		banner: '<%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %>',
		clean: {
			files: ['min']
		},

		watch: {
			options: {
				// livereload: true,
				atBegin: true,
			},
			dist: {
				files: [],
				tasks: [],
				options: { spawn: false },
			},
		},

		nodemon: {
			dev: {
				script: 'app.js',
				options: {
					args: ['dev'],
					ignore: ['node_modules/**', 'assets/**'],
					// ext: ['js','css'], // watched extensions
					nodeArgs: ['--debug'],
					watch: ['src'],
					delayTime: 1,
					env: {
						PORT: 3000,
					},
					cwd: __dirname,
				}
			},
		},

		// Run watch and nodemon side-by-side
		concurrent: {
			dev: {
				tasks: ['nodemon', 'watch'], // +? 'node-inspector'
				options: {
					logConcurrentOutput: true
				}
			}
		},
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-nodemon');

	grunt.registerTask('serve', ['nodemon']);
	grunt.registerTask('default', ['concurrent']);
};
