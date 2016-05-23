define(['underscore', 'backbone', '../models/incomingsCategory', '../../backbone-localstorage'],
    function(_, Backbone, CategoryModel, Localstorage) {

    var IncomingsCategoryCollection = Backbone.Collection.extend({
        //url: "/api/incomingsCategory",
        model: CategoryModel,
        localStorage: new Store("incomingCategories")
    });
    return IncomingsCategoryCollection;
});