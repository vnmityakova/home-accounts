define(['backbone', 'text!../templates/categories.html', '../views/category', '../collections/wallets'],
    function( Backbone, tpl, CategoryView, WalletCollection ) {
    var StoragesView = Backbone.View.extend({
        
        template: _.template(tpl),
        
        initialize: function(options) {
            //this.render();
            this.options = options
        },

        render: function () {
            var self = this;
            this.$el.empty().append(this.template());

            this.collection.each(function (model) {
                var categoryView = new CategoryView({
                    model: model,
                    collection: self.options.subcatCollections[model.toJSON().storageTypeId]
                });
                self.$("[data-storages-type = storage-types]").append(categoryView.render().$el);
                //после добавления можно делать fetch для всех айтемов
                //categoryView.fetchSubcat();
            });
            return this;
        },

        renderCategories : function(){

        }
        
    });
    return StoragesView;
});