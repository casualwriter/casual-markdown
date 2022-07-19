## casual-markdown

A super lightweight RegExp-based markdown parser, with TOC and scrollspy support

It revises from simple-markdown-parser of [Powerpage Markdown Document](https://github.com/casualwriter/powerpage-md-document) 
for the following features

* simple, super lightweight (less than 150 lines js code)
* vanilla javascript, no dependance
* support all browsers (IE9+,Chrome,etc..)
* straight-forward coding style, hopefully readable.
* support the [Basic Markdown Syntax](https://www.markdownguide.org/basic-syntax/)  
* support some [extended-syntax](https://casualwriter.github.io/powerpage/index.html?file=pp-md-document.md#markdown-syntax)
* highlight comment and keyword in code-block
* TOC and scrollspy support

### Usage Guide

just simply include [casual-markdown.js](source/casual-markdown.js) in web page, (from local or CDN).  

~~~ 
<link rel="stylesheet" href="casual-markdown.css">
<script src="casual-markdown.js"></script>
~~~

or CDN

~~~ 
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/casualwriter/casual-markdown/dist/casual-markdown.css">
<script src="https://cdn.jsdelivr.net/gh/casualwriter/casual-markdown/dist/casual-markdown.js"></script>
~~~ 

or github-page 

~~~ 
<link rel="stylesheet" href="https://casualwriter.github.io/dist/casual-markdown.css">
<script src="https://casualwriter.github.io/dist/casual-markdown.js"></script>
~~~ 

#### Coding

Once include the javascript library, markdown parser object `md` is available with below functions.

* `md.html(mdString)` - convert markdown string into html
* `md.toc( mdElement, tocElement, options)` - generate TOC html to tocElement
* default TOC option := { title:'Table of Contents', css:'h1,h2,h3,h4', button:false, scrollspy:'active' }

for example

~~~
// get markdown source from element
var mdText = document.getElementById('source').innerHTML

// parse markdown, and render content
document.getElementById('content').innerHTML = md.html( mdText )

// render TOC
md.toc( 'content', 'toc-box', { css:'h2,h3,h4', button:'X', scrollspy:'active' } )
~~~

### Applications

* casual-md-view.html?file={md-file}&toc={left|right|top|none}  // show MD as document.
* casual-md-blog.html  // use MD for blogging
* casual-md-doc.js     // document by markdown

### History

* 2022/07/19, v0.80, initial release.

