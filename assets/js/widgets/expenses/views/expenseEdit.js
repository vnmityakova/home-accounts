define(['backbone', 'text!../templates/expenseEdit.html'], function (Backbone, tpl) {
    var ExpenseRowView = Backbone.View.extend({

        template: _.template(tpl),

        initialize: function (options) {
        },

        events: {
            "click [data-eid=cancel-edit]" : 'cancelEdit',
            'click [data-eid=save]': 'saveEditedItem'
        },

        render: function () {
            this.$el.empty().append(this.template({
                data: this.model.toJSON()
            }));

            this.$(".date-fld").datepicker({
                dateFormat: "dd.mm.yy",
                firstDay: 1,
                prevText: "",
                nextText: "",
                showOn: "button",
                buttonImage: "assets/img/icon_calendar.svg",
                buttonImageOnly: true,
                buttonText: "Select date"
            });

            return this;
        },

        saveEditedItem: function () {
            if( ! this.$("[data-eid=exp-edit-form]").valid() ) return;

            this.model.save({
                "expenseAmmount": this.$("[data-eid=ammount]").val(),
                "expenseSource":  this.$("[data-eid=storage-name] option:selected").text(),
                "expenseDate":    this.$("[data-eid=date]").val(),
                "descr":          this.$("[data-eid=descr]").val(),
                "categoryName":   this.$("[data-eid=category-name] option:selected").text()
            });
            Backbone.Events.trigger('showAddForm');
        },

        cancelEdit : function () {
            Backbone.Events.trigger('cancelEdit');
        }
    });

    return ExpenseRowView;
});
