define(['backbone',
        'text!../templates/expenses.html',
        '../views/expenseRow',
        '../views/expenseEdit',
        'widgets/utils'
    ],
    function( Backbone,
              tpl,
              ExpenseRowView,
              ExpenseEditView,
              Utils
) {
    var ExpensesView = Backbone.View.extend({
        
        template : _.template( tpl ),

        events : {
            'click [data-eid=add-item]' : 'addItem'
        },

        initialize: function (options) {
            var self = this;
            this.storagesCollection = options.storagesCollection;
            this.fullCollection = options.fullCollection;
            this.getStoragesList();

            Backbone.Events.on('editExpense', function( args ){
                self.editExpense(args);
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
                if( self.$("[ data-eid = expenses-tbl ] tr").length == 1 ){
                    self.$(".table").hide();
                    self.$("[data-eid=no-expenses-found]").fadeIn(115);
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
            //this.listenTo(this.collection, 'remove', this.renderItemsList);
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
                    self.filterExpensesByDate(date);
                    Utils.setCookie("expenseSelectedDate", date, 1);
                    self.$("[data-eid=date]").val(date);
                }
            });
            var curDate = Utils.getCookie("expenseSelectedDate");
            if( curDate.length ) {
                this.$(".dateInput").datepicker("setDate", curDate);
                this.$("[data-eid=date]").val(curDate);
            } else {
                this.$("[data-eid=date]").val( $.datepicker.formatDate("dd.mm.yy", new Date()) );
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
            return this;
        },

        renderItemsList : function(){
            var self = this;

            $.when(this.$(".table").fadeOut(115)).then(function(){

                self.$("[ data-eid = expenses-tbl ] tr:gt(0)").empty().remove();

                if(self.collection.length) {
                    self.$(".table").fadeIn(115);
                    self.$("[data-eid=no-expenses-found]").hide();
                } else {
                    self.$(".table").hide();
                    self.$("[data-eid=no-expenses-found]").fadeIn(115);
                }
                self.collection.each(function (model) {
                    var expenseRowView = new ExpenseRowView({
                        model: model
                    });
                    var curViewEl = expenseRowView.render().el;
                    self.$("[ data-eid = expenses-tbl ] tr:last").after( curViewEl );
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

        showAddForm : function(){
            this.$("[data-eid=edit-form]").hide();
            this.$("[data-eid=add-form]").show();
        },

        addItem : function(){
            if( ! this.$("[data-eid=exp-form]").valid() ) return;

            var $storage = this.$("[data-eid=storage-name]:visible option:selected");

            this.fullCollection.create({
                "expenseAmmount": this.$("[data-eid=ammount]").val(),
                "expenseSource":  $storage.text(),
                "expenseDate":    this.$("[data-eid=date]").val(),
                "descr":          this.$("[data-eid=descr]").val(),
                "categoryName":   this.$("[data-eid=category-name]:visible option:selected").text(),
                "categoryId":     this.$("[data-eid=category-name]").val()
            });

            var storageId = $storage.val();
            var self = this;
            //списать с выбранного источника storage потраченное
            this.storagesCollection.each(function(storage){
                if(storage.toJSON().id == storageId) {
                    storage.save({
                        "currentBalance": storage.toJSON().currentBalance - self.$("[data-eid=ammount]").val()
                    });
                }
            });

            this.$("[data-eid=ammount]").val('');
            this.$("[data-eid=storage-name]").val('');
            //this.$("[data-eid=date]").val('');
            this.$("[data-eid=descr]").val('');
            this.$("[data-eid=category-name]").val('');
        },

        filterExpensesByDate : function(date){
            //TODO коллекцию трат получать с сервера отфильтрованную по дате
            var self = this;
            var filterType;
            this.fullCollection.each(function(){
                filterType = _.filter(self.fullCollection.models,function(item){
                    return item.get("expenseDate") == date;
                });
            });
            self.collection.reset(filterType);
            this.renderItemsList();
        },

        editExpense : function(args){
            this.$("[data-eid=add-form]").hide();
            this.$("[data-eid=edit-form]").show();
            var nmodel = args.model;
            nmodel.attributes.storageList = this.model.storageList;
            nmodel.attributes.expenseCategories = this.model.expenseCategories;
            var expenseEditView = new ExpenseEditView({
                model: nmodel
            });
            this.$("[ data-eid=edit-form ]").empty().append( expenseEditView.render().$el );
        },

        onCollectionChange : function(model){
            var expenseDate = model.toJSON().expenseDate;
            this.filterExpensesByDate( expenseDate );
            this.$(".dateInput").datepicker("setDate", expenseDate );
            this.$("[data-eid=date]").val( expenseDate );
        }

    });
    
    return ExpensesView;
});

