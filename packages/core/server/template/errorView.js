module.exports = (err, items) => {

	/**
	 * .
	 * @class ErrorDetail
	 * @namespace Server.Template
	 * @module Server
	 * @submodule Template
	 */

	var res = `<style>
		.hljs {
			display: block;
			padding: 1em 1.5em;
			background: #23241f;
			margin-right: 40px;
		}

		.hljs,
		.hljs-tag,
		.css .hljs-rules,
		.css .hljs-value,
		.css .hljs-function
		.hljs-preprocessor,
		.hljs-pragma {
			color: #f8f8f2;
		}

		.hljs-strongemphasis,
		.hljs-strong,
		.hljs-emphasis {
			color: #a8a8a2;
		}

		.hljs-bullet,
		.hljs-blockquote,
		.hljs-horizontal_rule,
		.hljs-number,
		.hljs-regexp,
		.alias .hljs-keyword,
		.hljs-literal,
		.hljs-hexcolor {
			color: #ae81ff;
		}

		.hljs-tag .hljs-value,
		.hljs-code,
		.hljs-title,
		.css .hljs-class,
		.hljs-class .hljs-title:last-child {
			color: #a6e22e;
		}

		.hljs-link_url {
			font-size: 80%;
		}

		.hljs-strong,
		.hljs-strongemphasis {
			font-weight: bold;
		}

		.hljs-emphasis,
		.hljs-strongemphasis,
		.hljs-class .hljs-title:last-child {
			font-style: italic;
		}

		.hljs-keyword,
		.hljs-function,
		.hljs-change,
		.hljs-winutils,
		.hljs-flow,
		.lisp .hljs-title,
		.clojure .hljs-built_in,
		.nginx .hljs-title,
		.tex .hljs-special,
		.hljs-header,
		.hljs-attribute,
		.hljs-symbol,
		.hljs-symbol .hljs-string,
		.hljs-tag .hljs-title,
		.hljs-value,
		.alias .hljs-keyword:first-child,
		.css .hljs-tag,
		.css .unit,
		.css .hljs-important {
			color: #F92672;
		}

		.hljs-function .hljs-keyword,
		.hljs-class .hljs-keyword:first-child,
		.hljs-constant,
		.css .hljs-attribute {
			color: #66d9ef;
		}

		.hljs-variable,
		.hljs-params,
		.hljs-class .hljs-title {
			color: #f8f8f2;
		}

		.hljs-string,
		.css .hljs-id,
		.hljs-subst,
		.haskell .hljs-type,
		.ruby .hljs-class .hljs-parent,
		.hljs-built_in,
		.sql .hljs-aggregate,
		.django .hljs-template_tag,
		.django .hljs-variable,
		.smalltalk .hljs-class,
		.django .hljs-filter .hljs-argument,
		.smalltalk .hljs-localvars,
		.smalltalk .hljs-array,
		.hljs-attr_selector,
		.hljs-pseudo,
		.hljs-addition,
		.hljs-stream,
		.hljs-envvar,
		.apache .hljs-tag,
		.apache .hljs-cbracket,
		.tex .hljs-command,
		.hljs-prompt,
		.hljs-link_label,
		.hljs-link_url {
			color: #e6db74;
		}

		.hljs-comment,
		.hljs-javadoc,
		.java .hljs-annotation,
		.python .hljs-decorator,
		.hljs-template_comment,
		.hljs-pi,
		.hljs-doctype,
		.hljs-deletion,
		.hljs-shebang,
		.apache .hljs-sqbracket,
		.tex .hljs-formula {
			color: #75715e;
		}

		.coffeescript .javascript,
		.javascript .xml,
		.tex .hljs-formula,
		.xml .javascript,
		.xml .vbscript,
		.xml .css,
		.xml .hljs-cdata,
		.xml .php,
		.php .xml {
			opacity: 0.5;
		}

		/* ==========================
		 * Custom stuff
		 * ==========================
		 */

		body {
			margin: 0;
		}

		h1 {
			background: #F8EEEE;
			padding: 10px 20px;
			border-bottom: 5px solid #D59394;
			margin: 0;
		}

		h3 {
			padding: 0px 20px;
		}

		ul {
			list-style-type: decimal;
		}

		.error-line {
			border: 1px solid #FF0000;
		}

		.functionName {
			font-weight: bold;
		}

		pre {
			counter-reset: lines;
		}
		pre .line {
			counter-increment: lines;
		}
		pre .line::before {
			content: counter(lines); text-align: right;
			display: inline-block; width: 2em;
			padding-right: 0.5em; margin-right: 0.5em;
			color: #BBB; border-right: solid 1px;
	}
	</style>`;

	res += `<h1>${err.name}: ${err.message}</h1>`;

	var encodedParams = '';

	if (err._params) {
		encodedParams = String(JSON.stringify(err._params, 4)).replace(/[\u00A0-\u9999<>\&]/gim, (i) => {
			return '&#' + i.charCodeAt(0) + ';';
		});
	}

	res += `<h3>Params: ${encodedParams}</h3>`;
	res += `<ul>`;
	res += items.map((item) => {
		return (
		`<li>at <span class='functionName'>${item.functionName || 'anonymous'}</span> ${item.fileName}:${item.lineNumber}:${item.columnNumber}
		<style> pre#${item.id}{counter-increment:lines ${item.startLine};}</style>
		<pre id='${item.id}'><code class='hljs lang-js'>${item.content}</code></pre>
		</li>`);
	}).join('');
	res += `</ul>`;

	return res;
};
