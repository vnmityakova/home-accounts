define(['backbone', 'text!../templates/expenseRow.html', '../../utils'], function (Backbone, tpl, Utils) {
    var ExpenseRowView = Backbone.View.extend({

        template: _.template(tpl),

        events : {
            'click [data-eid=edit-link]' : 'editExpense',
            'click [data-eid=remove]': 'removeItem'
        },

        tagName: "tr",

        initialize: function (options) {
            var self = this;
            Backbone.Events.on('cancelEdit', function( args ){
                self.$("[data-eid=edit-link]").removeClass("active");
            });

            Backbone.Events.on('showAddForm', function( args ){
                self.$("[data-eid=edit-link]").removeClass("active");
            });
        },

        render: function () {
            this.$el.empty().append(this.template({
                data: this.model.toJSON(),
                Utils: Utils
            }));
            return this;
        },

        editExpense: function (evt) {
            Backbone.Events.trigger('cancelEdit');
            evt.preventDefault();
            var args = {
                model : this.model
            };
            this.$("[data-eid=edit-link]").addClass("active");
            Backbone.Events.trigger('editExpense', args);
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

    return ExpenseRowView;
});

