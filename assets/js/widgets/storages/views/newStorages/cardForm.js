define(['backbone', 'text!../../templates/newStorages/cardForm.html'], function(Backbone, tpl) {
    var CardFormView = Backbone.View.extend({

        template: _.template(tpl),

        events: {
            "click [data-eid=cancel-edit]" : "cancelEdit",
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

        //добавить новый в список всех кошельков
        addItem : function(){
            if( ! this.$("[data-eid=card-form]").valid() ) return;
            /*this.model.set("currentBalance", this.$("[data-eid=item-balance]").val() );*/
            this.collection.create({
                "currentBalance": this.$("[data-eid=item-balance]").val(),
                "storageName": this.$("[data-eid=item-name]").val(),
                "bankName": self.$("[data-eid=bank-name]").val(),
                "isCredit": false,
                "mayBeSpent": true
            });
            this.$("[data-eid=new-item]").hide(200);
            this.$("[data-eid=item-balance]").val('');
            this.$("[data-eid=item-name]").val('');
        }

    });

    return CardFormView;

});