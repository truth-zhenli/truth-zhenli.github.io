
var TemplateEngine = function (html, options) {
    var re = /<%([^%>]+)?%>/g,
        reExp = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g,
        code = 'var r=[];\n',
        cursor = 0;
    var add = function (line, js) {
        js ? (code += line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n') :
            (code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
        return add;
    }
    while (match = re.exec(html)) {
        add(html.slice(cursor, match.index))(match[1], true);
        cursor = match.index + match[0].length;
    }
    add(html.substr(cursor, html.length - cursor));
    code += 'return r.join("");';
    return new Function(code.replace(/[\r\t\n]/g, '')).apply(options);
}

// Handler for .ready() called.
$(function () {
	
	// Install highlight slider
	for (var i = 0; i < slide_list.length; i++ ){
		var slide_item = $('<li></li>');
		$(slide_item).append ('<img src="'+slide_list[i].source+'">');
		$(slide_item).append ('<p style="font-size:80%; text-align:right;"><a href="'+slide_list[i].url+'">'+slide_list[i].title+'</a></p>');
		$('#highlight .slides').append(slide_item);
	}

	// Install news
	var news_tamplate = '<DIV class="news-item">' +
		'<DIV class="news-date"><SPAN class="month"><%this.Month%></SPAN><SPAN class="day"><%this.Day%></SPAN><SPAN class="year"><%this.Year%></SPAN></DIV>' +
		'<DIV class="news-excerpt"><%this.excerpt%></DIV></DIV>';
	var month = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
	for (var j = 0; j < news_list.length; j++ ){
		var news_item = $(TemplateEngine(news_tamplate, {
            Year: $(news_list[j]).attr('Year'),
            Month: month[$(news_list[j]).attr('Month')-1],
            Day: $(news_list[j]).attr('Day'),
            excerpt: $(news_list[j]).attr('excerpt')
        }));
		$('#news').append(news_item);
	}
	
	// Install publications
	var tableID = "paperlist";
	for (var k = 0; k < book_list.length; k++ ){
			$('#' + tableID + ' > tbody').append('<tr data-cate=' + '0' + '><td width="20px"; align="right"; valign="top">' + 
				book_list[k].number + '</td><td width="5px"></td><td>' + 
				book_list[k].author + ' "' + book_list[k].ctitle + '" in "' + book_list[k].btitle + '", ' +
				'Edited by ' + book_list[k].editor + ', ' + 
				book_list[k].publisher + ', Chapter ' + book_list[k].chapter + ', p' + 
				book_list[k].page1 + ' (<strong>' + book_list[k].year + '</strong>).</td></tr>');
	}
	// Papers
	for (var k = 0; k < paper_list.length; k++ ){
	/*	var paper_item = $('<tr data-cate=' + paper_list[k].year + '><td width="20px"; align="right"; valign="top">' + paper_list[k].number + '</td><td width="5px"></td><td>' + 
				paper_list[k].author + ' ' + paper_list[k].title + ', ' + 
				'<strong><em>' + paper_list[k].journal + '</em></strong> ' + 
				paper_list[k].year + ', ' + paper_list[k].volume + ', ' + 
				paper_list[k].page1 + '. ' + paper_list[k].remark + ' <br></td></tr>');
				
		if (paper_list[k].toc) {
			$(paper_item).append('<image width="200" height="200" src=' + paper_list[k].toc + '/>');
		}
		$('#' + tableID + ' > tbody').append(paper_item);
	*/	
		if (paper_list[k].toc === "") {
			$('#' + tableID + ' > tbody').append('<tr data-cate=' + paper_list[k].year + '><td width="20px"; align="right"; valign="top">' + paper_list[k].number + '</td><td width="5px"></td><td>' + 
				paper_list[k].author + ' ' + paper_list[k].title + ', ' + 
				'<strong><em>' + paper_list[k].journal + '</em></strong> ' + 
				paper_list[k].year + ', ' + paper_list[k].volume + ', ' + 
				paper_list[k].page1 + '. ' + paper_list[k].remark + '</td></tr>');
		}
		else {
			$('#' + tableID + ' > tbody').append('<tr data-cate=' + paper_list[k].year + '><td width="20px"; align="right"; valign="top">' + paper_list[k].number + '</td><td width="5px"></td><td>' + 
				paper_list[k].author + ' ' + paper_list[k].title + ', ' + 
				'<strong><em>' + paper_list[k].journal + '</em></strong> ' + 
				paper_list[k].year + ', ' + paper_list[k].volume + ', ' + 
				paper_list[k].page1 + '. ' + paper_list[k].remark + ' ' + 
				'<br><div align="center"><image align="center" height="150" src=' + paper_list[k].toc + '/></div><br></td></tr>');
		}	
	}

	readHash();//in case load all
	function readHash() {
		var hashStr = location.hash.substr(1).toLowerCase();
		if (hashStr === '') {hashStr = "2017";}
		$('tr[data-cate]').hide();
		$('tr[data-cate=' + hashStr + ']').fadeIn(0);
		if (hashStr === '2012') {
			hashStr = "2012 and before";
			for ( var year=2002; year < 2012; year++){
				$('tr[data-cate=' + year + ']').fadeIn(0);
			}
		}
		if (hashStr === '0') {hashStr = "Book chapters";}
		$('#publication-category').text(hashStr);
	}
	window.onhashchange = readHash;//> IE 7
	if (navigator.appVersion.indexOf("MSIE 7.") != -1){
		$('.changehash').click(function(){window.setTimeout(readHash, 100)}) //deal with IE 7
	}

//	SyntaxHighlighter.all();
});

$(window).load(function(){
	$('#highlight.flexslider').flexslider({
		animation: "slide",
		start: function(slider){
			$('body').removeClass('loading');
		}
	});

	$('#gallery.flexslider').flexslider({
        animation: "slide",
        controlNav: "thumbnails",
		smoothHeight: true,
        start: function(slider){
          $('body').removeClass('loading');
		}
	});
});
