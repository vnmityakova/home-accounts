define(['underscore', 'backbone'], function(_, Backbone) {
    var IncomingsCategoryModel = Backbone.Model.extend({
        initialize: function(options) {
            console.log("model IncomingsCategoryModel init");
        }
    });
    return IncomingsCategoryModel;
});


