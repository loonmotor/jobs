module.exports = function (grunt) {

	require('load-grunt-tasks')(grunt);

	grunt.initConfig({

		watch : {
			development : {
				files : [
					'public/less/**/*.less'
				],
				options : {
					livereload : true,
					spawn : false
				},
				tasks : ['less']
			}
		}, 

		less : {
			development : {
				files : {
					'public/css/style.css' : 'public/less/main.less'
				}
			}
		}

	});

	grunt.registerTask('default', [
		'watch'
	]);

};