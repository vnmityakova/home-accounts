define(['underscore', 'backbone', '../models/item', '../../backbone-localstorage'],
    function(_, Backbone, StoragesModel, Localstorage) {

        var StorageTypeDataCollection = Backbone.Collection.extend({
            //url: "/api/cards",
            model: StoragesModel,
            localStorage: new Store("cards")
        });
        return StorageTypeDataCollection;
    });