var InAppZendesk = function () {
	var url = "https://frontlinecloud.zendesk.com/api/v2/help_center/articles.json",
	articlesJson = {},
	listArticlesContainer = $(".article-list .content"),
	paginationContainer = $(".pagination"),
	articleContent = $(".article-content"),	
	loadArticles = function (params) {
		$.ajax({
			type : 'GET',
			url : url,
			data : params,
			success : function (data) {
				articlesJson = data;
				displayArticles(data);
			}
		})
	},
	displayArticles = function (articlesJson) {
		renderArticles(articlesJson.articles);
		var pages = [];
		for (var i = 1; i <= articlesJson.page_count; i++) {
			pages.push(i);	
		}
		source = $("#pagination-container").html();
		template = Handlebars.compile(source);
		html = template(pages);
		paginationContainer.html(html);
		
		$(".page[data-page-id="+ articlesJson.page +"]").closest("li").addClass("active");
		$('.page').on("click", handlePageChange);
		$('.article').on("click", handleArticleSelecton);
	},
	renderArticles = function (articles) {
		var source = $("#article-list-handlebar").html();
		var template = Handlebars.compile(source);
		var html = template(articles);
		listArticlesContainer.html(html);
	},
	handlePageChange = function () {
		var element = $(this),
		pageId = element.data("page-id"),
		params = { page:pageId, per_page:30 };
		loadArticles(params);
	},
	handleArticleSelecton = function () {
		var element = $(this),
		articleId = element.data("article-id");
		$.ajax({
			type:'GET',
			url:'https://frontlinecloud.zendesk.com/api/v2/help_center/articles/'+articleId+'.json',
			success: function (data) {
				var source = $("#article-view").html();
				var template = Handlebars.compile(source);
				var html = template(data.article);
				articleContent.html(html);
			}
		})	
	},
	searchForArticle = function () {
		var queryString = $(".query").val();
		$.ajax({
			type:'GET',
			url:'https://frontlinecloud.zendesk.com/api/v2/help_center/articles/search.json',
			data : { query : queryString },
			success: function (data) {
				articlesJson = data;
				renderArticles(data.results);
				$('.article').on("click",handleArticleSelecton);
			}
		})
	},
	init = function () {
		loadArticles({});
		$('.search').on("click", searchForArticle);
	};
	init();
}

var inAppZendesk;
$(function () {
	inAppZendesk = new InAppZendesk();
});
