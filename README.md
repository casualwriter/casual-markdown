## casual-markdown

A super lightweight regexp-based markdown parser, with TOC support

It is a refinement of simple-markdown-parser of 
[Powerpage Markdown Document](https://github.com/casualwriter/powerpage-md-document) 
for the following features

* simple, super lightweight (less than 150 lines js code)
* no dependance, support all browsers (IE9+,Chrome,etc..)
* straight-forward, and readable coding style.
* support the [Basic Markdown Syntax](https://www.markdownguide.org/basic-syntax/)  
* support some [extended-syntax](https://casualwriter.github.io/powerpage/index.html?file=pp-md-document.md#markdown-syntax)
* highlight comment and keyword in code-block
* TOC support

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

#### Coding

once include the javascript library, markdown parser object `md` is available with below functions.

* `md.html(mdString)` - conver markdown string into html
* `md.toc( mdElement, tocElement, options)` - general TOC html 

for example

~~~
// get markdown source from element
var srcElement = document.getElementById('source')

// parse markdown, and render content
document.getElementById('content').innerHTML = md.html( srcElement.innerHTML )

// render TOC
md.toc( 'content', 'toc-box' )
~~~

#### Applications

* casual-markdown-doc.html  // show MD document.
* casual-markdown-blog.html // use MD for blogging


### History

* 2022/07/19, v0.80, initial release.

