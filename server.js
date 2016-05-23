/* Replaced by localstorage */

var express = require('express');
var app = express();
app.use('/', express.static(__dirname + '/'));
/* ----------------- get ------------------ */
app.get('/api/item/:id', function(req, res) {
    var item = {
        "name": 1,
        "price": 2.4,
        "descr": "asdfasdf"
    };
    res.send(JSON.stringify(item));
});
app.get('/api/expenses/:id', function(req, res) {
    var expense = {
        "id": 1,
        "expenseAmmount": 2.4,
        "expenseSource": "card",
        "expenseDate": new Date(),
        "descr": "expenses Descr"
    };
    res.send(JSON.stringify(expense));
});
app.get('/api/incomings/:id', function(req, res) {
    var incoming = {
        "id": 1,
        "incomingAmmount": 1000,
        "incomingSource": "salary",
        "incomingDate": new Date(),
        "descr": "incomings Descr"
    };
    res.send(JSON.stringify(incoming));
});
/* ----------------- //get end ------------------ */
/* ----------------- put ------------------ */
app.put('/api/item/:id', function(req, res) {
    res.send('PUT!');
});
/* ----------------- //put end ------------------ */
/* ----------------- get list ------------------ */
app.get('/api/item', function(req, res) {
    var items = [{
        id: 1,
        "name": 1,
        "price": 2.4,
        "descr": "asdfasdf"
    }, {
        id: 2,
        "name": 2,
        "price": 5.5,
        "descr": "descr2"
    }];
    res.send(JSON.stringify(items));
});

app.get('/api/expenses', function(req, res) {
    var expenses = [{
        "id": 1,
        "expenseAmmount": 1400,
        "expenseSource": "Карта зарплатная",
        "expenseDate": "26.10.2015",
        "descr": "",
        "categoryId": "3",
        "categoryName": "Развлечения"
    }, {
        "id": 2,
        "expenseAmmount": 300,
        "expenseSource": "Карта зарплатная",
        "expenseDate": "25.10.2015",
        "descr": "Пятерочка",
        "categoryId": "1",
        "categoryName": "Обеды на работе"
    }, {
        "id": 3,
        "expenseAmmount": 700,
        "expenseSource": "Карта зарплатная",
        "expenseDate": "25.10.2015",
        "descr": "Пироженки",
        "categoryId": "2",
        "categoryName": "Продукты домой"
    }, {
        "id": 4,
        "expenseAmmount": 1500,
        "expenseSource": "Карта зарплатная",
        "expenseDate": "25.10.2015",
        "descr": "спинка",
        "categoryId": "11",
        "categoryName": "Консультации"
    }];
    res.send(JSON.stringify(expenses));
});
app.get('/api/incomings', function(req, res) {
    var incomings = [{
        "id": 1,
        "incomingAmmount": 44000,
        "storageName": "Карта зарплатная",
        "storageId": 0,
        "incomingDate": "19.03.2016",
        "descr": "аванс",
        "categoryId": "0",
        "categoryName": "Зарплата"
    }, {
        "id": 2,
        "incomingAmmount": 7000,
        "storageName": "Карта зарплатная",
        "storageId": 0,
        "incomingDate": "11.03.2016",
        "descr": "проект другой",
        "categoryId": "1",
        "categoryName": "Аутсорсинг"
    }, {
        "id": 3,
        "incomingAmmount": 35000,
        "storageName": "Карта зарплатная",
        "storageId": 0,
        "incomingDate": "21.02.2016",
        "descr": "",
        "categoryId": "0",
        "categoryName": "Зарплата"
    }, {
        "id": 4,
        "incomingAmmount": 4000,
        "storageName": "Карта зарплатная",
        "storageId": 0,
        "incomingDate": "01.03.2016",
        "descr": "на ДР",
        "categoryId": "2",
        "categoryName": "Подарки"
    }, {
        "id": 5,
        "incomingAmmount": 15000,
        "storageName": "Карта зарплатная",
        "storageId": 0,
        "incomingDate": "19.03.2016",
        "descr": "",
        "categoryId": "3",
        "categoryName": "Фриланс"
    }
    ];
    res.send(JSON.stringify(incomings));
});

/*app.get('/api/storages', function(req, res) {

    var storages = [
        {
            "storageTypeName": "Кошельки",
            "id": 0,
            "objects": [{
                "id": 3,
                "storageName": "Мой кошелек",
                "currentBalance": 1500,
                "storageTypeId": 0,
                "storageTypeName": "Кошельки",
                "mayBeSpent": true
            }]
        },
        {
            "storageTypeName": "Карты",
            "id": 1,
            "objects": [{
                "id": 0,
                "storageName": "Карта зарплатная",
                "bankName": "ПромСвязьБанк",
                "isCredit": false,
                "currentBalance": 12000,
                "storageTypeId": 1,
                "storageTypeName": "Карты",
                "mayBeSpent": true
            }, {
                "id": 1,
                "storageName": "Карта кредитная",
                "bankName": "ПромСвязьБанк",
                "isCredit": true,
                "creditLimit": 150000,
                "currentBalance": 80000,
                "storageTypeId": 1,
                "storageTypeName": "Карты",
                "mayBeSpent": true
            }]
        }, {
            "storageTypeName": "Вклады",
            "id": 2,
            "objects": [{
                "id": 2,
                "storageName": "Свободные деньги",
                "bankName": "ПромСвязьБанк",
                "currentBalance": 30000,
                "startDate": "10.10.2015",
                "endDate": "10.03.2016",
                "percent": 10.5,
                "storageTypeId": 2,
                "storageTypeName": "Вклады",
                "mayBeSpent": true
            }]
        }, {
            "storageTypeName": "Сейфы",
            "id": 3,
            "objects": [{
                "id": 3,
                "storageName": "Сейф домашний",
                "currentBalance": 10000,
                "storageTypeId": 3,
                "storageTypeName": "Сейфы",
                "mayBeSpent": true
            }]
        }];
    res.send(JSON.stringify(storages));
});*/

app.get('/api/storagesCategories', function(req, res) {

    var storages = [
        {
            "storageTypeName": "Кошельки",
            "id": 0,
            storageTypeId: 0
        },
        {
            "storageTypeName": "Карты",
            "id": 1,
            storageTypeId: 1
        }, {
            "storageTypeName": "Вклады",
            "id": 2,
            storageTypeId: 2
        }, {
            "storageTypeName": "Сейфы",
            "id": 3,
            storageTypeId: 3
        }];
    res.send(JSON.stringify(storages));
});

app.get('/api/wallets', function(req, res) {

    var wallets = [
        {
            "storageName": "Мой кошелек",
            "id": 0,
            "currentBalance": 1500,
            "mayBeSpent": true
        },
        {
            "storageName": "Кошелек запасной",
            "id": 1,
            "currentBalance": 2500,
            "mayBeSpent": true
        }];
    res.send(JSON.stringify(wallets));
});

app.get('/api/cards', function(req, res) {

    var cards = [
        {
            "id": 0,
            "storageName": "Карта зарплатная",
            "bankName": "ПромСвязьБанк",
            "isCredit": false,
            "currentBalance": 12000,
            "storageTypeId": 1,
            "storageTypeName": "Карты",
            "mayBeSpent": true
        },
        {
            "id": 1,
            "storageName": "Карта кредитная",
            "bankName": "ПромСвязьБанк",
            "isCredit": true,
            "creditLimit": 150000,
            "currentBalance": 80000,
            "storageTypeId": 1,
            "storageTypeName": "Карты",
            "mayBeSpent": true
        }];
    res.send(JSON.stringify(cards));
});

app.get('/api/deposits', function(req, res) {

    var deposits = [
        {
            "id": 2,
            "storageName": "Свободные деньги",
            "bankName": "ПромСвязьБанк",
            "currentBalance": 30000,
            "startDate": "10.10.2015",
            "endDate": "10.03.2016",
            "percent": 10.5,
            "storageTypeId": 2,
            "storageTypeName": "Вклады",
            "mayBeSpent": true
        }];
    res.send(JSON.stringify(deposits));
});

app.get('/api/safes', function(req, res) {

    var safes = [
        {
           "id": 3,
           "storageName": "Сейф домашний",
           "currentBalance": 10000,
           "storageTypeId": 3,
           "storageTypeName": "Сейфы",
           "mayBeSpent": true
        }];
    res.send(JSON.stringify(safes));
});

app.get('/api/incomingsCategory', function(req, res) {
    var items = [{
        id: 0,
        "name": "Зарплата"
    }, {
        id: 1,
        "name": "Аутсорсинг"
    }, {
        id: 2,
        "name": "Подарки"
    }, {
        id: 3,
        "name": "Фриланс"
    }];
    res.send(JSON.stringify(items));
});

app.get('/api/expenseCategories', function(req, res) {
    var items = [{
        id: 0,
        "name": "Питание"
    }, {
        id: 3,
        "name": "Развлечения"
    }, {
        id: 7,
        "name": "Спорт"
    }, {
        id: 10,
        "name": "Здоровье"
    }, {
        id: 13,
        "name": "ЖКХ"
    }, {
        id: 16,
        "name": "Машина"
    }, {
        id: 20,
        "name": "Кредиты"
    }];
    res.send(JSON.stringify(items));
});

app.get('/api/expenseCategories/:catId/subcategories', function(req, res) {
    var queryBy = req.params.catId;

    var items = [];

    if(queryBy == 0) {
        items = [
            {
                "id": 1,
                "parentId": 0,
                "name": "Обеды на работе"
            }, {
                "id": 2,
                "parentId": 0,
                "name": "Продукты домой"
            }
        ];

    } else if(queryBy == 3){

        items = [
            {
                "id": 4,
                "name": "Кафе",
                "parentId": 3
            }, {
                "id": 5,
                "name": "Подарки",
                "parentId": 3
            }, {
                "id": 6,
                "name": "Прочее",
                "parentId": 3
            }
        ];
    } else if(queryBy == 7) {
        items = [
            {
                "id": 8,
                "name": "Абонемент фитнес",
                "parentId": 7
            }, {
                "id": 9,
                "name": "Спорттовары",
                "parentId": 7
            }
        ];
    } else if(queryBy == 10) {
        items = [
            {
                "id": 11,
                "name": "Консультации врачей",
                "parentId": 10
            }, {
                "id": 12,
                "name": "Медикаменты",
                "parentId": 10
            }
        ];
    } else if(queryBy == 13) {
        items = [
            {
                "id": 14,
                "name": "Квартплата",
                "parentId": 13
            }, {
                "id": 15,
                "name": "Паркинг",
                "parentId": 13
            }
        ];
    } else if(queryBy == 16) {
        items = [
            {
                "id": 17,
                "name": "ТО",
                "parentId": 16
            }, {
                "id": 18,
                "name": "Ремонт",
                "parentId": 16
            }, {
                "id": 19,
                "name": "Мойка",
                "parentId": 16
            }
        ];
    }
    res.send(JSON.stringify(items));
});

/*app.get('/api/expenseCategories', function(req, res) {
    var items = [{
        id: 0,
        "name": "Питание",
        "subcats": [{
            "id": 1,
            "name": "Обеды на работе"
        }, {
            "id": 2,
            "name": "Продукты домой"
        }]
    }, {
        id: 3,
        "name": "Развлечения",
        "subcats": [{
            "id": 4,
            "name": "Кафе"
        }, {
            "id": 5,
            "name": "Подарки"
        }, {
            "id": 6,
            "name": "Прочее"
        }]
    }, {
        id: 7,
        "name": "Спорт",
        "subcats": [{
            "id": 8,
            "name": "Абонемент фитнес"
        }, {
            "id": 9,
            "name": "Спорттовары"
        }]
    }, {
        id: 10,
        "name": "Здоровье",
        "subcats": [{
            "id": 11,
            "name": "Консультации врачей"
        }, {
            "id": 12,
            "name": "Медикаменты"
        }]
    }, {
        id: 13,
        "name": "ЖКХ",
        "subcats": [{
            "id": 14,
            "name": "Квартплата"
        }, {
            "id": 15,
            "name": "Паркинг"
        }]
    }, {
        id: 16,
        "name": "Машина",
        "subcats": [{
            "id": 17,
            "name": "ТО"
        }, {
            "id": 18,
            "name": "Ремонт"
        }, {
            "id": 19,
            "name": "Мойка"
        }]
    }, {
        id: 20,
        "name": "Кредиты",
        "subcats": [{
        }]
    }];
    res.send(JSON.stringify(items));
});*/

/* ----------------- //get list end------------------ */
/* ----------------- delete ------------------ */
app.delete('/api/item/:id', function(req, res) {
    res.send('DELETE!');
});
/* ----------------- delete end ------------------ */
var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});