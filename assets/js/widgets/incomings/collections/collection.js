define(['underscore', 'backbone', '../models/incomings', '../../backbone-localstorage'],
    function(_, Backbone, IncomingsModel, Localstorage) {
    var IncomingsCollection = Backbone.Collection.extend({
        //url: "/api/incomings",
        model: IncomingsModel,
        localStorage: new Store("incomings")
    });
    return IncomingsCollection;
});