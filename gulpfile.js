const {src, dest, watch, parallel, series} = require('gulp');
const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat'); /*Нужен для объединения файлов*/
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const clean = require('gulp-clean');


function scripts() {    /*Сделали унифицированный main.js и перетек в папку main.min.js */
    return src([
        'app/js/main.js',
        /*
        Как прописывать, если нужно взять все файлы, кроме некоторых?
        app/js/*.js
        !app/js/main.min.js

        Как откатить версию плагина на версию или на несколько версий назад?
        npm i gulp-autoprefixer@8.0.0
        */
    ])
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(dest('app/js'))
        .pipe(browserSync.stream())
}

function styles(){
    return src('app/scss/**/*.scss')
        .pipe(autoprefixer({ overrideBrowserslist: ['last 10 version']}))
        .pipe(concat('style.min.css')) /*Мы создали файл style.min.css и удалили файлю style.css*/
        .pipe(scss({ outputStyle: 'compressed' })) /*Испльзуем функции scss для сжатия унифицирования файлов, т.е. в файле css весь код представляеться в одну строку*/
        .pipe(dest('app/css'))
        .pipe(browserSync.stream())

}

function watching(){ /*Переводит в режим отслеживания, это функция от gulp, ЭТО НЕ ПЛАГИН! кансоль переходит в режим отслеживания за файлами и мгновенно переводит в унифицированный код. Выйти из этого сотояния "ctrl + C" */
    watch(['app/scss/style.scss'], styles)
    watch(['app/js/main.js'], scripts)
    watch(['app/*.html']).on('change', browserSync.reload)
}

function browsersync(){
    browserSync.init({
        server: {
            baseDir: "app/"
        }
    });
}

function cleanDist() {
    return src('dist')
        .pipe(clean())
}

function building() { /*Отвечает за выгрузку файлов в dist, т.е. при передачи сайта заказчику, всё выгружаеться в отдельную папку.*/
    return src([
        'app/css/style.min.css',
        'app/js/main.min.js',
        'app/**/*.html'
    ], {base : 'app'})
        .pipe(dest('dist'))
}

exports.styles = styles;
exports.scripts = scripts;
exports.watching = watching;
exports.browsersync = browsersync;

exports.build = series(cleanDist, building);
exports.default = parallel(styles, scripts, browsersync, watching);