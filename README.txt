Simple customized Search Engine Results Pages (SERPs) for Apache Solr 

Usage:

You must provide a jQuery template for the results in your SERP html. For example:

	<ul id="search-results">
		<script id="results-tmpl" type="text/x-jquery-tmpl">
			<li class="search-result">
				<h3>
					<a href="${resAnchorHref}" title="${resAnchorTitle}">
						{{html resAnchorTitle}}
					</a>
				</h3>
				<p>
					{{html resSummaryText}}
				</p>
				<em class="search-breadcrumbs">
					<i class="icon-globe"></i> ${resDisplayLinkText}
				</em>
			</li>
		</script>
	</ul>

And an optional jQuery template for the pagination. For example:

	<ul id="pagination">
		<script id="pagination-tmpl" type="text/x-jquery-tmpl">
			{{if prev}}
				<li>
					<a href="${prevHref}" title="Previous">Prev</a>
				</li>
			{{/if}}
			
			{{each pages}}
				<li {{if active}}class="active"{{/if}}>
					<a href="${href}" title="Page ${num}">${num}</a>
				</li>
			{{/each}}
			
			{{if next}}
				<li>
					<a href="${nextHref}" title="Next">Next</a>
				</li>
			{{/if}}
		</script>
	</ul>

Plugin usage example. You must create an instance of solrSearch providing the query path of solr engine, 
the id of the results template and a little mapping between the names of Solr result fields you want to push in each result (in the template jQuery you did)

You've also a callback function, where you can do another stuff and call the public methods of solrSearch.

Example:

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

In the callback stuff you can use the public methods for other features like:

* getQuery: Returns the query terms used
		
* getNumResults: Returns the number of results showed 
		
* getResultsFrom: Returns the pointer of the first result showed

* getResultsTo: Returns the pointer of the last result showed
		
* getTotalResults: Returns the number of all (total) results
		
* getCrono: Returns the time expended in search
		
* applyPagination: Allows create a pagination component. Must provide the DOM element where you can append the pagination,  the DOM object of  pagination template and the max number of pages you want.



