module.exports = function (grunt) {
    grunt.config('build_number', grunt.option('build_number') || process.env.BUILD_NUMBER || 'SNAPSHOT<%= grunt.template.today("yyyymmddHHMMss") %>');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        easy_rpm: {
            options: {
                name: 'polypus',
                summary: 'Polypus',
                description: 'Service to register different DataSources connections and queries with parameters.',
                version: '<%= pkg.version %>',
                release: grunt.config('build_number'),
                buildArch: 'noarch',
                vendor: 'Logicalis',
                group: 'Application',
                license: 'Closed',
                requires: ["nodejs >= 6.9.1"],
                postInstallScript: [
                    'systemctl daemon-reload'
                ],
                defaultAttributes: {
                    mode: 644,
                    // user: 'polypus',
                    // group: 'polypus',
                    dirMode: 755
                }
            },
            release: {
                files: [
                    {src: 'app.js', dest: '/opt/polypus/'},
                    {src: 'config.js', dest: '/opt/polypus/'},
                    {src: 'package.json', dest: '/opt/polypus/'},
                    {src: 'lib/**/*', dest: '/opt/polypus/'},
                    {src: 'scripts/**/*', dest: '/opt/polypus/'},
                    {src: 'README.md', dest: '/opt/polypus/'},
                    {src: 'api/**/*', dest: '/opt/polypus/'},
                    {src: 'pm2.json', dest: '/opt/polypus/'},
                    {src: 'adapters/**/*', dest: '/opt/polypus/'},
                    {src: 'config/default.yaml', dest: '/opt/polypus/'},
                    {src: 'node_modules/**/*', dest: '/opt/polypus/'},
                    {cwd: "systemd", src: "polypus.service", dest: '/usr/lib/systemd/system/'},

                    {config: true, cwd: "config", src: 'polypus.yml', dest: '/etc/polypus/'}
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-easy-rpm');

    grunt.registerTask('default', ['easy_rpm']);
};