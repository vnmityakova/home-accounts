define(['backbone',
        'text!../templates/expenseCategories.html',
        '../views/expenseCategoriesItem',
        '../views/categoryEdit',
        '../views/subcategoryAdd',
        '../models/expenseCategories',
        '../collections/expenseSubCategories'],
    function(Backbone,
             tpl,
             ExpenseCategoriesItemView,
             CategoryEditView,
             SubcategoryAddView,
             ExpenseCategoriesModel,
             SubCategoriesCollection) {

        var ExpenseCategoryView = Backbone.View.extend({

            template : _.template( tpl ),

            events : {
                'click [data-eid=add-cat]' : 'addCategory'

            },

            initialize: function( options ) {
                this.subcatCollections = options.subcatCollections;
                this.bindUIEvents();
                //this.listenTo(this.collection, 'add', this.renderCategories);
                this.listenTo(this.collection, 'change', this.updateParentCatList);
            },

            bindUIEvents : function(){
                var self = this;
                Backbone.Events.on('editSubcat', function( args ){
                    self.$("[data-eid=add-form]").hide();
                    var data = args.model;
                    data.attributes.parentCatList = self.parentCatList;
                    var categoryEditView = new CategoryEditView({
                        model: data
                    });
                    self.$("[ data-eid=edit-form ]").empty().append( categoryEditView.render().$el).show();
                });

                Backbone.Events.on('rerenderCatList', function(){
                    self.renderCategories();
                });

                Backbone.Events.on('editCat', function( args ){
                    self.$("[data-eid=add-form]").hide();
                    var data = args.model;
                    data.attributes.isMainCat = true;
                    var categoryEditView = new CategoryEditView({
                        model: data
                    });
                    self.$("[ data-eid=edit-form ]").empty().append( categoryEditView.render().$el).show();
                });

                Backbone.Events.on('cancelEditCat', function( args ){
                    Backbone.Events.trigger('removeActive', args);
                    self.$("[data-eid=new-cat-name]").val('');
                    self.$("[data-eid=edit-form]").hide();
                    self.$("[data-eid=add-form]").show();
                });

                Backbone.Events.on('addSubcat', function( args ){
                    self.$("[data-eid=add-form]").hide();
                    var subcategoryAddView = new SubcategoryAddView({
                        model: args.model,
                        parentCatList : self.parentCatList
                    });
                    self.$("[ data-eid=edit-form ]").empty().append( subcategoryAddView.render().$el).show();
                });

            },

            render: function() {
                this.$el.empty().append( this.template() );
                this.renderCategories();
                return this;
            },

            addCategory : function(){
                if( ! this.$("[data-eid=add-category-form]").valid() ) return;

                var nmodel = new ExpenseCategoriesModel({
                    "name": this.$("[data-eid=new-cat-name]").val()
                });
                /*this.collection.create({
                    "name":     this.$("[data-eid=new-cat-name]").val()
                });*/
                this.collection.create(nmodel);
                this.$("[data-eid=new-cat-name]").val('');

                var categoriesItemView = new ExpenseCategoriesItemView({
                    model: nmodel,
                    collection: new SubCategoriesCollection([], {parId: nmodel.id})
                });
                var $newItem = categoriesItemView.render().$el.hide();
                this.$("[data-eid=items-list]").append($newItem);
                $newItem.show(200);

                Backbone.Events.trigger('cancelEditCat');

            },

            renderCategories: function () {
                var self = this;
                this.parentCatList = [];
                this.$("[data-eid=items-list]").empty();

                this.collection.each(function (model) {
                    self.parentCatList.push({
                        id: model.toJSON().id,
                        name: model.toJSON().name
                    });

                    var categoriesItemView = new ExpenseCategoriesItemView({
                        model: model,
                        collection: self.subcatCollections[model.toJSON().id]/*,
                         el : self.$("[data-eid=items-list]")*/
                    });
                    self.$("[data-eid=items-list]").append(categoriesItemView.render().$el);
                });
            },

            updateParentCatList : function() {
                var self = this;
                this.parentCatList = [];
                this.collection.each(function (model) {
                    self.parentCatList.push({
                        id: model.toJSON().id,
                        name: model.toJSON().name
                    });

                });
            }

        });

        return ExpenseCategoryView;
    });
