define(['backbone',
    'widgets/expenses/models/expenses',
    'widgets/expenses/views/expenses',
    'widgets/expenses/collections/collection',
    'widgets/incomings/models/incomings',
    'widgets/incomings/views/incomings',
    'widgets/incomings/collections/collection',
    'widgets/storages/views/categories',
    'widgets/storages/models/item',
    'widgets/storages/collections/categories',
    'widgets/currentState/views/current',
    'widgets/incomingsCategories/views/incomingsCategory',
    'widgets/incomingsCategories/models/incomingsCategory',
    'widgets/incomingsCategories/collections/incomingsCategory',
    'widgets/menu/views/menu',
    'widgets/utils',
    'widgets/expenseCategories/views/expenseCategories',
    'widgets/expenseCategories/models/expenseCategories',
    'widgets/expenseCategories/collections/expenseCategories',
    'widgets/storages/collections/cards',
    'widgets/storages/collections/wallets',
    'widgets/storages/collections/deposits',
    'widgets/storages/collections/safes',
    'widgets/expenseCategories/collections/expenseSubCategories',
    'jquery-ui',
    'jquery-validation'

], function (Backbone,
             ExpensesModel,
             ExpensesView,
             ExpensesCollection,
             IncomingsModel,
             IncomingsView,
             IncomingsCollection,
             StoragesView,
             StoragesModel,
             StoragesCollection,
             CurrentView,
             IncomingsCategoryView,
             IncomingsCategoryModel,
             IncomingsCategoryCollection,
             MenuView,
             Utils,
             ExpenseCategoriesView,
             ExpenseCategoriesModel,
             ExpenseCategoriesCollection,
             CardsCollection,
             WalletsCollection,
             DepositsCollection,
             SafesCollection,
             ExpenseSubCategoriesCollection) {

    var AppRouter = Backbone.Router.extend({

        routes: {
            "": "showCurrent",
            "current": "showCurrent",
            "expenses": "showExpenses",
            "incomings": "showIncomings",
            "storages": "showStorages",
            "incomings-categories": "showIncomingsCategory",
            "expenses-categories": "showExpenseCategories"
        },

        initialize: function () {

            /*this.on("route", function(route, params) {
             console.log("Different Page: " + route);
             Backbone.Events.trigger('pageChanged', []);
             });*/
            this.menu = new MenuView({
                el: "[data-eid=menu-block]"
            });

            this.expensesModel = new ExpensesModel();
            this.expensesCollection = new ExpensesCollection();

            this.incomingsModel = new IncomingsModel();
            this.incomingsCollection = new IncomingsCollection();

            this.storagesModel = new StoragesModel();
            this.storagesCollection = new StoragesCollection();

            this.incomingsCategoryModel = new IncomingsCategoryModel();
            this.incomingsCategoryCollection = new IncomingsCategoryCollection();

            this.expenseCategoriesModel = new ExpenseCategoriesModel();
            this.expenseCategoriesCollection = new ExpenseCategoriesCollection();

            Utils.localizeDatepicker();
            Utils.addValidationMethods();

            this.setDefaultIncomingCategories();
            this.setDefaultExpenseCategories();
            this.setDefaultStorageCategories();
            this.setDefaultStorageSubcats();
        },

        showCurrent: function ()  {
            var self = this;
            var curDeffered = [];
            var storagesCollection = new Backbone.Collection();

            curDeffered.push( this.fetchAllStorages(storagesCollection));
            curDeffered.push( this.fetchCollection(this.expensesCollection) );
            curDeffered.push( this.fetchCollection(this.incomingsCollection) );

            var today = new Date();
            var curDate = $.datepicker.formatDate("dd.mm.yy", today);
            var monthAgoDate = new Date( today.setMonth(today.getMonth() - 1) );

            this.expensesCollection = this.filterCollectionByPeriod(this.expensesCollection, "expenseDate", monthAgoDate);
            this.incomingsCollection = this.filterCollectionByPeriod(this.incomingsCollection, "incomingDate", monthAgoDate);

            $.when.apply($, curDeffered).done(function () {
                self.currentPage = new CurrentView({
                    model:               self.storagesModel,
                    collection:          storagesCollection,
                    expensesCollection:  self.expensesCollection,
                    incomingsCollection: self.incomingsCollection
                });
                $(".content").empty().append(self.currentPage.render().$el);
                Backbone.Events.trigger('current-page-appended');
            });
        },

        showIncomingsCategory: function () {
            var self = this;

            this.fetchCollection(this.incomingsCategoryCollection).then(function(){
                self.incomingsCategoryPage = new IncomingsCategoryView({
                    model: self.incomingsCategoryModel,
                    collection: self.incomingsCategoryCollection
                });
                $(".content").empty().append( self.incomingsCategoryPage.render().$el );
            });
        },

        showExpenseCategories: function () {
            var self = this;

            this.fetchCollection(this.expenseCategoriesCollection).then(function(){
                var deferredList = [];
                var subcatCollections = [];
                var curSubcatCollection;
                self.expenseCategoriesCollection.each(function (model) {
                    curSubcatCollection = new ExpenseSubCategoriesCollection([], {parId: model.id});
                    self.setDefaultExpenseSubCategory(model.id, curSubcatCollection);
                    deferredList.push(curSubcatCollection.fetch());
                    subcatCollections[model.id] = curSubcatCollection;
                });

                $.when.apply($, deferredList).done(function () {
                    self.expenseCategoriesView = new ExpenseCategoriesView({
                        model:             self.expenseCategoriesModel,
                        collection:        self.expenseCategoriesCollection,
                        subcatCollections: subcatCollections
                    });
                    $(".content").empty().append( self.expenseCategoriesView.render().$el );

                });
            });
        },

        showExpenses: function () {
            var self = this;
            var deferredList = [];
            var storagesCollection = new Backbone.Collection();
            deferredList.push(this.fillExpenseCategoriesList());
            deferredList.push(this.fetchCollection(this.expensesCollection));
            deferredList.push.apply(deferredList, this.fetchAllStorages(storagesCollection));

            $.when.apply($, deferredList).done(function () {
                self.expensesPage = new ExpensesView({
                    model:              self.expensesModel,
                    collection:         self.filterCollectionByDate(self.expensesCollection, "expense"),
                    fullCollection:     self.expensesCollection,
                    storagesCollection: storagesCollection
                });
                //TODO коллекцию трат получать с сервера отфильтрованную по дате
                $(".content").empty().append( self.expensesPage.render().$el );
            });
        },

        showIncomings: function () {
            var self = this;
            var deferredList = [];
            var storagesCollection = new Backbone.Collection();
            deferredList.push(this.getIncomingSourcesList());
            deferredList.push(this.fetchCollection(this.incomingsCollection));
            deferredList.push.apply(deferredList, this.fetchAllStorages(storagesCollection));

            $.when.apply($, deferredList).done(function () {
                self.incomingsPage = new IncomingsView({
                    model:              self.incomingsModel,
                    collection:         self.filterCollectionByDate(self.incomingsCollection, "incoming"),
                    fullCollection:     self.incomingsCollection,
                    storagesCollection: storagesCollection
                });
                //TODO коллекцию трат получать с сервера отфильтрованную по дате
                $(".content").empty().append( self.incomingsPage.render().$el );
            });
        },

        showStorages: function () {
            var self = this;
            var subcatCollections = [];
            var deferredList = [];

            this.fetchCollection(this.storagesCollection).then(function(){
                $.each(self.SOURCES_SUBCATS_MAP, function (index, sourceTypeCollection) {
                    deferredList[index] = self.fetchCollection(sourceTypeCollection).then(function () {
                        subcatCollections[index] = sourceTypeCollection;
                    });
                });

                $.when.apply($, deferredList).done(function () {
                    self.storagesPage = new StoragesView({
                        model: self.storagesModel,
                        collection: self.storagesCollection,
                        subcatCollections: subcatCollections
                    });
                    $(".content").empty().append( self.storagesPage.render().$el );
                });

            });

        },

        /* ================================================ utils ====================================================*/

        SOURCES_SUBCATS_MAP: {
            0: new WalletsCollection(),
            1: new CardsCollection(),
            2: new DepositsCollection(),
            3: new SafesCollection()
        },

        fetchCollection : function(collection){
            var deferredObj = $.Deferred();
            if( collection.length ){
                return deferredObj.resolve();
            } else {
                return collection.fetch();
            }
        },

        //список на что можно потратить (категорий трат)
        fillExpenseCategoriesList: function () {
            var self = this;
            this.expenseCategoriesCollection = new ExpenseCategoriesCollection();
            this.expensesModel.expenseCategories = [];
            var curSubcat;

            return this.fetchCollection(this.expenseCategoriesCollection).then(function () {
                self.expenseCategoriesCollection.each(function (model) {
                    self.expensesModel.expenseCategories.push({
                        name: model.toJSON().name,
                        id: model.toJSON().id,
                        isParent: true
                    });
                    curSubcat = new ExpenseSubCategoriesCollection([], {parId: model.toJSON().id});
                    self.setDefaultExpenseSubCategory(model.toJSON().id, curSubcat);
                    curSubcat.fetch().then( self.getExpenseCategories(curSubcat, self.expensesModel) );
                });
            });
        },

        getExpenseCategories: function (subcatCol, curModel) {
            subcatCol.each(function (model) {
                curModel.expenseCategories.push({
                    name: model.toJSON().name,
                    id: model.toJSON().id,
                    isParent: false
                });
            });
        },

        getIncomingSourcesList : function(){
            var self = this;
            this.incomingsModel.sources = [];

            return this.fetchCollection(this.incomingsCategoryCollection).then( function(){
                self.incomingsCategoryCollection.each(function (model) {
                    self.incomingsModel.sources.push({
                        name: model.toJSON().name,
                        id:   model.toJSON().id
                    });
                });
            });

        },

        fetchAllStorages : function(storagesCollection){
            //var storagesCollection = new Backbone.Collection();
            var self = this;
            var curDeffered = [];

            $.each(this.SOURCES_SUBCATS_MAP, function (index, collection) {
                var sourceTypeCollection = collection;

                curDeffered[index] = self.fetchCollection(sourceTypeCollection).then( function(){
                    sourceTypeCollection.each(function (storageModel) {
                        storagesCollection.add(storageModel);
                    });
                });
            });

            return curDeffered;

        },

        filterCollectionByPeriod: function(collection, dateFldName, startDate, endDate){
            if( ! endDate ) endDate = new Date();
            endDate.setHours(0,0,0,0);
            startDate.setHours(0,0,0,0);

            var filterType;
            collection.each(function(){
                filterType = _.filter(collection.models,function(model){
                    var itemDate = $.datepicker.parseDate('dd.mm.yy', model.toJSON()[dateFldName]);
                    return +itemDate >= +startDate && +itemDate <= +endDate;
                });
            });
            collection.reset(filterType);

            return collection;
        },

        filterCollectionByDate: function(collection, prefix){
            var todayCollection;
            if(prefix == "expense") {
                todayCollection = new ExpensesCollection();
            } else {
                todayCollection = new IncomingsCollection();
            }

            var curDate;
            var prevDate = Utils.getCookie(prefix + "SelectedDate");
            if( prevDate.length ){
                curDate = prevDate;
            } else {
                curDate = $.datepicker.formatDate("dd.mm.yy", new Date());
            }
            collection.each( function( model ){
                if( model.toJSON()[prefix + "Date"] == curDate ) {
                    todayCollection.add(model);
                }
            });
            return todayCollection;
        },

        /* ====================================== set default data to localstorage ===================================*/

        setDefaultStorageCategories : function(){
            //добавить категории по умолчанию
            if( !localStorage.storages ) {
                this.storagesCollection.create({
                    "storageTypeId": "0",
                    "storageTypeName": "Кошельки"
                });
                this.storagesCollection.create({
                    "storageTypeId": "1",
                    "storageTypeName": "Карты"
                });
                this.storagesCollection.create({
                    "storageTypeId": "2",
                    "storageTypeName": "Вклады"
                });
                this.storagesCollection.create({
                    "storageTypeId": "3",
                    "storageTypeName": "Сейфы"
                });
            }
        },

        setDefaultIncomingCategories : function() {
            //добавить категории по умолчанию
            if (!localStorage.incomingCategories) {
                this.incomingsCategoryCollection.create({
                    "name": "Зарплата"
                });
                this.incomingsCategoryCollection.create({
                    "name": "Аутсорсинг"
                });
                this.incomingsCategoryCollection.create({
                    "name": "Подарки"
                });
                this.incomingsCategoryCollection.create({
                    "name": "Фриланс"
                });
            }
        },

        setDefaultExpenseCategories : function(){
            //добавить категории по умолчанию
            if( !localStorage.expenseCategories ) {
                this.expenseCategoriesCollection.create({
                    "id": "0",
                    "name": "Питание"
                });
                this.expenseCategoriesCollection.create({
                    "id": "3",
                    "name": "Развлечения"
                });
                this.expenseCategoriesCollection.create({
                    "id": "7",
                    "name": "Спорт"
                });
                this.expenseCategoriesCollection.create({
                    "id": "10",
                    "name": "Здоровье"
                });
                this.expenseCategoriesCollection.create({
                    "id": "13",
                    "name": "ЖКХ"
                });
                this.expenseCategoriesCollection.create({
                    "id": "16",
                    "name": "Машина"
                });
                this.expenseCategoriesCollection.create({
                    "id": "20",
                    "name": "Кредиты"
                });
            }
        },

        setDefaultExpenseSubCategory: function (modelId, subcatCollection) {
            switch (modelId) {
                case '0':
                    if (!localStorage['expenseSubcat(' + modelId + ')']) {
                        subcatCollection.create({
                            "id": 1,
                            "parentId": 0,
                            "name": "Обеды на работе"
                        });
                        subcatCollection.create({
                            "id": 2,
                            "parentId": 0,
                            "name": "Продукты домой"
                        });
                    }
                    break;
                case '3':
                    if (!localStorage['expenseSubcat(' + modelId + ')']) {
                        subcatCollection.create({
                            "name": "Кафе",
                            "parentId": 3
                        });
                        subcatCollection.create({
                            "name": "Подарки",
                            "parentId": 3
                        });
                        subcatCollection.create({
                            "name": "Прочее",
                            "parentId": 3
                        });
                    }
                    break;
                case '7':
                    if (!localStorage['expenseSubcat(' + modelId + ')']) {
                        subcatCollection.create({
                            "name": "Абонемент фитнес",
                            "parentId": 7
                        });
                        subcatCollection.create({
                            "name": "Спорттовары",
                            "parentId": 7
                        });
                    }
                    break;
                case '10':
                    if (!localStorage['expenseSubcat(' + modelId + ')']) {
                        subcatCollection.create({
                            "id": 11,
                            "name": "Консультации врачей",
                            "parentId": 10
                        });
                        subcatCollection.create({
                            "id": 12,
                            "name": "Медикаменты",
                            "parentId": 10
                        });
                    }
                    break;
                case '13':
                    if (!localStorage['expenseSubcat(' + modelId + ')']) {
                        subcatCollection.create({
                            "id": 14,
                            "name": "Квартплата",
                            "parentId": 13
                        });
                        subcatCollection.create({
                            "id": 15,
                            "name": "Паркинг",
                            "parentId": 13
                        });
                    }
                    break;
                case '16':
                    if (!localStorage['expenseSubcat(' + modelId + ')']) {
                        subcatCollection.create({
                            "id": 17,
                            "name": "ТО",
                            "parentId": 16
                        });
                        subcatCollection.create({
                            "id": 18,
                            "name": "Ремонт",
                            "parentId": 16
                        });
                        subcatCollection.create({
                            "id": 19,
                            "name": "Мойка",
                            "parentId": 16
                        });
                    }
                    break;
            }
        },

        setDefaultStorageSubcats : function(){
            if( !localStorage.wallets ) {
                this.SOURCES_SUBCATS_MAP[0].create({
                    "storageName": "Мой кошелек",
                    "currentBalance": 1500,
                    "storageTypeId": 0,
                    "storageTypeName": "Кошельки",
                    "mayBeSpent": true
                });
                this.SOURCES_SUBCATS_MAP[0].create({
                    "storageName": "Кошелек запасной",
                    "currentBalance": 2500,
                    "storageTypeId": 0,
                    "storageTypeName": "Кошельки",
                    "mayBeSpent": true
                });
            }
            if( !localStorage.cards) {
                this.SOURCES_SUBCATS_MAP[1].create({
                    "storageName": "Карта зарплатная",
                    "bankName": "ПромСвязьБанк",
                    "isCredit": false,
                    "currentBalance": 12000,
                    "storageTypeId": 1,
                    "storageTypeName": "Карты",
                    "mayBeSpent": true
                });
                this.SOURCES_SUBCATS_MAP[1].create({
                    "storageName": "Карта кредитная",
                    "bankName": "ПромСвязьБанк",
                    "isCredit": true,
                    "creditLimit": 150000,
                    "currentBalance": 80000,
                    "storageTypeId": 1,
                    "storageTypeName": "Карты",
                    "mayBeSpent": true
                });
            }

            if( !localStorage.deposits) {
                this.SOURCES_SUBCATS_MAP[2].create({
                    "storageName": "Свободные деньги",
                    "bankName": "ПромСвязьБанк",
                    "currentBalance": 30000,
                    "startDate": "10.10.2015",
                    "endDate": "10.03.2016",
                    "percent": 10.5,
                    "storageTypeId": 2,
                    "storageTypeName": "Вклады",
                    "mayBeSpent": true
                });
            }
            if( !localStorage.safes) {
                this.SOURCES_SUBCATS_MAP[3].create({
                    "storageName": "Сейф домашний",
                    "currentBalance": 10000,
                    "storageTypeId": 3,
                    "storageTypeName": "Сейфы",
                    "mayBeSpent": true
                });
            }
        }

    });

    return AppRouter;
});