define(['underscore', 'backbone', '../models/item', '../../backbone-localstorage'],
    function(_, Backbone, StoragesModel, Localstorage) {

        var StorageTypeDataCollection = Backbone.Collection.extend({
            //url: "/api/safes",
            model: StoragesModel,
            localStorage: new Store("safes")
        });
        return StorageTypeDataCollection;
    });