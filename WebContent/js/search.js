
$(document).ready(function(){
	
	var gCustomSearch = $("#search-results").gCustomSearch({
		
		resultsTmpl: "#results-tmpl",
		path: "http://localhost:28080/solr/cms/select/",
		solrResAnchorTitle: "titulo",
		solrResAnchorHref: "url",
		solrResSummaryText: "contenido",
		solrResDisplayLinkText: "url"
	
	}, function(){
		
		$("#totalResults").text(gCustomSearch.getTotalResults());
		$("#theQuery").text(gCustomSearch.getQuery());
		$("#crono").text(gCustomSearch.getCrono());
		$("#resultsFrom").text(gCustomSearch.getResultsFrom());
		$("#resultsTo").text(gCustomSearch.getResultsTo());
		gCustomSearch.applyPagination( $("#pagination") , $("#pagination-tmpl"), 10 );
	
	});
	
});