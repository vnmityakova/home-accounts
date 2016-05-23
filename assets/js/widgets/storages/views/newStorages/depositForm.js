define(['backbone', 'text!../../templates/newStorages/depositForm.html'], function(Backbone, tpl) {
    var DepositFormView = Backbone.View.extend({

        template: _.template(tpl),

        events: {
            'click [data-eid=cancel-edit]' : "cancelEdit",
            "click [data-eid=add-item]" : "addItem"
        },

        initialize: function(options) {

        },

        render: function() {
            this.$el.empty().append(this.template());
            return this;
        },

        cancelEdit: function(){
            this.$("[data-eid=new-item]").hide(200);
        },

        //добавить новый в список
        addItem : function(){
            if( ! this.$("[data-eid=deposit-form]").valid() ) return;

            this.collection.create({
                "currentBalance": this.$("[data-eid=item-balance]").val(),
                "storageName": this.$("[data-eid=item-name]").val(),
                "bankName": this.$("[data-eid=bank-name]").val(),
                "mayBeSpent": true,
                "startDate" : this.$("[data-eid=start-date]").val(),
                "endDate" : this.$("[data-eid=end-date]").val(),
                "percent": this.$("[data-eid=percent]").val()
            });

            this.$("[data-eid=new-item]").hide(200);
            this.$("[data-eid=item-balance]").val('');
            this.$("[data-eid=item-name]").val('');
            this.$("[data-eid=bank-name]").val('');
            this.$("[data-eid=start-date]").val('');
            this.$("[data-eid=end-date]").val('');
            this.$("[data-eid=percent]").val('');
        }

    });

    return DepositFormView;

});