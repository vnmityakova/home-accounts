define([], function() {

    var ChartData = function () {
        this.data = [];
        this.colors = ["#5B90BF", "#96b5b4", "#a3be8c",
            "#ab7967", "#d08770", "#b48ead", "#337AB7",
            "#3C763D", "#777777", "#8A6D3B", "#A94442",
            "#F2DEDE", "#DFF0D8", "#FCF8E3", "#BF4292", "#FB9200"];
        this.index = 0;
    };

    ChartData.prototype.add = function (ammount, categoryId, categoryName) {
        // data[i] = { value, categoryId, categoryName, categoryId  }
        var self = this;
        if( ! this.isCategoryExists(categoryId) ) {
            if( this.data.length ) {
                this.index += 1;
            }
            this.data[this.index] = {
                value: this.getTotalByCategoryId(categoryId, ammount),
                color:  function () {
                    return self.colors[self.data.length + 1]
                }(),
                label: categoryName.trim(),
                categoryId: categoryId
            };
        } else {
            this.data[this.getDataIndexByCategoryId(categoryId)].value = this.getTotalByCategoryId(categoryId, ammount);
        }

    };

    ChartData.prototype.getDataIndexByCategoryId = function (categoryId) {
        var categoryIndex = -1;
        $.each(this.data, function( index, DataItem ) {
            if ( DataItem.categoryId ==  categoryId) {
                categoryIndex = index;
                return false;
            }
        });
        return categoryIndex;
    };

    ChartData.prototype.getChartData = function () {
        return this.data;
    };

    ChartData.prototype.isCategoryExists = function (categoryId) {
        var isCategoryExists = false;
        $.each(this.data, function( index, DataItem ) {
            if ( DataItem.categoryId ==  categoryId) {
                isCategoryExists = true;
                return false;
            }
        });
        return isCategoryExists;
    };

    ChartData.prototype.getTotalByCategoryId = function (categoryId, ammount) {
        var total = ammount;
        $.each(this.data, function( index, DataItem ) {
            if ( DataItem.categoryId ==  categoryId) {
                total = DataItem.value + ammount;
                return false;
            }
        });
        return total;
    };

    return ChartData;

});



