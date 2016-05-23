module.exports = function(grunt) {
    // Конфигуграция задач
    grunt.initConfig({
        bowerRequirejs : {
            target: {
                // Путь к конфигурационному файлу RequireJS
                rjsConfig: 'assets/js/requirejs-config.js'
            },
            options: {
                // Опция указывающая, что зависимости установленных пакетов так же следует
                // добавлять в конфигурационный файл RequireJS
                // Например: при установке "bootstrap" добавится две записи: "bootstrap" и "jquery"
                transitive: true
            }
        },

        less: {
            compile: {
                files: {
                    'assets/css/modules.css': 'assets/less/modules.less'
                }
            }
        }
    });

    // Загружаем задачу
    grunt.loadNpmTasks('grunt-bower-requirejs');
    grunt.loadNpmTasks('grunt-contrib-less');

    // Создаем другое имя задачи по которому мы будем ее вызывать
    grunt.registerTask('update-requirejs', ['bowerRequirejs']);
};