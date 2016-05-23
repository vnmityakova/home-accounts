/*
require(["create-post/views/main", "bootstrap"], function (MainView) {
    var mainView = new MainView();
    $("#content").append(mainView.render().$el);
});*/

require(["backbone", "routers/appRouter"], function ( Backbone, AppRouter) {
    var appRouter = new AppRouter();
    Backbone.history.start();
});