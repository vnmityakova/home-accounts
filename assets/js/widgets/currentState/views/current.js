define(['backbone', 'text!../templates/current.html', '../views/currentStorageItem',
    '../views/currentExpenses', '../views/currentIncomings', '../../utils'],
    function(Backbone, tpl, CurrentStorageItem, CurrentExpenses, CurrentIncomings, Utils) {

    var CurrentView = Backbone.View.extend({

        template : _.template( tpl ),

        initialize: function( options ) {
            this.expensesCollection = options.expensesCollection;
            this.incomingsCollection = options.incomingsCollection;

            /*Backbone.Events.on('current-page-appended', function(){
                self.currentExpenses.renderChart();
            });*/
        },

        render: function () {
            this.$el.empty().append(this.template());
            this.renderStorageItems();

            if (this.expensesCollection.length) {
                var currentExpenses = new CurrentExpenses({
                    collection: this.expensesCollection
                });
                this.$("[data-eid=cur-expenses]").empty().append(currentExpenses.render().$el);
            }

            if( this.incomingsCollection.length ) {
                var currentIncomings = new CurrentIncomings({
                    collection: this.incomingsCollection
                });
                this.$("[data-eid=cur-incomings]").empty().append(currentIncomings.render().$el);
            }

            return this;
        },

        renderStorageItems: function () {
            var summary = 0;
            var self = this;

            this.collection.each(function (model) {
                var currentStorageItem = new CurrentStorageItem({
                    model: model
                });
                summary += +model.toJSON().currentBalance;
                //вьюшка на каждую из карт
                self.$("[data-eid=storage-items]").append(currentStorageItem.render().$el);
            });
            self.$("[data-eid=summary]").empty().append(Utils.addSpacesToSum(summary) + " руб.");

        }
    });

    return CurrentView;
});
