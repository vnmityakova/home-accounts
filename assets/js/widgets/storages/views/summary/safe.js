define(['backbone', 'text!../../templates/summary/safe.html', '../../../utils'],
    function (Backbone, tpl, Utils) {

        var SafeSummaryView = Backbone.View.extend({

            template: _.template(tpl),

            events: {
                'click [data-eid=link]': 'showEditForm',
                'click [data-eid=save]': 'saveEditedItem',
                'click [data-eid=remove]': 'removeItem'
            },

            initialize: function (options) {
                //перерисовать после изменения
                this.listenTo(this.model, 'change', this.render);
            },

            render: function () {
                //вывести данные по конкретному объекту (карте)
                this.$el.empty().append(this.template({
                    data: this.model.toJSON(),
                    Utils: Utils
                }));
                return this;
            },

            showEditForm: function (e) {
                e.preventDefault();
                this.$("[data-eid=edit-block]").toggleClass("active");
                this.$(".glyphicon-pencil").toggleClass("active");
                this.$("[data-eid=edit-form]").toggle(200);
            },

            saveEditedItem: function () {
                if( ! this.$("[data-eid=safe-edit-form]").valid() ) return;

                var self = this;
                $.when(this.$("[data-eid=edit-form]").toggle(200)).done(function () {
                    self.model.save({
                        storageName: self.$("[data-eid=name]").val(),
                        "currentBalance": self.$("[data-eid=balance]").val()
                    });
                });
            },

            removeItem : function () {
                this.model.destroy();
                this.$el.toggle(200);
            }

        });

        return SafeSummaryView;
    });
