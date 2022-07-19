/*****************************************************************************
 * casual-markdown - a lightweight regexp-base markdown parser with TOC support
 * last updated on 2022/07/19, v0.80, refine table syntax, code formatter
 *
 * Copyright (c) 2022, Casualwriter (MIT Licensed)
 * https://github.com/casualwriter/casual-markdown
*****************************************************************************/
;(function(){ 

  var md = function (id) { return document.getElementById(id) }

  // function for REGEXP to convert html tag. ie. <TAG> => &lt;TAG*gt;  
  md.formatTag = function (html) { return html.replace(/</g,'&lt;').replace(/\>/g,'&gt;'); }

  //===== format code-block, highlight remarks/keywords for code/sql
  md.formatCode = function (match, title, block) {
    // convert tag <> to &lt; &gt;
    block = block.replace(/</g,'&lt;').replace(/\>/g,'&gt;').replace(/\t/g,'   ')
    
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
  
  //===== parse markdown string into HTML string (exclude code-block)
  md.parser = function( mdstr ) {
    // table syntax
    mdstr = mdstr.replace(/\n(.+?)\n.*?\-\-\|\-\-.*?\n([\s\S]*?)\n\s*?\n/g, function (m,p1,p2) {
        var thead = '<thead>\n<tr><th>' + p1.replace(/\|/g,'<th>') + '</th></thead>'
        var tbody = p2.replace(/(.+)/gm,'<tr><td>$1</td></tr>').replace(/\|/g,'<td>')
        return '\n<table>' + thead + '\n<tbody>' + tbody + '\n</tbody></table>\n\n' 
    } )   

    // horizontal rule => <hr> 
    mdstr = mdstr.replace(/^-{3,}|^\_{3,}|^\*{3,}$/gm, '<hr>').replace(/\n\n<hr\>/g, '\n<br><hr>')

    // header => <h1>..<h5> 
    mdstr = mdstr.replace(/^##### (.*?)\s*#*$/gm, '<h5>$1</h5>')
              .replace(/^#### (.*?)\s*#*$/gm, '<h4>$1</h4>')
              .replace(/^### (.*?)\s*#*$/gm, '<h3>$1</h3>')
              .replace(/^## (.*?)\s*#*$/gm, '<h2>$1</h2>')
              .replace(/^# (.*?)\s*#*$/gm, '<h1>$1</h1>')
              .replace(/^<h(\d)\>(.*?)\s*{(.*)}\s*<\/h\d\>$/gm, '<h$1 id="$3">$2</h$1>')
        
    // inline code-block: `code-block` => <code>code-block</code>    
    mdstr = mdstr.replace(/``(.*?)``/gm, function(m,p){ return '<code>' + md.formatTag(p).replace(/`/g,'&#96;') + '</code>'} ) 
    mdstr = mdstr.replace(/`(.*?)`/gm, '<code>$1</code>' )
        
    // blockquote, max 2 levels => <blockquote>{text}</blockquote>
    mdstr = mdstr.replace(/^\>\> (.*$)/gm, '<blockquote><blockquote>$1</blockquote></blockquote>')
    mdstr = mdstr.replace(/^\> (.*$)/gm, '<blockquote>$1</blockquote>')
    mdstr = mdstr.replace(/<\/blockquote\>\n<blockquote\>/g, '\n<br>' )
    mdstr = mdstr.replace(/<\/blockquote\>\n<br\><blockquote\>/g, '\n<br>' )
                  
    // image syntax: ![title](url) => <img alt="title" src="url" />          
    mdstr = mdstr.replace(/!\[(.*?)\]\((.*?) "(.*?)"\)/gm, '<img alt="$1" src="$2" $3 />')
    mdstr = mdstr.replace(/!\[(.*?)\]\((.*?)\)/gm, '<img alt="$1" src="$2" width="90%" />')
                  
    // links syntax: [title](url) => <a href="url" title="title">text</a>          
    mdstr = mdstr.replace(/\[(.*?)\]\((.*?) "new"\)/gm, '<a href="$2" target=_new>$1</a>')
    mdstr = mdstr.replace(/\[(.*?)\]\((.*?) "(.*?)"\)/gm, '<a href="$2" title="$3">$1</a>')
    mdstr = mdstr.replace(/([<\s])(http[s]\:\/\/.*?)([\s\>])/gm, '$1<a href="$2">$2</a>$3')
    mdstr = mdstr.replace(/\[(.*?)\]\(\)/gm, '<a href="$1">$1</a>')
    mdstr = mdstr.replace(/\[(.*?)\]\((.*?)\)/gm, '<a href="$2">$1</a>')
                  
    // unordered/ordered list, max 2 levels  => <ul><li>..</li></ul>, <ol><li>..</li></ol>
    mdstr = mdstr.replace(/^[\*+-][ .](.*)/gm, '<ul><li>$1</li></ul>' )
    mdstr = mdstr.replace(/^\d[ .](.*)/gm, '<ol><li>$1</li></ol>' )
    mdstr = mdstr.replace(/^\s{2,6}[\*+-][ .](.*)/gm, '<ul><ul><li>$1</li></ul></ul>' )
    mdstr = mdstr.replace(/^\s{2,6}\d[ .](.*)/gm, '<ul><ol><li>$1</li></ol></ul>' )
    mdstr = mdstr.replace(/<\/[ou]l\>\n<[ou]l\>/g, '\n' )
    mdstr = mdstr.replace(/<\/[ou]l\>\n<[ou]l\>/g, '\n' )
                  
    // text decoration: bold, italic, underline, strikethrough, highlight                
    mdstr = mdstr.replace(/\*\*\*(\w.*?[^\\])\*\*\*/gm, '<b><em>$1</em></b>')
    mdstr = mdstr.replace(/\*\*(\w.*?[^\\])\*\*/gm, '<b>$1</b>')
    mdstr = mdstr.replace(/\*(\w.*?[^\\])\*/gm, '<em>$1</em>')
    mdstr = mdstr.replace(/___(\w.*?[^\\])___/gm, '<b><em>$1</em></b>')
    mdstr = mdstr.replace(/__(\w.*?[^\\])__/gm, '<u>$1</u>')
    // mdstr = mdstr.replace(/_(\w.*?[^\\])_/gm, '<u>$1</u>')  // NOT support!! 
    mdstr = mdstr.replace(/~~(\w.*?)~~/gm, '<del>$1</del>')
    mdstr = mdstr.replace(/\^\^(\w.*?)\^\^/gm, '<ins>$1</ins>')
                  
    // line break and paragraph => <br/> <p>                
    mdstr = mdstr.replace(/  \n/g, '\n<br/>').replace(/\n\s*\n/g, '\n<p>\n')
        
    // indent as code-block          
    mdstr = mdstr.replace(/^ {4,10}(.*)/gm, function(m,p) { return '<pre><code>' + md.formatTag(p) + '</code></pre>'} )
    mdstr = mdstr.replace(/^\t(.*)/gm, function(m,p) { return '<pre><code>' + md.formatTag(p) + '</code></pre>'} )
    mdstr = mdstr.replace(/<\/code\><\/pre\>\n<pre\><code\>/g, '\n' )

    // Escaping Characters                
    return mdstr.replace(/\\([`_~\*\+\-\.\^\\\<\>\(\)\[\]])/gm, '$1' )
  }

  //===== parse markdown string into HTML content (cater code-block)
  md.html = function (mdText) { 
    // first, handle syntax for code-block
    var pos1=0, pos2=0, mdHTML = ''
    mdText = mdText.replace(/\r\n/g, '\n').replace(/\n~~~/g,'\n```')
    mdText = mdText.replace(/\n``` *(.*?)\n([\s\S]*?)\n``` *\n/g, md.formatCode)
    
    // split by "<code>", skip for code-block and process normal text
    while ( (pos1 = mdText.indexOf('<code>')) >= 0 ) {
      pos2 = mdText.indexOf('</code>', pos1 )
      mdHTML += md.parser( mdText.substr(0,pos1) ) + mdText.substr(pos1, (pos2>0? pos2-pos1+7 : mdtext.length) )
      mdText = mdText.substr( pos2 + 7 )
    }

    return '<div class="markdown">' + mdHTML + md.parser( mdText ) + '</div>'
  }

  //==== TOC support
  md.toc = function (source, target, options) {
    var toc = md(source).querySelectorAll('h2,h3,h4')
    var html = '<button style="float:right" onclick="this.parentElement.style.display=\'none\'">X</button>'
    html += '<ul class="toc"><h3>Table of Contents</h3>';
    
    for (var i=0; i<toc.length; i++ ) {
      if (!toc[i].id) toc[i].id = "toc-item-" + i;
      html += '<li class="' + toc[i].nodeName + '"><a href="#' + toc[i].id + '">' 
      html += toc[i].textContent + '</a></li>';
    }
    
    md(target).innerHTML = html + "</ul>";
    md(target).style.display = 'block';
  }  
  
  if (typeof exports==='object') { 
    module.exports=md;
  } else if (typeof define==='function') { 
     define(function(){return md;});
  } else {
     this.md=md;
  }
}).call( function(){ return this||(typeof window!=='undefined'?window:global)}() );
