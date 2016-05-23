define(['backbone', 'text!../templates/categoryEdit.html'],
    function(Backbone, tpl) {

        var CategoryEditView = Backbone.View.extend({

            template : _.template( tpl ),

            events: {
                'click [data-eid=cancel-edit]' : 'cancelEditCat',
                'click [data-eid=remove]' :      'removeCategory',
                'click [data-eid=save-edited]' : 'saveEditedCategory'
            },

            initialize: function( options ) {
            },

            render: function() {
                this.$el.empty().append( this.template({
                    data: this.model.toJSON()
                }) );
                return this;
            },

            cancelEditCat : function(){
                Backbone.Events.trigger('cancelEditCat');
            },

            removeCategory: function(){
                this.model.trigger("categoryRemoved");
            },

            saveEditedCategory : function() {
                if( ! this.$("[data-eid=edit-cat-form]").valid() ) return;

                this.model.save({
                    "name": this.$("[data-eid=edited-cat-name]").val()
                });
                if(this.model.toJSON().parentId) {
                    this.model.save({
                        "parentId": this.$("[data-eid=parent-cat]").val()
                    });
                    Backbone.Events.trigger('rerenderCatList');
                }
                Backbone.Events.trigger('cancelEditCat');
                //Backbone.Events.trigger('saveEditedCat');
            }

        });

        return CategoryEditView;
    });
