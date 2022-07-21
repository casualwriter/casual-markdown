## casual-markdown

A super lightweight RegExp-based markdown parser, with TOC and scrollspy support

It revises from simple-markdown-parser of [Powerpage Markdown Document](https://github.com/casualwriter/powerpage-md-document) 
for the following features

* simple, super lightweight (less than 180 lines)
* vanilla javascript, no dependance
* support all browsers (IE9+, Chrome, Firfox, Brave, etc..)
* straight-forward coding style, hopefully readable.
* support [basic syntax](https://casualwriter.github.io/casual-markdown/casual-markdown-syntax.html) according [Basic Markdown Syntax (markdownguide.org)](https://www.markdownguide.org/basic-syntax/)  
* support subset of [extended-syntax](https://casualwriter.github.io/casual-markdown/casual-markdown-syntax.html#enhanced-syntax)
* TOC and scrollspy support
* highlight comment and keyword in code-block
* extendable (by override md.before, md.after, md.formatCode)


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

or github-page (with version)

~~~ 
<link rel="stylesheet" href="https://casualwriter.github.io/dist/casual-markdown@0.82.css">
<script src="https://casualwriter.github.io/dist/casual-markdown@0.82.js"></script>
~~~ 


#### Usage

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

// render TOC, add scrollspy to document.body
md.toc( 'content', 'toc', { css:'h2,h3,h4', title:'Table of Contents', scrollspy:'body' } )

// render TOC, title=Index, add scrollspy to <div id=content>
md.toc( 'content', 'toc', { title:'Index', scrollspy:'content' } )
~~~


#### Advanced Usage

**Code-block formatter**

the highlight keyword is hardcode in function md.formatCode(). 
If need highlight different keyword, please override original function md.formatCode() showing below. 

~~~
//===== format code-block, highlight remarks/keywords for code/sql
md.formatCode = function (match, title, block) {
  // convert tag <> to &lt; &gt; tab to 3 space, support mark code using ^^^
  block = block.replace(/</g,'&lt;').replace(/\>/g,'&gt;')
  block = block.replace(/\t/g,'   ').replace(/\^\^\^(.+?)\^\^\^/g, '<mark>$1</mark>')
  
  // highlight comment and keyword based on title := none | sql | code
  if (title.toLowerCase(title) == 'sql') {
    block = block.replace(/^\-\-(.*)/gm,'<rem>--$1</rem>').replace(/\s\-\-(.*)/gm,' <rem>--$1</rem>')   
    block = block.replace(/(\s)(function|procedure|return|if|then|else|end|loop|while|or|and|case|when)(\s)/gim,'$1<b>$2</b>$3')
    block = block.replace(/(\s)(select|update|delete|insert|create|from|where|group by|having|set)(\s)/gim,'$1<b>$2</b>$3')
  } else if ((title||'none')!=='none') {
    block = block.replace(/^\/\/(.*)/gm,'<rem>//$1</rem>').replace(/\s\/\/(.*)/gm,' <rem>//$1</rem>')   
    block = block.replace(/(\s)(function|procedure|return|if|then|else|end|loop|while|or|and|case|when)(\s)/gim,'$1<b>$2</b>$3')
    block = block.replace(/(\s)(var|let|const|for|next|do|while|loop|continue|break|switch|try|catch|finally)(\s)/gim,'$1<b>$2</b>$3')
  }
  return '<pre title="' + title + '"><code>'  + block + '</code></pre>'
}
~~~

**Extend Parser for enhanced syntax**

to parse every markdown-block, dummy function md.before() and md.after() will be called 
(i.e. ``md.after( md.parser( md.before(mdText) ) )``). They can be re-defined for enhanced syntax

~~~
// original code
var md = { before: function (str) {return str}, after: function (str) {return str} }

// re-define for extend syntax. e.g. $text$  => <strong>text</strong>
md.before = function (str) { 
   return mdstr = mdstr.replace(/\$(\w.*?[^\\])\$/gm, '<strong>$1</strong>')
}   

// re-define for extend syntax. e.g. $$text$$  => <b>text</b>
md.after = function (str) { 
   return mdstr = mdstr.replace(/\$\$(\w.*?[^\\])\$\$/gm, '<b>$1</b>')
}   
~~~


### Applications

* casual-md-view.html?file={md-file}&toc={left|right|top|none}  // show markdown as document.
* casual-md-blog.html  // use markdown for blogging
* casual-md-doc.js     // document by markdown


### Update History

* 2022/07/19, v0.80, initial release.
* 2022/07/21, v0.82, refine toc/scrollspy, add dummy function for extension
