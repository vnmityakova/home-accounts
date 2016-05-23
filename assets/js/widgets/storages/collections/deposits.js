define(['underscore', 'backbone', '../models/item', '../../backbone-localstorage'],
    function(_, Backbone, StoragesModel, Localstorage) {

        var StorageTypeDataCollection = Backbone.Collection.extend({
            //url: "/api/deposits",
            model: StoragesModel,
            localStorage: new Store("deposits")
        });
        return StorageTypeDataCollection;
    });