var gulp 		= require('gulp');
	sass 		= require('gulp-sass');
	browserSync = require('browser-sync');
	concat		= require('gulp-concat');
	uglify		= require('gulp-uglifyjs');
	cssnano		= require('gulp-cssnano');
	rename		= require('gulp-rename');
	del			= require('del'),
	imagemin	= require('gulp-imagemin'),
	pngquant	= require('imagemin-pngquant'),
	cache		 = require('gulp-cache'),
	autoprefixer = require('gulp-autoprefixer'),
	pug 		 = require('gulp-pug');
	notify 		= require('gulp-notify');
	spritesmith = require('gulp.spritesmith');

gulp.task('sass', function(){ // Создаем таск Sass
	return gulp.src('app/sass/**/*.scss') // Берем источник
		.pipe(sass()) 
		.on('error', notify.onError({
			title:'Sass Compilation Failed',
			message:'<%= error.message%>'
		}) )
		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) 
		.pipe(gulp.dest('app/css')) 
		.pipe(browserSync.reload({stream: true})) 
});
gulp.task('pug',function(){
	return gulp.src('app/component/index.pug')
	.pipe(pug({pretty: true}))
	.on('error', notify.onError({
			title:'Pug Compilation Failed',
			message:'<%= error.message%>'
		}) )
	.pipe(gulp.dest('app'))
	.pipe(browserSync.reload({stream: true})) 

});

 
gulp.task('sprite', function () {
  var spriteData = gulp.src('app/img/icons/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    imgPath: '../img/sprite.png',
    cssName: '_sprite.scss'
  }));
  return spriteData.css.pipe(gulp.dest('app/sass/')) , spriteData.img.pipe(gulp.dest('app/img/'));
  
  
});

gulp.task('scripts',function(){
	return gulp.src([
		'app/libs/jquery/dist/jquery.min.js',
		
		])
	.pipe(concat('libs.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('app/js'));
});
gulp.task('css-libs',['sass'],function(){
	return gulp.src(['app/css/libs.css'])
	.pipe(cssnano())
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest('app/css'));
});

gulp.task('browser-sync',function(){
	browserSync({
		server:{
			baseDir:'app'
		},
		notify: false
	});
});

gulp.task('clean', function(){
	return del.sync('dist');
});
gulp.task('clear', function(){
	return cache.clearAll();
});

gulp.task('img', function() {
	return gulp.src('app/img/**/*') // Берем все изображения из app
		.pipe(cache(imagemin({  // Сжимаем их с наилучшими настройками с учетом кеширования
			interlaced: true,
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		})))
		.pipe(gulp.dest('dist/img')); // Выгружаем на продакшен
});
gulp.task('watch',['browser-sync','css-libs','scripts'],function(){
	gulp.watch('app/sass/**/*.scss', function(event, cb) {
setTimeout(function(){gulp.start('sass')},500)});
	gulp.watch('app/component/**/*.pug',['pug'],browserSync.reload);
	gulp.watch('app/*.html',browserSync.reload);
	gulp.watch('app/**/*.js',browserSync.reload);
});

gulp.task('build',['clean', 'img', 'sass', 'scripts'], function(){

	var buildCss = gulp.src([
		'app/css/**/*',
		'app/css/libs.min.css',
		])
	.pipe(gulp.dest('dist/css'))

	var buildFonts = gulp.src('app/fonts/**/*')
	.pipe(gulp.dest('dist/fonts'));

	var buildJs = gulp.src('app/js/**/*')
	.pipe(gulp.dest('dist/js'))

	var buildHtml = gulp.src('app/*.html')
	.pipe(gulp.dest('dist'))


});