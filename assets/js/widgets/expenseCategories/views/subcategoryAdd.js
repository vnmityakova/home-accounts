define(['backbone', 'text!../templates/subcategoryAdd.html'],
    function(Backbone, tpl) {

        var SubcategoryAddView = Backbone.View.extend({

            template : _.template( tpl ),

            events: {
                'click [data-eid=save-added-subcat]' : 'addItem',
                'click [data-eid=cancel-edit]': 'cancelEdit'
            },

            initialize: function( options ) {
                this.options = options;
            },

            render: function() {
                this.$el.empty().append( this.template({
                    parentCatList: this.options.parentCatList,
                    model: this.model.toJSON()
                }) );
                return this;
            },

             addItem : function(){
                 if( ! this.$("[data-eid=subcat-add-form]").valid() ) return;

                 var self = this;
                 this.model.trigger("create-subcat", {
                     name : self.$("[data-eid=cat-name]").val()
                 });
                 Backbone.Events.trigger('cancelEditCat');
            },

            cancelEdit : function(){
                Backbone.Events.trigger('cancelEditCat');
            }
        });

        return SubcategoryAddView;
    });
