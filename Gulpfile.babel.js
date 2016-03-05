import gulp from 'gulp';
import file from 'gulp-file';
import zip from 'gulp-zip';
import glob from 'globby';
import { demapify } from 'es6-mapify';

const SET_NAME = 'emoji';

gulp.task('twemoji', (cb) => {
	glob('*.png', {
		cwd: 'twemoji/36x36'
	}).then((files) => {
		let out = new Map();

		for(let file of files){
			let icon = file.replace(/\.png$/, '')
				.split('-')
				.map(part => String.fromCodePoint(parseInt(part, 16)))
				.join('');
			out.set(icon, file);
		}

		gulp.src('./*.png', {cwd: 'twemoji/36x36'})
			.pipe(file('set.json', JSON.stringify({
				name: SET_NAME,
				emotes: demapify(out)
			})))
			.pipe(zip('twemoji.zip'))
			.pipe(gulp.dest('build'))
			.on('end', cb);
	});
});
