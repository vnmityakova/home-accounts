define(['backbone', 'text!../templates/subcategoriesItem.html'],
    function(Backbone, tpl) {

        var SubcategoresItemView = Backbone.View.extend({

            template : _.template( tpl ),

            events: {
                'click [data-eid=edit-subcat-block]' : 'editItem'
            },

            initialize: function( options ) {
                var self = this;
                Backbone.Events.on('removeActive', function( args ){
                    self.$("[data-eid=edit-subcat-block]").removeClass('active');
                    self.$(".glyphicon-pencil").removeClass("active");
                });

                this.listenTo(this.model, 'categoryRemoved',  function(  ){
                    self.$el.hide('150');
                    self.model.destroy();
                    Backbone.Events.trigger('cancelEditCat');
                });
                this.listenTo(this.model, 'change', this.render);
            },

            render: function() {
                this.$el.empty().append( this.template({
                    data: this.model.toJSON()
                }) );
                return this;
            },

            editItem : function(){
                Backbone.Events.trigger('removeActive', args);
                //передать модель в др вьюшку
                var args = {
                    model : this.model
                };
                Backbone.Events.trigger('editSubcat', args);
                this.$("[data-eid=edit-subcat-block]").addClass('active');
                this.$(".glyphicon-pencil").addClass("active");
            }
        });

        return SubcategoresItemView;
    });
