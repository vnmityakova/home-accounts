define(['underscore', 'backbone'], function(_, Backbone) {
    var StorageTypesModel = Backbone.Model.extend({
        initialize: function(options) {
            console.log("model StorageTypesModel init");
        }
    });
    return StorageTypesModel;
});


