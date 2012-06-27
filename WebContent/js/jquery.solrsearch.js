/*

solrSearch v 0.6.0

Simple customized Search Engine Results Pages (SERPs) for SolR Search 

Copyright (c) 2012 Luis Jiménez. http://luisjime.com/

Licensed under the MIT license.
http://github.com/jquery/jquery/blob/master/MIT-LICENSE.txt

Github site: http://github.com/luisjime/solrSearch

*/

;(function($){
	
	$.fn.gCustomSearch = function (options) {
		
		// EXTEND Settings default + optional
		
		var settings = $.extend({
			queryParam: "q",
			startParam: "start",
			numParam: "num",
		}, options);
		
		// PRIVATE functions
		var getUrlVars = function(){
			var vars = [], hash;
			var theUrl = window.location.href;
			if (theUrl.substring(theUrl.length-1, theUrl.length) == "#"){
				theUrl = theUrl.substring(0, theUrl.length-1)
			}
			var hashes = theUrl.slice(theUrl.indexOf('?') + 1).split('&');
			for(var i = 0; i < hashes.length; i++){
				hash = hashes[i].split('=');
				vars.push(hash[0]);
				vars[hash[0]] = hash[1];
			}
			return vars;
		};
		
		var getUrlVar = function(name){
			return getUrlVars()[name];
		};
		
		var getPageHref = function(_query, _start, _num){
			
			var pageHref = location.href.split('?')[0];
			
			pageHref += "?";
			pageHref += settings.queryParam;
			pageHref += "=";
			pageHref += _query;
			
			pageHref += "&";
			pageHref += settings.startParam;
			pageHref += "=";
			pageHref += _start;
			
			pageHref += "&";
			pageHref += settings.numParam;
			pageHref += "=";
			pageHref += _num;
			
			return pageHref;
		}
		
		// END PRIVATE functions
		
		var solrSearcj = this;
		
		var callbackFunction;
		if (typeof(arguments[1]) == 'function') {
		    var callbackFunction = arguments[1];
		}
		
		var query = getUrlVar(settings.queryParam);
		
		var start = getUrlVar(settings.startParam);
		if (typeof start == 'undefined') {
		    start = 0;
		}
		
		var num = getUrlVar(settings.numParam);
		if (typeof num == 'undefined') {
		    num = 10;
		}
		
		var numResults = 0;
		var resultsFrom = 0;
		var resultsTo = 0;
		var totalResults = 0;
		var crono = 0;
		
		var solrSearchPath = settings.path;
		
		solrSearchPath += "?q=";
		solrSearchPath += query;
		
		solrSearchPath += "&start=";
		solrSearchPath += start;
		
		solrSearchPath += "&rows=";
		solrSearchPath += num;
		
		solrSearchPath += "&wt=json";
		
		this.each(function(){
			
			$.ajax({
				type : 'GET',
				dataType : 'jsonp',
				jsonp: 'json.wrf',
				url : solrSearchPath,
				success : function(results) {
					
					query = results.responseHeader.params.q;
					numResults = parseInt(results.responseHeader.params.rows);
					totalResults = results.response.numFound;
					crono = results.responseHeader.QTime;
					if(totalResults === 0){
						resultsFrom = 0;
					} else {
						resultsFrom = parseInt(results.responseHeader.params.start) + 1 ;
					}
					resultsTo = parseInt(numResults) + parseInt(resultsFrom) - 1;
					if(resultsTo > totalResults){
						resultsTo = totalResults;
					}
					numResults = parseInt(resultsTo) - parseInt(resultsFrom) + 1;
					
					if (typeof results.response.docs != 'undefined') {
					
						var resultsMap = $.map(results.response.docs, function(obj, index) {
							return {
								resAnchorHref : eval("obj." + settings.solrResAnchorHref),
								resAnchorTitle: eval("obj." + settings.solrResAnchorTitle),
								resSummaryText : eval("obj." + settings.solrResSummaryText),
								resDisplayLinkText: eval("obj." + settings.solrResDisplayLinkText)
							};
						});
						
						if (typeof settings.resultsTmpl == 'undefined'){
							console.log("you must provide the id of the results template in the variable resultsTmpl")
						} else {
							$(settings.resultsTmpl).tmpl(resultsMap).appendTo(solrSearcj);
						}
						
					}
					
					if (typeof callbackFunction == 'function') {
					    callbackFunction.call(this);
					}
    			}
			});
			
			return this;
			
		});
		
		// PUBLIC functions
		this.getQuery = function(){
			return query;
		};
		
		this.getNumResults = function(){
			return numResults;
		};
		
		this.getResultsFrom = function(){
			return resultsFrom;
		};

		this.getResultsTo = function(){
			return resultsTo;
		};
		
		this.getTotalResults = function(){
			return totalResults;
		};
		
		this.getCrono = function(){
			return crono;
		};
		
		this.applyPagination = function(object, template, maxPages) {
						
			var numPages = parseInt(totalResults / num);
			if (totalResults % num != 0){
				numPages = numPages + 1;
			}
			
			if (numPages > maxPages) {
				numPages = maxPages;
			}
			
			var currentPage = ( start  / num ) + 1;
			
			var _prev = {};
			if (currentPage == 1  || numPages == 0){
				_prev.prev = false;
				_prev.prevHref = "#";
			} else {
				_prev.prev = true;
				_prev.prevHref = getPageHref(query, start - num, num);
			}
			
			var _next = {};
			if(currentPage == numPages || numPages == 0){
				_next.next = false;
				_next.nextHref = "#";
			} else {
				_next.next = true;
				var aux = parseInt(start) + parseInt (num);
				_next.nextHref = getPageHref(query, aux, num);
			}
			
			var arrPages = [];
			for (var i = 0; i < numPages; i++) {
				var _pag = {};
				ii = i + 1;
				_pag.num = (ii).toString();
				if(ii != currentPage){
					_pag.href = getPageHref(query, i * num, num);
					_pag.active = false;
				} else {
					_pag.href = "#";
					_pag.active = true;
				}
				arrPages[i] = _pag;
			}
			
			var _pages = {};
			_pages.pages = arrPages;
			
			var data = [];
			data[0] = _prev;
			data[1] = _pages;
			data[2] = _next;
			
			template.tmpl(data).appendTo(object);
			
		}
		
		// END PUBLIC functions
		
		return this;
	
	};
	
})(jQuery);