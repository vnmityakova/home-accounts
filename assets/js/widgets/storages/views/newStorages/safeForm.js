define(['backbone', 'text!../../templates/newStorages/safeForm.html'], function(Backbone, tpl) {
    var SafeFormView = Backbone.View.extend({

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

        //добавить новый item в список
        addItem : function(){
            if( ! this.$("[data-eid=safe-form]").valid() ) return;

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

    return SafeFormView;

});