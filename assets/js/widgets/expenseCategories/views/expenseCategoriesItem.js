define(['backbone',
        'text!../templates/expenseCategoriesItem.html',
        '../views/subcategoryItem',
        '../collections/expenseSubCategories'
    ],
    function (Backbone,
              tpl,
              SubcategoryItemView,
              SubCategoriesCollection) {

        var ExpenseCategoresItemView = Backbone.View.extend({

            template: _.template(tpl),

            events: {
                'click [data-eid=edit-cat]': 'editItem',
                'click [data-eid=add-subcat]': 'addSubcat'
            },

            initialize: function (options) {
                var self = this;

                Backbone.Events.on('removeActive', function (args) {
                    self.$("[data-eid=edit-block]").removeClass('active');
                    self.$("[data-eid=add-subcat]").removeClass("active");
                    self.$("[data-eid=edit-cat]").removeClass("active");
                });
                /*Backbone.Events.on('createSubcat', function (args) {
                    self.collection.create({
                        "name": args.name,
                        "parentId" : self.model.toJSON().id

                    });
                });*/
                this.listenTo(this.model, 'change', this.render);
                this.listenTo(this.model, 'categoryRemoved', this.removeCategoryItem);
                this.listenTo(this.model, 'create-subcat', this.createSubcat);
                //this.listenTo(this.collection, 'add', this.renderSubcatsList);
            },

            render: function () {
                this.$el.append(this.template({
                    data: this.model.toJSON()
                }));
                this.renderSubcatsList();

                return this;
            },

            renderSubcatsList: function () {
                var self = this;
                this.$("[data-eid=add-subcats-list]").empty();

                this.collection.each(function (model) {
                    var subcategoryItemView = new SubcategoryItemView({
                        model: model
                    });
                    self.$("[data-eid=add-subcats-list]").append(subcategoryItemView.render().$el);
                });
            },

            createSubcat : function(args){
                var self = this;
                this.collection.create({
                    "name": args.name,
                    "parentId" : self.model.toJSON().id
                });
            },

            editItem: function () {
                Backbone.Events.trigger('removeActive', args);
                //передать модель в др вьюшку
                var args = {
                    model: this.model
                };
                Backbone.Events.trigger('editCat', args);
                self.$("[data-eid=edit-cat]").addClass('active');
                /*
                 Backbone.Events.trigger('editCat', {
                 model : self.model
                 });
                 */
                this.$("[data-eid=edit-block]").addClass("active");
            },

            addSubcat: function () {
                var self = this;
                Backbone.Events.trigger('removeActive', {
                    model: self.model
                });
                Backbone.Events.trigger('addSubcat', {
                    model: self.model
                });
                this.$("[data-eid=edit-block]").addClass("active");
                this.$("[data-eid=add-subcat]").addClass("active");
            },

            removeCategoryItem : function(){
                var self = this;
                this.collection.reset();
                this.model.destroy();
                Backbone.Events.trigger('cancelEditCat');

                $.when(this.$el.hide('100')).then(function(){
                    self.$el.empty();
                });
            }
        });

        return ExpenseCategoresItemView;
    });

