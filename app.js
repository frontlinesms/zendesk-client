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
		var source = $("#article-list-handlebar").html();
		var template = Handlebars.compile(source);
		var html = template(articlesJson.articles);
		listArticlesContainer.html(html);

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
	handlePageChange = function () {
		var element = $(this),
		pageId = element.data("page-id"),
		params = { page:pageId, per_page:30 };
		loadArticles(params);
	},
	handleArticleSelecton = function () {
		var element = $(this),
		articleId = element.data("article-id");
		articleData = {};
		for(var i=0; i < articlesJson.articles.length; i++) {
			if(articlesJson.articles[i].id == articleId) {
				articleData = articlesJson.articles[i];
				break;
			}
		}
		var source = $("#article-view").html();
		var template = Handlebars.compile(source);
		var html = template(articleData);
		articleContent.html(html);
	},
	searchForArticle = function () {
		// TODO
	},
	init = function () {
		loadArticles({});
	};
	init();
}

var inAppZendesk;
$(function () {
	inAppZendesk = new InAppZendesk();
});
