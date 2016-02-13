# handlebars-html-parser [![NPM Version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][david-image]][david-url]

> Parse Handlebars and HTML.

Parse this:
```handlebars
<tag> value {{{obj.value~}}} </tag>
```
into this:
```js
[
    { type:"htmlTagStart" },
    { type:"htmlTagNameStart" },
    { type:"text", value:"tag" },
    { type:"htmlTagNameEnd" },
    { type:"htmlTagEnd" },
    
    { type:"text", value:" value " },
    
    { type:"hbsTagStart", notEscaped:true },
    { type:"hbsExpressionStart" },
    { type:"hbsExpressionPath", value:["obj","value"] },
    { type:"hbsExpressionEnd" },
    { type:"hbsTagEnd", stripWhitespace:true, notEscaped:true },
    
    // whitespace stripped
    
    { type:"htmlTagStart", closing:true },
    { type:"htmlTagNameStart" },
    { type:"text", value:"tag" },
    { type:"htmlTagNameEnd" },
    { type:"htmlTagEnd" }
]
```
…for use in compiling to something like a virtual DOM, such that of [handlebars-react](https://github.com/stevenvachon/handlebars-react).

For more information on the strengths, weaknesses and implementation details of this library, check out the [wiki](https://github.com/stevenvachon/handlebars-html-parser/wiki).


## Installation
[Node.js](http://nodejs.org/) `>= 0.10` is required; `< 4.0` will need `Promise` and `Object.assign` polyfills. ~~Type this at the command line:~~
```shell
npm install handlebars-html-parser
```


## Methods

### .parse(template)
Parse a template String into a linear program which contains HTML pieces and Handlebars expressions. A `Promise` is returned for use in chaining.


## Functions

### .beautifyJS(js)
Format a JavaScript String for increased legibility. This is a convenience function that will prevent your project from depending on multiple versions of [uglify-js](https://npmjs.com/uglify-js).

### .each(callback)
Runs a provided Function once per element in the generated linear program.

`callback` has two arguments:

* `node`, the current node being processed in the linear program
* `state`, a mutable/reused object containing the current state of `node`


## Constants

### .type.*
A map of node types, especially useful with nodes in `parse()` callbacks. See the [full list](https://github.com/stevenvachon/handlebars-html-parser/blob/master/lib/NodeType.js).


## Options

### options.convertHbsComments
Type: `Boolean`  
Default value: `false`  
When `true`, Handlebars comments will be converted to HTML comments.

### options.ignoreHbsComments
Type: `Boolean`  
Default value: `false`  
When `true`, Handlebars comments will be excluded from output. This can result in concatenated Strings, which optimizes compilation.

### options.ignoreHtmlComments
Type: `Boolean`  
Default value: `false`  
When `true`, HTML comments will be excluded from output. This can result in concatenated Strings, which optimizes compilation.

### options.normalizeWhitespace
Type: `Boolean`  
Default value: `false`  
When `true`, will replace multiple standard whitespace characters (line breaks, tabs, regular spaces) with a single space. This helps improve runtime performance and lower compiled template file size.

* Does not affect "special" whitespace chars such as `&nbsp;`, etc.
* Does not affect text within `<pre>`,`<script>`,`<style>`,`<textarea>` tags
* Does not affect text within "dynamic" tags (`<{{tag}}>`)
* Does not affect HTML's rendered appearance (unless using CSS `white-space:pre`)

### options.processCSS
Type: `Boolean`  
Default value: `false`  
When `true`, the contents of CSS tags and attributes will be [auto-prefixed](https://npmjs.com/autoprefixer) and minified. **Note:** if *any* Handlebars expressions are contained within, minification will be skipped.

### options.processJS
Type: `Boolean`  
Default value: `false`  
When `true`, the contents of JavaScript tags, attributes and `href="javascript:…"` links will be minified. **Note:** if *any* Handlebars expressions are contained within, minification will be skipped.


## Example
```js
var HandlebarsHtmlParser = require("handlebars-html-parser")

var each = HandlebarsHtmlParser.each
var NodeType = HandlebarsHtmlParser.type
var parser = new HandlebarsHtmlParser(options)

parser.parse("<tag>{{var}}</tag>").then( 
	each( function(node, state) {
		switch(node.type) {
			case NodeType.HBS_EXPRESSION_START: {
				// is expression start node
				break
			}
			case NodeType.HTML_TAG_START: {
				// is html tag start node
				break
			}
		}
	})
).then( function() {
	console.log("done!")
})
```


## FAQ
1. **How is this different from [HTMLBars](https://npmjs.com/htmlbars)?**  
HTMLBars *builds* a DOM whereas this library *allows* you to build a DOM and especially a virtual DOM.


## Roadmap Features
* add support for sub-expressions
* add support for `{{#if}}`,`{{else}}`,`{{else if}}`,`{{#unless}}`
* add support for `{{#with}}`,`{{#each}}`,`{{@index}}`,`{{@key}}`,`{{this}}`,`{{.}}`
* add support for `{{> partial}}`
* `options.mustacheOnly` that disables helpers, expressions and whitespace control? would have to provide parse errors
* `options.xmlMode` with [xmldoc](https://npmjs.com/xmldoc) ?


## Changelog
* 0.0.1–0.0.19 pre-releases


[npm-image]: https://img.shields.io/npm/v/handlebars-html-parser.svg
[npm-url]: https://npmjs.org/package/handlebars-html-parser
[travis-image]: https://img.shields.io/travis/stevenvachon/handlebars-html-parser.svg
[travis-url]: https://travis-ci.org/stevenvachon/handlebars-html-parser
[david-image]: https://img.shields.io/david/stevenvachon/handlebars-html-parser.svg
[david-url]: https://david-dm.org/stevenvachon/handlebars-html-parser
