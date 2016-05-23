define(['backbone', 'text!../templates/incomingsCategoryItem.html'],
    function(Backbone, tpl) {

        var IncomingsCategoryItemView = Backbone.View.extend({

            template : _.template( tpl ),

            events: {
                'click [data-eid=category-item-block]' : 'showEditForm',
                'click [data-eid=save-cat]' : 'saveEditedCategory',
                'click [data-eid=remove-cat]' : 'removeCategory'
            },

            initialize: function( options ) {
                //перерисовать после изменения
                this.listenTo(this.model, 'change', this.render);
            },

            render: function() {
                this.$el.empty().append( this.template({
                    data: this.model.toJSON()
                }) );
                return this;
            },

            showEditForm: function (){
                //show item edit form
                this.$(".itemBlock").toggle('200');
                this.$("[data-eid=category-item-block]").toggleClass("active");
                this.$(".glyphicon-pencil").toggleClass("active");

            },

            saveEditedCategory : function(){
                if( ! this.$("[data-eid=inc-cat-edit-form]").valid() ) return;

                var self = this;
                var newName = this.$("[data-eid=name]").val();
                this.$("[data-eid=edit]").hide(200).promise().done(function () {
                    self.model.save({
                        name: newName
                    });
                });
            },

            removeCategory : function(){
                this.model.destroy();
                this.$("[data-eid=edit]").hide(200);
                this.$("[data-eid=category-item-block]").hide(200);
            }
        });

        return IncomingsCategoryItemView;
    });
