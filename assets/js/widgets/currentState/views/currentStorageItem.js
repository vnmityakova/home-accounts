define(['backbone', 'text!../templates/currentStorageItem.html', '../../utils'],
    function( Backbone, tpl, Utils ) {
        var StorageTypeDataView = Backbone.View.extend({

            template: _.template(tpl),

            events : {},

            initialize: function(options) {},

            render: function() {
                this.$el.empty().append( this.template({
                    data:  this.model.toJSON(),
                    Utils: Utils
                }) );

                return this;
            }

        });

        return StorageTypeDataView;

    });