define(['backbone', 'text!../templates/editForm.html'],
    function (Backbone, tpl) {

        var EditFormView = Backbone.View.extend({
            template: _.template(tpl),

            events: {
                'click [data-eid=cancel-edit]': 'cancelEdit',
                'click [data-eid=save]': 'saveEditedItem'
            },

            initialize: function (options) {

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
                if( ! this.$("[data-eid=inc-edit-form]").valid() ) return;

                this.model.save({
                    "incomingAmmount": this.$("[data-eid=ammount]").val(),
                    "storageName":     this.$("[data-eid=storage-name] option:selected").text(),
                    "incomingDate":    this.$("[data-eid=date]").val(),
                    "descr":           this.$("[data-eid=descr]").val(),
                    "categoryName":    this.$("[data-eid=category-name] option:selected").text()/*,
                    "justAdded":       true*/
                });
                Backbone.Events.trigger('showAddForm');
            },

            cancelEdit: function () {
                //Backbone.Events.trigger('showAddForm');
                Backbone.Events.trigger('cancelEdit');
            }
        });

        return EditFormView;
    });
