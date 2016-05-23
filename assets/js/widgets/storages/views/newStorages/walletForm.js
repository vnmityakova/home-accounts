define(['backbone', 'text!../../templates/newStorages/walletForm.html'], function(Backbone, tpl) {
    var WalletFormView = Backbone.View.extend({

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
            /*this.model.set("currentBalance", this.$("[data-eid=item-balance]").val() );*/

            if( ! this.$("[data-eid=wallet-form]").valid() ) return;

            this.collection.create({
                "currentBalance": this.$("[data-eid=item-balance]").val(),
                "storageName": this.$("[data-eid=item-name]").val(),
                "mayBeSpent": true
            });
            this.$("[data-eid=new-item]").hide(200);
            this.$("[data-eid=item-balance]").val('');
            this.$("[data-eid=item-name]").val('');
        }

    });

    return WalletFormView;

});