var gulp = require("gulp");
var cssnano = require("gulp-cssnano");
var rename = require("gulp-rename");
var uglify = require("gulp-uglify");
var imagemin = require("gulp-imagemin");
var bs = require("browser-sync").create();
var sass =require("gulp-sass");
const path = {
    'html':'./templates/**/',
    'css': './src/css/**/',
    'js': './src/js/',
    'images': './src/images/',
    'css_dist': './dist/css/',
    'js_dist': './dist/js/',
    'images_dist': './dist/images/'
};

gulp.task("bs",done=> {
    bs.init({
        'server': {
            'baseDir': './'
        }
    });
done();
});

// 定义一个处理css文件改动的任务
gulp.task("css",done=> {
    gulp.src(path['css'] + '*.scss')
        .pipe(sass().on("error",sass.logError))
    .pipe(cssnano())
    .pipe(rename({"suffix":".min"}))
    .pipe(gulp.dest(path['css_dist']))
    .pipe(bs.stream()) //刷新当前页面
done();
});

//定义一个js任务
gulp.task("js",function () {
    gulp.src(path['js'] + '*.js')
        .pipe(uglify())
        .pipe(rename({"suffix":".min"}))
        .pipe(gulp.dest(path['js_dist']))
        .pipe(bs.stream())
});


// 定义一个监听的任务
gulp.task("watch",done=> {
    gulp.watch(path['css'] + '*.scss',['css']);
    gulp.watch(path['js'] + '*.js',['js']);
    gulp.watch(path['images'] + '*.*',['images']);
    gulp.watch(path['html'] + '*.html',['html']);
done();
});

//定义处理图片的任务
gulp.task("images",function () {
    gulp.src(path['images'] + '*.*')
        .pipe(imagemin())
        .pipe(gulp.dest(path['images_dist']))
        .pipe(bs.stream())
});

gulp.task("html",function () {
    gulp.src(path['html'] + '*.html')
        .pipe(bs.stream())
});
// 执行gulp server开启服务器
gulp.task("default",['bs','watch']);