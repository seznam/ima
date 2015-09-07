
var gulp = require('gulp');
var change = require('gulp-change');
var yuidoc = require('gulp-yuidoc');

var gulpConfig = require('../../../gulpConfig.js');
var files = gulpConfig.files;

/**
 * Patterns used to increase compatibility of YUI Doc with jsDoc tags.
 *
 * @type {{pattern: RegExp, replace: string}[]}
 */
var documentationPreprocessors;

gulp.task('doc', function () {
	return (
		gulp
			.src(files.app.src)
			.pipe(change(function (content) {
				var oldContent = null;

				while (content !== oldContent) {
					oldContent = content;
					documentationPreprocessors.forEach(function (preprocessor) {
						content = content.replace(
							preprocessor.pattern,
							preprocessor.replace
						);
					});
				}

				return content;
			}))
			.pipe(yuidoc())
			.pipe(gulp.dest('./doc'))
	);
});

documentationPreprocessors = [
	{
		pattern: /\/[*][*]((?:a|[^a])*?)(?: |\t)*[*]\s*@(?:override|inheritDoc|abstract)\n((a|[^a])*)[*]\//g,
		replace: '/**$1$2*/'
	},
	{
		pattern: /\/[*][*]((?:a|[^a])*?)@implements(?: (.*))?\n((a|[^a])*)[*]\//g,
		replace: '/**$1@extends $2\n$3*/'
	},
	{
		pattern: /\/[*][*]((?:a|[^a])*?)@interface (.*)\n((a|[^a])*)?[*]\//g,
		replace: '/**$1@class $2\n$3*/'
	},
	{
		pattern: /\/[*][*]((?:a|[^a])*?)@see (.*)\n((a|[^a])*)[*]\//g,
		replace: '/**$1\n$3*/'
	},
	{
		pattern: /\/[*][*]((?:a|[^a])*?)[{]@code(?:link)? ([^}]*)[}]((a|[^a])*)[*]\//g,
		replace: '/**$1<code>$2</code>$3*/'
	},
	{
		pattern: /\/[*][*]((?:a|[^a])*?)@(type|param|return)\s*[{]([^}]*)[*]([^}]*)[}]((a|[^a])*)[*]\//g,
		replace: '/**$1@$2 {$3any$4}$5*/'
	},
	{
		pattern: /\/[*][*]((?:a|[^a])*?)@(type|param|return)\s*[{]([^}]*)<([^}]*)[}]((a|[^a])*)[*]\//g,
		replace: '/**$1@$2 {$3&lt;$4}$5*/'
	},
	{
		pattern: /\/[*][*]((?:a|[^a])*?)@(type|param|return)\s*[{]([^}]*)>([^}]*)[}]((a|[^a])*)[*]\//g,
		replace: '/**$1@$2 {$3&gt;$4}$5*/'
	},
	{
		pattern: /\/[*][*]((?:a|[^a])*?)@(type|param|return)\s*[{]([^}]*?)([a-zA-Z0-9_.]+)\[\]([^}]*)[}]((a|[^a])*)[*]\//g,
		replace: '/**$1@$2 {$3Array<$4>$5}$6*/'
	},
	{
		pattern: /\/[*][*]((?:a|[^a])*?)(?: |\t)*[*]\s*@template\s*.*\n((a|[^a])*)[*]\//g,
		replace: '/**$1$2*/'
	}
];
