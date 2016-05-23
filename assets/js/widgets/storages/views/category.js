define(['backbone',
        'text!../templates/category.html',
        '../views/newStorages/cardForm',
        '../views/newStorages/depositForm',
        '../views/newStorages/safeForm',
        '../views/newStorages/walletForm',
        '../views/summary/wallet',
        '../views/summary/card',
        '../views/summary/deposit',
        '../views/summary/safe',
        '../collections/wallets',
        '../collections/cards',
        '../collections/deposits',
        '../collections/safes'],
    function (Backbone,
              tpl,
              CardFormView,
              DepositFormView,
              SafeFormView,
              WalletFormView,
              WalletSummaryView,
              CardSummaryView,
              DepositSummaryView,
              SafeSummaryView,
              WalletCollection,
              CardCollection,
              DepositCollection,
              SafeCollection) {

        var StorageTypeDataView = Backbone.View.extend({

            template: _.template(tpl),

            className: "storageTypeBlock",

            /*COLLECTION_MAP: {
                0: WalletCollection,
                1: CardCollection,
                2: DepositCollection,
                3: SafeCollection
            },*/

            VIEW_SUMMARY_MAP: {
                0: WalletSummaryView,
                1: CardSummaryView,
                2: DepositSummaryView,
                3: SafeSummaryView
            },

            VIEW_NEW_ITEM_MAP: {
                0: WalletFormView,
                1: CardFormView,
                2: DepositFormView,
                3: SafeFormView
            },

            events: {
                'click [data-eid=add-storage-item]': 'showAddForm'
            },

            /*setDefaultItems : function(){
                //добавить категории по умолчанию
                if( !localStorage.wallets && this.typeId == 0 ) {
                    this.collection.create({
                        "storageName": "Мой кошелек",
                        "currentBalance": 1500,
                        "storageTypeId": 0,
                        "storageTypeName": "Кошельки",
                        "mayBeSpent": true
                    });
                    this.collection.create({
                        "storageName": "Кошелек запасной",
                        "currentBalance": 2500,
                        "storageTypeId": 0,
                        "storageTypeName": "Кошельки",
                        "mayBeSpent": true
                    });
                    return;
                }
                if( !localStorage.cards && this.typeId == 1) {
                    this.collection.create({
                        "storageName": "Карта зарплатная",
                        "bankName": "ПромСвязьБанк",
                        "isCredit": false,
                        "currentBalance": 12000,
                        "storageTypeId": 1,
                        "storageTypeName": "Карты",
                        "mayBeSpent": true
                    });
                    this.collection.create({
                        "storageName": "Карта кредитная",
                        "bankName": "ПромСвязьБанк",
                        "isCredit": true,
                        "creditLimit": 150000,
                        "currentBalance": 80000,
                        "storageTypeId": 1,
                        "storageTypeName": "Карты",
                        "mayBeSpent": true
                    });
                    return;
                }

                if( !localStorage.deposits && this.typeId == 2) {
                    this.collection.create({
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
                    return;
                }
                if( !localStorage.safes && this.typeId == 3) {
                    this.collection.create({
                        "storageName": "Сейф домашний",
                        "currentBalance": 10000,
                        "storageTypeId": 3,
                        "storageTypeName": "Сейфы",
                        "mayBeSpent": true
                    });
                }
            },*/

            initialize: function (options) {
                this.typeId = this.model.toJSON().storageTypeId;

                //this.collection = new this.COLLECTION_MAP[this.typeId]();

                this.listenTo(this.collection, 'add', this.renderItemSummaryList);

            },

            // TODO сохранять коллекцию после добавления эл-та/изменения/удаления (save)

            render: function () {
                //вывести название типа (Карты) и инфу о ней
                this.$el.append(this.template({
                    data: this.model.toJSON()
                }));

                //добавить форму создания нового item
                this.addNewStorageItem();
                this.renderAllItemSummaryList();

                //this.setDefaultItems();

                return this;
            },

            renderAllItemSummaryList : function(){
                var self = this;
                this.collection.each(function(model){
                    self.renderItemSummaryList(model);
                });
            },

            renderItemSummaryList: function (m) {
                //var self = this;
                var itemSummaryView;
                itemSummaryView = new this.VIEW_SUMMARY_MAP[this.typeId]({
                    model: m
                });
                this.$("[data-eid=sources]").append(itemSummaryView.render().$el);

            },

            addNewStorageItem: function () {
                var addForm = new this.VIEW_NEW_ITEM_MAP[this.typeId]({
                    collection: this.collection
                });
                this.$("[data-eid=sources]").prepend(addForm.render().$el);
            },

            showAddForm: function () {
                this.$("[data-eid=new-item]").toggle('200');
            }

        });

        return StorageTypeDataView;

    });