define(['underscore', 'backbone', '../models/expenseCategories', '../../backbone-localstorage'],
    function(_, Backbone, CategoryModel) {
    var ExpenseCategoriesCollection = Backbone.Collection.extend({
        url: "/api/expenseCategories",
        model: CategoryModel,
        localStorage: new Store("expenseCategories")
    });
    return ExpenseCategoriesCollection;
});