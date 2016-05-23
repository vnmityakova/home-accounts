define(['underscore', 'backbone', '../models/item', '../../backbone-localstorage'],
    function(_, Backbone, StoragesModel, Localstorage) {

    var StorageTypeDataCollection = Backbone.Collection.extend({
        //url: "/api/storagesCategories",
        model: StoragesModel,
        localStorage: new Store("storages")
    });
    return StorageTypeDataCollection;
});