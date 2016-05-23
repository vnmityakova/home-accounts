define(['underscore', 'backbone'], function(_, Backbone) {
    var IncomingsModel = Backbone.Model.extend({
        initialize: function(options) {
            console.log("model Incomings init");
        }
    });
    return IncomingsModel;
});


