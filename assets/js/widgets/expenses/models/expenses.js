define(['underscore', 'backbone'], function(_, Backbone) {
    var ExpensesModel = Backbone.Model.extend({
        initialize: function(options) {
            console.log("model expenses init");
        }
    });
    return ExpensesModel;
});


