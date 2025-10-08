const {src, dest, watch, parallel, series} = require('gulp');
const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat'); /*Нужен для объединения файлов*/
const uglify = require('gulp-uglify-es').default;/*ДЕЛАЕТ УНИФИЦИРОВАННЫЙ КОД JS*/
const browserSync = require('browser-sync').create();/*Отслеживаем в браузере без перезагрузки страницы*/
const autoprefixer = require('gulp-autoprefixer');/*Исправляет небольшие недостатки кода*/


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
        // Переменовываем файл, при помощи уже установленного плагина concat
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        // Куда всё сброситься после данной операции
        .pipe(dest('app/js'))
        .pipe(browserSync.stream())
}


function styles(){
    // С каким файлом будет работать.
    return src('app/scss/style.scss')
        // Сколько последних версий поддерживает
        .pipe(autoprefixer({ overrideBrowserslist: ['last 10 version']}))
        /*Мы создали файл style.min.css и удалили файлю style.css*/
        .pipe(concat('style.min.css'))
        /*Испльзуем функции scss для сжатия унифицирования файлов, т.е. в файле css весь код представляеться в одну строку. ОБНОВЛЕНИЕ:outputStyle --> style*/
        .pipe(scss({ style: 'compressed' }))
        // Выкидываем в файл CSS, ее местоположение.
        .pipe(dest('app/css'))
        .pipe(browserSync.stream())

}


/*Переводит в режим отслеживания, это функция от gulp, ЭТО НЕ ПЛАГИН! кансоль переходит в режим отслеживания за файлами и мгновенно переводит в унифицированный код. Выйти из этого сотояния "ctrl + C" */
function watching(){ 
    // Он отслеживает, файл который прописали, а после запускаеться функция "styles"
    watch(['app/scss/style.scss'], styles)
    watch(['app/js/main.js'], scripts)
    // Будем происходить изменения во всех файлах в формате html.
    watch(['app/*.html']).on('change', browserSync.reload)
    
}


function browsersync(){
    browserSync.init({
        server: {
            baseDir: "app/"
        }
    });
}


// Для включение функции в кансоли. Нужно прописать "gulp styles".
exports.styles = styles;
exports.scripts = scripts;
exports.watching = watching;
exports.browsersync = browsersync;

// Позволяет все эти команды, запустить параллельно, т.е. одновременно. Запускает по порядку.
exports.default = parallel(styles, scripts, browsersync, watching);

/*
1. Сделаем функцию для Sass.
1.1 Сделаем, чтобы был сжатым(или компрессированным). ДЕЛАЕТ УНИФИЦИРОВ АННЫЙ КОД CSS!
2. Устанавливаем плагин, для конкатинации файлов. npm install --save-dev gulp-concat. Нужен, чтобы из нескольких файлов сделать один файл. Он так же умеет переименовывать файлы.
2.1 Удаляем CSS.
3. Устанавливаем плагин: gulp-uglify-es. Аналогично с командой compressed для CSS. Плагин используеться для сжатия JavaScript файлов. ДЕЛАЕТ УНИФИЦИРОВАННЫЙ КОД JS!
4. Прописываем, команду, который будет запускать "exports.styles; exports.scripts = scripts", без нашего ведома, т.е. автоматически, без прописи в консоль. Это не плагин, а команда, которая уже встроена в GULP, её не нужно устанавливать. ВЫЙТИ ИЗ СОСТОЯНИЯ WARCHINGA: CTRL + C.
5. Устанавливаем плагин browser-sync. npm install browser-sync gulp --save-dev. Проблема между watching и browser-sync, она заключаеться в том, что и там и там функция отслеживания и нужно чтобы они обе одновременно работали.
*/
// (['app/**/*.html']) - такая запись найдёт все html файлы, которые нам нужны.
/*
5.1. Для решения проблемы есть еще встроенная команда в Gulp. parallel. Позволяет все эти команды, запустить параллельно, т.е. одновременно. Запускает по порядку.Вот: parallel(styles, scripts, browsersync, watching);
6. Устанавливаем плагин autoprefixer. Доделывает наш код. К примеру, если в предыдущей версии писали с префиксом, а в новой мы по привычке без префикса, этот плагин дописывает, так как нужно. npm install --save-dev gulp-autoprefixer

Далее идут команды отдельные, которые могу не пригодиться.
7.1 Подключаем swiper при помощи команды: npm install swiper.
return src([
        'node_modules/swiper/swiper-bundle.js',
        'app/js/main.js',
    ])
        // Переменовываем файл, при помощи уже установленного плагина concat
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        // Куда всё сброситься после данной операции
        .pipe(dest('app/js'))
        .pipe(browserSync.stream())
}  

8. Унифицируем проект, для передачи заказчику. Прописываем задачу(или функцию), которая это сделает за нас.
// Отвечает за выгрузку файлов в dist, т.е. при передачи сайта заказчику, всё выгружаеться в отдельную папку
*/
// function building() { 
//     return src([
//         'app/css/style.min.css',
//         'app/js/main.min.js',
//         'app/**/*.html'
//     ], {base : 'app'})
//         .pipe(dest('dist'))
// }
// exports.build = series(cleanDist, building);
/*
9. Можно сохранить без папки node-modules и packega-lock.json и запустить готовую сборку при помощи команды: npm i
*/


