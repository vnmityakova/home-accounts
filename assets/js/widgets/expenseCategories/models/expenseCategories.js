define(['underscore', 'backbone'], function(_, Backbone) {
    var ExpenseCategoriesModel = Backbone.Model.extend({
        initialize: function(options) {
            console.log("model ExpenseCategoriesModel init");
        }
    });
    return ExpenseCategoriesModel;
});


