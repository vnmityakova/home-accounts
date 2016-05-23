define(['backbone', 'text!../templates/incomingRow.html', '../../utils'],
    function(Backbone, tpl, Utils) {

        var IncomingRowView = Backbone.View.extend({
            template : _.template( tpl ),

            events : {
              'click [data-eid=edit-link]' : "editIncoming",
              'click [data-eid=remove]': 'removeItem'
            },

            tagName: 'tr',

            initialize: function( options ) {
                var self = this;
                Backbone.Events.on('cancelEdit', function( args ){
                    self.$("[data-eid=edit-link]").removeClass("active");
                });

                Backbone.Events.on('cancelEdit, showAddForm', function( args ){
                    self.$("[data-eid=edit-link]").removeClass("active");
                });
            },

            render: function() {
                this.$el.empty().empty().append( this.template({
                    data: this.model.toJSON(),
                    Utils: Utils
                }) );

                return this;
            },

            editIncoming : function(evt){
                Backbone.Events.trigger('cancelEdit');
                var args = {
                    model : this.model
                };
                this.$("[data-eid=edit-link]").addClass("active");
                Backbone.Events.trigger('editIncoming', args);
            },

            removeItem: function(){
                var self = this;
                this.model.destroy();
                $.when(this.$el.hide('100')).then(function(){
                    self.$el.empty().remove();
                    Backbone.Events.trigger('item-removed');
                });

            }
        });

        return IncomingRowView;
    });
