define(['underscore', 'backbone', '../models/item', '../../backbone-localstorage'],
    function(_, Backbone, StoragesModel, Localstorage) {

        var StorageTypeDataCollection = Backbone.Collection.extend({
            //url: "/api/wallets",
            model: StoragesModel,
            localStorage: new Store("wallets")
        });
        return StorageTypeDataCollection;
    });