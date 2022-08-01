## casual-markdown

A super lightweight RegExp-based markdown parser, with TOC, scrollspy and frontmatter support

It revises from simple-markdown-parser of [Powerpage Markdown Document](https://github.com/casualwriter/powerpage-md-document) 
for the following features

* simple, super lightweight (less than 190 lines)
* vanilla javascript, no dependance
* support all browsers (IE9+, Chrome, Firfox, Brave, etc..)
* straight-forward coding style, hopefully readable.
* support [basic syntax](https://casualwriter.github.io/casual-markdown/casual-markdown-syntax.html) according [Basic Markdown Syntax (markdownguide.org)](https://www.markdownguide.org/basic-syntax/)  
* support some [enhanced syntax](https://casualwriter.github.io/casual-markdown/casual-markdown-syntax.html#enhanced-syntax)
* TOC and scrollspy support
* highlight comments/keywords in code-block
* frontmatter for simple YAML
* extendable (by override md.before, md.after, md.formatCode, md.formatYAML)


### Usage Guide

just simply include [casual-markdown.js](source/casual-markdown.js) from local or CDN.  

~~~ 
<link rel="stylesheet" href="casual-markdown.css">
<script src="casual-markdown.js"></script>
~~~

or CDN

~~~ 
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/casualwriter/casual-markdown/dist/casual-markdown.css">
<script src="https://cdn.jsdelivr.net/gh/casualwriter/casual-markdown/dist/casual-markdown.js"></script>
~~~ 

or github-page (may specify version no)

~~~ 
<link rel="stylesheet" href="https://casualwriter.github.io/dist/casual-markdown@0.90.css">
<script src="https://casualwriter.github.io/dist/casual-markdown@0.90.js"></script>
~~~ 


### Basic Usage

Once include the javascript library, casual-markdown object `md` is available with below functions.

* `md.html(mdString)` - convert markdown string into html
* `md.toc( mdElement, tocElement, options)` - generate TOC html to tocElement
* default TOC option := { title:'Table of Contents', css:'h1,h2,h3,h4', scrollspy:null }

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


### Advanced Usage

#### TOC from special elements

TOC may retrieve heading from special elements TAG. `e.g. tag=section`. 
md.toc() will retrieve content from the tag using class of tag name. remember provide additional #toc class for this tag.

~~~
// render TOC from tag:section, and H3, H4
md.toc( 'content', 'toc', { css: 'section,h3,h4' } )

// remember provide style class for TOC tag, normally set psoiton for left margin
var style = document.createElement('style');
style.innerHTML = '#toc .SECTION { margin-left:2em }
document.head.appendChild(style);
~~~

#### Activate scrollspy feature

To activate the scrollspy feature, just pass element-ID of scroll content as below.

~~~
// activate scrollspy. normally is same as md-content, but sometime is document body.
md.toc( 'content', 'toc', { css: 'h2,h3,h4', scrollspy:'conent' } )

// sometimes scroll content is document body.
md.toc( 'content', 'toc', { css: 'h3,h4,h5', scrollspy:'body' } )
~~~

#### Code-block formatter

code-block keywords are hard-code in function md.formatCode(). 
If do want to highlight different keywords, please override original function md.formatCode() showing below. 

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

#### Extend Parser for enhanced syntax

to parse every markdown-block, dummy function md.before() and md.after() will be called 
(i.e. ``md.after( md.parser( md.before(mdText) ) )``). They can be re-defined for enhanced syntax

~~~
// original code in casual-markdown.js
var md = { before: function (str) {return str}, after: function (str) {return str} }

// re-define for extend syntax. e.g. $text$  => <strong>text</strong>
md.before = function (str) { 
   return mdstr = mdstr.replace(/\$(\w.*?[^\\])\$/gm, '<strong>$1</strong>')
}   

// re-define for extend syntax. e.g. $$text$$  => <b>text</b>
md.after = function (str) { 
   return mdstr = mdstr.replace(/\$\$(\w.*?[^\\])\$\$/gm, '<b>$1</b>')
}   

document.getElementById('content').innerHTML = md.html()
~~~

### Frontmatter for simple YAML

Support frontmatter for simple YAML, only support string value at first level (i.e. key = value) 

Frontmatter start with `---` (at least three) in first line of markdown document, for example

```
-----------------------------------------------------------------------------
title   : Casual Markdown 
toc     : leftspy
github  : https://github.com/casualwriter/casual-markdown 
version : v0.90, last updated on 2022/07/31
-----------------------------------------------------------------------------

## {{ title }}

[casual-markdown]({{github}}) is a super lightweight RegExp-based markdown parser, with TOC and scrollspy support

```

After called md.html(), js program may refer these values by `md.yaml[name]` (i.e. md.yaml = { title:'Casual Markdown', toc:'leftspy', .... }) 
and html string with ``{{ name }}`` will be replaced with related values
                                               

### Applications

* [Markdown-as-Document](markdown-as-document.md): [casual-markdown-doc.js](source/casual-markdown-doc.js), [casual-markdown-doc.css](source/casual-markdown-doc.css)
* [Markdown-as-WebPage](markdown-as-webpage.md): [causual-markdown-page.html](source/casual-markdown-page.html)  
* [Markdown-as-Blog](markdown-as-blog.md), developping... 


### Update History

* 2022/07/19, v0.80, initial release.
* 2022/07/21, v0.82, refine toc/scrollspy, add dummy function for extension
* 2022/07/22, v0.85, frontmatter for simple YAML
* 2022/07/22, v0.90, refine frontmatter. code casual-markdown-doc.js, casual-markdown-page.html

