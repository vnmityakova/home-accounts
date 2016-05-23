define(['backbone', 'text!../../templates/summary/card.html', '../../../utils'],
    function (Backbone, tpl, Utils) {

        var CardSummaryView = Backbone.View.extend({

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
                var nModel = this.model.toJSON();
                if (nModel.isCredit) {
                    nModel.cardType = "Кредитная";
                } else {
                    nModel.cardType = "Дебетовая";
                }

                //вывести summary по конкретному объекту (карте)
                this.$el.empty().append(this.template({
                    data: nModel,
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
                if( ! this.$("[data-eid=card-form-edit]").valid() ) return;

                var self = this;
                $.when(this.$("[data-eid=edit-form]").toggle(200)).done(function () {
                    self.model.save({
                        "storageName": self.$("[data-eid=name]").val(),
                        "currentBalance": self.$("[data-eid=balance]").val(),
                        "bankName": self.$("[data-eid=bank-name]").val(),
                        "isCredit": false,
                        "mayBeSpent": true
                    });
                });
            },

            removeItem : function () {
                this.model.destroy();
                this.$el.toggle(200);
            }
        });

        return CardSummaryView;
    });
