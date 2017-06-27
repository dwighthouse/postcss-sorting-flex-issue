const gulp = require('gulp');
const gulpPostcss = require('gulp-postcss');
const gulpRename = require('gulp-rename');
const postcssCssnext = require('postcss-cssnext');
const postcssSorting = require('postcss-sorting');

function onerror(e) {
    console.log(e);
    this.emit('end'); //eslint-disable-line no-invalid-this
}

function generateNaturalOrder() {
    let stream = gulp.src('test.css')
        .on('error', onerror);

    stream = stream.pipe(gulpPostcss([
        postcssCssnext, // Adds vendor prefixing
        postcssSorting({
            // Nothing
        }),
    ]));
    stream = stream.on('error', onerror);

    stream = stream.pipe(gulpRename('naturalOrder.css'));

    stream = stream.pipe(gulp.dest('./output'));
}

function generateAlphabeticalOrder() {
    let stream = gulp.src('test.css')
        .on('error', onerror);

    stream = stream.pipe(gulpPostcss([
        postcssCssnext, // Adds vendor prefixing
        postcssSorting({
            'properties-order': 'alphabetical', // The problem line
        }),
    ]));
    stream = stream.on('error', onerror);

    stream = stream.pipe(gulpRename('alphabeticalOrder.css'));

    stream = stream.pipe(gulp.dest('./output'));
}

generateNaturalOrder();
generateAlphabeticalOrder();
