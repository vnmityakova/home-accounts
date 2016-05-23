define(['backbone', 'text!../templates/currentExpenses.html', '../../expenses/collections/collection',
        'chartJs', '../chartData', '../../utils'],
    function (Backbone, tpl, ExpensesCollection, ChartJs, ChartData, Utils) {
        var CurrentExpenses = Backbone.View.extend({

            template: _.template(tpl),

            events: {},

            initialize: function (options) {
                var self=this;
                //тк чарт отрисовывается только после того, как эл-т появился на странице
                Backbone.Events.once('current-page-appended', function(){
                    self.renderChart();
                });
            },

            render: function () {
                this.$el.empty().append(this.template());

                this.$("[data-eid=last-month-dates]").text( this.getDatesPeriod() );

                this.chartData = new ChartData();
                //this.renderChart();

                return this;
            },

            getDatesPeriod : function(){
                var today = new Date();
                var curDate = $.datepicker.formatDate("dd.mm.yy", today);
                var monthAgoDate = new Date( today.setMonth(today.getMonth() - 1) );
                var monthAgoDateStr = $.datepicker.formatDate("dd.mm.yy", monthAgoDate);
                return monthAgoDateStr + " - " + curDate;
            },

            renderChart: function () {
                var self = this;
                var summary = 0;

                this.collection.each(function (model) {
                    var modelJson = model.toJSON();
                    self.chartData.add(+modelJson.expenseAmmount, modelJson.categoryId, modelJson.categoryName);
                    summary += +modelJson.expenseAmmount;
                });
                self.drawChart(self.chartData);
                this.$("[data-eid=summary-expenses]").append(Utils.addSpacesToSum(summary) + " руб.");
            },

            drawChart : function(){
                var data = this.chartData.getChartData();

                // For a pie chart
                //http://stackoverflow.com/questions/28476159/chart-js-pie-tooltip-getting-cut
                var ctx =  this.$("[data-eid=chart-expenses]").get(0).getContext("2d");
                var myPieChart = new Chart(ctx).Pie(data, {
                    animationEasing: "linear",
                    animationSteps: 20,
                    tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%=value+' руб.'%>",
                    tooltipXPadding: 4,
                    tooltipCornerRadius: 2
                });
                var legend = myPieChart.generateLegend();
                this.$("[data-eid=add-legend]").empty().append(legend);
            }

        });

        return CurrentExpenses;

    });