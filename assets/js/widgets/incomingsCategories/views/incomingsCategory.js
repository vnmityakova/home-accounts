define(['backbone', 'text!../templates/incomingsCategories.html', '../views/incomingsCategoryItem'],
    function(Backbone, tpl, IncomingsCategoryItemView) {

        var IncomingsCategoryView = Backbone.View.extend({

            template : _.template( tpl ),

            events : {
                'click [data-eid=add-categ]' : 'clickAddCateg'
            },

            initialize: function( options ) {
                //this.render();
                this.listenTo(this.collection, 'add', this.render);
            },

            render: function() {
                var self = this;
                this.$el.empty().append( this.template() );

                this.collection.each( function( model ) {
                    //вьюшка на каждую
                    var incomingsCategoryItemView = new IncomingsCategoryItemView({
                        model: model
                    });
                    self.$("[data-eid=items]").append( incomingsCategoryItemView.render().$el );
                    self.$("[data-eid=categ-name]").val("");
                });

                return this;
            },

            clickAddCateg : function(){
                if( ! this.$("[data-eid=inc-cat-form]").valid() ) return;
                //создать новую категорию с именем data-eid="categ-name" и сохранить
                /*var newCat = new IncomingsCategoryModel({
                    id: 0,
                    "name": "Зарплата"
                });
                this.collection.add(newCat);*/

                this.collection.create({
                    "name": this.$("[data-eid=categ-name]").val()
                });
            }

        });

        return IncomingsCategoryView;
    });
