define(['underscore', 'backbone', '../models/expenseCategories', '../../backbone-localstorage'],
    function(_, Backbone, CategoryModel) {

    var ExpenseSubCategoriesCollection = Backbone.Collection.extend({

        initialize: function(models, options) {
            this.parId = options.parId;
            this.localStorage = new Store("expenseSubcat(" + this.parId + ")");
        },

        /*url: function() {
                return '/api/expenseCategories/' + this.id + '/subcategories';
        },*/

        model: CategoryModel/*,

        localStorage: new Store("expenseSubcat" + this.parId)*/

    });
    return ExpenseSubCategoriesCollection;
});

// http://stackoverflow.com/questions/8464417/backbone-js-collection-options

/*var collection = new ExpenseSubCategoriesCollection([], { id: 2 });
*/
