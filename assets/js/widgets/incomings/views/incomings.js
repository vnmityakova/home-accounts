define(['backbone',
        'text!../templates/incomings.html',
        '../views/incomingRow',
        '../views/editForm',
        'widgets/utils'],
    function(Backbone,
             tpl,
             IncomingRowView,
             EditView,
             Utils) {

    var IncomingsView = Backbone.View.extend({

        template : _.template( tpl ),

        events : {
            'click [data-eid=add-item]' : 'addItem'
        },

        initialize: function( options ) {
            var self = this;
            this.storagesCollection = options.storagesCollection;
            this.fullCollection = options.fullCollection;
            this.getStoragesList();

            Backbone.Events.on('editIncoming', function( args ){
                self.editIncoming(args);
            });

            Backbone.Events.on('cancelEdit', function(){
                self.$("[data-eid=edit-form]").hide();
                self.$("[data-eid=add-form]").show();
            });

            Backbone.Events.on('showAddForm', function(){
                self.showAddForm();
            });

            Backbone.Events.on('item-removed', function(){
                //прятать таблицу после удаления эл-тов, если только заголовок остался
                if( self.$("[ data-eid = incomings-tbl ] tr").length == 1 ){
                    self.$(".table").hide();
                    self.$("[data-eid=no-incomings-found]").fadeIn(115);
                }
            });

            //add & edit
            this.listenTo(this.fullCollection, 'change', function(model){
                self.onCollectionChange(model);
            });

            /*this.listenTo(this.fullCollection, 'add', function(model){
                self.onCollectionChange(model);
            });*/

            //this.listenTo(this.collection, 'reset', this.renderItemsList);
        },

        render: function () {
            var self = this;

            this.$el.empty().append(this.template({
                data: this.model
            }));

            this.$(".dateInput").datepicker({
                dateFormat: "dd.mm.yy",
                firstDay: 1,
                prevText: "",
                nextText: "",
                onSelect : function(date, dp){
                    self.filterIncomingsByDate(date);
                    Utils.setCookie("incomingSelectedDate", date, 1);
                    self.$("[data-eid=date]").val(date);
                }
            });

            var curDate = Utils.getCookie("incomingSelectedDate");
            if( curDate.length ) {
                this.$(".dateInput").datepicker("setDate", curDate);
                this.$("[data-eid=date]").val(curDate);
            } else {
                this.$("[data-eid=date]").val($.datepicker.formatDate("dd.mm.yy", new Date()));
            }

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

            this.renderItemsList();


            this.$("#myform").validate({
                focusInvalid: false/*,
                onfocusout: false*/
            });


            return this;
        },

        renderItemsList : function(){
            var self = this;

            $.when(this.$(".table").fadeOut(115)).then(function(){

                self.$("[ data-eid = incomings-tbl ] tr:gt(0)").empty().remove();

                if(self.collection.length) {
                    self.$(".table").fadeIn(115);
                    self.$("[data-eid=no-incomings-found]").hide();
                } else {
                    self.$(".table").hide();
                    self.$("[data-eid=no-incomings-found]").fadeIn(115);
                }
                self.collection.each(function (model) {
                    var incomingRowView = new IncomingRowView({
                        model: model
                    });
                    var curViewEl = incomingRowView.render().el;
                    self.$("[ data-eid = incomings-tbl ] tr:last").after( curViewEl );
                });

            });
        },

        getStoragesList : function(){
            var self = this;
            this.model.storageList = [];
            this.storagesCollection.each(function(storage){
                self.model.storageList.push({
                    name: storage.toJSON().storageName,
                    id: storage.toJSON().id
                })
            });
        },

        addItem : function(){
            if( ! this.$("[data-eid=inc-form]").valid() ) return;

            var $storage = this.$("[data-eid=storage-name]:visible option:selected");
            var storageId = $storage.val();
            var $cat = this.$("[data-eid=category-name]:visible option:selected");

            this.fullCollection.create({
                "incomingAmmount": this.$("[data-eid=ammount]").val(),
                "storageName":     $storage.text(),
                "incomingDate":    this.$("[data-eid=date]").val(),
                "descr":           this.$("[data-eid=descr]").val(),
                "categoryName":    this.$("[data-eid=category-name]:visible option:selected").text(),
                "categoryId":      $cat.val()/*,
                "justAdded":       true*/
            });

            //добавить в выбранный источник storage доход
            this.storagesCollection.each(function(storage){
                if(storage.toJSON().id == storageId) {
                    storage.save({
                        "currentBalance": storage.toJSON().currentBalance + Number(self.$("[data-eid=ammount]").val())
                    });
                }
            });

            this.$("[data-eid=ammount]").val('');
            this.$("[data-eid=storage-name]").val('');
            //this.$("[data-eid=date]").val('');
            this.$("[data-eid=descr]").val('');
            this.$("[data-eid=category-name]").val('')
        },

        showAddForm : function(){
            this.$("[data-eid=edit-form]").hide();
            this.$("[data-eid=add-form]").show();
        },

        filterIncomingsByDate : function(date){
            //TODO коллекцию трат получать с сервера отфильтрованную по дате
            var self = this;
            var filterType;
            this.fullCollection.each(function(){
                filterType = _.filter(self.fullCollection.models,function(item){
                    return item.get("incomingDate") == date;
                });
            });
            this.collection.reset(filterType);
            this.renderItemsList();
        },

        editIncoming : function( args ){
            this.$("[data-eid=add-form]").hide();
            this.$("[data-eid=edit-form]").show();
            var nmodel = args.model;
            nmodel.attributes.storageList = this.model.storageList;
            nmodel.attributes.sources = this.model.sources;
            var editView = new EditView({
                model: nmodel
            });
            this.$("[ data-eid=edit-form ]").empty().append( editView.render().$el );
        },

        onCollectionChange : function(model){
            var incomingDate = model.toJSON().incomingDate;
            this.filterIncomingsByDate( incomingDate );
            this.$(".dateInput").datepicker("setDate", incomingDate );
            this.$("[data-eid=date]").val( incomingDate );
        }

    });
    
    return IncomingsView;
});

/* дергается тк при обновлении fullcollection дергается еще и change для просто коллекции, тк в них одни и те же модели
 * но клонировать тоже не могу, тк иначе не будет редактироваться */