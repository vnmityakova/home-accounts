define(['underscore', 'backbone', '../models/expenses', '../../backbone-localstorage'], function(_, Backbone, ExpensesModel) {
    var ExpensesCollection = Backbone.Collection.extend({
        //url: "/api/expenses",
        model: ExpensesModel,
        localStorage: new Store("expenses")/*,
        fetchFiltered : function(date){
            var self = this;

            this.fetch().done(function(){
                var filterType = _.filter(self.models,function(item){
                    return item.get("expenseDate") == date;
                });
                self.reset(filterType);
            });
        }*/
    });
    return ExpensesCollection;
});