var InAppZendesk = function () {
	var allArticlesUrl = "https://frontlinecloud.zendesk.com/api/v2/help_center/en-us/articles.json",
	searchUrl = 'https://frontlinecloud.zendesk.com/api/v2/help_center/articles/search.json',
	articlesJson = {},
	listArticlesContainer = $(".article-list .content"),
	paginationContainer = $(".pagination"),
	articleContent = $(".article-content"),
	loadArticles = function (params) {
		var defaultParams = { sort_by:'title', sort_order:'asc' };
		$.extend(params, defaultParams);
		$.ajax({
			type : 'GET',
			url : allArticlesUrl,
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
		renderHandlebar("#pagination-container", paginationContainer, pages);
		$(".page[data-page-id="+ articlesJson.page +"]").closest("li").addClass("active");
		$('.page').on("click", handlePageChange);
		$('.article').on("click", handleArticleSelecton);
	},
	renderArticles = function (articles) {
		renderHandlebar("#article-list-handlebar", listArticlesContainer, articles);
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
				renderHandlebar("#article-view", articleContent, data.article);
			}
		})	
	},
	searchForArticle = function () {
		var queryString = $(".query").val();
		$.ajax({
			type: 'GET',
			url: searchUrl,
			data : { query : queryString },
			success: function (data) {
				articlesJson = data;
				renderArticles(data.results);
				$('.article').on("click",handleArticleSelecton);
			}
		})
	},
	renderHandlebar = function (handlebarId, container, data) {
		var source = $(handlebarId).html();
		var template = Handlebars.compile(source);
		var html = template(data);
		container.html(html);
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
