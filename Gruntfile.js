module.exports = function (grunt) {
    grunt.config('build_number', grunt.option('build_number') || process.env.BUILD_NUMBER || 'SNAPSHOT<%= grunt.template.today("yyyymmddHHMMss") %>');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        easy_rpm: {
            options: {
                name: 'datasourceapi',
                summary: 'DataSourceAPI',
                description: 'Service to register different DataSources connections and queries with parameters.',
                version: '<%= pkg.version %>',
                release: grunt.config('build_number'),
                buildArch: 'noarch',
                vendor: 'Logicalis',
                group: 'Application',
                license: 'Closed',
                defaultAttributes: {
                    mode: 644,
                    user: 'datasourceapi',
                    group: 'datasourceapi',
                    dirMode: 755
                }
            },
            release: {
                files: [
                    {src: 'app.js', dest: '/opt/logicalis/datasourceapi/'},
                    {src: 'config.js', dest: '/opt/logicalis/datasourceapi/'},
                    {src: 'package.json', dest: '/opt/logicalis/datasourceapi/'},
                    {src: 'lib/**/*', dest: '/opt/logicalis/datasourceapi/'},
                    {src: 'scripts/**/*', dest: '/opt/logicalis/datasourceapi/'},
                    {src: 'README.md', dest: '/opt/logicalis/datasourceapi/'},
                    {src: 'api/**/*', dest: '/opt/logicalis/datasourceapi/'},
                    {src: 'pm2.json', dest: '/opt/logicalis/datasourceapi/'},
                    {src: 'adapters/**/*', dest: '/opt/logicalis/datasourceapi/'},
                    {src: 'config/default.yaml', dest: '/opt/logicalis/datasourceapi/'},
                    {src: 'node_modules/**/*', dest: '/opt/logicalis/datasourceapi/'},

                    {config: true, cwd: "config", src: 'datasourceapi.yml', dest: '/etc/logicalis/datasourceapi/'}
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-easy-rpm');

    grunt.registerTask('default', ['easy_rpm']);
};